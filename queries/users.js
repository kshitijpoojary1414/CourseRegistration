const db = require("../db/db")

const findUserByEmail = (body) => {
    const { email_id } = body

    return db('users').where({
        email_id  
    }).select("*")
}

const createUser = (user) => {
    return db.from('public.users')
              .insert(user)
}

module.exports = {
    findUserByEmail,
    createUser
}