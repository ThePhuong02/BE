class UserDTO {
    constructor(user) {
        this.userid = user.userid;
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.avatar = user.avatar;
        this.role = user.role;
    }
}

module.exports = UserDTO;
