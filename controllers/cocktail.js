/** les imports */
const Cocktail = require('../models/cocktail')
const bcrypt = require('bcrypt')


// afficher tous les cocktails
exports.getAllCocktails = (req, res) => {
  
  Cocktail.findAll()
    .then(cocktails => res.json({data: cocktails}))
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err})) 

}


// afficher un cocktail
exports.getCocktail = async (req, res) => {

  let cocktailId = parseInt(req.params.id)

  console.log('id du cocktail: ',cocktailId)



  if (!cocktailId) {
    return res.status(400).json({ message: 'ID non trouvé' })
  }


  try {

    // recuperer le cocktail
    let cocktail = await Cocktail.findOne({ where: {id: cocktailId}, raw: true })

    // teste si resultat
    if ((cocktail === null)) {
      return res.status(404).json({ message: 'cocktail non trouvé, ouuups!' })
    }

    // renvoie du cocktail trouvé
    return res.json({data: cocktail})

  } catch (err) {

    return res.status(500).json({ message: 'erreur de la base de donnée', error: err})

  }



  // Cocktail.findOne({ where: {id: cocktailId}, raw: true })
  //   .then(cocktail => {

  //     if ((cocktail === null)) {
  //       return res.status(404).json({ message: 'cocktail non trouvé, ouuups!' })
  //     }

  //     return res.json({data: cocktail})
  //   })
  //   .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

}



// ajouter un cocktail
exports.addCocktail = async (req, res) => {

  const { user_id, nom, description, recette } = req.body

  
  if ( !user_id || !nom || !description || !recette) {
    return res.status(400).json({ message: "donnée manquantes!, remplit bien tous les champs requis stp!" })
  }

  try {
    
    // verification si le cocktail existe
    let cocktail = await Cocktail.findOne({ where: { nom: nom }, raw: true})

    if (cocktail !== null) {
      return res.status(409).json({ message: ` le cocktail ${nom} existe, choisit un autre... `})
    }

    cocktail = await Cocktail.create(req.body)
    return res.json({ message: "le cocktail a été bien crée!", data: cocktail})

  } catch (err) {

    return res.status(500).json({ message: 'erreur de la base de donnée', error: err})

  }


  // Cocktail.findOne({ where: { nom: nom }, raw: true})
  //   .then(cocktail => {

  //     if (cocktail !== null) {
  //       return res.status(409).json({ message: ` le cocktail ${nom} existe, choisit un autre... `})
  //     }


  //     Cocktail.create(req.body)
  //       .then(cocktail => res.json({ message: "le cocktail a été bien crée!", data: cocktail}) )
  //       .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

  //   })
  //   .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

}



// modifier un cocktail

exports.updateCocktail = (req, res) => {

  let cocktailId = parseInt(req.params.id)

  console.log('id mise a jour', cocktailId);

  if (!cocktailId) {
    return res.status(400).json({ message: 'ouuups, parametre manquantes...' })
  }

  Cocktail.findOne({ where: {id: cocktailId}, raw: true })
    .then(cocktail => {

      console.log('je recherche le cocktail', cocktail)

      if (cocktail === null) {
        return res.status(400).json({ message: 'ouuups, ce cocktail n\'existe pas...' })
      }

      Cocktail.update(req.body, { where: { id: cocktailId }})
        .then(cocktail => res.json({ message: "le cocktail a été bien mises à jour!", data: cocktail}))
        .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

    })
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))
  

}


// supprimer un cocktail

exports.deleteCocktail = (req, res) => {

  
  let cocktailId = parseInt(req.params.id)
  
  if (!cocktailId) {
    return res.status(400).json({ message: 'ID non trouvé' })
  }

  Cocktail.destroy({ where: {id: cocktailId }, force: true })
    .then(() => res.status(204).json({ message: `le cocktail ${cocktailId} a été bien supprimé, merci! `}))
    .catch(err => res.status(500).json({ message: 'erreur de la base de donnée', error: err}))

}

