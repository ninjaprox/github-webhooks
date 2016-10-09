const bunyan = require("bunyan");
const log = bunyan.createLogger({
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

module.exports = log;