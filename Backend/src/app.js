const express = require('express')
const morga = require('morgan')
const { config } = require('dotenv')

require('./db')
const indexRoutes = require('./routes/index')
config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morga("dev"))



app.use('/api', indexRoutes)

app.listen(port, () => {
    console.log("app listenning on port 🔥 " + port)
})
