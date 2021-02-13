let express = require('express');
let app = express();
let http = require('http').Server(app);


//引入controller
require('./controllsers/UserController')(app);


//配置https
let fs = require('fs');
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
//当前连接人数
let userList = [];

//socket.io连接
io.on('connect', (socket) => {

    onlinePersonNum++;

    //用户进入系统
    socket.on('init', () => {
        let userList = [];
        for (let key in io.sockets.connected) {
            userList.push(key)
        }
        io.sockets.emit('updateOnlineNum', onlinePersonNum);
        if (io.sockets.connected[socket.id]) {
            io.sockets.connected[socket.id].emit('getRoomsInfo', roomsInfo)
        }
    })


    //返回所有已连接用户
    socket.on('getUserList', (data) => {
        if (io.sockets.connected[socket.id]) {
            userList = userList.filter(item => item.userName !== data)
            userList.push({
                socketId: socket.id,
                userName: data
            })
            io.sockets.emit('sendUserList', userList)
        }
    })

    //返回当前房间的成员
    socket.on('getRoomUsers', (data) => {
        let isContainRoom = false;
        roomsInfo.forEach((item) => {
            if (item.roomId + '' === data.roomId + '') {
                isContainRoom = !isContainRoom;
                let isContainPeople = false;
                for (let i of item.peoples) {
                    if (i.socketId === socket.id) {
                        isContainPeople = true;
                    }
                }
                if (!isContainPeople) {
                    item.peoples.push({
                        userName:data.userName,
                        socketId:socket.id
                    })
                    item.peopleNum++;
                    socket.join(item.roomId)
                }
                io.to(item.roomId).emit('sendRoomInfo', item);
            }
        })
        if (!isContainRoom) {
            io.sockets.connected[socket.id].emit('roomUnableEnter')
        }
    })

    //用户退出系统
    socket.on('disconnect', () => {
        userList = userList.filter(item => item.socketId !== socket.id)
        onlinePersonNum--;
        socket.broadcast.emit('sendUserList', userList)
        socket.broadcast.emit('updateOnlineNum', onlinePersonNum)
    })

    //创建房间
    socket.on('createRoom', (data) => {
        let room = {
            roomId: num++,
            roomName: data.roomName,
            peopleNum: 1,
            peoples: [{
                socketId: socket.id,
                userName: data.userName
            }],
            password: data.password,
        }
        roomsInfo.push(room)
        socket.join(room.roomId + '')
        //通知创建房间发起者
        if (io.sockets.connected[socket.id]) {
            io.sockets.connected[socket.id].emit('createRoomSuccess', room)
        }
        //广播通知所有人
        io.sockets.emit('updateRoomList', roomsInfo)
    })


    //加入房间
    socket.on('enterRoom', (data) => {
        roomsInfo.forEach(function (item) {
            if (item.roomId + '' === data.roomId + '') {
                if (!item.password || item.password + '' === data.password + '') {
                    item.peopleNum += 1;
                    item.peoples.push({
                        socketId: socket.id,
                        userName: data.userName
                    })
                    socket.join(item.roomId + '');
                    // socket.broadcast.to(item.roomId).emit('enterRoomSuccess', roomsInfo)
                    io.sockets.emit('enterRoomSuccess', item)
                } else {
                    io.sockets.emit('enterRoomFailure')
                }
            }
        })
    })


    //获取当前系统信息
    socket.on('getSysInfo', () => {
        //通知当前请求人
        if (io.sockets.connected[socket.id]) {
            io.sockets.connected[socket.id].emit('updateRoomList', roomsInfo)
            io.sockets.connected[socket.id].emit('updateOnlineNum', onlinePersonNum);
        }
    })

    //线上聊天部分
    socket.on('sendMessage', (msg) => {
        let res = {
            roomId: msg.roomId,
            content: msg.content,
            sender: socket.id,
            time: msg.time
        }
        io.to(msg.roomId).emit('getNewMessage', res);
    })


    //离开房间
    socket.on('exitRoom', (data) => {
        socket.leave(data, () => {
            // console.log('------------')
            // console.log(roomsInfo)
            roomsInfo.forEach((item) => {
                if (item.roomId + '' === data + '') {
                    item.peoples = item.peoples.filter(i => i.socketId + '' !== socket.id + '');
                    item.peopleNum--;
                    if (item.peoples.length === 0) {
                        roomsInfo = roomsInfo.filter(j => j !== item)
                    }
                    io.sockets.emit('updateRoomList', roomsInfo)
                }
                // console.log('++++++++++++++++++')
                // console.log(roomsInfo)
            })
        })
    })

    //sdp 消息的转发
    socket.on('sdp', (data) => {
        // console.log(data.to)
        //console.log('sdp:  ' + data.sender + '   to:' + data.to);
        socket.to(data.to).emit('sdp', {
            description: data.description,
            sender: data.sender
        });
    });


    //candidates 消息的转发
    socket.on('iceCandidates', (data) => {
        socket.to(data.to).emit('iceCandidates', {
            candidate: data.candidate,
            sender: data.sender
        });
    });


});

https.listen(8088);
console.log('监听8088端口');
