const express = require("express");
const router = express.Router();
const CrashlyticsClient = require("../lib/crashlyticsClient");
const Q = require("q");

module.exports = router;

/*global $*/
router.post("/", function(req, res) {
    if (req.body.event === "verification") {
        res.status(200).end();

        return;
    }

    const crashlyticsClient = new CrashlyticsClient(req.body.payload.url);
    var issue = JSON.parse(JSON.stringify(req.body.payload));

    crashlyticsClient.load()
        .then(function(client) {
            return Q.all([
                client,
                client.versions(),
                client.exception()
            ]);
        })
        .spread(function(client, versions, exception) {
            const titleComponents = issue.title.split(" line ");

            issue.title = `Crash in ${titleComponents[0]}`;
            issue.file = titleComponents[0];
            issue.line = titleComponents[2] || "unknown";
            issue.versions = versions;
            issue.exception = exception;

            console.log("Issue");
            console.log("=====");
            console.log(issue);

            return client;
        })
        .then(function(client) {
            client.done();
        })
        .catch(function(error) {
            client.done();
            console.log(error);
        });
        
    console.log(req.body);
    res.status(200).end();
});