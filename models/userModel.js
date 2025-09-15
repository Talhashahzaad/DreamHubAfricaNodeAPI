const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        unique: true
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'seller'],
        default: 'seller'
    },

    address: {
        type: String
    },

    about: {
        type: String
    },

    profileImage: {
        type: String
    },

    status: {
        type: Number,
        default: 1,
        enum: [0, 1]
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    verificationToken: {
        type: String
    },

    refreshToken: {
        type: String,
        default: ''
    },

    resetPasswordToken: {
        type: String,
        select: false
    },

    resetPasswordExpires: {
        type: Date,
        select: false
    },


}, { timestamps: true })


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);

    // mark when password changed
    this.passwordChangedAt = new Date();
    next();
});

module.exports = mongoose.model("User", userSchema);