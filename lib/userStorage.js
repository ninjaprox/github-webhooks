const Nedb = require("nedb");
const db = new Nedb({
    filename: "db/users",
    autoload: true
});
const Q = require("q");
const dbFind = Q.nbind(db.find, db);

module.exports.store = store;
module.exports.query = query;

function store(email, token, githubToken) {
    return Q.promise(function(resolve, reject) {
        db.update({
            email: email
        }, {
            email: email,
            token: token,
            githubToken: githubToken
        }, {
            upsert: true,
            returnUpdatedDocs: true
        }, function(error, _, updatedUser) {
            if (error) {
                reject(error);
            } else {
                resolve(updatedUser);
            }
        });
    });
}

function query(condition) {
    return dbFind(condition);
}