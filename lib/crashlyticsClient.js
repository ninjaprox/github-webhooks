require("dotenv").config();

const phantom = require("phantom");
const Q = require("q");
const versionScrapper = require("./scrapper/versionScrapper");
const loginScrapper = require("./scrapper/loginScrapper");
const exceptionScrapper = require("./scrapper/exceptionScrapper");
const closeScrapper = require("./scrapper/closeScrapper");

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

    return Q.promise(function(resolve, reject) {
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
                return that.page.on("onUrlChanged", function() {
                    setTimeout(function() {
                        resolve(that);
                    }, 5000);
                });
            })
            .then(function() {
                return loginScrapper(that.page, email, password);
            })
            .catch(function(error) {
                console.log(error);
                that.phantom.exit();
                reject(error);
            });
    });
};

CrashlyticsClient.prototype.versions = function() {
    return versionScrapper(this);
};

CrashlyticsClient.prototype.exception = function() {
    return exceptionScrapper(this);
};

CrashlyticsClient.prototype.close = function() {
    return closeScrapper(this);
}