const express = require("express");
const url = require("url");
const router = express.Router();
const unirest = require("unirest");
const user = require("../model/user");
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
    const token = req.signedCookies.token;

    if (token) {
        user.checkToken(token)
            .then(function(user) {
                if (user) {
                    res.status(200).end();
                    console.log(req.signedCookies.token);
                } else {
                    res.redirect(githubAuthUrl);
                }
            });
    } else {
        res.redirect(githubAuthUrl);
    }
});

router.get("/", function(req, res) {
    const code = req.query.code;

    requestAccessToken(code)
        .then(function(token) {
            return user.authenticate(token);
        })
        .then(function(user) {
            res.cookie("token", user.token, {
                signed: true
            });
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