const versionRegex = /\d+\.\d+\.\d+ \(\d+\)/g;

/*global $*/
module.exports = function(page) {
    return page.evaluate(function() {
            return document.getElementsByClassName("build-version-table")[0].innerHTML;
        })
        .then(function(html) {
            const versions = html.match(versionRegex) || [];

            return versions.map(function(version) {
                return version.replace(" ", "");
            });
        });
};