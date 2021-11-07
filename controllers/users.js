const bcrypt = require("bcryptjs");
const { email } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const { Validations } = require("../utils")

async function loginUser (req, res) {

  try {
    const { body } = req

    const { email_id } = body
    
    if (
      Validations.isEmpty(email_id) ||
      Validations.isUndefined(email_id)
    ) {
      res.status(414).json({
        message : "Invalid credentials"
      })
    }

    let response = await userQueries.findUserByEmail(email_id)

    if(
      Validations.isUndefined(response) || 
      Validations.isEmpty(response)
    ) {
      return res.status(400).send("Invalid Credentials")
    }

    let validPassword = bcrypt.compareSync(body.password, response[0].password);

    if (!validPassword) {
      res.status(400).send("Email or password is incorrect");
    }

    response = response[0]
    const tokenBody = { id: response.id, email_id: response.email_id, role: response.role }

    console.log(tokenBody)
    const token = jwt.sign(tokenBody, process.env.TOKEN_SECRET)
    res.status(200).send({ data: response, token });

  } catch( error ) {
    console.log(error)
    res.status(500).send("Internal Server Error");
  }

};

async function registerUser (req, res)  {
  try {
    const { body } = req 
    const { email_id } = body
    const response = await userQueries.findUserByEmail(email_id) 

    if (
      Validations.isDefined(response) &&
      !Validations.isEmpty(response)
    ) {
      return res.status(414).send("User Already Exists")
    }


    const password = bcrypt.hashSync(req.body.password, 10)

    userBody = {
      first_name : body.first_name,
      last_name : body.last_name,
      middle_name : body.middle_name,
      email_id: body.email_id,
      phone: body.phone,
      password: password
    }

    if (req.body.avatar) {
      userBody.avatar = `${req.protocol}://${req.get('host')}/${req.file.filename}`
    } else {
      userBody.avatar = `${req.protocol}://${req.get('host')}/service_default_avatar_182956.png`
    }

    const data = await userQueries.createUser([userBody])
    const tokenBody = { id: data.id, email: data.email, role: data.role }

    const token = jwt.sign(tokenBody, process.env.TOKEN_SECRET)

    return res.status(200).json(
      {
        token : token,
        userInfo : userBody
      }
    )
  } catch ( error ) {
      console.log(error)
      res.status(500).send("Internal Server Error")
  }
}

async function getUserInfo (req, res)  {
  try {
    const { body } = req 
    
    const { user_id } = req

    const response = await userQueries.findUserById(user_id) 

    if (
      Validations.isUndefined(response) ||
      Validations.isEmpty(response)
    ) {
      return res.status(404).json(
        JSON.stringify({message: "User Not Found"})
      )
    }

    return res.status(200).json(
      {...response[0]}
    )
  } catch ( error ) {
      console.log(error)
      res.status(500).send("Internal Server Error")
  }

}

async function findUserById(userId) {
  const data = await userQueries.findUserById(userId)
  
  return data
}



module.exports = {
  loginUser,
  registerUser,
  getUserInfo,
  findUserById
};
