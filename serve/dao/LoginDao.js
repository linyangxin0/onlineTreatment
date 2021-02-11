let mysql = require('mysql')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
});

connection.connect();

module.exports.userLogin = function (account, callback) {
    return connection.query('select * from user where account=?', [account], function (error, results, fields) {
        if (error) throw error;
        callback(results)
    });
}


