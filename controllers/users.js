const bcrypt = require("bcryptjs");
const { email } = require("is");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const { Validations } = require("../utils")
const { ROLES } = require("../constants/roles")
const courseRegQueries = require("../queries/course-registrations")
const { Operations } = require("../utils/operations")

async function loginUser(req, res) {

  try {
    const { body } = req

    const { email } = body

    if (
      Validations.isEmpty(email) ||
      Validations.isUndefined(email)
    ) {
      res.status(414).json({
        message: "Invalid credentials"
      })
    }

    console.log(body)

    let response = await userQueries.findUserByEmail(email)

    if (
      Validations.isUndefined(response) ||
      Validations.isEmpty(response)
    ) {
      return res.status(400).json({
        message: "Invalid Credentials"
      })
    }

    let validPassword = bcrypt.compareSync(body.password, response[0].password);

    if (!validPassword) {
      res.status(400).send("Email or password is incorrect");
    }
    console.log('response is - ', response);
    response = response[0]
    const tokenBody = { id: response.id, email: response.email, role: response.role }

    console.log(tokenBody)
    const token = jwt.sign(tokenBody, process.env.TOKEN_SECRET)
    res.status(200).send({ data: response.role, token });

  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error");
  }

};

async function registerUser(req, res) {
  try {
    console.log(req.body);
    //const body = req.body
    const { body } = req
    const { email } = body
    const response = await userQueries.findUserByEmail(email)

    if (
      Validations.isDefined(response) &&
      !Validations.isEmpty(response)
    ) {
      return res.status(414).json({
        message: "User Already Exists"
      })
    }

    const password = bcrypt.hashSync(req.body.password, 10)

    userBody = {
      id: Operations.guid(),
      first_name: body.first_name,
      last_name: body.last_name,
      middle_name: body.middle_name,
      email: body.email,
      phone: body.phone,
      password: password,
      street_address: body.street_address,
      city: body.city,
      state: body.state,
      country: body.country,
      zip_code: body.zip_code,
      phone: body.phone,
      role: ROLES.STUDENT,
      avatar: body.avatar
    }

    if (req.body.avatar) {
      // userBody.avatar = `${req.protocol}://${req.get('host')}/${req.file.filename}`
      userBody.avatar = `${req.protocol}://${req.get('host')}/service_default_avatar_182956.png`
    } else {
      userBody.avatar = `${req.protocol}://${req.get('host')}/service_default_avatar_182956.png`
    }

    let data = await userQueries.createUser([userBody])
    data = data[0]

    const tokenBody = { id: data.id, email: data.email, role: data.role }
    const token = jwt.sign(tokenBody, process.env.TOKEN_SECRET)

    const responseBody = {
      address: {
        streetAddress: userBody.street_address,
        city: userBody.city,
        state: userBody.state,
        country: userBody.country,
        zipCode: userBody.zip_code
      },
      courses: [],
      role: userBody.role,
      _id: userBody.role,
      first_name: userBody.first_name,
      middle_name: userBody.middle_name,
      last_name: userBody.last_name,
      email: userBody.email,
      avatar: userBody.avatar
    }

    return res.status(200).json({
      token: token,
      data: responseBody
    }
    )
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

async function editUser(req, res) {
  try {
    console.log(req)
    //const body = req.body
    const { body } = req
    const { id } = req.params
    const response = await userQueries.findUserById(id)

    const { user_id } = req

    if (
      Validations.isUndefined(response) &&
      Validations.isEmpty(response)
    ) {
      return res.status(414).json({
        message: "User does not exist"
      })
    }
    console.log(response, user_id)
    if (user_id != response[0].id) {
      return res.status(401).json({
        "message": "Unauthorized Access"
      })
    }
    // ADD SCHEMA VALIDATION , CANNOT ALLOW NORMAL UPDATE 

    const editRes = await userQueries.editUser(response[0].id, body)

    console.log(editRes)

    return res.status(200).json({
      message: "Updated information successfully"
    })


  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

async function getUserInfo(req, res) {
  try {
    const { body } = req
    console.log("Here")
    const { id: user_id } = req.params
    const params = req.params
    console.log(params)

    const response = await userQueries.findUserById(user_id)

    if (
      Validations.isUndefined(response) ||
      Validations.isEmpty(response)
    ) {
      return res.status(404).json(
        { message: "User Not Found" }
      )
    }

    const courses = await courseRegQueries.getCoursesForUser(user_id)

    return res.status(200).json(
      {
        ...response[0],
        courses
      }
    )
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }

}

async function findUserById(userId) {
  const data = await userQueries.findUserById(userId)

  return data
}

async function getUsersByRole(req, res) {
  try {
    const { role } = req.params

    if (
      Validations.isUndefined(role) ||
      Validations.isEmpty(role)
    ) {
      return res.status(414).json({
        message: "Role is a required parameter"
      })
    }

    const response = await userQueries.getUsersByRole(role)

    return res.status(200).json({
      users: response
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }

}





module.exports = {
  loginUser,
  registerUser,
  getUserInfo,
  findUserById,
  getUsersByRole,
  editUser
};
