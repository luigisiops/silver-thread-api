const express = require("express")
const router = express.Router()
const models = require("../models")

const session = require("express-session")
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const { verify } = require("crypto");

const nodemailer = require("nodemailer");
require('dotenv').config()
const options = {
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
}
const transporter = nodemailer.createTransport(options, null)

const getPasswordResetURL = (user, token) =>
    `http://localhost:3000/password-reset/${user.id}/${token}`

const resetPasswordTemplate = (user, url) => {
    const from = process.env.EMAIL
    const to = user.email
    const subject = "Password Reset"
    const html = `
    <p>Hey ${user.first_name || user.email},</p>
    <p>We heard that you lost your inventory email. Sorry to hear about that!</p>
    <p>But don’t worry! You can use the following link to reset your password:</p>
    <a href=${url}>${url}</a>
    <p>If you don’t use this link within 15 minutes, it will expire.</p>
    <p>Enjoy the application! </p>
    <p>–Your friends from Digital Crafts</p>
    `

    return { from, to, subject, html }
}

// get all materialByProdNum

router.post("/", async (req, res) => {
    const email = req.body.email
    try {
        let user = await models.User.findOne({
            where: {
                email: email
            }
        })
        const passwordHash = user.password
        const id = user.id

        const secret = passwordHash + "-" + "createdAt"
        const token = jwt.sign({ id }, secret, {
            expiresIn: 900 //15 minutes
        })
        const url = getPasswordResetURL(user, token)
        const emailTemplate = resetPasswordTemplate(user, url)
        const sendEmail = () => {
            transporter.sendMail(emailTemplate, (err, info) => {
                if (err) {
                    console.log({ message: err })
                }
                else {
                    console.log('Email has successfully sent', info.response)
                }
            })
        }
        sendEmail()
        res.send({ message: "successfully sent email" })
    }
    catch (err) {
        res.status(404).json("No user with that email exists")
    }


})
router.put("/update-password", async (req, res) => {
    let userId = req.body.userId
    let token = req.body.token
    let newPassword = req.body.password
    try {
        let user = await models.User.findOne({
            where: {
                id: userId
            }
        })
        const salt = bcrypt.genSaltSync(saltRounds)
        const hash = bcrypt.hashSync(newPassword, salt)

      user.password = hash
      let newUser = await user.save()

    res.send(newUser)

    }
    catch (err) {
        console.log("User does not exist")
    }

})

module.exports = router