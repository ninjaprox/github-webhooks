require('dotenv').config();

const express = require("express");
const app = express();
const authRouter = require("./auth/auth")
const cookieParser = require('cookie-parser')

app.use(express.static(__dirname + "/client"));
app.use("/", cookieParser(process.env.COOKIE_SECRET))
app.use("/auth", authRouter);

app.listen(process.env.PORT, function() {
    console.log("App listening on port 80.");
});