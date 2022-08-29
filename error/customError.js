class MainError extends Error {

  constructor(errorMessage, errorType='') {

    super()

    this.name = this.constructor.name
    this.message = errorMessage

    console.log('le nom du constructeur', this.name)

    switch (this.constructor.name) {
      
      case 'AuthenticationError': 
        console.log('authen error')
        if (errorType == 0) {
          this.statusCode = 400
        } else if (errorType == 1) {
          this.statusCode = 404
        } else {
          this.statusCode = 401
        }
        break 

      case 'UserError':
        console.log('user error')
        if (errorType == 0) {
          this.statusCode = 404
        } else {
          this.statusCode = 409
        }
        break
      
      case 'CocktailError':
        console.log('cocktail error')
        if (errorType == 0) {
          this.statusCode = 404
        } else {
          this.statusCode = 409
        }
        break

      case 'RequestError':
        console.log('request error')
        this.statusCode = 400
        break
      
      default:
        console.log('les autres errors - no handler for that')

    }

  }
  
}


class AuthenticationError extends MainError {}
class UserError extends MainError {}
class CocktailError extends MainError {}
class RequestError extends MainError {}

module.exports = { AuthenticationError, UserError, CocktailError, RequestError }
