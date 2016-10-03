module.exports = unirestHandler;

function unirestHandler(callback, reduce, proxy) {
    return function(res) {
        if (proxy) {
            proxy(res);
        }
        if (callback) {
            const data = reduce ? reduce(res.body) : res.body;
            
            callback(res.error, data);
        }
    };
}