const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const verify = require("./verifyToken");

router.get("/", (req,res) => {
    res.render("Login/login.ejs");
})

router.post("/", async (req,res) => {
    const userEmail = req.body.email;
    const userPass = req.body.password;
    let error;

    try {
        error = {};
        const emailExists = await User.findOne({email: userEmail});
        if(!emailExists) {
            error.text = "User does not exist!";
            console.log("User does not exist!");
            res.render("Auth/error.ejs",{error: error});
        }
        else {
            const validatePass = await bcrypt.compare(userPass, emailExists.password);
            if(!validatePass) {
                error.text = "Password incorrect!";
                res.render("Auth/error.ejs",{error: error});
            } 
            const token = jwt.sign({ email: userEmail }, process.env.SECRET_TOKEN);
            //res.cookie('jwt-token', token);
            res.cookie('jwt', token, {httpOnly: true, maxAge: 60*60*60});
            res.json({
                token: token,
            });
        }
    }    
    catch(err) {
        console.log(err);
    }
})

router.get("/priv", verify, (req,res) => {
    res.render("Login/dummy.ejs");
})

module.exports = router;