const db = require("../db/db")

const getCourses = () => {
    return db('courses').where({
        is_active: true        
    }).select("*")
}

const getCourseInfo = (course_id) => {
    return db('courses').where({
        id:course_id,
        "is_active": true        
    })
    .select("*")
}

const getRegisteredStudents = (course_id) => {
    console.log(course_id)
    return db.select("*")
    .from("courseregistrations")
    .rightJoin('users', 'users.id', 'courseregistrations.user_id')
    .where({
        course_id
    }).select('*')
}

const addCourse = (course) => {
    return db.from('public.courses')
              .insert(course)
}

const updateCourseInfo = (course_id, updateBody) => {
    return db('public.courses')
            .where({
                id: course_id
            })
            .update({
                ...updateBody
            })
}

module.exports = {
    getCourses,
    addCourse,
    getCourseInfo,
    getRegisteredStudents,
    updateCourseInfo,
}