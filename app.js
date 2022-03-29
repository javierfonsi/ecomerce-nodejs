const express= require('express')

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');


//Routes 
const { productRouter } = require('./routes/products.routes');

//Init express
const app = express()

app.use(express.json());

//Endpoint
app.use('/api/v1/products', productRouter)

app.use(globalErrorHandler);

module.exports = { app };

