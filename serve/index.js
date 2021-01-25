let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

//当前在线人数
let onlinePersonNum = 0;
//房间
let rooms = []
//房间id
let num = 0

io.on('connect', (socket) => {

    //用户进入系统
    socket.on('init', () => {
        onlinePersonNum++;
        io.sockets.emit('onlinePersonNumChange', onlinePersonNum);
        if (io.sockets.connected[socket.id]) {
            io.sockets.connected[socket.id].emit('getInitInfo', rooms)
        }
    })

    //创建房间
    socket.on('createRoom', (data) => {
        let room = {
            roomId: num++,
            roomName: data.roomName,
            peopleNum: 1,
            peoples: [socket.id]
        }
        rooms.push(room)
        socket.join(room)
        //广播通知所有人
        io.sockets.emit('updateRoomList', rooms)
    })

    //加入房间
    socket.on('enterRoom', (data) => {
        rooms.forEach(function (item) {
            if (item.roomId === data.roomId) {
                item.peopleNum += 1;
                item.peoples.push(socket.id)
                socket.join(item.roomId);
                console.log(item)
                // socket.broadcast.to(item.roomId).emit('enterRoomSuccess', rooms)
                io.sockets.emit('enterRoomSuccess', rooms)
            }
        })
    })


});

http.listen(8088);
console.log('监听8088端口');
