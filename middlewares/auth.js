const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const { Validations } = require("../utils")
const { findUserById } = require("../controllers/users")

function userAuthorization(permittedRoles = []) {
    return async (req, res, next) => {
        try {
          const token = req.headers.authorization;
          console.log(req.headers,token,process.env.TOKEN_SECRET)

          const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
          const { id : userId } = decodedToken;
          
          let user = await findUserById(userId)
        
          user = user[0]
          console.log("Token",user)
        if (
            Validations.isUndefined(user) || 
            Validations.isEmpty(user)
        ) {
            throw "Invalid user ID"
        }

        if (!Validations.isEmpty(permittedRoles)) {
            if (!permittedRoles.includes(user.role)) {
                throw "Not Authorized"  
            }
        }

        req.user_id = user.id   
        next()
          

        } catch (error) {
            console.log(error)
            return res.status(401).json({
            error: new Error('Invalid request!')
          });
        }
      }
}

module.exports.userAuthentication = userAuthorization