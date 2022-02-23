//import packages
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const fs = require('fs')
const methodOverride = require('method-override')


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
// this allows us to access form data via req.body
app.use(express.urlencoded({extended: false}))

//ROUTES
//home url = '/'
app.get('/', (req,res) => {
    // res.send('Hello Dino!')
    res.render('index.ejs')
})

//controllers
app.use('/dinosaurs', require('./controllers/dinosaurs.js'))
app.use('/prehistoric_creatures', require('./controllers/prehistoric_creature.js'))




app.listen(8000, () => {
    console.log('DINO CRUD TIME ')
})
