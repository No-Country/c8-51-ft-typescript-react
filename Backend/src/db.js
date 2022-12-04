require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connect to mongodb"))
  .catch((err) => console.log("error connecting", err));


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));