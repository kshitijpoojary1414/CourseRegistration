const db = require("../db/db")

const getMajorss = () => {
    return db('majors').where({
        is_active: true        
    }).select("*")
}

const createMajors = (major) => {
    return db('majors')
                .insert(major)
                .returning("*")
}

const getMajors = (major_id) => {
    return db('majors')
                .where({
                    id: major_id
                })
                .select("*")
}
const getMajorsByDepartment = (department_id) => {
    return db('majors')
                .where({
                    department_id
                })
                .select("*")
}

const getMajorById = (major_id) => {
    return db('majors')
                .where({
                    id:major_id
                })
                .select("*")
}



module.exports = {
    getMajorss,
    createMajors,
    getMajors,
    getMajorsByDepartment,
    getMajorById
}