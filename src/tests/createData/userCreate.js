const User = require("../../models/User")

const userCreate = async () => {

    const user = {
        firstName: "Rafael",
        lastName: "Pérez",
        email: "rafa@gmail.com",
        password: "rafa1234",
        phone: "+584142309489"
    }

    await User.create(user)
}
console.log(userCreate);

module.exports = userCreate