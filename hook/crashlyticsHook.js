require("dotenv").config();

const express = require("express");
const router = express.Router();
const CrashlyticsClient = require("../lib/crashlyticsClient");
const Q = require("q");
const log = require("../logger/logger");
const GithubClient = require("../lib/githubClient");

module.exports = router;

const githubClient = new GithubClient(
    process.env.GITHUB_TOKEN,
    process.env.GITHUB_REPO
);

/*global $*/
router.post("/", function(req, res) {
    if (req.body.event === "verification") {
        res.status(200).end();

        return;
    }

    const crashlyticsClient = new CrashlyticsClient(req.body.payload.url);
    var issue = JSON.parse(JSON.stringify(req.body.payload));

    crashlyticsClient
        .load()
        .then(function(client) {
            return Q.all([client, client.versions(), client.exception()]);
        })
        .spread(function(client, versions, exception) {
            const titleComponents = issue.title.split(" line ");

            issue.title = `Crash in ${titleComponents[0]}`;
            issue.file = titleComponents[0];
            issue.line = titleComponents[1] || "unknown";
            issue.versions = versions;
            issue.exception = exception;

            log.info(
                {
                    issue: issue
                },
                "Crashlytics issue detail"
            );

            return [client, issue];
        })
        .spread(function(client, issue) {
            const body = [
                "### File",
                `${issue.file}`,
                "### Method",
                `${issue.method}`,
                "### Line",
                `${issue.line}`,
                "### Exception",
                `${issue.exception.exception}`,
                `*${issue.exception.info}*`,
                "### Source",
                `[${issue.url}](${issue.url})`
            ].join("\r\n");
            var labels = issue.versions;

            labels.push("crashlytics");
            return [
                client
                githubClient.createIssue(issue.title, {
                    body: body,
                    labels: labels
                })
            ];
        })
        .spread(function(client) {
            client.end();
        })
        .catch(function(error) {
            log.error(error);
        });

    res.status(200).end();
});
