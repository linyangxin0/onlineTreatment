let express = require('express');
let app = express();
let http = require('http').Server(app);

var fs = require('fs');
let sslOptions = {
    key: fs.readFileSync('C:/privkey.key'),//里面的文件替换成你生成的私钥
    cert: fs.readFileSync('C:/cacert.pem')//里面的文件替换成你生成的证书
};

const https = require('https').createServer(sslOptions, app);
let io = require('socket.io')(https);


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
        let userList = [];
        for (let key in io.sockets.connected) {
            userList.push(key)
        }
        io.sockets.emit('UpdateOnlineNum', onlinePersonNum);
        io.sockets.emit('sendUserList', userList)
        if (io.sockets.connected[socket.id]) {
            io.sockets.connected[socket.id].emit('getRoomsInfo', roomsInfo)
        }
    })

    //返回所有已连接用户
    socket.on('getUserList', () => {
        if (io.sockets.connected[socket.id]) {
            let userList = [];
            for (let key in io.sockets.connected) {
                userList.push(key)
            }
            io.sockets.connected[socket.id].emit('sendUserList', userList)
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


    //sdp 消息的转发
    socket.on('sdp', (data) => {
        console.log(data.to)
        //console.log('sdp:  ' + data.sender + '   to:' + data.to);
        socket.to(data.to).emit('sdp', {
            description: data.description,
            sender: data.sender
        });
    });


    //candidates 消息的转发
    socket.on('iceCandidates', (data) => {
        console.log(data.to);
        socket.to(data.to).emit('iceCandidates', {
            candidate: data.candidate,
            sender: data.sender
        });
    });


});

https.listen(8088);
console.log('监听8088端口');
