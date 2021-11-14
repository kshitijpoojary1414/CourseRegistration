const db = require("../db/db")


const getGrades = (course_id) => {
    return db('grades').where({
        course_id:course_id,
        "is_active": true        
    })
    .select("*")
}

const addGrades = (grade) => {
    const fields = `'${grade.id}', '${grade.course_id}','${grade.user_id}','${grade.grades}','${grade.comments}','${grade.createdby}'`
    return db.raw(`
       Insert into grades (id,course_id,user_id,grades,comments,createdBy) values(${fields})
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

const getGradeForTeacher = (user_id) => {
    return db('grades').where({
        createdby:user_id        
    })
    .select("*")
}

const updateGrades = (grade) => {
    return db.raw(`
    update grades set grades='${grade.grades}' where user_id ='${grade.user_id}' and course_id ='${grade.course_id}'; 
    `)
}


module.exports = {
    getGrades,
    addGrades,
    getGrade,
    updateGrades,
    getGradeForTeacher
}