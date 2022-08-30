/** les imports */
const { Sequelize } = require('sequelize')

/** connexion à la bdd */
let sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: true
  }
)

/** mise en place des relations */
const db = {}

db.sequelize = sequelize
db.User = require('./models/user')(sequelize)
db.Cocktail = require('./models/cocktail')(sequelize)

db.User.hasMany(db.Cocktail, {foreignKey: 'user_id'})
db.Cocktail.belongsTo(db.User, {foreignKey: 'user_id'})


/** synchronisation des modeles  */
// sequelize.sync((err) => {
//   console.log('erreur de syncronisation de la base de donnée, ok!', err)
// })

db.sequelize.sync({alter: true})

module.exports = db