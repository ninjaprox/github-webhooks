module.exports = unirestHandler;

function unirestHandler(resolve, reject, reduce, proxy) {
    return function(res) {
        const data = reduce ? reduce(res.body) : res.body;

        if (proxy) {
            proxy(res);
        }
        if (res.error) {
            reject(res.error);
        } else {
            resolve(data);
        }
    };
}