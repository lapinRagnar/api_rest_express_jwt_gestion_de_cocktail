// les imports

const User = require('../models/user')
const bcrypt = require('bcrypt')


/** routages de la ressource User */

// tous les utilisateur
exports.getAllUsers = (req, res) => {

  User.findAll()
    .then(users => res.json({data: users}))
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err})) 

}


// utilisateur par id
exports.getUser = (req, res) => {

  let userId = parseInt(req.params.id)

  if (!userId) {
    return res.status(400).json({ message: 'ID non trouvé' })
  }

  User.findOne({ where: {id: userId}, raw: true })
    .then(user => {
      if ((user === null)) {
        return res.status(404).json({ message: 'User not found' })
      }

      return res.json({data: user})
    })
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

}


// ajouter un utilisateur

exports.addUser = (req, res) => {

  const { nom, prenom, pseudo, email, password } = req.body

  if ( !nom || !prenom || !pseudo || !email || !password) {
    return res.status(400).json({ message: "donnée manquantes!, remplit bien tous les champs requis stp!" })
  }

  User.findOne({ where: { email: email }, raw: true})
    .then(user => {
      if (user !== null) {
        return res.status(409).json({ message: ` l'user ${nom} existe, choisit un autre... `})
      }

      bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
        .then(hash => {

          req.body.password = hash

          User.create(req.body)
            .then(user => res.json({ message: "l'utilisateur a été bien crée!", data: user}) )
            .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

        })
        .catch(err => res.status(500).json({ message: 'hash process error', error: err}))

    })
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))


}


// modifier un utilisateur

exports.updateUser = (req, res) => {

  let userId = parseInt(req.params.id)

  if (!userId) {
    return res.status(400).json({ message: 'ouuups, parametre manquantes...' })
  }

  User.findOne({ where: {id: userId}, raw: true })
    .then(user => {

      if (user === null) {
        return res.status(400).json({ message: 'ouuups, cette utilisateur n\'existe pas...' })
      }

      User.update(req.body, { where: { id: userId }})
        .then(user => res.json({ message: "l'utilisateur a été bien mises à jour!", data: user}))
        .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

    })
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))


}


// restaurer un utilisateur

exports.untrashUser = (req, res) => {


  let userId = parseInt(req.params.id)

  if (!userId) {
    return res.status(400).json({ message: 'ouuups, parametre manquantes...' })
  }

  User.restore({ where: {id: userId }})
    .then(() => res.status(204).json({}))
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

}


// mettre à la corbeille utilisateur

exports.trashUser = (req, res) => {

  let userId = parseInt(req.params.id)
  
  if (!userId) {
    return res.status(400).json({ message: 'ID non trouvé' })
  }

  User.destroy({ where: {id: userId } })
    .then(() => res.status(204).json({}))
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

}



// supprimer definitivement un utilisateur

exports.deleteUser = (req, res) => {

  let userId = parseInt(req.params.id)
  
  if (!userId) {
    return res.status(400).json({ message: 'ID non trouvé' })
  }

  User.destroy({ where: {id: userId }, force: true })
    .then(() => res.status(204).json({}))
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

}



