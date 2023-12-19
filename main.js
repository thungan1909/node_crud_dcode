// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to Database");

    // Start the server only after a successful database connection
    app.listen(PORT, () => {
      console.log("Server is running on port: " + PORT);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectToDatabase();

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//set template engine
app.set("view engine", "ejs");

// route prefix
app.use("", require("./routes/routes"));
