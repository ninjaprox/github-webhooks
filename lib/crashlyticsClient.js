require("dotenv").config();

const phantom = require("phantom");

module.exports = CrashlyticsClient;

function CrashlyticsClient(url) {
    this.url = url;
    this.phantom = null;
    this.page = null;
}

/*global $*/
CrashlyticsClient.prototype.login = function() {
    const that = this;
    const email = process.env.FABRIC_EMAIL;
    const password = process.env.FABRIC_PASSWORD;

    phantom.create(["--load-images=no"])
        .then(function(instance) {
            that.phantom = instance;

            return instance.createPage();
        })
        .then(function(page) {
            that.page = page;

            return page.open(that.url);
        })
        .then(function(status) {
            return that.page.on("onUrlChanged", loginHandler(that.phantom, that.page, function(error, content) {
                // console.log(content);
                // Use content here
            }));
        })
        .then(function() {
            return that.page.evaluate(function(email, password) {
                $("#email").val(email);
                $("#password").val(password);
                $("[type=submit]").submit();
            }, email, password);
        })
        .catch(function(error) {
            console.log(error);
            that.phantom.exit();
        });
}

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