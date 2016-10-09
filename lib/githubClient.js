const rootEndpoint = "https://api.github.com";
const unirest = require("unirest");
const url = require("url");
const unirestHandler = require("../helper/unirestHandler");
const Q = require("q");
const log = require("../logger/logger").child({
    module: "github-client"
});

module.exports = GitHubClient;

function GitHubClient(token, repo) {
    this.token = token;
    this.request = request(token);
    this.userUrl = url.resolve(rootEndpoint, "/user");
    this.issueUrl = url.resolve(rootEndpoint, `/repos/${repo}/issues`);
}

GitHubClient.prototype.user = function() {
    const that = this;

    return Q.promise(function(resolve, reject) {
        that.request("GET", that.userUrl)
            .end(unirestHandler(resolve, reject));
    });
};

GitHubClient.prototype.closeIssue = function(number) {
    log.info("Closing issue %d", number);

    return editIssue.call(this, number, {
        state: "closed"
    }, `Closed issue ${number}`);
};

GitHubClient.prototype.createIssue = function(title, params) {
    const that = this;

    if (params) {
        params.title = params.title || title;
    }
    log.info({
        issue: params
    }, "Creating new issue");

    return Q.promise(function(resolve, reject) {
            that.request("POST", that.issueUrl)
                .send(params)
                .end(unirestHandler(resolve, reject));
        })
        .then(function(data) {
            log.info("Created issue %d", data.number);

            return data;
        });
};

function request(token) {
    return function(method, url) {
        return unirest(method, url, {
            "User-Agent": "GitHub Webhooks",
            "Authorization": `token ${token}`,
            "Content-Type": "application/json"
        });
    };
}

GitHubClient.prototype.issue = function(number) {
    const that = this;
    const issueUrl = [that.issueUrl, `${number}`].join("/");

    return Q.promise(function(resolve, reject) {
        that.request("GET", issueUrl)
            .end(unirestHandler(resolve, reject));
    });
};

GitHubClient.prototype.linkInIssue = function(number) {
    log.info("Finding link in issue %d", number);

    return this.issue(number)
        .then(function(issue) {
            const link = issue.body.match(/https:\/\/fabric\.io\/[\w\d\/.]*/g) || [];

            if (!link.length) {
                log.info("Link not found in issue %d", number);
            } else {
                log.info("Found link %s in issue %d", link, number);
            }

            return link[0] || null;
        });
};

function editIssue(number, params, logMessage) {
    const that = this;
    const issueUrl = [that.issueUrl, `${number}`].join("/");

    log.info({
        issue: params
    }, "Editing issue %d", number);
    logMessage = logMessage || `Edited issue ${number}`;

    return Q.promise(function(resolve, reject) {
        that.request("PATCH", issueUrl)
            .send(params)
            .end(unirestHandler(resolve, reject, logMessage));
    });
}