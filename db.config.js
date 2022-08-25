const { Sequelize } = require('sequelize')

let sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
)

/** synchronisation des modeles  */
// sequelize.sync((err) => {
//   console.log('erreur de syncronisation de la base de donnée, ok!', err)
// })

module.exports = sequelize