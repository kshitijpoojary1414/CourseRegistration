const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var userController = require('../controllers/users')

    

router.route('/users/register')
    .post(userController.registerUser);

router.route('/users/login')
    .post(userController.loginUser);

router.route('/users/:id')
    .get(userAuthentication() ,userController.getUserInfo)

router.route('/users/roles/:role')
    .get(userAuthentication(),userController.getUsersByRole)

router.route('/users/:id')
    .patch(userAuthentication(),userController.editUser)


module.exports = router
