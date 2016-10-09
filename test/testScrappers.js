const jqueryPath = "./node_modules/jquery/dist/jquery.min.js";
const expect = require("chai").expect;
const phantom = require("phantom");
const loginScrapper = require("../lib/scrapper/loginScrapper");
const versionScrapper = require("../lib/scrapper/versionScrapper");
const exceptionScrapper = require("../lib/scrapper/exceptionScrapper");

describe("Scrappers", function() {
    var phantomInstance;
    var page;

    beforeEach(function(done) {
        phantom.create()
            .then(function(instance) {
                phantomInstance = instance;

                return phantomInstance.createPage();
            })
            .then(function(_page) {
                page = _page;

                return page.injectJs(jqueryPath);
            })
            .then(function(success) {
                done();
            })
            .catch(function(error) {
                done(error);
            });
    });

    afterEach(function() {
        page.close();
        phantomInstance.exit();
    });

    describe("login", function() {
        const email = "email@email.com";
        const password = "password";

        beforeEach(function(done) {
            page.evaluate(function() {
                    var form = $("<form>\
                                  <input type=text id='email' />\
                                  <input type=password id='password' />\
                                  <input type=submit />\
                                  </form>");

                    $("body").append(form);
                    $("body").append("<div id='submit'></div>");
                    form.on("submit", function() {
                        $("#submit").text("submited");
                    });
                })
                .then(function() {
                    done();
                });
        });


        it("should fill in form", function(done) {
            loginScrapper(page, email, password)
                .then(function() {
                    page.evaluate(function() {
                            return {
                                email: $("#email").val(),
                                password: $("#password").val()
                            };
                        })
                        .then(function(result) {
                            expect(result.email).to.equal(email);
                            expect(result.password).to.equal(password);
                            done();
                        })
                })
        });

        it("should click login button", function(done) {
            loginScrapper(page, email, password)
                .then(function() {
                    page.evaluate(function() {
                            return $("#submit").text() === "submited";
                        })
                        .then(function(submited) {
                            expect(submited).to.be.true;
                            done();
                        })
                        .catch(function(error) {
                            done(error);
                        });
                })
                .catch(function(error) {
                    done(error);
                });
        });
    });

    describe("version", function() {
        beforeEach(function(done) {
            page.evaluate(function() {
                    var content = $("<div class='build-version-table'>\
                                  <span>1.0.0 (1)<span>\
                                  <span>1.2.0 (1)<span>\
                                  <span>1.2.3 (1)<span>\
                                  <span>1</span>\
                                  <span>a</span>\
                                  </div>");

                    $("body").append(content);
                })
                .then(function() {
                    done();
                });
        });

        it("should return versions", function(done) {
            versionScrapper(page)
                .then(function(versions) {
                    expect(versions).to.deep.equal(["1.0.0(1)", "1.2.0(1)", "1.2.3(1)"]);
                    done();
                })
                .catch(function(error) {
                    done(error);
                });
        });
    });

    describe("exception", function() {
        beforeEach(function(done) {
            page.evaluate(function() {
                    var content = $("<div class='strong title'>" +
                                  "<!-- coment -->" +
                                  "Exception" +
                                  "<div class='info normal'>Exception info</div>" +
                                  "</div>");

                    $("body").append(content);
                })
                .then(function() {
                    done();
                });
        });

        it("should return exception and info", function(done) {
            exceptionScrapper(page)
                .then(function(exception) {
                    expect(exception.exception).to.equal("Exception");
                    expect(exception.info).to.equal("Exception info");
                    done();
                })
                .catch(function(error) {
                    done(error);
                });
        });
    });
});