const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var departmentsController = require('../controllers/departments')

    

router.route('/departments')
    .get(departmentsController.getDepartments);

router.route('/departments')
    .post(departmentsController.createDepartment);

module.exports = router
