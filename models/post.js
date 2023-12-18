const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    title: String,
    descreption: String,
    image: String,
    publicId: String,
});

module.exports = mongoose.model("post", postSchema);
