const GitHubClient = require("../lib/githubClient");
const userStorage = require("../lib/userStorage");

module.exports.authenticate = authenticate;

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

function storedInfo(email) {
    userStorage.find({
            email: email
        })
        .then(function(user) {
            console.log(user);
        });
}

function generateToken(email, githubToken) {
    return githubToken;
}