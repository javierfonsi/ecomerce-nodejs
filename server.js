const { app } = require('./app');

// Utils
const { sequelize } = require('./utils/database');
const { initModels } = require('./utils/initModels');

// Database authenticated
sequelize
  .authenticate()
  .then(() => console.log('Database authenticated'))
  .catch((err) => console.log(err));

// Models relations
initModels();

sequelize
  //.sync({ force: true })
  .sync()
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.log(err));
// process.ENV.PORT
//si port esta definida y tiene un valor  entonces el port sera igual al puerto (4000)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Express app running: ${PORT}`);
});
