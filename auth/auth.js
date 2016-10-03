const express = require("express");
const url = require("url");
const router = express.Router();

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
    console.log(req.query);
    res.send("Success");
});