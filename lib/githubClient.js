const rootEndpoint = "https://api.github.com";
const unirest = require("unirest");
const url = require("url");
const unirestHandler = require("../helper/unirestHandler");
const Q = require("q");

module.exports = GitHubClient;

function GitHubClient(token, repo) {
    this.token = token;
    this.request = _request(token);
    this.userUrl = url.resolve(rootEndpoint, "/user");
    this.issueUrl = url.resolve(rootEndpoint, `/repos/${repo}/issues`);
}

GitHubClient.prototype.user = function() {
    const that = this;

    return Q.promise(function(resolve, reject) {
        that.request("GET", that.userUrl)
            .end(unirestHandler(resolve, reject));
    });
}

GitHubClient.prototype.closeIssue = function(number) {
    return editIssue.call(this, number, {
        state: "closed"
    });
}

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
}

function _request(token) {
    return function(method, url) {
        return unirest(method, url, {
            "User-Agent": "GitHub Webhooks",
            "Authorization": `token ${token}`,
            "Content-Type": "application/json"
        });
    };
}

function editIssue(number, params) {
    const that = this;
    const issueUrl = [that.issueUrl, `${number}`].join("/");

    return Q.promise(function(resolve, reject) {
        that.request("PATCH", issueUrl)
            .send(params)
            .end(unirestHandler(resolve, reject));
    });
}