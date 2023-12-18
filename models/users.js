const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    profileImage: String,
    publicId: String,
    contact: {
        type: Number,
        unique: true,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
        },
    ],
});

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
