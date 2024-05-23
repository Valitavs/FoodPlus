const express = require('express')
require("dotenv").config();
const mysql = require('mysql')

const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`

const conexion = mysql.createConnection(urlDB)


conexion.connect((error)=>{
    if(error){
        console.log('Error de conexion ',+ error)
        return
    }
    console.log('Conectado a la BD')
})

module.exports = conexion