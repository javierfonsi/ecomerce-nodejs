const express = require('express');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors');

//controllers
const { globalErrorhandler } = require('./controllers/error.controller');

//Routes
const { usersRouter } = require('./routes/users.routes');
const { productRouter } = require('./routes/products.routes');
const { cartsRouter } = require('./routes/carts.routes');
//const { productsincartRouter } = require('./routes/productsInCart.routes');
//const { ordersRouter } = require('./routes/order.routes');
//const { productinordersRouter } = require('./routes/productinorder.routes');

//Util
const { AppError } = require('./utils/appError')

//init server
const app = express();

//import json to receive requeriments in json format
app.use(express.json());

//max request/min = 5
app.use(rateLimit({ windowMS: 60*1000, max: 5, message: 'Too many request from your IP address, please verify' }))

//Enable cors
app.use('*', cors());

//Enable helmet
app.use(helmet())

//Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/carts', cartsRouter);
//app.use('/api/v1/productsincart', productsincartRouter);
//app.use('/api/v1/orders', ordersRouter);
//app.use('/api/v1/productsinorders', productinordersRouter);

app.use('*', (req, res, next) => {
  next(new AppError (404, `${req.originalUrl} not found in this server.`));
});

// Error handler (err -> AppError)
app.use(globalErrorhandler);

module.exports = { app };

