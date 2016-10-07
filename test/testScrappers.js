const jqueryPath = "./node_modules/jquery/dist/jquery.min.js";
const expect = require("chai").expect;
const phantom = require("phantom");
const loginScrapper = require("../lib/scrapper/loginScrapper");

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
                console.log("inject", success);
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
                                  <input type=text id='email'/>\
                                  <input type=password id='password'/>\
                                  <input type=submit/>\
                                  </form>");

                    $("body").append(form);
                    $("body").append("<div id='submit'></div>");
                    form.on("submit", function() {
                        $("#submit").val("submited");
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

        it("should click login button", function() {
            loginScrapper(page, email, password)
                .then(function() {
                    page.evaluate(function() {
                            return $("#submit").val() === "submited";
                        })
                        .then(function(submited) {
                            expect(submited).to.be.true;
                            done();
                        })
                });
        });
    });
});
