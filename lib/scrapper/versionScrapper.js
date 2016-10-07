const versionRegex = /\d+\.\d+\.\d+ \(\d+\)/g;

/*global $*/
module.exports = function(that) {
    return that.page.evaluate(function() {
            return $(".build-version-table").html();
        })
        .then(function(html) {
            return html.match(versionRegex) || [];
        })
        .then(function(versions) {
            return [that, versions];
        });
};