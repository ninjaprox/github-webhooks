const express = require("express");
const router = express.Router();

module.exports = router;

/*global $*/
router.post("/", function(req, res) {
    if (req.body.event === "verification") {
        res.status(200).end();

        return;
    }

    console.log(req.body);
    res.status(200).end();
});