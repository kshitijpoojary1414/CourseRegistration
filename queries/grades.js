const db = require("../db/db")


const getGrades = (course_id) => {
    return db('grades').where({
        course_id:course_id,
        "is_active": true        
    })
    .select("*")
}

const addGrades = (grade) => {
    const fields = `'${grade.id}', '${grade.course_id}','${grade.user_id}','${grade.grades}','${grade.createdBy}'`
    return db.raw(`
       Insert into grades (id,course_id,user_id,grades,createdBy) values(${fields})
    `)
}

const getGrade = (user_id,course_id) => {
    return db('grades').where({
        course_id:course_id,
        user_id,
        "is_active": true        
    })
    .select("*")
}



module.exports = {
    getGrades,
    addGrades,
    getGrade
}