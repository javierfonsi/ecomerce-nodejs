const express= require('express');

//Model
const { productRouter } = require('./routes/products.routes');
const { usersRouter } = require('./routes/users.routes')
const { ordersRouter } = require('./routes/order.route')
const { productinordersRouter } = require('./routes/productinorder.route')


//Util
const { sequelize } = require('./utils/database')

//Init express
const app = express()
//json 
app.use(express.json());


//Endpoint
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orders', ordersRouter)
app.use('/api/v1/productsinorders', productinordersRouter)



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

