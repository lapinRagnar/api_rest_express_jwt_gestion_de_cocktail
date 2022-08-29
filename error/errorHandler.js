const errorHandler = (err, req, res, next) => {

  // 0 --> message simple
  // 1 --> message d'erreur sans detail 
  // 1 --> message avec toutes les erreurs 
  debugLevel = 1
  message = {}

  console.log('je suis dans errorHandler')
  console.log(err)

  switch (debugLevel) {
    case 0:
      message = { message: err.message }
      if (err.name == 'SequelizeDatabaseError') {
        message = { message: 'database error'}
      }
      break
    case 1:
      message = { message: err.message }
      break
    case 2:
      message = { message: err.message, error: err }
      break
    default:
      console.log('bad debugLevel')
  }

  return res.status(err.statusCode || 500).json({ message})

}

module.exports = errorHandler


