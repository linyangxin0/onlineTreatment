let mysql = require('mysql')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
});

connection.connect();

module.exports.updateUserInPassword = function (account, newPassword, callback) {
    return connection.query('update user set password=? where account=?',
        [newPassword, account], function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}

module.exports.insertUser = function (userName, account, password, callback) {
    return connection.query('insert into user (name,account,password) values(?,?,?)',
        [userName, account, password], function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}

module.exports.selectUserByAccount = function (account, callback) {
    return connection.query('select * from user where account = ?',
        [account], function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}

module.exports.selectUserByAccountAndPassword = function (account, password, callback) {
    return connection.query('select * from user where account = ? and password = ?',
        [account, password], function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}



