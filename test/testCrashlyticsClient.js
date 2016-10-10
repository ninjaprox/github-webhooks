const expect = require("chai").expect;
const CrashlyticsClient = require("../lib/crashlyticsClient");

describe("CrashlyticsClient", function() {
    var crashlyticsClient;

    this.timeout(15000);

    beforeEach(function() {
        crashlyticsClient = new CrashlyticsClient("https://fabric.io/piktochart/ios/apps/com.piktochart.piktopad/issues/57f798bc0aeb16625b3d873b");
    });

    afterEach(function() {
        crashlyticsClient.done();
    });

    describe("#load", function() {
        it("should be done", function(done) {
            crashlyticsClient.load()
                .then(function() {
                    done();
                })
                .catch(done);
        });

        it("shoule return itself", function(done) {
            crashlyticsClient.load()
                .then(function(client) {
                    expect(client).to.equal(crashlyticsClient);
                    done();
                })
                .catch(done);
        });
    });

    it("#versions should be done", function(done) {
        crashlyticsClient.load()
            .then(function(client) {
                return client.versions();
            })
            .then(function() {
                done();
            })
            .catch(done);
    });

    it("#exception should be done", function(done) {
        crashlyticsClient.load()
            .then(function(client) {
                return client.exception();
            })
            .then(function() {
                done();
            })
            .catch(done);
    });

    it("#close should be done", function(done) {
        crashlyticsClient.load()
            .then(function(client) {
                return client.close();
            })
            .then(function() {
                done();
            })
            .catch(done);
    });
});