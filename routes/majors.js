const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var majorsController = require('../controllers/majors')

    

router.route('/majors')
    .get(userAuthentication(),majorsController.getMajors);

router.route('/majors')
    .post(userAuthentication(),majorsController.createMajor);

router.route('/majors/department')
    .get(majorsController.getMajorsByDepartment);

module.exports = router
