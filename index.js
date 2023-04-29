const express = require('express');
const mongoose = require('mongoose');
const userModel = require("./models/user");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 1000;

// BodyParser
app.use(express.json());

const mongoDbUri = "mongodb+srv://Arsalan:oWHZuDKYZ9vh54RR@cluster0.qn5yksf.mongodb.net/LearnMongoDB";

mongoose.connect(mongoDbUri)
    .then((res) => console.log("DB Connect Successfully"))
    .catch((err) => console.log("Db Error", err));

// Signup
app.post("/api/signupuser", (req, res) => {
    console.log(req.body);

    // Destructuring
    const { firstName, lastName, email, mobNum, dob, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !mobNum || !dob) {
        res.json({
            message: "Required fields are missing.",
            status: false
        })
        return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    // console.log("hash wala password " + hashedPassword);
    // console.log("password" + password);

    // Object which has to be send to DB
    const ObjToSend = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
        dob: dob,
        mob_num: mobNum
    };

    userModel.findOne({ email: email })
        .then((user) => {
            // console.log("user", user)
            if (user) {
                res.json({
                    message: "Email Address already exists.",
                    status: false
                })
            } else {
                // Data send to DB
                userModel.create(ObjToSend)
                    .then(data => res.json({
                        message: "User Successfully Signed Up",
                        data,
                        status: true
                    }))
                    .catch(err => res.json({
                        message: "Internal server error: " + err,
                        status: false
                    }))
            }
        }).catch((err) => {
            res.json({
                message: "Internal server error: " + err,
                status: false
            })
        })
})

// Login
app.post("/api/login", (req, res) => {
    // console.log("body ", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({
            message: "Required fields are missing",
            status: false
        })
        return;
    }
    userModel.findOne({ email: email })
        .then((data) => {
            if (!data) {
                res.json({
                    message: "Credential Error.",
                    status: false
                })
            } else {
                // console.log("User ", data);
                const comparePassword = bcrypt.compareSync(password, data.password);
                // console.log("compare pass ", comparePassword);
                if (comparePassword) {
                    res.json({
                        message: "User successfully loged in.",
                        data,
                        status: true
                    })
                } else {
                    res.json({
                        message: "Credential Error.",
                        status: false
                    })
                }

            }
        }).catch((err) => {
            res.json({
                message: `Internal Error: ${err}.`
            })
        })
})

app.listen(PORT, () => console.log("Server listening on port " + PORT));