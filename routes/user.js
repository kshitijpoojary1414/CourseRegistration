const express = require('express')
const router = express.Router()

var userRoutes = require('../controllers/users')

router.route('/users/register')
    .post(userRoutes.registerUser);

router.route('/users/login')
    .post(userRoutes.loginUser
);

module.exports = router
