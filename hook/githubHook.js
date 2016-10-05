const express = require("express");
const router = express.Router();

module.exports = router;

router.post("/", function(req, res) {
    console.log(req.body);
    res.status(200).end();
});