const bcrypt = require("bcryptjs");
const { email } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const { Validations } = require("../utils")

async function postAuthorize(req, res)  {
    try {
        //console.log("Request",req.headers,req.body)
        let token = req.headers.authorization.replace('Bearer ', '')

        let userInfo = jwt.verify(token, process.env.TOKEN_SECRET)
        //console.log(userInfo)
        const data = await userQueries.findUserById(userInfo.id);

        res.status(200).json({
            ...data[0]
        })
    } catch (error) {
        if (error.name == "JsonWebTokenError") {
            return res.status(401).json({
                message: "Unauthorized request"
            })
        }
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

module.exports = {
  postAuthorize,

};
