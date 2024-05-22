const mysql = require('mysql')
const conexion = mysql.createConnection({
    multipleStatements: true,
    host:3306,
    user: 'root',
    password: 'coco1033',
    database: 'bd_foodplus'
})

conexion.connect((error)=>{
    if(error){
        console.log('Error de conexion ',+ error)
        return
    }
    console.log('Conectado a la BD')
})

module.exports = conexion