require("dotenv").config({
    path: ".env.test"
});

const GithubClient = require("../lib/githubClient");
const expect = require("chai").expect;

describe("GithubClient", function() {
    var githubClient;

    describe("using dummy info", function() {
        beforeEach(function() {
            githubClient = new GithubClient("token", "owner/repo");
        });

        describe("#init", function() {
            it("should construct properties properly", function() {
                expect(githubClient.token).to.equal("token");
                expect(githubClient.request).to.not.be.null;
                expect(githubClient.userUrl).to.equal("https://api.github.com/user");
                expect(githubClient.issueUrl).to.equal("https://api.github.com/repos/owner/repo/issues");
            });
        });

        describe("#request", function() {
            it("should set headers", function() {
                const headers = githubClient.request("GET", "example.com").options.headers;

                expect(headers["User-Agent"]).to.equal("GitHub Webhooks");
                expect(headers["Authorization"]).to.equal("token token");
                expect(headers["Content-Type"]).to.equal("application/json");
            });
        });
    });

    describe("using real info", function() {
        beforeEach(function() {
            githubClient = new GithubClient(process.env.GITHUB_TOKEN, "ninjaprox/test-place");
        });

        it("#user should be done", function(done) {
            githubClient.user()
                .then(function() {
                    done();
                })
                .catch(done);
        });

        it("#closeIssue should be done", function(done) {
            githubClient.closeIssue(1)
                .then(function() {
                    done();
                })
                .catch(done);
        });

        it("#createIssue should be done", function(done) {
            githubClient.createIssue("Issue 1", {
                    body: "hello\r\nworld"
                })
                .then(function() {
                    done();
                })
                .catch(done);
        });

        it.only("#issue should be done", function(done) {
            githubClient.issue(1)
                .then(function() {
                    done();
                })
                .catch(done);
        });

        it.only("#linkInIssue should be done", function(done) {
            githubClient.linkInIssue(1)
                .then(function(link) {
                    expect(link).to.equal("http://example.com")
                    done();
                })
                .catch(done);
        });
    });
});