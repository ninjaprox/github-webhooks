require("dotenv").config();

const Nightmare = require("nightmare");
const Q = require("q");
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
    this.nightmare = Nightmare();
}

CrashlyticsClient.prototype.load = function() {
    const that = this;

    return Q.promise(function(resolve, reject) {
        that.nightmare
            .goto(that.url)
            .then(function(result) {
                const email = process.env.FABRIC_EMAIL;
                const password = process.env.FABRIC_PASSWORD;

                log.info("Logging in Crashlytics");
                return loginScrapper(that.nightmare, email, password);
            })
            .then(function() {
                log.info("Login success");
                resolve(that);
            })
            .catch(function(error) {
                log.error(error);
                that.nightmare.end();
                reject(error);
            });
    });
};

CrashlyticsClient.prototype.versions = function() {
    return versionScrapper(this.nightmare);
};

CrashlyticsClient.prototype.exception = function() {
    return exceptionScrapper(this.nightmare);
};

CrashlyticsClient.prototype.close = function() {
    log.info("Closing Crashlytics issue at %s", this.url);

    return closeScrapper(this.nightmare).then(function() {
        log.info("Closed Crashlytics issue at %s", this.url);
    });
};

CrashlyticsClient.prototype.end = function() {
    this.nightmare.end();
};
