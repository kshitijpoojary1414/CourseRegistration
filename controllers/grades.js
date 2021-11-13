const bcrypt = require("bcryptjs");
const { email, integer } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const courseQueries = require("../queries/courses")
const deptQueries = require("../queries/departments")
const gradesQueries = require("../queries/grades")
const { Validations, Operations } = require("../utils")
const { ROLES } = require("../constants/roles")
const Dayjs = require("dayjs")
const { response } = require("express");

async function getGrades (req, res) {

  try {
    const { body } = req
    const { user_id } = req 
    const { id: course_id } = req.params
    console.log("user_id", user_id)
    console.log(course_id)

    let grades = await gradesQueries.getGrades(course_id)
    if (
        Validations.isUndefined(grades) ||
        Validations.isEmpty(grades)
    ) {
      return res.status(404).json({
          message: "Course not found"
      })
    }
    res.status(200).send(grades);

  } catch( error ) {
    console.log(error)
    res.status(500).send("Internal Server Error",error);
  }
};

async function addGrades (req, res) {

  try {
    const { body } = req
    // const body = req.body
    const { user_id: creator } = req 
    // const creator = req.user_id
    // const { id: course_id } = req.params



    const { course_id, user_id, grades} = body

    let grade = await gradesQueries.getGrade(user_id,course_id)

    if (!Validations.isEmpty(grade)) {
      return res.status(414).json({
        message: "Grade Already exists"
      })
    }


    const gradeBody = {
      id : Operations.guid(),
      course_id,
      user_id,
      grades,
      createdBy: creator
    }

    await gradesQueries.addGrades(gradeBody)
    return res.status(200).json(gradeBody);

  } catch( error ) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
module.exports = {
    getGrades,
    addGrades
    
};
