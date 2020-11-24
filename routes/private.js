const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req,res) => {
    res.send("Hey! Seems like u are logged in!");
})

router.get("/logout", (req,res) => {
    res.cookie("jwt", "", { expires: new Date(0)});
    res.render("Login/login.ejs");
})

module.exports = router;