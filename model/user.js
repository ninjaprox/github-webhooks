const GitHubClient = require("../lib/githubClient");
const userStorage = require("../lib/userStorage");

module.exports.checkToken = checkToken;
module.exports.authenticate = authenticate;

function checkToken(token) {
    return storedInfo({
        token: token
    });
}

function authenticate(githubToken) {
    return info(githubToken)
        .then(function(user) {
            const token = generateToken(user.email, githubToken);

            return userStorage.store(user.email, token, githubToken);
        })
        .then(function(user) {
            return user;
        });
}

function info(token) {
    const githubClient = new GitHubClient(token);

    return githubClient.user();
}

function storedInfo(query) {
    return userStorage.query(query);
}

function generateToken(email, githubToken) {
    return githubToken;
}