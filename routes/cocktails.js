/** les imports */
const express = require('express')

const Cocktail = require('../models/cocktail')

const bcrypt = require('bcrypt')

let router = express.Router()

const checkTokenMiddleware = require('../jsonwebtoken/check')



/** middleware pour logger la date des requetes */

router.use((req, res, next) => {

  const event = new Date()
  console.log('Cocktails - date de connexion : ', event.toString())

  next()

})


/** routages de la ressource User */

// afficher tout
router.get('', (req, res) => {

  Cocktail.findAll()
    .then(cocktails => res.json({data: cocktails}))
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err})) 
})


// afficher un cocktail
router.get('/:id', (req, res) => {

  let cocktailId = parseInt(req.params.id)

  console.log('id du cocktail: ',cocktailId)

  if (!cocktailId) {
    return res.status(400).json({ message: 'ID non trouvé' })
  }

  Cocktail.findOne({ where: {id: cocktailId}, raw: true })
    .then(cocktail => {

      if ((cocktail === null)) {
        return res.status(404).json({ message: 'cocktail non trouvé, ouuups!' })
      }

      return res.json({data: cocktail})
    })
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))
})




// ajouter un cocktail
router.put('', checkTokenMiddleware, (req, res) => {

  const { user_id, nom, description, recette } = req.body

  if ( !user_id || !nom || !description || !recette) {
    return res.status(400).json({ message: "donnée manquantes!, remplit bien tous les champs requis stp!" })
  }

  Cocktail.findOne({ where: { nom: nom }, raw: true})
    .then(cocktail => {

      if (cocktail !== null) {
        return res.status(409).json({ message: ` le cocktail ${nom} existe, choisit un autre... `})
      }


      Cocktail.create(req.body)
        .then(cocktail => res.json({ message: "le cocktail a été bien crée!", data: cocktail}) )
        .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

    })
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

})



// supprimer un cocktail
router.delete('/:id', checkTokenMiddleware, (req, res) => {

  let cocktailId = parseInt(req.params.id)
  
  if (!cocktailId) {
    return res.status(400).json({ message: 'ID non trouvé' })
  }

  Cocktail.destroy({ where: {id: cocktailId }, force: true })
    .then(() => res.status(204).json({ message: `le cocktail ${cocktailId} a été bien supprimé, merci! `}))
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

})



module.exports = router
