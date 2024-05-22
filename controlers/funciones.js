const express = require('express')
const conexion = require('../database/db')
const multer = require("multer");
const { resolveInclude } = require('ejs');
const { engine } = require('express-handlebars')
const myconnection = require('express-myconnection')
const session = require("express-session")


//Guardar registro
exports.save = (req,res)=>{
    const nombre = req.body.user_nombre
    const correo = req.body.user_correo
    const telefono =  req.body.user_telefono
    const direccion = req.body.user_direccion
    const contraseña = req.body.user_contraseña
    const terminos = req.body.terminos

    conexion.query('INSERT INTO usuarios SET ?', {user_nombre:nombre, user_correo:correo, user_telefono:telefono, user_direccion:direccion, user_contraseña:contraseña, terminos:terminos}, (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/')
        }
    })
}
