const express= require('express');
const { productRouter } = require('./routes/products.routes');
const { usersRouter } = require('./routes/users.routes')
const { sequelize } = require('./utils/database')


const app = express()
//json 
app.use(express.json());

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productRouter)

sequelize
    .authenticate()
    .then(() => console.log("Database autenthicate"))
    .catch(error => console.log(error))

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

