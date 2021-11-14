const bcrypt = require("bcryptjs");
const { email, integer } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const courseQueries = require("../queries/courses")
const courseRegistrationQueries = require("../queries/course-registrations")
const teachersQueries = require("../queries/teachers")
const { Validations, Operations } = require("../utils")
const { ROLES } = require("../constants/roles")
const Dayjs = require("dayjs")
const { response } = require("express");

async function getCoursesByTeacher (req, res) {

  try {
    
    const { teacher_id } = req.query

    let coursesInfo = await teachersQueries.getCoursesByTeacher(teacher_id)
    
    if (
      Validations.isUndefined(coursesInfo) ||
      Validations.isEmpty(coursesInfo)
    ) {
      return res.status(404).json({
        message: "Course not found"
      })
    }

    res.status(200).send(coursesInfo);

  } catch( error ) {
    console.log(error)
    res.status(500).send("Internal Server Error",error);
  }
};

async function getTeachersByMajors (req, res) {

    try {
      
      const { major_id } = req.query


      const Info = {
        major_id,
        role: "teacher"
      }

      console.log(Info)
      let teacherInfo = await userQueries.getUserByMajorAndRole(Info)
      
      if (
        Validations.isUndefined(teacherInfo.rows) ||
        Validations.isEmpty(teacherInfo.rows)
      ) {
        return res.status(404).json({
          message: "Course not found"
        })
      }
  
      res.status(200).send(teacherInfo.rows);
  
    } catch( error ) {
      console.log(error)
      res.status(500).send("Internal Server Error");
    }
  };

  async function getStudentByMajors (req, res) {

    try {
      
      const { major_id } = req.query


      const Info = {
        major_id,
        role: "student"
      }

      console.log(Info)
      let teacherInfo = await userQueries.getUserByMajorAndRole(Info)
      
      if (
        Validations.isUndefined(teacherInfo.rows) ||
        Validations.isEmpty(teacherInfo.rows)
      ) {
        return res.status(404).json({
          message: "Course not found"
        })
      }
  
      res.status(200).send(teacherInfo.rows);
  
    } catch( error ) {
      console.log(error)
      res.status(500).send("Internal Server Error");
    }
  };

module.exports = {
    getCoursesByTeacher,
    getTeachersByMajors,
    getStudentByMajors
};
