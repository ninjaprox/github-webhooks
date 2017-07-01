/*global $*/
module.exports = function(nightmare, email, password) {
    return nightmare
        .wait("#email")
        .insert("#email", email)
        .insert("#password", password)
        .click(".block.sdk-button.sign-in")
        .wait(5000);
};
