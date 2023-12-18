var express = require("express");
var router = express.Router();
const userModel = require("../models/users");
const passport = require("passport");
const localStratergy = require("passport-local");
const upload = require("./multer");
const {
    login,
    register,
    profile,
    add,
    posts,
    feed,
    logout,
    createPost,
    fileupload,
    registerPost,
    home,
    view,
    deletePost,
    viewfeedpin,
} = require("../controllers/index");

passport.use(new localStratergy(userModel.authenticate()));
router
    .get("/", home)
    .get("/login", login)
    .get("/profile", isLoggedIn, profile)
    .get("/add", isLoggedIn, add)
    .get("/posts", isLoggedIn, posts)
    .get("/feed", isLoggedIn, feed)
    .get("/register", register)
    .get("/logout", logout)
    .get("/view", isLoggedIn, view)
    .get("/viewfeedpin", isLoggedIn, viewfeedpin)
    .get("/deletepost", isLoggedIn, deletePost);

router
    .post("/createPost", isLoggedIn, upload.single("postimage"), createPost)
    .post("/fileupload", isLoggedIn, upload.single("image"), fileupload)
    .post("/register", registerPost)
    .post(
        "/login",
        passport.authenticate("local", {
            failureRedirect: "/login",
            successRedirect: "/profile",
        }),
        (req, res, next) => {}
    );

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

module.exports = router;
