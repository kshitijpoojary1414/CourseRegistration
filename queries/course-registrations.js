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

const getCoursesForUser = (user_id) => {
    return db('public.courseregistrations').where({
        "courseregistrations.is_active": true,
        'courseregistrations.user_id': user_id     
    })
    .join('courses','courses.id','courseregistrations.course_id')
    .select("*")
}


module.exports = {
    addCourseRegistration,
    fetchCourseRegInfo,
    getCoursesForUser
}