const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { engine } = require('express-handlebars')
const myconnection = require('express-myconnection')
const session = require('express-session');

app.use(session({secret: 'secret', resave: true, saveUninitialized: true})); //Session setup

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.set('view engine', 'ejs')

app.use('/', require('./router'))

app.listen(4000, ()=>{
    console.log('Servidor corriendo en http://localhost:4000')
})

app.use(express.static(__dirname + '/public'));