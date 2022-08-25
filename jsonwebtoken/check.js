/** les imports */

const jwt = require('jsonwebtoken')


/** extraction du token */
const extractBearer = authorization => {

  if (typeof authorization !== 'string') {
    return false
  }

  // on isole le token
  const matches = authorization.match(/(bearer)\s+(\S+)/i)

  return matches && matches[2]

}

/** verification de la presence du token */
const checkTokenMiddleware = (req, res, next) => {

  const token = req.headers.authorization && extractBearer(req.headers.authorization)

  if (!token) {
    return res.status(401).json('oh la la, qu\'est ce que t\'as foutu mecs!')
  }

  // verifier la validité du token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

    if (err) {
      return res.status(401).json({message: "le token n'est plus bon."})
    }

    next()
  })
}

module.exports = checkTokenMiddleware


