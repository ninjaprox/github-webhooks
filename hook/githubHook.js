const express = require("express");
const router = express.Router();
const pullRequestHandler = require("./github/pullRequestHandler");

const handlerMap = {
    "pull_request": pullRequestHandler
};
const nullHandler = function() { };

module.exports = router;

router.post("/", function(req, res) {
    const event = req.get("X-GitHub-Event");
    const handler = handlerMap[event] || nullHandler;
    const copyBody = JSON.parse(JSON.stringify(req.body));
    
    copyBody.token = req.token || process.env.GITHUB_TOKEN;
    handler(copyBody);
    res.status(200).end();
});