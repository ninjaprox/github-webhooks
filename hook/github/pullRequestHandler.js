const GithubClient = require("../../lib/githubClient");
const log = require("../../logger/logger");
const Q = require("q");
const CrashlyticsClient = require("../../lib/crashlyticsClient");

module.exports = function(body) {
    const action = body.action;
    const repo = body.repository.full_name;
    const number = body.number;
    const prBody = body.pull_request.body;
    const merged = body.pull_request.merged;
    const githubClient = new GithubClient(body.token, repo);
    const issueLine = prBody.split("\r\n")[0] || "";
    const issueNumbers = issueLine.match(/(\d+)/g) || [];

    log.info({
        "pull_request": {
            action: action,
            repo: repo,
            number: number,
            body: prBody,
            merged: merged,
            issueNumbers: issueNumbers
        }
    }, "Compact pull request detail");
    if (action === "closed" && merged) {
        const closeIssueTasks = issueNumbers.map(function(issueNumber) {
            log.info("Closing issue %d", issueNumber);

            return githubClient.closeIssue(issueNumber)
                .then(function() {
                    log.info("Closed issue %d", issueNumber);
                })
                .catch(log.error);
        });
        const linkInIssueTasks = issueNumbers.map(function(issueNumber) {
            log.info("Finding link in issue %d", issueNumber);

            return githubClient.linkInIssue(issueNumber)
                .then(function(link) {
                    log.info("Found link %s in issue %d", link, issueNumber);

                    return link;
                })
                .catch(log.error);
        });

        Q.all(closeIssueTasks)
            .then(function(results) {
                log.info("Closed all issues related to pull request %d", number);

                return Q.all(linkInIssueTasks);
            })
            .then(function(links) {
                const closeCrashlyticsIssueTasks = links
                    .filter(function(link) {
                        return link;
                    })
                    .map(function(link) {
                        log.info("Closing Crashlytics issue at %s", link);

                        return (new CrashlyticsClient(link))
                            .load(function(client) {
                                return [client, client.close()];
                            })
                            .spread(function(client) {
                                log.info("Closed Crashlytics issue at %s", link);

                                return client;
                            })
                            .catch(log.error);
                    });

                return Q.all(closeCrashlyticsIssueTasks);
            })
            .then(function(clients) {
                if (clients.length) {
                    log.info("Closed all Crashlytics issues related to pull request %d", number);
                } else {
                    log.info("There is no Crashlytics issue related to pull request %d", number);
                }

                clients.forEach(function(client) {
                    client.done();
                });
            })
            .catch(log.error);
    }
}