const express = require('express');

//Routes
const { usersRouter } = require('./routes/users.routes');
const { productRouter } = require('./routes/products.routes');
const { cartsRouter } = require('./routes/carts.routes');
const { productsincartRouter } = require('./routes/productsInCart.routes');
const { ordersRouter } = require('./routes/order.routes');
const { productinordersRouter } = require('./routes/productinorder.routes');

//Util
const { sequelize } = require('./utils/database');

//Models
const { User } = require('./models/users.model');
const { Product } = require('./models/products.model');
const { Cart } = require('./models/carts.model');
const { Order } = require('./models/order.model');

//Init express
const app = express();

//json
app.use(express.json());

//Endpoint
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/carts', cartsRouter);
app.use('/api/v1/productsincart', productsincartRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/productsinorders', productinordersRouter);

sequelize
  .authenticate()
  .then(() => console.log('Database autenthicate'))
  .catch((error) => console.log(error));

//Relation
User.hasMany(Product);
Product.belongsTo(User);

User.hasOne(Cart);
Cart.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
  .sync()
  .then(() => console.log('Database sync'))
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log('Running server');
});

// User (id, username, email, password, status)
// ○ Product (id, name, price, availableQty, status, userId)
// ○ Cart (id, userId, totalPrice, status)
// ○ ProductInCart (id, cartId, productId, quantity, price, status)
// ○ Order (id, totalPrice, userId, status)
// ○ ProductInOrder (id, orderId, productId, quantity, price, status
