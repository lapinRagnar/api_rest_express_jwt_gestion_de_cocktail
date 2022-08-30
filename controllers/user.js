// les imports

const User = require('../models/user')
const bcrypt = require('bcrypt')
const { RequestError, UserError } = require('../error/customError')



/** routages de la ressource User */

// tous les utilisateur
exports.getAllUsers = (req, res, next) => {

  User.findAll()
    .then(users => res.json({data: users}))
    .catch(err => next()) 

}


// utilisateur par id
exports.getUser = async (req, res, next) => {

  try {

    // recuperer l'id
    let userId = parseInt(req.params.id)

    // test si l'id exite et coherent
    if (!userId) {
      throw new RequestError('missing parameter!')
    }

    // recuperer l'utilisateur
    let user = await User.findOne({ where: {idd: userId}, raw: true})

    // teste si resultat
    if ((user === null)) {
      throw new UserError('utilisateur non trouvé, ouuups!', 0)
    }

    // renvoyer l'user
    return res.json({data: user})

  } catch (err) {
    next(err)
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
exports.addUser = async (req, res, next) => {

  try {

    const { nom, prenom, pseudo, email, password } = req.body

    if ( !nom || !prenom || !pseudo || !email || !password) {
      throw new RequestError('missing parameter!') 
    }

    let user = await User.findOne({ where: { email: email }, raw: true})

    if (user !== null) {
      throw new CocktailError(` l'utilisateur ${nom} existe deja! `, 1)
    }

    bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
      .then(hash => {

        req.body.password = hash

        User.create(req.body)
          .then(user => res.json({ message: "l'utilisateur a été bien crée!", data: user}) )
          .catch(err => next())

      })
      .catch(err => next())

  } catch (err) {
    next()
  }
}


// modifier un utilisateur - A refaire ne marche pas
exports.updateUser = async (req, res, next) => {

  try {

    let userId = parseInt(req.params.id)

    if (!userId) {
      throw new RequestError('missing parameter!')  
    }

    let user = await User.findOne({ where: {id: userId}, raw: true })

    if (user === null) {
      console.log('je suis la')
      throw new UserError(`utilisateur non trouvé, désolé! `, 1)
    }

    user = await User.update(req.body, { where: { id: userId }})

    return res.json({ message: "l'utilisateur a été bien modifié!", data: user})

  } catch (err) {
    next()
  }

}


// restaurer un utilisateur supprimé
exports.untrashUser = async (req, res, next) => {

  try {

    let userId = parseInt(req.params.id)

    if (!userId) {
      throw new RequestError('missing parameter!')
    }

    await User.restore({ where: {id: userId}})

    return res.status(204).json({})

  } catch (err) {
    next()
  }

}


// mettre à la corbeille utilisateur
exports.trashUser = async (req, res, next) => {

  try {
    
    let userId = parseInt(req.params.id)
    console.log(userId)

    if (!userId) {
      throw new RequestError('missing parameter!')
    }

    await User.destroy({ where: {id: userId} })

    return res.status(204).json({ message: `l'utilisateur a bien été supprimé, merci! `})

  } catch (err) {
    next()
  }

}


// supprimer definitivement un utilisateur

exports.deleteUser = async (req, res, next) => {

  try {

    let userId = parseInt(req.params.id)
    
    if (!userId) {
      return res.status(400).json({ message: 'ID non trouvé' })
    }

    await User.destroy({ where: {id: userId }, force: true })

    return res.status(204).json({})

  } catch (err) {
    next()
  }

}



