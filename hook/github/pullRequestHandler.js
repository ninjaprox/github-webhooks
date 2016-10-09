const GithubClient = require("../../lib/githubClient");
const log = require("../../logger/logger");
const Q = require("q");

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
        issueNumbers.forEach(function(issueNumber) {
            console.log("Closing issue", issueNumber);
            githubClient.closeIssue(issueNumber)
                .then(function() {
                    console.log("Closed issue", issueNumber);
                })
                .catch(function(error) {
                    console.log(error);
                });
        });
    }
}