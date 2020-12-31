const express = require("express")
const router = express.Router()
const models = require("../models")

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require('jsonwebtoken')
// get all materialByProdNum

router.get("/", async (req, res) => {
let username = req.body.username
let password = req.body.password

let user = await models.findOne({
    where:{
        username:username
    }
})

if (user === null){
    res.send(`user: ${username} does not exist`)
}
bcrypt.compare(password, user.password, (error, response) => {
    if(response){
        req.session.user = user;
        console.log(req.session.user)
        res.send(user)
    } else{
        res.send({message: "Wrong user/password combination"})
    }
})

})

router.post

module.exports = router