let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

//当前在线人数
let onlinePersonNum = 0;
//房间
let roomsInfo = []
//房间id
let num = 0

io.on('connect', (socket) => {

    //用户进入系统
    socket.on('init', () => {
        onlinePersonNum++;
        io.sockets.emit('UpdateOnlineNum', onlinePersonNum);
        if (io.sockets.connected[socket.id]) {
            io.sockets.connected[socket.id].emit('getRoomsInfo', roomsInfo)
        }
    })

    //用户退出系统
    socket.on('disconnect', () => {
        onlinePersonNum--;
        socket.broadcast.emit('UpdateOnlineNum', onlinePersonNum)
    })

    //创建房间
    socket.on('createRoom', (data) => {
        let room = {
            roomId: num++,
            roomName: data.roomName,
            peopleNum: 1,
            peoples: [socket.id]
        }
        roomsInfo.push(room)
        socket.join(room.roomId)
        //广播通知所有人
        io.sockets.emit('updateRoomList', roomsInfo)
    })

    //加入房间
    socket.on('enterRoom', (data) => {
        roomsInfo.forEach(function (item) {
            if (item.roomId === data.roomId) {
                item.peopleNum += 1;
                item.peoples.push(socket.id)
                socket.join(item.roomId);
                // socket.broadcast.to(item.roomId).emit('enterRoomSuccess', roomsInfo)
                io.sockets.emit('enterRoomSuccess', roomsInfo)
            }
        })
    })

    //离开房间



});

http.listen(8088);
console.log('监听8088端口');
