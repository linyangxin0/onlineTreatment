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

    //修改密码
    app.get('/updatePassword', (req, res) => {
        loginDao.changePassword(req.query.account, req.query.newPassword, (back) => {
            if (back.changedRows === 0) {
                res.send(false)
            } else {
                res.send(true)
            }
        })
    })

    app.get('/userRegister', (req, res) => {
        loginDao.selectUser(req.query.account, (firstBack) => {
            if (firstBack.length !== 0) {
                res.send(false)
            } else {
                loginDao.userRegister(req.query.userName, req.query.account, req.query.password, (secondBack) => {
                    if (secondBack.affectedRows !== 0) {
                        res.send(true)
                    }
                })
            }
        })
    })

}



