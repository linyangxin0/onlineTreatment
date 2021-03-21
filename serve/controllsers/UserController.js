let loginDao = require('../dao/UserDao')
let userModel = require('../models/User')


module.exports = function (app) {
    //登录
    app.get('/login', async (req, res) => {
        await loginDao.selectUserByAccount(req.query.account, back => {
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
        loginDao.selectUserByAccountAndPassword(req.query.account, req.query.oldPassword, firstBack => {
            if (firstBack.length !== 0) {
                loginDao.updateUserInPassword(req.query.account, req.query.newPassword, secondBack => {
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
        loginDao.selectUserByAccount(req.query.account, firstBack => {
            if (firstBack.length !== 0) {
                res.send(false)
            } else {
                loginDao.insertUser(user, secondBack => {
                    if (secondBack.affectedRows !== 0) {
                        res.send(true)
                    }
                })
            }
        })
    })

    //获取医师列表
    app.get('/selectAllDoctor', async (req, res) => {
        await loginDao.selectAllDoctor(back => {
            res.send(back);
        })
    });

    //获取医生信息
    app.get('/getDoctorInfo', async (req, res) => {
        await loginDao.selectDoctorInfoById(req.query.id, back => {
            res.send(back[0])
        })
    });


    //增加医生预约信息
    app.get('/addAppointment', async (req, res) => {
        let time = new Date(req.query.time * 1);
        await loginDao.selectAllTimeById(req.query.id, back => {
            let flag = false;
            back.forEach(item => {
                if (item.time.getTime() === time.getTime()) {
                    flag = true;
                }
            })
            if (flag) {
                res.send(false)
            } else {
                loginDao.addAppointment(req.query.id, time, back => {
                    res.send(true)
                })
            }
        })
    });

    //获取预约时间
    app.get('/getAppointmentById',async (req, res) => {
        await loginDao.selectAllTimeById(req.query.id, back => {
            res.send(back)
        })
    })
}





