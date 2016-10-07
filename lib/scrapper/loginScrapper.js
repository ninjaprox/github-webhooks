/*global $*/
module.exports = function(page, email, password) {
    return page.evaluate(function(email, password) {
        $("#email").val(email);
        $("#password").val(password);
        $("[type=submit]").submit();
    }, email, password);
};