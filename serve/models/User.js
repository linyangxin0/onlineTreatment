module.exports.User = class User {
    constructor(name, account, password, doctor) {
        this.name = name;
        this.account = account;
        this.password = password;
        this.doctor = doctor
    }
}
