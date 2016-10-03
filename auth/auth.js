const express = require("express");
const url = require("url");
const router = express.Router();
const unirest = require("unirest");
const GitHubClient = require("../lib/githubClient");
const unirestHandler = require("../helper/unirestHandler");

module.exports = router;

router.post("/", function(req, res) {
    const githubAuthUrl = url.format({
        protocol: "https",
        hostname: "github.com",
        pathname: "login/oauth/authorize",
        query: {
            client_id: process.env.GITHUB_CLIENT_ID,
            scope: "user:email public_repo repo",
            state: process.env.GITHUB_STATE
        }
    });

    res.redirect(githubAuthUrl);
});

router.get("/", function(req, res) {
    const code = req.query.code;

    requestAccessToken(code, function(error, token) {
        const githubClient = new GitHubClient(token);

        githubClient.user(function(error, user) {
            console.log(user);
        });
    });
    res.send("Success");
});

function requestAccessToken(code, callback) {
    const githubAuthUrl = url.format({
        protocol: "https",
        hostname: "github.com",
        pathname: "login/oauth/access_token",
    });

    unirest.post(githubAuthUrl)
        .send({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            state: process.env.GITHUB_STATE,
            code: code
        })
        .end(unirestHandler(callback, function(body) {
            return body.access_token;
        }));
}