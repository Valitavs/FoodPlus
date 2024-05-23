const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { engine } = require('express-handlebars')
const myconnection = require('express-myconnection')
const session = require('express-session');
const PORT = require('./config2')

app.use(session({secret: 'secret', resave: true, saveUninitialized: true})); //Session setup

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.set('view engine', 'ejs')

app.use('/', require('./router'))

app.listen(PORT, ()=>{
    console.log('Servidor corriendo en', PORT)
})

app.use(express.static(__dirname + '/public'));