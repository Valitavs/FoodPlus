const express = require('express')
const mysql = require('mysql')
const DB = require('../config')

const conexion = mysql.createConnection({
    multipleStatements: true,
    host: DB.BD_HOST,
    port: DB.BD_PORT,
    user: DB.BD_USER,
    password: DB.BD_PASSWORD,
    database: DB.BD_NAME
})

console.log(DB.BD_HOST, DB.BD_PORT, DB.BD_USER)

conexion.connect((error)=>{
    if(error){
        console.log('Error de conexion ',+ error)
        return
    }
    console.log('Conectado a la BD')
})

module.exports = conexion