/*global $*/
module.exports = function(that) {
    return that.page.evaluate(function() {
            $(".toggle-button:not(.closed)").click();
        })
        .then(function() {
            return [that];
        });
};