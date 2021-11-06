const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/users")
const { Validations } = require("../utils")

async function loginUser (req, res) {

  try {
    const { body } = req

    const response = await userQueries.findUserByEmail(body)

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

    const token = jwt.sign(
      { _id: response._id, email: response.email, role: response.role },
      process.env.TOKEN_SECRET
    );

    res.status(200).send({ data: response.role, token });

  } catch( error ) {
    res.status(500).send("Internal Server Error");
  }

};

async function registerUser (req, res)  {
  try {
    const { body } = req 

    const response = await userQueries.findUserByEmail(req.body) 

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

    const token = jwt.sign({ id: data.id, email: data.email, role: data.role }, process.env.TOKEN_SECRET)

    return res.status(200).json(
      JSON.stringify({ data, token })
    )
  } catch ( error ) {
      console.log(error)
      res.status(500).send("Internal Server Error")
  }

}



module.exports = {
  loginUser,
  registerUser
};
