/** les imports */
const express = require('express')
const cors = require('cors')
let DB = require('./db.config')
const checkTokenMiddleware = require('./jsonwebtoken/check')
const errorHandler = require('./error/errorHandler')
const path = require('path')

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
// app.get('/', (req, res) => res.send(
//   `
//     <h1> Bienvenu sur mon api - gestion de cocktail</h1>  
//     <h3> ressources : utilisateur </h3>

  
//   `
// ))
app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/pages/home.html')))

// app.use('/users', checkTokenMiddleware, user_router)
app.use('/users', user_router)

app.use('/cocktails', cocktail_router)

app.use('/auth', auth_router)

app.get('*', (req, res) => res.status(501).send(`Ouuuups, la route n'existe pas euuuuh!!`))


// middleware pour gerer les erreurs
app.use(errorHandler)


/** demarrer le server avec la bdd */

DB.sequelize.authenticate()
  .then(() => console.log('la connexion à la base de donnée est ok'))
  .then(() => {

    app.listen(process.env.SERVER_PORT, () => {
      console.log(`le server ecoute sur le port ===> ${process.env.SERVER_PORT}, amuse toi! `)
    })

  })
  .catch(err => console.log('erreur de la base de donnée ==>', err))



