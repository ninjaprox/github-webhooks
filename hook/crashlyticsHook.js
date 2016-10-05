const express = require("express");
const router = express.Router();
const request = require("request");
const phantom = require("phantom");

module.exports = router;

router.post("/", function(req, res) {
    const issueUrl = req.body.payload.url;

    // request(issueUrl, function(error, response, body) {
    //     const versions = [] || body.match(/(\d+\.\d+\.\d+ \(\d+\))/gm);

    //     console.log(body);
    // });

    var sitepage = null;
    var phInstance = null;
    
    // phantom.create(["--load-images=no"], {
    //         phantomPath: "/home/ubuntu/downloads/phantomjs-2.1.1-linux-x86_64/bin/phantomjs"
    //     })
    //     .then(instance => {
    //         phInstance = instance;
    //         return instance.createPage();
    //     })
    //     .then(page => {
    //         sitepage = page;
    //         return page.open(issueUrl);
    //     })
    //     .then(status => {
    //         console.log(status);
    //         return sitepage.property('content');
    //     })
    //     .then(content => {
    //         console.log(content);
    //         sitepage.close();
    //         phInstance.exit();
    //     })
    //     .catch(error => {
    //         console.log(error);
    //         phInstance.exit();
    //     });

    console.log(res.body);
    res.status(200).end();
});