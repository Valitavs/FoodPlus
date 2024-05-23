const express = require('express')
const mysql = require('mysql')

const conexion = mysql.createConnection({
    multipleStatements: true,
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME
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