const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var authController = require('../controllers/auth')

    

router.route('/auth')
    .post(authController.postAuthorize);


module.exports = router
