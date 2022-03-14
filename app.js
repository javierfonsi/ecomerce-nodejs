const express= require('express');
const { usersRouter } = require('./routes/users.routes')
const { productRouter } = require('./routes/products.routes');
const { cartsRouter } = require('./routes/carts.routes');
const { productsincartRouter } = require('./routes/productsInCart.routes');
const { sequelize } = require('./utils/database');

const { User } = require('./models/users.model');
const { Product } = require('./models/products.model');
const { Cart } = require('./models/carts.model');

const app = express()
//json 
app.use(express.json());

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productRouter)
app.use('/api/v1/carts', cartsRouter);
app.use('/api/v1/productsincart', productsincartRouter);

sequelize
    .authenticate()
    .then(() => console.log("Database autenthicate"))
    .catch(error => console.log(error))

User.hasMany(Product)
Product.belongsTo(User)

User.hasOne(Cart)
Cart.belongsTo(User)

//Pendiente cuando Robert agregue su código de Order and Product
//User.hasMany(Order)
//Order.belongsTo(User)

sequelize
    .sync()
    .then(() => console.log("Database sync"))
    .catch(error => console.log(error))


const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log("Running server");
})

// User (id, username, email, password, status)
// ○ Product (id, name, price, availableQty, status, userId)
// ○ Cart (id, userId, totalPrice, status)
// ○ ProductInCart (id, cartId, productId, quantity, price, status)
// ○ Order (id, totalPrice, userId, status)
// ○ ProductInOrder (id, orderId, productId, quantity, price, status

