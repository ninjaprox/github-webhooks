const versionRegex = /\d+\.\d+\.\d+ \(\d+\)/g;

/*global $*/
module.exports = function(page) {
    return page.evaluate(function() {
            return $(".build-version-table").html();
        })
        .then(function(html) {
            return html.match(versionRegex) || [];
        });
};