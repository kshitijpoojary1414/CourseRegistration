const bcrypt = require("bcryptjs");
const { email, integer } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const courseQueries = require("../queries/courses")
const courseRegistrationQueries = require("../queries/course-registrations")
const deptQueries = require("../queries/departments")
const gradesQueries = require("../queries/grades")
const { Validations, Operations } = require("../utils")
const { ROLES } = require("../constants/roles")
const Dayjs = require("dayjs")
const { response } = require("express");
const { use } = require("../routes/courses");

async function getGrades (req, res) {

  try {
    const { body } = req
    // const { user_id } = req 
    const { course_id } = req.query

    let courseRegistrationInfo = await courseRegistrationQueries.fetchCourseRegInfoByCourse(course_id)
    
    if (
      Validations.isUndefined(courseRegistrationInfo) ||
      Validations.isEmpty(courseRegistrationInfo)
    ) {
      return res.status(200).send([])
    }

    for(i = 0; i< courseRegistrationInfo.length; i++){
      const { user_id } = courseRegistrationInfo[i]
      let userInfo = await userQueries.findUserById(user_id)
      const{first_name,middle_name, last_name} = userInfo[0]  
      courseRegistrationInfo[i].first_name = first_name
      courseRegistrationInfo[i].middle_name = middle_name
      courseRegistrationInfo[i].last_name = last_name

      let gradesInfo = await gradesQueries.getGrade(user_id,course_id)

      
      if(Validations.isEmpty(gradesInfo)){
        courseRegistrationInfo[i].grades = "-"
        courseRegistrationInfo[i].comments = "-"
      }else{
        const{grades, comments } = gradesInfo[0]
      courseRegistrationInfo[i].grades = grades
      courseRegistrationInfo[i].comments = comments
      }
  }
    if (
        Validations.isUndefined(courseRegistrationInfo) ||
        Validations.isEmpty(courseRegistrationInfo)
    ) {
      return res.status(200).send([])
    }
    res.status(200).send(courseRegistrationInfo);

  } catch( error ) {
    //console.log(error)
    res.status(500).send("Internal Server Error",error);
  }
};


async function addGrades (req, res) {
  try {
    const { body } = req
    // const body = req.body
    const user_id = req.user_id 
    //console.log(req)

    const { course_id, student_id, grades, comments} = body

    const gradeBody = {
      id : Operations.guid(),
      course_id,
      student_id,
      grades,
      comments,
      user_id
    }
    const response = await userQueries.findUserById(user_id)
    if (
      Validations.isUndefined(response) ||
      Validations.isEmpty(response)
    ) {
      return res.status(200).send([])
    }

    if (response[0].role !== ROLES.TEACHER) {
      return res.status(200).json(
        { message: "User is not authorized to Grade this course" }
      )
    }

    try {
      let grade = await gradesQueries.getGrade(student_id,course_id)
      
      if (!Validations.isEmpty(grade)) {
        //console.log("Update Query")
        await gradesQueries.updateGrades(gradeBody)
        gradeBody.message = "Grades updated for user"
        return res.status(200).json(gradeBody);
      }
    }
    catch(err) {
    }


    try {
        if(!grade.createdBy == creator){
        return res.status(200).json({
          message : "This Teacher is not authorized to grade this course",
          flag : "Rejected"
        })
      }
    } catch (error) { 
    }

    await gradesQueries.addGrades(gradeBody)
    return res.status(200).json(gradeBody);

  } catch( error ) {
    //console.log(error)
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = {
    getGrades,
    addGrades
};
