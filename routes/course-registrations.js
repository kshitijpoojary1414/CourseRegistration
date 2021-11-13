const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var courseRegistrationController = require('../controllers/course-registrations')


router.route('/course-registrations')
    .post(userAuthentication(),courseRegistrationController.addMultipleRegistrations);


router.route('/course-registrations/:id')
    .delete(userAuthentication(),courseRegistrationController.dropCourseRegistrations);

module.exports = router
