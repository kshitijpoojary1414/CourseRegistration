const db = require("../db/db")

const getCourses = () => {
    return db('courses').where({
        "courses.is_active": true        
    }).select("*")
}

const getCoursesByDepartment = (department_id) => {
    return db('courses').where({
        "courses.is_active": true,
        department_id       
    }).select("*")
}

const getCourseInfo = (course_id) => {
    return db('courses').where({
        'id':course_id,
        "is_active": true        
    })
    .select("*")
}

const getRegisteredStudents = (course_id) => {
    return db.select(["users.*", "courseregistrations.id as reg_id"])
    .from("courseregistrations")
    .where({
        "courseregistrations.course_id": course_id
    })
    .join('users', 'users.id', 'courseregistrations.user_id')
    // .select('users.* , courseregistrations.id as')
}


const addCourse = (course) => {
    return db.from('public.courses')
              .insert(course)
              .returning("*")
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
    getCoursesByDepartment
}