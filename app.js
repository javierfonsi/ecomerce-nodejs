const express= require('express')

//Model
const { ordersRouter } = require('./routes/order.route')
const { productinordersRouter } = require('./routes/productinorder.route')

//Util
const { sequelize } = require('./utils/database')

//Init express
const app = express()

//Endpoint
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

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log("Running server");
})

