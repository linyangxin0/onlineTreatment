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


//根据房间名称查询
module.exports.selectRoomByName = function (name, callback) {
    return connection.query('select * from room where name = ?',
        [name], function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}

//插入room
module.exports.insertRoom = function (room, callback) {
    return connection.query('insert into room (name,password) values (?,?)',
        [room.name, room.password], function (error, results, fields) {
            if (error) throw error;
            callback(results)
        })
}


