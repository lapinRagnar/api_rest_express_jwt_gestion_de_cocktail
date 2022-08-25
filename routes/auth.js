/** les imports */
const express = require('express')
const authCtrl = require('../controllers/auth')
let router = express.Router()


/** middleware pour logger la date des requetes */

router.use((req, res, next) => {

  const event = new Date()
  console.log('Auth - date de connexion : ', event.toString())

  next()

})


/** les routages de la ressource auth */
router.post('/login', authCtrl.login)



module.exports = router
