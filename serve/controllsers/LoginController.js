let loginDao = require('../dao/LoginDao')

module.exports = function (app) {
    app.get('/test', (req, res) => {
        loginDao.testDao()
    });
}



