const rootEndpoint = "https://api.github.com";
const unirest = require("unirest");
const url = require("url");

module.exports = GitHubClient;

function GitHubClient(token) {
    this.token = token;
    this.userUrl = url.resolve(rootEndpoint, "/user");
    this.newRequest = _newRequest.bind(this);
}

GitHubClient.prototype.user = function() {
    this.newRequest('GET', this.userUrl)
        .end(function(res) {
            console.log(res.body);
        });
}

function _newRequest(method, url) {
    return unirest(method, url, {
        "User-Agent": "GitHub Webhooks",
        "Authorization": `token ${this.token}`
    });
}