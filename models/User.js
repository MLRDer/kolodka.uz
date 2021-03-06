const mongoose = require("mongoose");
const { Schema } = mongoose;

const _ = require("lodash");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: "customer",
        enum: ["customer", "admin"],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    liked: [
        {
            type: Schema.Types.ObjectId,
            ref: "Products",
        },
    ],
    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: "Products",
        },
    ],
    comparison: [
        {
            type: Schema.Types.ObjectId,
            ref: "Products",
        },
    ],
});

userSchema.index({ phone: "text" });

const jwtPrivateKey = process.env.jwtPrivateKey;
userSchema.methods.genToken = function () {
    const token = jwt.sign(
        _.pick(this, ["_id", "fullname", "phone", "role"]),
        jwtPrivateKey
    );
    return token;
};

userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model("Users", userSchema);
