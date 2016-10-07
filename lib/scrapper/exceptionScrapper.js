/*global $*/
module.exports = function(page) {
    return page.evaluate(function() {
            const exception = $(".strong.title")[0].childNodes[1].textContent;
            const info = $(".info.normal")[0].textContent;

            return {
                exception: exception,
                info: info
            };
        });
};