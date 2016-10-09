/*global $*/
module.exports = function(page, email, password) {
    return page.evaluate(function(email, password) {
        document.getElementById("email").value = email;
        document.getElementById("password").value = password;
        document.querySelector("[type=submit]").click();
    }, email, password);
};