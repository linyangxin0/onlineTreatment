let loginDao = require('../dao/UserDao')
let userModel = require('../models/User')

module.exports = function (app) {
    //登录
    app.get('/login', async (req, res) => {
        await loginDao.selectUserByAccount(req.query.account, (back) => {
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
        loginDao.selectUserByAccountAndPassword(req.query.account, req.query.oldPassword, (firstBack) => {
            if (firstBack.length !== 0) {
                loginDao.updateUserInPassword(req.query.account, req.query.newPassword, (secondBack) => {
                    if (secondBack.changedRows === 0) {
                        res.send({
                            first: true,
                            second: false
                        })
                    } else {
                        res.send({
                            first: true,
                            second: true
                        })
                    }
                })
            } else {
                res.send({
                    first: false
                })
            }
        })
    })

    //用户注册
    app.get('/userRegister', (req, res) => {
        let user = new userModel.User(req.query.userName, req.query.account, req.query.password, req.query.doctor)
        loginDao.selectUserByAccount(req.query.account, (firstBack) => {
            if (firstBack.length !== 0) {
                res.send(false)
            } else {
                loginDao.insertUser(user, (secondBack) => {
                    if (secondBack.affectedRows !== 0) {
                        res.send(true)
                    }
                })
            }
        })
    })

}



