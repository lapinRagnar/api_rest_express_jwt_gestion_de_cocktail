/** les imports */
const express = require('express')
const cocktailCtrl = require('../controllers/cocktail')

let router = express.Router()

const checkTokenMiddleware = require('../jsonwebtoken/check')



/** middleware pour logger la date des requetes */

router.use((req, res, next) => {

  const event = new Date()
  console.log('Cocktails - date de connexion : ', event.toString())

  next()

})


/** routages de la ressource cocktail */

// afficher tout
router.get('', cocktailCtrl.getAllCocktails)



// afficher un cocktail
router.get('/:id', cocktailCtrl.getCocktail)



// ajouter un cocktail
router.put('', checkTokenMiddleware, cocktailCtrl.addCocktail)


// modifier un cocktail
router.patch('/:id', checkTokenMiddleware, cocktailCtrl.updateCocktail)


// restaurer un cocktail

router.post('/untrash/:id', cocktailCtrl.untrashCocktail)



// mettre à la corbeille un cocktail provisoirement

router.delete('/trash/:id', cocktailCtrl.trashCocktail)


// supprimer un cocktail definitivement
router.delete('/:id', checkTokenMiddleware, cocktailCtrl.deleteCocktail)



module.exports = router
