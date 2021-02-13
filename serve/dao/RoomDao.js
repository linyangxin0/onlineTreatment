let mysql = require('mysql')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
});

connection.connect();

//查询所有房间
module.exports.selectAllRoom = function (callback) {
    return connection.query('select * from room', function (error, results, fields) {
        if (error) throw error;
        callback(results)
    })
}
