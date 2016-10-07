const Q = require("q");
const versionRegex = /\d+\.\d+\.\d+ \(\d+\)/g;

/*global $*/
module.exports = function(page) {
    return Q.promise(function(resolve, reject) {
        page.evaluate(function() {
                return $(".build-version-table").html();
            })
            .then(function(html) {
                resolve(html.match(versionRegex) || []);
            })
            .catch(function(error) {
                reject(error);
            });
    });
};