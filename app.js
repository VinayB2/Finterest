var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const expressSession = require("express-session");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./models/users");
const passport = require("passport");

var app = express();
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: "Some kind of secret",
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"), { type: "text/css" }));

app.use("/", indexRouter);
app.listen(process.env.PORT || 3000, () =>
    console.log("Server running on port 3000")
);

module.exports = app;
