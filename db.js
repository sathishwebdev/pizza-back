const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config()

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("connected", () => {
  console.log("Database connected successfully");
});

db.on("error", () => {
  console.log("Database connection error ");
});

module.exports = mongoose;
