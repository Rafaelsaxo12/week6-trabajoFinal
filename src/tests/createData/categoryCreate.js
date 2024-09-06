const Category = require("../../models/Category")
const User = require("../../models/Category")

const categoryCreate =async() =>{

    const category = {
        name: "Kitchen"
    }

    await Category.create(category)
}

module.exports = categoryCreate;