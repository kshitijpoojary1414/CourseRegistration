const bcrypt = require("bcryptjs");
const { email, integer } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const courseQueries = require("../queries/courses")
const deptQueries = require("../queries/departments")
const majorQueries = require("../queries/majors")
const { Validations, Operations } = require("../utils")
const { ROLES } = require("../constants/roles")
const Dayjs = require("dayjs");
const { response } = require("express");

async function getMajors (req, res) {

  try {
    const { body } = req
    const { email } = body
    const { user_id } = req 
    //console.log("user_id", user_id)

    let majors = await majorQueries.getMajors()

    res.status(200).send(majors);

  } catch( error ) {
    //console.log(error)
    res.status(500).send("Internal Server Error");
  }
};

async function getMajorsByDepartment (req, res) {

  try {
    const { body } = req
    const { email } = body
    const { user_id } = req 
    //console.log("user_id", req.query)
    const { department_id } = req.query
    let majors = await majorQueries.getMajorsByDepartment(department_id)

    const promises = majors.map( async major => {
      const advisor = await userQueries.findUserById(major.advisor)
      console.log('Advisor', advisor)
      return {
        ...major,
        advisor: advisor[0]
      }
    })

    const response = await Promise.all(promises)

    res.status(200).send(response);

  } catch( error ) {
    //console.log(error)
    res.status(500).send("Internal Server Error");
  }
};

async function createMajor (req, res) {
    try {
      const { body } = req
        
      const major = 	{
        id :Operations.guid(), 
        major_name :  body.major_name,
        major_code : body.major_code,
        maj_min_units : body.maj_min_units,
        maj_units : body.maj_units,
        department_id: body.department_id
      }
      let majors = await majorQueries.createMajors(major)
  
      res.status(200).send(majors );
  
    } catch( error ) {
      //console.log(error)
      return res.status(500).send("Internal Server Error");
    }
  };

  async function getMajorById (req, res) {
    try {
      const { body } = req
      const { id } = req.params

      let major = await majorQueries.getMajorById(id)

      let courses = await courseQueries.getCoursesByMajor(id)
      let students = await userQueries.getUserByMajorAndRole({major_id:id, role: ROLES.STUDENT})
      let teachers = await userQueries.getUserByMajorAndRole({major_id:id, role: ROLES.TEACHER})

      

  
      res.status(200).json({
        ...major[0],
        students: students.rows,
        teachers: teachers.rows,
        courses
      });
  
    } catch( error ) {
      //console.log(error)
      return res.status(500).json("Internal Server Error");
    }
  };


  


module.exports = {
    getMajors,
    createMajor,
    getMajorsByDepartment,
    getMajorById
};
