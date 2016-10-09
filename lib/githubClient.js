const rootEndpoint = "https://api.github.com";
const unirest = require("unirest");
const url = require("url");
const unirestHandler = require("../helper/unirestHandler");
const Q = require("q");
const log = require("../logger/logger");

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
    return editIssue.call(this, number, {
        state: "closed"
    });
};

GitHubClient.prototype.createIssue = function(title, params) {
    const that = this;

    if (params) {
        params.title = params.title || title;
    }

    return Q.promise(function(resolve, reject) {
        that.request("POST", that.issueUrl)
            .send(params)
            .end(unirestHandler(resolve, reject));
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
    return this.issue(number)
        .then(function(issue) {
            const link = issue.body.match(/https?\:\/\/[\w\d\/.]*/g)

            if (!link) {
                log.info({
                    issue: number
                }, "Link not found");
            }

            return link[0];
        });
};

function editIssue(number, params) {
    const that = this;
    const issueUrl = [that.issueUrl, `${number}`].join("/");

    return Q.promise(function(resolve, reject) {
        that.request("PATCH", issueUrl)
            .send(params)
            .end(unirestHandler(resolve, reject));
    });
}