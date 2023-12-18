const userModel = require("../models/users");
const postModel = require("../models/post");
const passport = require("passport");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const login = (req, res, next) => {
    res.render("login");
};

const home = (req, res, next) => {
    res.render("home");
};

const profile = async (req, res, next) => {
    const user = await userModel
        .findOne({ username: req.session.passport.user })
        .populate("posts");
    res.render("profile", { user });
};

const add = async function (req, res, next) {
    const user = await userModel.findOne({
        username: req.session.passport.user,
    });
    res.render("add", { user });
};

const posts = async function (req, res, next) {
    const user = await userModel
        .findOne({ username: req.session.passport.user })
        .populate("posts");
    res.render("posts", { user });
};

const feed = async function (req, res, next) {
    const user = await userModel.findOne({
        username: req.session.passport.user,
    });
    const posts = await postModel.find().populate("user");
    res.render("feed", { user, posts });
};

const register = function (req, res, next) {
    res.render("register");
};

const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

const view = async (req, res, next) => {
    const postId = req.query.id;
    const post = await postModel.findById(postId);
    res.render("pin", { post });
};

const viewfeedpin = async (req, res, next) => {
    const postId = req.query.id;
    const post = await postModel.findById(postId);
    res.render("feedPin", { post });
};

const deletePost = async (req, res, next) => {
    const postId = req.query.id;
    const post = await postModel.findByIdAndDelete(postId);
    const url = post.publicId;
    const userPostId = post.user;
    const user = await userModel.findById(userPostId);
    const index = user.posts.indexOf(url);
    user.posts.splice(index, 1);
    cloudinary.uploader.destroy(url, function (error, result) {});
    await user.save();
    res.redirect("feed");
};

const createPost = async function (req, res, next) {
    const user = await userModel.findOne({
        username: req.session.passport.user,
    });

    const image = req.file.filename;
    const filePath = path.join(__dirname, "../public/images/uploads/" + image);
    cloudinary.uploader.upload(filePath, async function (error, result) {
        if (error) {
            console.log("Error:", error);
            res.redirect("/profile");
        } else {
            fs.unlinkSync(filePath);
            const post = await postModel.create({
                user: user._id,
                title: req.body.title,
                descreption: req.body.descreption,
                image: result.url,
                publicId: result.public_id,
            });
            user.posts.push(post._id);
            await user.save();
            await post.save();
            res.redirect("/profile");
        }
    });
};

const fileupload = async function (req, res, next) {
    const user = await userModel.findOne({
        username: req.session.passport.user,
    });
    const image = req.file.filename;
    const filePath = path.join(__dirname, "../public/images/uploads/" + image);
    cloudinary.uploader.upload(filePath, function (error, result) {
        if (error) {
            console.log("Error:", error);
            res.redirect("/profile");
        } else {
            fs.unlinkSync(filePath);
            if (user.publicId !== null) {
                const id = user.publicId;
                cloudinary.uploader.destroy(id, function (error, result) {});
            }
            user.publicId = result.public_id;
            user.profileImage = result.url;
            user.save();
            res.redirect("/profile");
        }
    });
};

const registerPost = function (req, res, next) {
    const user = new userModel({
        username: req.body.username,
        email: req.body.email,
        contact: req.body.phone,
    });
    userModel.register(user, req.body.password, (err, user) => {
        if (err) {
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/profile");
            });
        }
    });
};

module.exports = {
    home,
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
    view,
    deletePost,
    viewfeedpin,
};
