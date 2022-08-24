const express = require('express')
const cors = require('cors')

/** initialisation de l'api */

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** mise en place du routage */
app.get('/', (req, res) => res.send(`Je suis en ligne! aie aie aieuuuuh`))

app.get('*', (req, res) => res.status(501).send(`Ouuuups, qu'est ce que t'as foutu!`))

/** demarrer le server */
app.listen(process.env.SERVER_PORT, () => {
    console.log(`le server ecoute sur le port ===> ${process.env.SERVER_PORT} `)
})

