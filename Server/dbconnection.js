const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((error) => {
      console.error('Failed to connect to MongoDB:', error)
    })
}

module.exports = connectDB
