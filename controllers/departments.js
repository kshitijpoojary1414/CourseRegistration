const bcrypt = require("bcryptjs");
const { email, integer } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const courseQueries = require("../queries/courses")
const deptQueries = require("../queries/departments")
const { Validations, Operations } = require("../utils")
const { ROLES } = require("../constants/roles")
const Dayjs = require("dayjs");
const { response } = require("express");

async function getDepartments (req, res) {

  try {
    const { body } = req
    const { email } = body
    const { user_id } = req 
    //console.log("user_id", user_id)

    let departments = await deptQueries.getDepartments()

    res.status(200).send(departments);

  } catch( error ) {
    //console.log(error)
    res.status(500).send("Internal Server Error");
  }
};

async function createDepartment (req, res) {
    try {
      const { body } = req
      const { user_id } = req 
        
      const department = {
          id : Operations.guid(),
          name : body.name,
          code : body.code,
          created_by : user_id
      }

      let departments = await deptQueries.createDepartment(department)
  
      res.status(200).send(departments );
  
    } catch( error ) {
      //console.log(error)
      return res.status(500).send("Internal Server Error");
    }
  };


  


module.exports = {
    getDepartments,
    createDepartment
};
