const GitHubClient = require("../lib/githubClient");

module.exports.info = info;

function info(token) {
    const githubClient = new GitHubClient(token);

    return githubClient.user();
}