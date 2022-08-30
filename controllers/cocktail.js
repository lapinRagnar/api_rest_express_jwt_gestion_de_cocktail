/** les imports */
const DB = require('../db.config')
const Cocktail = DB.Cocktail
const User = DB.User

const { RequestError, CocktailError } = require('../error/customError')


// afficher tous les cocktails
exports.getAllCocktails = (req, res, next) => {
  
  Cocktail.findAll()
    .then(cocktails => res.json({data: cocktails}))
    .catch(err => next(err)) 

}


// afficher un cocktail
exports.getCocktail = async (req, res, next) => {


  try {

    let cocktailId = parseInt(req.params.id)
    console.log('id du cocktail: ',cocktailId)
  
    if (!cocktailId) {
      // return res.status(400).json({ message: 'ID non trouvé' })
      throw new RequestError('missing parameter!')
    }

    // recuperer le cocktail
    let cocktail = await Cocktail.findOne({ where: {id: cocktailId}, raw: true, include: User })

    // teste si resultat
    if ((cocktail === null)) {
      // return res.status(404).json({ message: 'cocktail non trouvé, ouuups!' })
      throw new CocktailError('cocktail non trouvé, ouuups!', 0)
    }

    // renvoie du cocktail trouvé
    return res.json({data: cocktail})

  } catch (err) {

    console.log('on est dans le catch')
    console.log('message err', err.message)
    next(err)
  }
}



// ajouter un cocktail
exports.addCocktail = async (req, res, next) => {

  try {

    const { user_id, nom, description, recette } = req.body

    console.log('les champs', req.body)
    
    if ( !user_id || !nom || !description || !recette) {
      throw new RequestError('missing parameter!')  
    }

    // verification si le cocktail existe
    let cocktail = await Cocktail.findOne({ where: { nom: nom }, raw: true})

    if (cocktail !== null) {
      throw new CocktailError(` le cocktail ${nom} existe, choisit un autre... `, 1)
    }

    // on crée le cocktail
    cocktail = await Cocktail.create(req.body)

    // reponse du cocktail crée
    return res.json({ message: "le cocktail a été bien crée!", data: cocktail})

  } catch (err) {
    next(err)
  }

}



// modifier un cocktail
exports.updateCocktail = async (req, res, next) => {

  try {

    let cocktailId = parseInt(req.params.id)
    console.log('id mise a jour', cocktailId)
    
    // verification si id exite et coherent
    if (!cocktailId) {
      throw new RequestError('missing parameter!')
    }

    // recherche du cocktail et verification
    let cocktail = await Cocktail.findOne({ where: {id: cocktailId}, raw: true})
    if (cocktail === null) {
      throw new CocktailError('cocktail non trouvé, ouuups!', 1)
    }

    // mises à jour du cocktail
    await Cocktail.update(req.body, {where: { id: cocktailId}, raw: true})

    // reponse de la mises à jour
    return res.json({ message: 'cocktail updated!'})


  } catch (err) {
    next(err)
  }

}


// restaurer un cocktail supprimé
exports.untrashCocktail = async (req, res, next) => {

  try {
    let cocktailId = parseInt(req.params.id)

    // verification si cocktail exite et coherent
    if (!cocktailId) {
      throw new RequestError('missing parameter!')
    }
    
    // restaurer le cocktail
    await Cocktail.restore({ where: {id: cocktailId}})
    
    // reponse de la restauration
    return res.status(204).json({})

  } catch (err) {
    next(err)
  }

}

// mettre dans la corbeille
exports.trashCocktail = async (req, res, next) => {

  try {
    let cocktailId = parseInt(req.params.id)
    console.log('je passe la - l id est => ', cocktailId)

    // verification si cocktail exite et coherent
    if (!cocktailId) {
      throw new RequestError('missing parameter!')
    }

    // mettre le cocktail à la poubelle
    await Cocktail.destroy({ where: {id: cocktailId}})

    // reponse de la suppression
    return res.status(204).json({})

  } catch (err) {
    next(err)
  }


}

// supprimer un cocktail
exports.deleteCocktail = async (req, res, next) => {

  
  try {
    let cocktailId = parseInt(req.params.id)

    // verification si cocktail exite et coherent
    if (!cocktailId) {
      throw new RequestError('missing parameter!')
    }

    // mettre le cocktail à la poubelle definitivement
    await Cocktail.restore({ where: {id: cocktailId, force: true}})
    
    // reponse de la suppression
    return res.status(204).json({})

  } catch (err) {
    next(err)
  }

}

