const log = (require("../logger/logger")).child({
    module: "unirest"
});

module.exports = unirestHandler;

function unirestHandler(resolve, reject, reduce, proxy) {
    return function(res) {
        const reduce = (typeof arguments[2] === "function") ? reduce : null;
        const data = reduce ? reduce(res.body) : res.body;

        if (proxy) {
            proxy(res);
        }
        log.info({
            req: res.request,
            res: res
        });
        if (res.error) {
            log.error(res.error);
            reject(res.error);
        } else {
            const logMessage = (typeof arguments[2] === "string") ? arguments[2] : null;

            if (logMessage) {
                log.info(logMessage);
            }
            resolve(data);
        }
    };
}