const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var grdesController = require('../controllers/grades')

    

router.route('/grades/')
    .get(userAuthentication(),grdesController.getGrades);

router.route('/grades/')
    .post(userAuthentication(),grdesController.addGrades);

module.exports = router
