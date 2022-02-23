//import packages
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const fs = require('fs')
const methodOverride = require('method-override')
const router = express.Router()

//create an instant of express
const app = express()

//middleware
//tell express to use ejs as the view engine
app.set('view engine', 'ejs')

//tell express that we're using ejs layouts
app.use(ejsLayouts)
//method override
app.use(methodOverride('_method'))
//body-parser middleware
//this allows us to access form data via req.body
app.use(express.urlencoded({ extended: false }))

//DISPLAY ALL DINO
//index route => list all dinosaurs
router.get('/', (req, res) => {
    // read in the array from dinosaurs.json
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    //grabbing the queried name from the url
    let nameFilter = req.query.nameFilter
    //if there IS a query.
    if (nameFilter) {
            dinoData = dinoData.filter(dino => {
            return dino.name.toLowerCase() === nameFilter.toLowerCase()
        })
        
    }
    res.render('./dinosaurs/index.ejs', {myDinos: dinoData})
})

//new route (renders the new dino form)
router.get('/new', (req, res) => {
    res.render('./dinosaurs/new.ejs')
})

//UPDATING A DINO
router.get('/edit/:idx', (req, res) => {
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    res.render('./dinosaurs/edit.ejs', { dino: targetDino, dinoId: dinoIndex})
    
})

//UPDATING A DINO
router.put('/:idx', (req, res) => { 
    //read in our existing dino data
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    //replace the dino fields with field from req.body
    dinoData[req.params.idx].name = req.body.name
    dinoData[req.params.idx].type = req.body.type
    //write the updated array back to the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    //once the dinosaur has been editted, do a get request to the index route
    res.redirect('/dinosaurs')
})

//show ie show all info about a single dino
//: -> indicates that the following is a url parameter
router.get('/:idx', (req, res) => { 
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    res.render('./dinosaurs/show.ejs', { dino: targetDino })
})

//ADDING A NEW DINO
router.post('/', (req, res) => {
     // read in the array from dinosaurs.json
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    //add the new dino to the dinoData array
    dinoData.push(req.body)
    //save the dinosaurs to the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    //redirect to the indexroute
    //res.redirect takes the url pattern for the get route that you want to run next
    res.redirect('/dinosaurs')
})

//DELETING A DINO
router.delete('/:idx', (req, res) => {
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    //remove the deleted dino from dinoData
    dinoData.splice(req.params.idx, 1)
    //
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    res.redirect('/dinosaurs')
})

module.exports = router