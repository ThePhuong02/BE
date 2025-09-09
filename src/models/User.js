class User {
    constructor({ userid, name, email, password, phone, avatar, role, reset_token }) {
        this.userid = userid;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.avatar = avatar;
        this.role = role;
        this.reset_token = reset_token;
    }
}

module.exports = User;
