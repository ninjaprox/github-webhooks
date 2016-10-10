const bunyan = require("bunyan");
const isTest = !process.env.npm_package_name;
var log;

if (!isTest) {
    log = bunyan.createLogger({
        name: process.env.npm_package_name,
        level: process.env.LOG_LEVEL,
        streams: [{
            stream: process.stdout,
            level: process.env.LOG_LEVEL
        }, {
            path: "./.log/server.log",
            level: process.env.LOG_LEVEL
        }],
        serializers: bunyan.stdSerializers
    });
} else {
    log = bunyan.createLogger({
        name: "TEST",
        level: "error"
    });
}

module.exports = log;