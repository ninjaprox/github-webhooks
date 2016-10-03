const express = require("express");
const url = require("url");
const router = express.Router();
const unirest = require("unirest");
const GitHubClient = require("../lib/githubClient");
const unirestHandler = require("../helper/unirestHandler");
const Q = require("q");

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

    requestAccessToken(code)
        .then(function(token) {
            const githubClient = new GitHubClient(token);

            return githubClient.user();
        })
        .then(function(user) {
            res.send(user);
        })
        .catch(function(error) {
            console.log(error);
            res.send("Failure");
        });
});

function requestAccessToken(code) {
    const githubAuthUrl = url.format({
        protocol: "https",
        hostname: "github.com",
        pathname: "login/oauth/access_token",
    });

    return Q.promise(function(resolve, reject) {
        unirest.post(githubAuthUrl)
            .send({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                state: process.env.GITHUB_STATE,
                code: code
            })
            .end(unirestHandler(resolve, reject, function(body) {
                return body.access_token;
            }));
    });
}