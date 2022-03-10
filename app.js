const express= require('express')
const { sequelize } = require('./utils/database')

const app = express()

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

