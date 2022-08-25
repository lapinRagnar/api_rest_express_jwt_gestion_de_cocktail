/** les imports */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

/** routages de la ressource auths */
exports.login = async (req, res) => {

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "mot de passe ou email incorrecte!"})
  }


  try {

    // verifier si l'utilisateur existe
    let user = await User.findOne({ where: {email: email}, raw: true })   
    if (user === null) {
      return res.status(401).json({ message: "ce compte n'existe pas!"})
    }
    
    // verifier si c'est le bon mot de passe
    let test = await bcrypt.compare(password, user.password)
    if (!test) {
      return res.status(401).json({ message: "mauvais mot de passe!"})
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

    if (err.name == 'SequelizeDatabaseError') {
      res.status(500).json({ message: 'erreur de la base de donnée', error: err})
    }
    res.status(500).json({message: "la connexion a échoué, ouuuups!", error: err})


  }


  // User.findOne({ where: {email: email}, raw: true })
  //   .then(user => {

  //     // verifier si l'utilisateur existe
  //     if (user === null) {
  //       return res.status(401).json({ message: "ce compte n'existe pas!"})
  //     }

  //     // verifier si c'est le bon mot de passe
  //     bcrypt.compare(password, user.password)
  //       .then(test => {

  //         if (!test) {
  //           return res.status(401).json({ message: "mauvais mot de passe!"})
  //         }

  //         // generation du token
  //         const token = jwt.sign({
  //           id: user.id,
  //           nom: user.nom,
  //           prenom: user.prenom,
  //           email: user.email
  //         }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING})

  //         return res.json({access_token: token})

  //       })
  //       .catch(err => res.status(500).json({message: "la connexion a échoué, ouuuups!", error: err}))

  // })
  //   .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

}

