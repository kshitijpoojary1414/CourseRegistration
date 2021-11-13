const bcrypt = require("bcryptjs");
const { email, integer } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const courseQueries = require("../queries/courses")
const { Validations, Operations } = require("../utils")
const { ROLES } = require("../constants/roles")

async function getCourses(req, res) {

  try {
    const { body } = req
    const { email } = body
    const { user_id } = req
    console.log("user_id", user_id)

    let courses = await courseQueries.getCourses()
    console.log(courses)
    courses = courses.map(
      async course => {
        console.log(course)
        const {
          start_date, days, start_time, end_time, end_date, ...courses2
        } = course

        const { registered, course_limit, ...courses3 } = courses2
        const students = await courseQueries.getRegisteredStudents(course.id)
        console.log("Students", students, user_id)
        return {
          schedule: {
            startTime: start_time,
            endTime: end_time,
            days: days,
            startDate: start_date,
            endDate: end_date
          },
          registration: {
            limit: course_limit,
            registered
          },
          hasRegistered: students.find(student => student.id === (user_id)) ? true : false,
          ...courses3
        }
      }
    )

    courses = await Promise.all(courses)

    res.status(200).send(courses);

  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error");
  }

};

async function getCoursesTeacher(req, res) {

  try {
    const { body } = req
    const { email } = body
    const { user_id } = req
    console.log("courses- teacher - user_id", user_id)

    let courses = await courseQueries.getCourses()
    console.log(courses)
    courses = courses.map(
      async course => {
        console.log(course)
        const {
          start_date, days, start_time, end_time, end_date, ...courses2
        } = course

        const { registered, course_limit, ...courses3 } = courses2
        const students = await courseQueries.getRegisteredStudents(course.id)
        console.log("Students", students, user_id)
        return {
          schedule: {
            startTime: start_time,
            endTime: end_time,
            days: days,
            startDate: start_date,
            endDate: end_date
          },
          registration: {
            limit: course_limit,
            registered
          },
          hasRegistered: students.find(student => student.id === (user_id)) ? true : false,
          ...courses3
        }
      }
    )

    courses = await Promise.all(courses)
    console.log('Sending courses - ', courses);
    res.status(200).send(courses);

  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error");
  }

};


async function addCourse(req, res) {
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
        message: "Unauthorized action"
      })
    }

    const course = {
      id: Operations.guid(),
      name: body.name,
      subject: body.subject,
      description: body.description,
      start_time: body.start_time,
      end_time: body.end_time,
      start_date: body.start_date,
      end_date: body.end_date,
      teachers: body.teachers,
      days: body.days
    }

    await courseQueries.addCourse(course)

    res.status(200).json({
      message: "Course added successfully"
    });

  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error");
  }

};

async function getCourseInfo(req, res) {

  try {
    const { body } = req
    const { email } = body
    const { user_id } = req
    const { id: course_id } = req.params

    let user = await userQueries.findUserById(user_id)

    if (
      Validations.isEmpty(user) ||
      Validations.isUndefined(user)
    ) {
      return res.status(401).json({
        message: "Unauthorized action"
      })
    }

    user = user[0]
    console.log(course_id)
    let courses = await courseQueries.getCourseInfo(course_id)

    if (
      Validations.isUndefined(courses) ||
      Validations.isEmpty(courses)
    ) {
      return res.status(404).json({
        message: "Course not found"
      })
    }

    const teachers = []

    for (i = 0; i < courses[0].teachers.length; i++) {
      let teacher = await userQueries.findUserById(courses[0].teachers[i])
      teacher = teacher[0]
      teachers.push(teacher)
    }

    const students = await courseQueries.getRegisteredStudents(course_id)

    console.log(courses)
    courses[0].students = students
    courses[0].teachers = teachers

    const {
      start_date, days, start_time, end_time, end_date, ...courses2
    } = courses[0]

    const { registered, course_limit, ...courses3 } = courses2

    courses = [courses3]

    courses[0].schedule = {
      startTime: start_time,
      endTime: end_time,
      days: days,
      startDate: start_date,
      endDate: end_date
    },
      courses[0].registration = {
        limit: course_limit,
        registered
      }

    if (user.role === ROLES.STUDENT) {
      courses[0].hasRegistered = students.find(student => student.id === (user_id)) ? true : false
    }

    console.log(courses)

    res.status(200).json(courses[0]);

  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error");
  }

};

// [
//     {
//       "schedule": {
//         "days": [
//           "Monday"
//         ],
//         "startDate": "04/02/2021",
//         "endDate": "04/05/2021",
//         "startTime": "08:30",
//         "endTime": "10:30"
//       },
//       "registration": {
//         "limit": 10,
//         "registered": 0
//       },
//       "teachers": [],
//       "students": [],
//       "_id": "61897cde1459159b08356208",
//       "name": "CS660",
//       "subject": "Analysis and Design of Algoriths",
//       "description": "",
//       "price": 100
//     }
//   ]



module.exports = {
  getCourses,
  addCourse,
  getCourseInfo,
  getCoursesTeacher
};
