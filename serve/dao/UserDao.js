let mysql = require('mysql')

let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'test'
});

connection.connect();

//修改密码
module.exports.updateUserInPassword = function (account, newPassword, callback) {
    return connection.query('update user set password=? where account=?',
        [newPassword, account], function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}

//注册
module.exports.insertUser = function (user, callback) {
    return connection.query('insert into user (name,account,password,doctor) values( ? ,? ,? ,? )',
        [user.name, user.account, user.password, user.doctor], function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}

//根据账号查找user
module.exports.selectUserByAccount = function (account, callback) {
    return connection.query('select * from user where account = ?',
        [account], function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}

//根据账号密码查询user
module.exports.selectUserByAccountAndPassword = function (account, password, callback) {
    return connection.query('select * from user where account = ? and password = ?',
        [account, password], function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}

//获取所有的医生列表
module.exports.selectAllDoctor = function (callback) {
    return connection.query('select * from user where doctor = 1',
        function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}



