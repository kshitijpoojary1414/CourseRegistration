const db = require("../db/db")

const getDepartments = () => {
    return db('departments').where({
        is_active: true        
    }).select("*")
}

const createDepartment = (department) => {
    return db('departments')
                .insert(department)
                .returning("*")
}

const getDepartment = (department_id) => {
    return db('departments')
                .where({
                    id: department_id
                })
                .select("*")
}

module.exports = {
    getDepartments,
    createDepartment,
    getDepartment
}