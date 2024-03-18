const express = require('express')
const app = express()

const router = require('./Routers/userRouters')
const connectDB = require('./dbconnection')

const PORT = 8000

connectDB('mongodb://localhost:27017/bankingSystem')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(router)

app.listen(PORT, () => {
  console.log(`Application Server Is Started at http://localhost:${PORT}`)
})
