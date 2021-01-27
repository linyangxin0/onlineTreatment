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
}



