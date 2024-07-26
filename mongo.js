require('dotenv').config()

const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

//conexión a mongodb
mongoose.connect(connectionString)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(`MongoDB connection error: ${err.message}`));


process.on('uncaughtException', () => {
    mongoose.connection.disconnect()
})

