// les imports
const express = require('express')
const userCtrl = require('../controllers/user')

let router = express.Router()


/** middleware pour logger la date des requetes */

router.use((req, res, next) => {

  const event = new Date()
  console.log('Users - date de connexion : ', event.toString())

  next()

})



/** routages de la ressource User */


// affichers tous les utilisateurs
router.get('/', userCtrl.getAllUsers)


// afficher un utilisateur par id
router.get('/:id', userCtrl.getUser)



// ajouter un utilisateur
router.put('', userCtrl.addUser)


// modifier un utilisateur

router.patch('/:id', userCtrl.updateUser)



// restaurer un utilisateur

router.post('/untrash/:id', userCtrl.untrashUser)




// mettre à la corbeille utilisateur

router.delete('/trash/:id', userCtrl.trashUser)

// supprimer definitivement un utilisateur

router.delete('/:id', userCtrl.deleteUser)




module.exports = router