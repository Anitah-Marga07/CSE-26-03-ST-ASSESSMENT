// DEPENDENCIES
const express = require("express");
const expressSession = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");

require("dotenv").config();
const connectDB = require("./config/db");

// INSTANTIATIONS
const app = express();
const port = 3000;

// CONFIGURATIONS
// setting up templating engine (pug)
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
connectDB(); //connecting to the DB

// MIDDLEWARE
//this helps us to access our static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(express.json());
// To parse URL encoded data
app.use(express.urlencoded({ extended: false }));
app.use(
  expressSession({
    secret: "Tell nobody!",
    resave: false, 
    saveUninitialized: false, 
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});

// ROUTES
app.use("/", require("./routes/indexRoutes"));


app.use((req, res) => {
  res.status(404).send("Oops! Route not found.");
});

// BOOTSTRAPPING SERVER
app.listen(port, () => console.log(`listening on port ${port}`));
