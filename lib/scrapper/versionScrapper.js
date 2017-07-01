const versionRegex = /\d+\.\d+\.\d+ \(\d+\)/g;

/*global document*/
module.exports = function(nightmare) {
    return nightmare
        .evaluate(function() {
            const elements = document.getElementsByClassName(
                "build-version-table"
            );

            return elements.length > 0 ? elements[0].innerHTML : "";
        })
        .then(function(html) {
            const versions = html.match(versionRegex) || [];

            return versions.map(function(version) {
                return version.replace(" ", "");
            });
        });
};
