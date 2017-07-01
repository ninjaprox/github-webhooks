/*global $*/
module.exports = function(nightmare) {
    return nightmare.click(".toggle-button:not(.closed)");
};
