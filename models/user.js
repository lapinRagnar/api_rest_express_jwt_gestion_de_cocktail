const { DataTypes } = require('sequelize')
const DB = require('../db.config')
const bcrypt = require('bcrypt')

const User = DB.define('User', {
  id: {
    type: DataTypes.INTEGER(10),
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    defaultValue: '',
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING(100),
    defaultValue: '',
    allowNull: false
  },
  pseudo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(64),
    is: /^[0-9a-f]{64}$/i
  }
}, { paranoid: true })                // soft delete


// hook pour le hashage du password
User.beforeCreate(async (user, options) => {
  let hash = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUND))
  user.password = hash
})

// ma fonction pour verifier le mot de passe - pour l'authentification 
User.checkPassword = async (password, originel) => {
  return await bcrypt.compare(password, originel)
}


/** synchronisation du modele  */
// User.sync()
// User.sync({force: true})
// User.sync({alter: true})


module.exports = User
