const express = require("express")
const router = express.Router()
const models = require("../models")

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require('jsonwebtoken')
// get all materialByProdNum

router.post("/", async (req, res) => {
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let username = req.body.username
    let password = req.body.password

    let user = await models.findOne({
        where: {
            username: username
        }
    })

    if (!password) {
        console.log('missing fields')
        res.send("Missing required fields")
    }

    else {
        if (user) {
            res.send(`user: ${username} is taken!`)
        }

        else {
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(password, salt)
            let temp = { password: hash }
            console.log({ password: hash })

            /*let newUser = await models.User.create({
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: hash
        })*/

            res.send(temp)
        }

    }

})

router.post

module.exports = router