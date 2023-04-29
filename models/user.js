const mongoose = require('mongoose');

const userSignUpSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    mob_num: String,
    dob: String,
    password: String,
});

const userModel = mongoose.model("userSignUp", userSignUpSchema);

module.exports = userModel;