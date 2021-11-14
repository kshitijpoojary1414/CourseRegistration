const db = require("../db/db")


const getCoursesByTeacher = (user_id) => {
    return db.raw(`
    select * from courses c where teachers = '{${user_id}}';
    `)
}


module.exports = {
    getCoursesByTeacher
}