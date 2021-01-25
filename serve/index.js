let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connect', (socket) => {
    console.log(socket.id + '连接成功');

    // socket.join(socket.id);

    socket.on('login', () => {
        // socket.broadcast.emit('relogin', {
        //     result: 'broadcast'
        // })
        if (io.sockets.connected[socket.id]) {
            io.sockets.connected[socket.id].emit('relogin', {
                result: 'success'
            })
        }
    })
});

http.listen(8088);
console.log('监听8088端口');
