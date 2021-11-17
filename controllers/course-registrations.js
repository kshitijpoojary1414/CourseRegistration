const bcrypt = require("bcryptjs");
const { email } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const courseQueries = require("../queries/courses")
const courseRegistrationQueries = require("../queries/course-registrations")
const { Validations, Operations } = require("../utils")
const { ROLES } = require("../constants/roles")

async function addCourseRegistration (req) {

  try {
    const user_id = req.user_id
    //console.log(req)
    const reqBody = {
      id : Operations.guid(),
      course_id: req.course_id,
      user_id: user_id ,
    }

    const course = await courseQueries.getCourseInfo(reqBody.course_id) 

    if  ( 
      Validations.isUndefined(course) || 
      Validations.isEmpty(course)
    ) {
      throw "Course Not Found"
    }

    if (course[0].registered == course[0].course_limit) {
      throw "Course is Full"
    }

    const courseReg = await courseRegistrationQueries.fetchCourseRegInfo(
      reqBody.user_id,
      reqBody.course_id
    )

    //console.log(courseReg)

    if (
      !Validations.isEmpty(courseReg)
    ) {
      throw "Already Registered for this course"
    }

    await courseRegistrationQueries.addCourseRegistration(reqBody)

    await courseQueries.updateCourseInfo(reqBody.course_id, {
      registered : course[0].registered + 1
    })

    return {
      message: "Registered Successfully"
    };

  } catch( error ) {
    //console.log(error)
    // return res.status(500).send("Internal Server Error");
    return {
      errors: true,
      errorMessage: error
    }
  }

};

async function addMultipleRegistrations (req, res) {

  try {
    const { body } = req
    // const { email } = body
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

    promises = body.course_id.map(
      async course_id => {
        return await addCourseRegistration({user_id, course_id})
    })

    const ans = await Promise.all(promises)

    const hasError = ans.find( a => a.errors)
    console.log(hasError)
    if(Validations.isDefined(hasError)) {
      return res.status(414).json({
        'message' : hasError.errorMessage 
      })
    }

    return res.status(200).json({
      message: 'Successfully registered for courses'
    })

  } catch( error ) {
    //console.log(error)
    return res.status(500).send("Internal Server Error");
  }

};

async function dropCourseRegistrations (req, res) {

  try {
    const { body } = req
    const { email } = body
    const { user_id } = req 
    const { id : registration_id } = req.params
    const user = await userQueries.findUserById(user_id)

    if (      
        Validations.isEmpty(user) ||
        Validations.isUndefined(user)
    ) {
        return res.status(401).json({
            message : "Unauthorized action"
        })
    }

    //console.log("REGISTRATION",registration_id)

    const ans = await courseRegistrationQueries.fetchCourseRegInfoById(registration_id)
    console.log(ans,registration_id)

    const respp = await courseRegistrationQueries.deleteCourseRegistration(registration_id)

    const course = await courseQueries.getCourseInfo(ans[0].course_id) 

    await courseQueries.updateCourseInfo(ans[0].course_id, {
      registered : course[0].registered - 1
    })


    console.log(respp)

    return res.status(200).json({
      message: 'Successfully dropped the course'
    })

  } catch( error ) {
    console.log(error)
    return res.status(500).send("Internal Server Error");
  }

};

module.exports = {
    addCourseRegistration,
    addMultipleRegistrations,
    dropCourseRegistrations
};
