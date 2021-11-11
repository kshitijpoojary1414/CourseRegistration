const bcrypt = require("bcryptjs");
const { email } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const courseQueries = require("../queries/courses")
const courseRegistrationQueries = require("../queries/course-registrations")
const { Validations, Operations } = require("../utils")
const { ROLES } = require("../constants/roles")

async function addCourseRegistration (req, res) {

  try {
    const { body } = req
    const { email } = body
    const { user_id } = req 
    
    const user = await userQueries.findUserById(user_id)

    if (      
        Validations.isEmpty(user) ||
        Validations.isUndefined(user)
    ) {
        return res.status(401).json({
            message : "Unauthorized action"
        })
    }

    const reqBody = {
      id : Operations.guid(),
      course_id: body.course_id,
      user_id: user_id ,
    }

    const course = await courseQueries.getCourseInfo(reqBody.course_id) 

    if  ( 
      Validations.isUndefined(course) || 
      Validations.isEmpty(course)
    ) {
      return res.status(404).json({
        message : "Course Not Found"
      })
    }

    if (course[0].registered == course[0].course_limit) {
      return res.status(414).json({
        message : "Course is full"
      })
    }

    const courseReg = await courseRegistrationQueries.fetchCourseRegInfo(
      reqBody.user_id,
      reqBody.course_id
    )

    console.log(courseReg)

    if (
      !Validations.isEmpty(courseReg)
    ) {
      return res.status(414).json({
        message : "Already registered for this course"
      })
    }

    await courseRegistrationQueries.addCourseRegistration(reqBody)

    await courseQueries.updateCourseInfo(reqBody.course_id, {
      registered : course[0].registered + 1
    })

    res.status(200).json({
      message: "Registered Successfully"
    });

  } catch( error ) {
    console.log(error)
    res.status(500).send("Internal Server Error");
  }

};

module.exports = {
    addCourseRegistration,
};
