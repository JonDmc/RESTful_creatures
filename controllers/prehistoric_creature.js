//import packages
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const fs = require('fs')
const methodOverride = require('method-override')
const router = express.Router()

//global variables
let creatures = fs.readFileSync('./prehistoric_creatures.json')
let phCreatures = JSON.parse(creatures)

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
app.use(express.urlencoded({extended: false}))

//displaying all creature
router.get('/', (req, res) => {
    res.render('./prehistoric_creatures/phCreatures.ejs', {creatures: phCreatures})
})
//going to new page
router.get('/new', (req, res) => {
    res.render('./prehistoric_creatures/phCreature_new.ejs')

})

//display the creatures with pictures
router.get('/:idx', (req, res) => {
    let targetCreature = phCreatures[req.params.idx]
    res.render('./prehistoric_creatures/phCreatures_show.ejs', {creatures: targetCreature})
})

//add a new creature
router.post('/', (req, res) => {
    phCreatures.push(req.body)
    fs.writeFileSync('./prehistoric_creatures.json', JSON.stringify(phCreatures))
    res.redirect('/prehistoric_creatures')
})
//going to edit.ejs
router.get('/edit/:idx', (req, res) => {
    let targetCreature = phCreatures[req.params.idx]
    res.render('./prehistoric_creatures/phCreature_edit.ejs', { creatures: targetCreature, creatureId: req.params.idx})
    
})
//update a creature
router.put('/:idx', (req, res) => { 
    phCreatures[req.params.idx].type = req.body.type
    phCreatures[req.params.idx].img_url = req.body.img_url
    fs.writeFileSync('./prehistoric_creatures.json', JSON.stringify(phCreatures))
    res.redirect('/prehistoric_creatures')
})

//deleting the creature
router.delete('/:idx', (req, res) => {
    //remove the deleted dino from dinoData
    phCreatures.splice(req.params.idx, 1)
    fs.writeFileSync('./prehistoric_creatures.json', JSON.stringify(phCreatures))
    res.redirect('/prehistoric_creatures')
})

module.exports = router

