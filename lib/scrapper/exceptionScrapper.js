/*global $*/
module.exports = function(nightmare) {
    return nightmare.evaluate(function() {
        var exception;
        const info = document.querySelector(".info.normal").textContent;
        const exceptionChildNodes = document.querySelector(".strong.title")
            .childNodes;

        for (var i = 0; i < exceptionChildNodes.length; i++) {
            if (exceptionChildNodes[i].nodeType === Node.TEXT_NODE) {
                exception = exceptionChildNodes[i].textContent;

                break;
            }
        }

        return {
            exception: exception,
            info: info
        };
    });
};
