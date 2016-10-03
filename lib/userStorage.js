const Nedb = require("nedb");
const db = new Nedb({
    filename: "db/users",
    autoload: true
});
const Q = require("q");
const dbInsert = Q.nbind(db.insert, db);
const dbFind = Q.nbind(db.find, db);

module.exports.store = store;
module.exports.query = query;

function store(email, token, githubToken) {
    return dbInsert({
        email: email,
        token: token,
        githubToken: githubToken
    });
}

function query(condition) {
    return dbFind(condition);
}