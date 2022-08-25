const { DataTypes } = require('sequelize')
const DB = require('../db.config')

const Cocktail = DB.define('Cocktail', {
  id: {
    type: DataTypes.INTEGER(10),
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER(10),
    allowNull: false
  },
  nom: {
    type: DataTypes.STRING(100),
    defaultValue: '',
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
    allowNull: false
  },
  recette: {
    type: DataTypes.TEXT,
    defaultValue: '',
    allowNull: false
  }
}, { paranoid: true })                // soft delete


/** synchronisation du modele  */
// Cocktail.sync()
// Cocktail.sync({force: true})
// Cocktail.sync({alter: true})


module.exports = Cocktail
