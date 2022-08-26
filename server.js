/** les imports */
const express = require('express')
const cors = require('cors')
let DB = require('./db.config')
const checkTokenMiddleware = require('./jsonwebtoken/check')

/** initialisation de l'api */

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** import des modules de routage */

const user_router = require('./routes/users')
const cocktail_router = require('./routes/cocktails')

const auth_router = require('./routes/auth')


/** mise en place du routage */
app.get('/', (req, res) => res.send(`Je suis en ligne! aie aie aieuuuuh`))

app.use('/users', checkTokenMiddleware, user_router)

app.use('/cocktails', cocktail_router)

app.use('/auth', auth_router)

app.get('*', (req, res) => res.status(501).send(`Ouuuups, qu'est ce que t'as foutu!`))


// middleware pour gerer les erreurs
app.use( (error, req, res, next) => {
  console.log('je suis dans le middleware')
  console.log(error)
  
  return res.status(error.statusCode || 500).json({ message: error.message, error: error})
})


/** demarrer le server avec la bdd */

DB.authenticate()
  .then(() => console.log('la connexion à la base de donnée est ok'))
  .then(() => {

    app.listen(process.env.SERVER_PORT, () => {
      console.log(`le server ecoute sur le port ===> ${process.env.SERVER_PORT}, amuse toi! `)
    })

  })
  .catch(err => console.log('erreur de la base de donnée ==>', err))



