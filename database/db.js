const express = require('express')
const mysql = require('mysql')

const conexion = mysql.createConnection({
    multipleStatements: true,
    host: process.env.BD_HOST || "localhost",
    port: process.env.BD_PORT || 3306,
    user: process.env.BD_USER || "root",
    password: process.env.BD_PASSWORD || "coco1033",
    database: process.env.BD_NAME || 'bd_foodplus'
})

conexion.connect((error)=>{
    if(error){
        console.log('Error de conexion ',+ error)
        return
    }
    console.log('Conectado a la BD')
})

module.exports = conexion