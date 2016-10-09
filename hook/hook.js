const express = require("express");
const router = express.Router();
const githubHook = require("./githubHook");
const crashlyticsHook = require("./crashlyticsHook");
const log = require("../logger/logger");

module.exports = router;

router.use("/", function(req, res, next) {
    log.info({
        req: req,
        body: req.body
    });
    next();
});
router.use("/github", githubHook);
router.use("/crashlytics", crashlyticsHook);