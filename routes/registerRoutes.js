const express = require("express")
const router = express.Router()
//const models = require("../models")

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require('jsonwebtoken')
// get all materialByProdNum

router.post("/", async (req, res) => {
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let email = req.body.email
    let username = req.body.username
    let password = req.body.password

    let user = await models.User.findOne({
        where: {
            username: username
        }
    })
    let userEmail = await models.User.findOne({
        where:{
            email:email
        }
    })

    if (!password) {
        console.log('missing fields')
        res.send("Missing required fields")
    }

    else {
        if (user || userEmail) {
            res.send(`user: ${username} or email is taken!`)
        }

        else {
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(password, salt)
  
            let newUser = await models.User.create({
                first_name: firstname,
                last_name: lastname,
                email: email,
                username: username,
                password: hash
        })

            res.send(newUser)
        }

    }

})

router.post

module.exports = router