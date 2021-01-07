const express = require("express")
const router = express.Router()
//const models = require("../models")

const session = require("express-session")
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const { verify } = require("crypto");
// get all materialByProdNum

router.post("/", async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    let user = await models.User.findOne({
        where: {
            username: username
        }
    })
    if (user) {
        bcrypt.compare(password, user.dataValues.password, (error, response) => {
            if (response) {
                req.session.user = user;
                const id = user.id
                const token = jwt.sign({id}, "jwtSecret", {
                    expiresIn: 300,
                })
                req.session.user = user

                res.json({auth: true, token: token, user: user})
            } else {
                res.send({ auth: false, message: "Wrong user/password combination!" })
            }
    })
}
        else {
            res.send({ auth: false, message: "User does not exist!" })
        }
    })

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if (!token) {
        res.send("no token")
    }
    else { 
        jwt.verify(token, "jwtSecret", async (err, decoded) => {
            if(err){    
                res.json({ auth: false})
            }
            else{
                req.userId = decoded.id
                req.token = token
                req.user = await models.User.findOne({
                    where: {
                        id: req.userId
                    }
                })
                next()
            }
        })
    }
}

router.get('/isUserAuth', verifyJWT, (req,res) => {
    let user = req.user
    let token = req.token
    res.send({auth: true, token: token, user: user})
})

router.post

module.exports = router