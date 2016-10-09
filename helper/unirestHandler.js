const log = (require("../logger/logger")).child({
    module: "unirest"
});

module.exports = unirestHandler;

function unirestHandler(resolve, reject, reduce, proxy) {
    return function(res) {
        const data = reduce ? reduce(res.body) : res.body;

        if (proxy) {
            proxy(res);
        }
        log.info({
            req: res.request,
            res: res
        });
        if (res.error) {
            log.error(error);
            reject(res.error);
        } else {
            resolve(data);
        }
    };
}