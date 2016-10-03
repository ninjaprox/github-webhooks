const rootEndpoint = "https://api.github.com";
const unirest = require("unirest");
const url = require("url");
const unirestHandler = require("../helper/unirestHandler");

module.exports = GitHubClient;

function GitHubClient(token) {
    this.token = token;
    this.userUrl = url.resolve(rootEndpoint, "/user");
    this.newRequest = _newRequest.bind(this);
}

GitHubClient.prototype.user = function(callback) {
    this.newRequest('GET', this.userUrl)
        .end(unirestHandler(callback);
}

function _newRequest(method, url) {
    return unirest(method, url, {
        "User-Agent": "GitHub Webhooks",
        "Authorization": `token ${this.token}`
    });
}