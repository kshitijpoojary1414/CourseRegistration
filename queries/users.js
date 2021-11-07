const db = require("../db/db")

const findUserByEmail = (email_id) => {

    return db('users').where({
        email_id  
    }).select("*")
}

const findUserById = (user_id) => {

    return db('users').where({
        id : user_id  
    }).select("*")
}

const createUser = (user) => {
    return db.from('public.users')
              .insert(user)
}

module.exports = {
    findUserByEmail,
    createUser,
    findUserById
}