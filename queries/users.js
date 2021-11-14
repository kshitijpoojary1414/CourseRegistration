const db = require("../db/db")

const findUserByEmail = (email) => {
    return db('users').where({
        email        
    }).select("*")
}

const findUserById = (user_id) => {
    return db('users').where({
        id : user_id  
    }).select("*")
}

const getUsersByRole = (role = "") => {
    return db('users').where({
        role 
    }).select("*")
}

const createUser = (user) => {
    return db('public.users')
              .insert(user)
              .returning('*')
}

const editUser = (id, updateBody) => {
    return db('users').where({
        id 
    }).update({
        ...updateBody
    })
}


module.exports = {
    findUserByEmail,
    createUser,
    findUserById,
    getUsersByRole,
    editUser
}