require("dotenv").config();

const waitingTimeout = 5000;
const phantom = require("phantom");
const Q = require("q");
const url = require("url");
const versionScrapper = require("./scrapper/versionScrapper");
const loginScrapper = require("./scrapper/loginScrapper");
const exceptionScrapper = require("./scrapper/exceptionScrapper");
const closeScrapper = require("./scrapper/closeScrapper");
const log = require("../logger/logger").child({
    module: "crashlytics-client"
});

module.exports = CrashlyticsClient;

function CrashlyticsClient(url) {
    this.url = url;
    this.phantom = null;
    this.page = null;
}

CrashlyticsClient.prototype.load = function() {
    const that = this;
    const thatOnUrlChangedHandler = onUrlChangedHandler.bind(this);

    return Q.promise(function(resolve, reject) {
            phantom.create(["--load-images=no"])
                .then(function(instance) {
                    that.phantom = instance;

                    return instance.createPage();
                })
                .then(function(page) {
                    that.page = page;
                    // Resolve and reject are called in handler instead of this method
                    page.on("onUrlChanged", thatOnUrlChangedHandler(resolve, reject));

                    return page.open(that.url);
                })
                .then(function(status) {
                    return that;
                })
                .catch(function(error) {
                    log.error(error);
                    that.done();
                    reject(error);
                });
        })
        .catch(function(error) {
            log.error(error);
            that.done();
        });
};

CrashlyticsClient.prototype.versions = function() {
    return versionScrapper(this.page);
};

CrashlyticsClient.prototype.exception = function() {
    return exceptionScrapper(this.page);
};

CrashlyticsClient.prototype.close = function() {
    log.info("Closing Crashlytics issue at %s", this.url);

    return closeScrapper(this.page)
        .then(function() {
            log.info("Closed Crashlytics issue at %s", link);
        });
}

CrashlyticsClient.prototype.done = function() {
    this.page.close();
    this.phantom.exit();
}

function login(page, email, password) {
    email = email || process.env.FABRIC_EMAIL;
    password = password || process.env.FABRIC_PASSWORD;
    log.info("Logging in Crashlytics");

    return loginScrapper(page, email, password);
};

function onUrlChangedHandler(resolve, reject) {
    const that = this;

    return function(_url) {
        const urlParts = url.parse(_url);

        if (urlParts.pathname === "/login") { // Redirect from _url to login page
            log.info("Redirecting to login");

            // Waiting for page loading
            setTimeout(function() {
                login(that.page)
                    .then(function() {
                        // Calling login() will cause page to redirect back to _url
                        // Therefore, do nothing here and waiting for next call to this handler
                    })
                    .catch(reject);
            }, waitingTimeout);
        } else if (that.url === _url) { // Login success, redirect back to _url
            // Waiting for page loading
            setTimeout(function() {
                log.info("Login success");
                resolve(that);
            }, waitingTimeout);
        } else {
            reject(new Error(`Cannot load ${_url}`));
        }
    };
}