const express = require("express");
const app = express();

app.use(express.static(__dirname + "/client"));

app.listen(process.env.PORT, function() {
    console.log("App listening on port 80.");
});