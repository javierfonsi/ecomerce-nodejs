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

app.listen(4000, () => {
    console.log("Running server");
})

//poefeom
//lmfkerf
