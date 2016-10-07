/*global $*/
module.exports = function(page) {
    return page.evaluate(function() {
            $(".toggle-button:not(.closed)").click();
        });
};