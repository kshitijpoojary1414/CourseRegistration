const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var userRoutes = require('../controllers/users')

    

router.route('/users/register')
    .post(userRoutes.registerUser);

router.route('/users/login')
    .post(userRoutes.loginUser);

router.route('/users/info')
    .get(userAuthentication() ,userRoutes.getUserInfo)

module.exports = router
