const rootEndpoint = "https://api.github.com";
const unirest = require("unirest");
const url = require("url");
const unirestHandler = require("../helper/unirestHandler");
const Q = require("q");

module.exports = GitHubClient;

function GitHubClient(token, repo) {
    this.token = token;
    this.newRequest = _newRequest.bind(this);
    this.userUrl = url.resolve(rootEndpoint, "/user");
    this.issueUrl = url.resolve(rootEndpoint, `/repos/${repo}/issues/`);
}

GitHubClient.prototype.user = function() {
    const that = this;

    return Q.promise(function(resolve, reject) {
        that.newRequest("GET", that.userUrl)
            .end(unirestHandler(resolve, reject));
    });
}

GitHubClient.prototype.closeIssue = function(number) {
    return editIssue.call(this, number, {
        state: "closed"
    });
}

function _newRequest(method, url) {
    return unirest(method, url, {
        "User-Agent": "GitHub Webhooks",
        "Authorization": `token ${this.token}`
    });
}

function editIssue(number, params) {
    const that = this;
    const issueUrl = url.resolve(that.issueUrl, `${number}`);

    return Q.promise(function(resolve, reject) {
        that.newRequest("PATCH", issueUrl)
            .send(params)
            .end(unirestHandler(resolve, reject));
    });
}