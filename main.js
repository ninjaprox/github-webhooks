require('dotenv').config();

const express = require("express");
const app = express();
const authRouter = require("./auth/auth");
const hookRouter = require("./hook/hook");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const log = require("./logger/logger");

app.use(express.static(__dirname + "/client"));
app.use("/", cookieParser(process.env.COOKIE_SECRET))
app.use("/", bodyParser.json());
app.use("/auth", authRouter);
app.use("/hook", hookRouter);

app.listen(process.env.PORT, function() {
    log.info(`App listening on port ${process.env.PORT}.`);
});