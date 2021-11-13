const express = require('express')
const router = express.Router()
const { ROLES } = require("../constants/roles")
const { userAuthentication} = require("../middlewares/auth")
var coursesController = require('../controllers/courses')

    

router.route('/courses')
    .get(userAuthentication(),coursesController.getCourses);

router.route('/courses')
    .post(userAuthentication(),coursesController.addCourse);

router.route('/courses/:id')
    .get(userAuthentication(),coursesController.getCourseInfo);


    


module.exports = router
