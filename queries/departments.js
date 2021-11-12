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

module.exports = {
    getDepartments,
    createDepartment
}