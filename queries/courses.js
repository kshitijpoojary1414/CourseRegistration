const db = require("../db/db")

const getCourses = () => {
    return db('courses').where({
        "courses.is_active": true        
    }).select("*")
}

const getCoursesByMajor = (major_id) => {
    return db('courses').where({
        "courses.is_active": true,
        major_id       
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

const getCoursesListByMajor = (major_id) => {
    return db.raw(`
    select u.first_name, u.last_name, c.name, c.subject, c.registered,
    c.course_limit, c.days, c.start_time, c.end_time
    from users u, courses c where u.role = 'teacher'
    and u.id = c.teachers[1]
    and c.major_id = '${major_id}';
    `)
}

const findCoursesForTeacher = (teacher_id) => {
    // return db('public.courses').where(teacher_id,'teacher')
    return db.raw(`select * from courses where '${teacher_id}'=ANY(teachers)`)
}

module.exports = {
    getCourses,
    addCourse,
    getCourseInfo,
    getRegisteredStudents,
    updateCourseInfo,
    getCoursesByMajor,
    getCoursesListByMajor,
    findCoursesForTeacher
}