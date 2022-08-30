const { DataTypes } = require('sequelize')
// const DB = require('../db.config')

module.exports = (sequelize) => {

  const Cocktail = sequelize.define('Cocktail', {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
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

  // Cocktail.sync()

  return Cocktail
}



/** synchronisation du modele  */
// Cocktail.sync()
// Cocktail.sync({force: true})
// Cocktail.sync({alter: true})


// module.exports = Cocktail
