const { config } = require('dotenv')
const mongoose = require('mongoose')
config()

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('connect to mongodb'))
    .catch((err) => console.log('error connecting', err))