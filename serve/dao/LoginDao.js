let mysql = require('mysql')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
});

connection.connect();

module.exports.testDao = function () {
    connection.query('select * from user', function (error, results, fields) {
        if (error) throw error;
        console.log(results);
    });
}



