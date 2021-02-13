let roomDao = require('../dao/RoomDao')
let roomModel = require('../models/Room')

module.exports = function (app) {

    app.get('/getRooms', (req, res) => {
        roomDao.selectAllRoom((back) => {
            res.send(back)
        })
    })

    app.get('/addRoom', (req, res) => {
        roomDao.selectRoomByName(req.query.name, (back) => {
            if (back.length !== 0) {
                res.send(false)
            } else {
                let room = new roomModel.Room(req.query.name, req.query.password)
                roomDao.insertRoom(room, (back) => {
                    res.send(true)
                })
            }
        })
    })

}
