const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var teachersController = require('../controllers/teachers')

    

router.route('/teacher/')
    .get(userAuthentication(),teachersController.getCoursesByTeacher);

router.route('/teacherByMajor/')
    .get(userAuthentication(),teachersController.getTeachersByMajors);

router.route('/studentByMajor/')
    .get(userAuthentication(),teachersController.getStudentByMajors);

module.exports = router


