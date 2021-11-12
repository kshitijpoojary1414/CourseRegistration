const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var departmentsController = require('../controllers/departments')

    

router.route('/departments')
    .get(userAuthentication(),departmentsController.getDepartments);

router.route('/departments')
    .post(userAuthentication(),departmentsController.createDepartment);

module.exports = router
