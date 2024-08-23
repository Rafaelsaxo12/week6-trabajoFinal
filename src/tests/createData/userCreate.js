const User = require("../../models/User")

const userCreate = async () => {

    const user = {
        firtsName: "Rafael",
        lastName: "Pérez",
        email: "rafa@gmail.com",
        phone: "+584142309489"
    }

    await User.create(user)
}

module.exports(userCreate)