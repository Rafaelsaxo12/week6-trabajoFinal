const User = require('./User')
const Category = require('./Category')
const Product = require('./Product')
const Cart = require('./Cart')
const Purchase = require('./Purchase')
const ProductImg = require('./ProductImg')



//!Product==>Category
Product.belongsTo(Category)
Category.hasMany(Product)


//cart ->userId
Cart.belongsTo(User)
User.hasMany(Cart)


//Cart -> Product
Cart.belongsTo(Product)
Product.hasMany(Cart)


//Cart -> user
Purchase.belongsTo(User)
User.hasMany(Purchase)

//Purchase -> Product
Purchase.belongsTo(Product)
Product.hasMany(Purchase)

//ProductImg ->productId
ProductImg.belongsTo(Product)
Product.hasMany(ProductImg)