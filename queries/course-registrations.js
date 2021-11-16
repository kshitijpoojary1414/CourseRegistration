const db = require("../db/db")

const addCourseRegistration = (registration) => {
    return db.from('public.courseregistrations')
              .insert(registration)
}

const fetchCourseRegInfo = (user_id, course_id) => {
    return db.select("*")
            .from('public.courseregistrations')
            .where({
                user_id,
                course_id
            })
}


const fetchCourseRegInfoById = (registration_id) => {
    return db.select("*")
            .from('public.courseregistrations')
            .where({
                id : registration_id
            })
}

const getCoursesForUser = (user_id) => {
    return db('public.courseregistrations').where({
        "courseregistrations.is_active": true,
        'courseregistrations.user_id': user_id     
    })
    .join('courses','courses.id','courseregistrations.course_id')
    .select("*")
}

const findCoursesForTeacher = (teacher_id) => {
    // return db('public.courses').where(teacher_id,'teacher')
    return db.raw(`select * from courses where '${teacher_id}'=ANY(teachers)`)
}

const getCoursesForStudent = (user_id) => {
    return db.select("*")
    .from("courseregistrations")
    .where({
        "courseregistrations.user_id": user_id
    })
    .rightJoin('courses', 'courses.id', 'courseregistrations.course_id')

}

const deleteCourseRegistration = (registration_id) => {
    return db.from('public.courseregistrations')
              .where({
                  id : registration_id
              }).del()
}

const fetchCourseRegInfoByCourse = (course_id) => {
    return db.select("*")
            .from('public.courseregistrations')
            .where({
                course_id
            })
}


module.exports = {
    addCourseRegistration,
    fetchCourseRegInfo,
    getCoursesForUser,
    findCoursesForTeacher,
    getCoursesForStudent,
    deleteCourseRegistration,
    fetchCourseRegInfoByCourse,
    fetchCourseRegInfoById
}