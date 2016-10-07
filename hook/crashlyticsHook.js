require("dotenv").config();

const express = require("express");
const router = express.Router();
const phantom = require("phantom");

module.exports = router;

/*global $*/
router.post("/", function(req, res) {
    if (req.body.event === "verification") {
        res.status(200).end();

        return;
    }

    const issueUrl = req.body.payload.url;
    const email = process.env.FABRIC_EMAIL;
    const password = process.env.FABRIC_PASSWORD;
    var page;
    var phantomInstance;

    phantom.create(["--load-images=no"])
        .then(function(instance) {
            phantomInstance = instance;

            return instance.createPage();
        })
        .then(function(_page) {
            page = _page;

            return page.open(issueUrl);
        })
        .then(function(status) {
            return page.on("onUrlChanged", loginHandler(phantomInstance, page, function(error, content) {
                // console.log(content);
                // Use content here
            }));
        })
        .then(function() {
            return page.evaluate(function(email, password) {
                $("#email").val(email);
                $("#password").val(password);
                $("[type=submit]").submit();
            }, email, password);
        })
        .catch(function(error) {
            console.log(error);
            phantomInstance.exit();
        });

    console.log(req.body);
    res.status(200).end();
});

function loginHandler(phantom, page, callback) {
    return function(url) {
        setTimeout(function() {
            page.property("content")
                .then(function(content) {
                    if (callback) {
                        callback(null, content);
                    }

                    page.close();
                    phantom.exit();
                })
                .catch(function(error) {
                    if (callback) {
                        callback(error);
                    }

                    console.log(error);
                    phantom.exit();
                });
        }, 5000);
    };
}