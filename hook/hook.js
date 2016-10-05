const express = require("express");
const router = express.Router();
const githubHook = require("./githubHook");
const crashlyticsHook = require("./crashlyticsHook");

module.exports = router;

router.use("/github", githubHook);
router.use("/crashlytics", crashlyticsHook);
