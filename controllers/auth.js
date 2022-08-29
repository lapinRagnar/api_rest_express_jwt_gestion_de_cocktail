/** les imports */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { AuthenticationError } = require('../error/customError')

/** routages de la ressource auths */
exports.login = async (req, res, next) => {


  try {

    const { email, password } = req.body

    if (!email || !password) {
      throw new AuthenticationError('bad email or password', 0)
    }

    // verifier si l'utilisateur existe
    let user = await User.findOne({ where: {email: email}, raw: true })   
    if (user === null) {
      throw new AuthenticationError('ouuuuups, ce compte n\existe pas!', 1)
    }
    
    // verifier si c'est le bon mot de passe
    let test = await bcrypt.compare(password, user.password)
    if (!test) {
      // return res.status(401).json({ message: "mauvais mot de passe!"})
      throw new AuthenticationError('wrong password', 2)
    }

    // generation du token et envoi
    const token = jwt.sign({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING})

    return res.json({access_token: token})




  } catch(err) {

    next(err)

    // if (err.name == 'SequelizeDatabaseError') {
    //   res.status(500).json({ message: 'erreur de la base de donnée', error: err})
    // }
    // res.status(500).json({message: "la connexion a échoué, ouuuups!", error: err})

  }

}

