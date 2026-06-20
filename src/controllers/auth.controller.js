const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

/**
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
    const { email, name, password } = req.body
    const isExists = await userModel.findOne({ email : email })

    if (isExists) {
        return res.status(400).json({
            status : "failed",
            message : "User already exists"
        })
    }
    const user = await userModel.create({ email, name, password })
    const token = jwt.sign({ userId : user._id }, process.env.JWT_SECRET, { expiresIn : "3d" })
    res.cookie("token", token)
    res.status(201).json({
        user : {
            email : user.email,
            _id : user._id,
            name : user.name
        },
        token : token
    })
}

/**
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
    const { email, password } = req.body
    const user = await userModel.findOne({ email : email }).select("+password")

    if (!user) {
        return res.status(400).json({
            status : "failed",
            message : "Invalid email or password"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(400).json({
            status : "failed",
            message : "Invalid email or password"
        })
    }

    const token = jwt.sign({ userId : user._id }, process.env.JWT_SECRET, { expiresIn : "3d" })
    res.cookie("token", token)
    res.status(200).json({
        user : {
            email : user.email,
            _id : user._id,
            name : user.name
        },
        token : token
    })
}

module.exports = {
    authController: {
        userRegisterController,
        userLoginController
    }
}