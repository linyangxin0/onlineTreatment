let roomDao = require('../dao/RoomDao')
let userModel = require('../models/Room')

module.exports = function (app) {

    app.get('/getRooms', (req, res) => {
        roomDao.selectAllRoom((back) => {
            res.send(back)
        })
    })
}
