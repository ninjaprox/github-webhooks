const rootEndpoint = "https://api.github.com";
const unirest = require("unirest");
const url = require("url");
const unirestHandler = require("../helper/unirestHandler");
const Q = require("q");

module.exports = GitHubClient;

function GitHubClient(token) {
    this.token = token;
    this.userUrl = url.resolve(rootEndpoint, "/user");
    this.newRequest = _newRequest.bind(this);
}

GitHubClient.prototype.user = function() {
    const that = this;

    return Q.promise(function(resolve, reject) {
        that.newRequest('GET', that.userUrl)
            .end(unirestHandler(resolve, reject));
    });
}

function _newRequest(method, url) {
    return unirest(method, url, {
        "User-Agent": "GitHub Webhooks",
        "Authorization": `token ${this.token}`
    });
}