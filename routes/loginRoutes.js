const express = require("express")
const router = express.Router()
const models = require("../models")

const session = require("express-session")
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const { verify } = require("crypto");
// get all materialByProdNum

router.get("/", async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    let user = await models.findOne({
        where: {
            username: username
        }
    })

    if (user.length > 0) {
        res.send(`user: ${username} does not exist`)
    }
    else {
        bcrypt.compare(password, user.password, (error, response) => {
            if (response) {
                req.session.user = user;
                console.log(req.session.user)

                const id = user.id
                const token = jwt.sign({id}, "jwtSecret", {
                    expiresIn: 300,
                })
                req.session.user = user

                res.json({auth: true, token: token, user: user})
            } else {
                res.send({ message: "Wrong user/password combination" })
            }
        })
    }
})

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if (!token) {
        res.send("no token")
    }
    else { 
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if(err){
                res.json({ auth: false, message: "authentication failed"})
            }
            else{
                req.userId = decoded.id
            }
        })
    }
}

router.get('/isUserAuth', verifyJWT, (req,res) => {
    res.send("You are authenticated")
})

router.post

module.exports = router