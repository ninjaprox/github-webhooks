const express = require("express");
const app = express();

app.get("/", function(req, res) {
    console.log(req);
    res.status(200);
});

app.listen(process.env.PORT, function() {
    console.log("App listening on port 80.");
});