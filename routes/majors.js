const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var majorsController = require('../controllers/majors')

    

router.route('/majors')
    .get(majorsController.getMajors);

router.route('/majors')
    .post(majorsController.createMajor);

router.route('/majors/department')
    .get(majorsController.getMajorsByDepartment);

router.route('/majors/:id')
    .get(majorsController.getMajorById);

module.exports = router
