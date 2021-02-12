let loginDao = require('../dao/LoginDao')

module.exports = function (app) {

    //登录接口
    app.get('/login', async (req, res) => {
        await loginDao.userLogin(req.query.account, (back) => {
            if (back.length === 0) {
                res.send(false)
            } else {
                if (back[0].password === req.query.password) {
                    res.send(back[0])
                } else {
                    res.send(false)
                }
            }
        })
    });

    app.get('/updatePassword', (req, res) => {
        loginDao.changePassword(req.query.account, req.query.newPassword, (back) => {
            if (back.changedRows === 0) {
                res.send(false)
            } else {
                res.send(true)
            }
        })

    })

}



