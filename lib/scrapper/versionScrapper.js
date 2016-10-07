const versionRegex = /\d+\.\d+\.\d+ \(\d+\)/g;

/*global $*/
module.exports = function(page) {
    return page.evaluate(function() {
            return $(".build-version-table").html();
        })
        .then(function(html) {
            const versions = html.match(versionRegex) || [];
            
            return versions.map(function(version) {
                return version.replace(" ", "");
            });
        });
};