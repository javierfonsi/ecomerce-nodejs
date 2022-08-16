const express = require('express');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const cors = require('cors');
const path = require('path')

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


//swagger
const swaggerSpec = {
  definition:{
      openapi: '3.0.3',
      info: {
          title: "ecommerceApi API",
          description: "This is a simple ecommerce store server, based on the OpenAPI 3.0 specification. The user create an account, then is logged and add the products to cart, perform their pay", 
          contact: {
              "name": "Javier Rodrigo Fonseca Leal",
              "url": "https://portafolio-javierfonseca.netlify.app/",
              "email": "javierrfl1985@gmail.com"
            },
          version: "1.0.0"
      },
      servers: [
          {
            "url":"http://localhost:4000",
            "description": "Development server"
          },
          {
            "url":"https://ecommerce-nodejs3.herokuapp.com",
            "description": "Production server"
        }
      ]
  },
  apis: [`${path.join(__dirname, './routes/*.js')}`]
}

//init server
const app = express();

//import json to receive requeriments in json format
app.use(express.json());

//max request/min = 5
app.use(rateLimit({ windowMS: 60*1000, max: 5, message: 'Too many request from your IP address, please verify' }))

//Enable helmet
app.use(helmet())

//Enable compression response for the browser 
app.use(compression())

//Enable morgan to view the request in console 
app.use(morgan('dev'))

//Enable cors
app.use('*', cors());




//Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/carts', cartsRouter);
app.use('/api/v1/doc', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))
//app.use('/api/v1/productsincart', productsincartRouter);
//app.use('/api/v1/orders', ordersRouter);
//app.use('/api/v1/productsinorders', productinordersRouter);

app.use('*', (req, res, next) => {
  next(new AppError (404, `${req.originalUrl} not found in this server.`));
});

// Error handler (err -> AppError)
app.use(globalErrorhandler);

module.exports = { app };

