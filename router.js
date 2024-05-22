const express = require('express')
const router = express.Router()
const multer = require("multer");
const path = require('path')


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './public/uploads')
    },
    filename: (req, file, cb)=> {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

const conexion = require('./database/db')

router.post('/save2',(req,res)=>{
    const correo = req.body.usercorreo
    const contraseña = req.body.contraseñauser

    conexion.query('SELECT * FROM usuarios WHERE user_correo =?', [correo], (error,results)=>{
        if(results.length > 0){
            results.forEach(element => {
                if(contraseña != element.user_contraseña){
                    res.redirect('/Signin')
                    console.log("error contra")
                }else{
                    req.session.loggedin = true
                    req.session.idusuarios = element.idusuarios
                    req.session.user_img = element.user_img
                    res.redirect('/Iniciouser')
                }
            });
        }else{
            res.redirect('/Signin')
            console.log("error correo")
        }
    })
})

router.get('/logout',(req, res) => {
    if(req.session.loggedin == true){
        req.session.destroy();
    }
    res.redirect('/')
})

router.get('/',(req,res)=>{
    res.render('inicio')
})

router.get('/Restaurantes',(req,res)=>{
    conexion.query('SELECT * FROM restaurantes',(error,results)=>{
        if(error){
            throw error
        }else{
            res.render('restaurantes',{results:results, name: req.session.idusuarios})
        }
    })
})

router.get('/Historial',(req,res)=>{
    conexion.query('SELECT * FROM ordenes_restaurante',(error,results)=>{
        if(error){
            throw error
        }else{
            res.render('historial-ordenes',{results:results})
        }
    })
})

router.get('/Restaurantesuser',(req,res)=>{
    conexion.query('SELECT * FROM restaurantes',(error,results)=>{
        if(error){
            throw error
        }else{
            res.render('restaurantes-usuario',{results:results, img: req.session.user_img, name: req.session.idusuarios})
        }
    })
})

router.get('/Blogs',(req,res)=>{
    res.render('blog')
})

router.get('/Blogsuser/:iduser',(req,res)=>{
    const iduser =  req.params.iduser
    conexion.query('SELECT * FROM usuarios WHERE idusuarios =?; SELECT * FROM recomendaciones',[iduser], (error,results)=>{
        if(error){
            throw error
        }else{
            if(req.session.loggedin == true) {
                res.render('blog-usuario', {name: req.session.idusuarios, img: req.session.user_img, user:results[0][0], recom:results[1]})
            }
        }
    })
})

router.get('/Signin',(req,res)=>{
    res.render('signin')
})

router.get('/AgregarReserva/:idres/:iduser',(req,res)=>{
    const idres = req.params.idres
    const iduser =  req.params.iduser

    conexion.query('SELECT * FROM restaurantes WHERE idrestaurantes =?; SELECT * FROM usuarios WHERE idusuarios =?',[idres,iduser],(error,results)=>{
        if(error){
            throw error
        }else{
            res.render('add-dias',{res:results[0][0], user:results[1][0]})
        }
    })
})

router.get('/RestauranteProfile/:idrestaurantes',(req,res)=>{
    const idrestaurantes = req.params.idrestaurantes
    const iduser_menu = req.params.idrestaurantes
    conexion.query('SELECT * FROM restaurantes WHERE idrestaurantes =?; SELECT * FROM menu WHERE idres_menu =?',[idrestaurantes,iduser_menu],(error,results)=>{
        if(error){
            throw error
        }else{
            res.render('restauranteprofile.ejs',{usuario:results[0][0], res:results[1]})
        }
    })
})

router.get('/RestauranteProfileUser/:idrestaurantes/:name',(req,res)=>{
    const idrestaurantes = req.params.idrestaurantes
    const idusuario = req.params.name
    const iduser_menu = req.params.idrestaurantes
    conexion.query('SELECT * FROM restaurantes WHERE idrestaurantes =?; SELECT * FROM menu WHERE idres_menu =?; SELECT * FROM usuarios WHERE idusuarios =?; SELECT * FROM carrito_compras WHERE idusuario =?; SELECT * FROM reseñas WHERE idres_reseña =?; SELECT * FROM dias_reserva WHERE idres_reserva=?',[idrestaurantes,iduser_menu,idusuario,idusuario,idrestaurantes,idrestaurantes],(error,results)=>{
        if(error){
            throw error
        }else{
            res.render('restauranteprofile-usuario.ejs',{usuario:results[0][0], res:results[1], resultado:results[2][0], carrito:results[3], reseñas:results[4], reserva:results[5]})
        }
    })
})

router.get('/Restaurante/:idrestaurantes/:idusuarios',(req,res)=>{
    const idrestaurantes = req.params.idrestaurantes
    const idusuarios = req.params.idusuarios
    const iduser_menu = req.params.idrestaurantes
    conexion.query('SELECT * FROM restaurantes WHERE idrestaurantes =?; SELECT * FROM usuarios WHERE idusuarios =?; SELECT * FROM menu WHERE idres_menu =?; SELECT * FROM ordenes_restaurante WHERE idres_orden=?; SELECT * FROM reseñas WHERE idres_reseña =?; SELECT * FROM dias_reserva WHERE idres_reserva=?',[idrestaurantes,idusuarios,iduser_menu,idrestaurantes,idrestaurantes,idrestaurantes],(error,results)=>{
        if(error){
            throw error
        }else{
            res.render('config-res',{usuario:results[0][0], resultados:results[1][0], res:results[2], restaurantes:results[3], reseñas:results[4],  reserva:results[5], name: req.session.idusuarios})
        }
    })
})

router.get('/Menu',(req,res)=>{
    conexion.query('SELECT * FROM menu',(error,results)=>{
        if(error){
            throw error
        }else{
            res.render('menu',{results:results})
        }
    })
})

router.get('/delete/:idmenu',(req,res)=>{
    const id = req.params.idmenu
    conexion.query('DELETE FROM menu WHERE idmenu =?', [id], (error,results)=>{
        if(error){
            throw error
        }else{
            res.redirect('/Restaurante')
        }
    })
})

router.get('/deletecarrito/:idcarrito_compras/:idres/:iduser',(req,res)=>{
    const id = req.params.idcarrito_compras
    const idres = req.params.idres
    const iduser = req.params.iduser
    conexion.query('DELETE FROM carrito_compras WHERE idcarrito_compras =?; DELETE FROM ordenes_restaurante WHERE idcarrito_producto =?', [id,id], (error,results)=>{
        if(error){
            throw error
        }else{
            res.redirect('/RestauranteProfileUser/'+idres+"/"+iduser)
        }
    })
})

router.get('/edit/:idmenu',(req,res)=>{
    const idmenu = req.params.idmenu
    conexion.query('SELECT * FROM menu WHERE idmenu =?',[idmenu], (error,results)=>{
        if(error){
            throw error
        }else{
            res.render('Edit.ejs',{usuario:results[0]})
        }
    })
})

router.get('/Editarinfouser/:idusuarios',(req,res)=>{
    const idusuarios = req.params.idusuarios
    conexion.query('SELECT * FROM usuarios WHERE idusuarios =?',[idusuarios], (error,results)=>{
        if(error){
            throw error
        }else{
            res.render('Edit-infouser.ejs',{usuario:results[0]})
        }
    })
})

router.get('/Editarinfores/:idrestaurantes',(req,res)=>{
    const idrestaurantes = req.params.idrestaurantes
    conexion.query('SELECT * FROM restaurantes WHERE idrestaurantes =?',[idrestaurantes], (error,results)=>{
        if(error){
            throw error
        }else{
            res.render('Edit-infores.ejs',{usuario:results[0]})
        }
    })
})

router.get('/Editarfondo/:idrestaurantes',(req,res)=>{
    const idrestaurantes = req.params.idrestaurantes
    conexion.query('SELECT * FROM restaurantes WHERE idrestaurantes =?',[idrestaurantes], (error,results)=>{
        if(error){
            throw error
        }else{
            res.render('Edit-fondores.ejs',{usuario:results[0]})
        }
    })
})

router.get('/Registro',(req,res)=>{
    res.render('registro')
})

router.get('/Add-res/:idusuarios',(req,res)=>{
    const idusuarios = req.params.idusuarios
    conexion.query('SELECT * FROM usuarios WHERE idusuarios =?',[idusuarios], (error,results)=>{
        if(error){
            throw error
        }else{
            res.render('Add-res.ejs',{usuario:results[0]})
        }
    })
})

router.get('/Iniciouser',(req,res)=>{
    conexion.query('SELECT * FROM restaurantes; SELECT * FROM menu;', (error,results)=>{
        if(error){
            throw error
        }else{
            if(req.session.loggedin == true) {
                res.render('inicio-usuario', {name: req.session.idusuarios, img: req.session.user_img, res:results[0], menu: results[1]})
            }
        }
    })
})


router.get('/Perfil/:idusuarios',(req,res)=>{
    const idusuarios = req.params.idusuarios
    conexion.query('SELECT * FROM usuarios WHERE idusuarios =?; SELECT * FROM restaurantes WHERE iduser_res =?; SELECT * FROM dias_reserva WHERE iduser_reserva=?',[idusuarios,idusuarios,idusuarios], (error,results)=>{
        if(error){
            throw error
        }else{
            res.render('perfil-usuario.ejs',{usuario:results[0][0], res:results[1], reserva:results[2]})
        }
    })

})

router.get('/Agregar/:idrestaurantes/:idusuarios',(req,res)=>{
    const idrestaurantes = req.params.idrestaurantes
    const idusuarios = req.params.idusuarios
    conexion.query('SELECT * FROM restaurantes WHERE idrestaurantes =?; SELECT * FROM usuarios WHERE idusuarios =?',[idrestaurantes, idusuarios], (error,results)=>{
        if(error){
            throw error
        }else{
            res.render('add-menu.ejs',{usuario:results[0][0],res:results[1][0]})
            console.log(results[0])
        }
    })
})

const func = require('./controlers/funciones');
const { error } = require('console');

router.post("/save", func.save)

router.post("/Agregardias",upload.single("image"),(req,res)=>{
    const idres =  req.body.idres
    const iduser = req.body.iduser
    const estado = req.body.estado
    const fecha = req.body.fecha
    const hora = req.body.hora

    conexion.query('INSERT INTO dias_reserva SET ?', {idres_reserva:idres, estado_reserva:estado, fecha_reserva:fecha, hora_reserval:hora}, (error,results)=>{
        if(error){
            console.log(error)
        }else{
            console.log(fecha)
            res.redirect('/Restaurante/%20'+idres+"/%20"+iduser)
        }
    })
})

router.post("/Agregarrecomendacion",upload.single("image"),(req,res)=>{
    const recomendacion = req.body.recomendacion
    const iduser = req.body.iduser
    const imguser = req.body.imguser
    const name =  req.body.name

    conexion.query('INSERT INTO recomendaciones SET ?', {recomendacion:recomendacion, iduser_recomendacion:iduser, imguser_recomendacion:imguser, nombreuser_recomendacion:name}, (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/Blogsuser/'+iduser)
        }
    })
})

router.post("/Subir_resena",upload.single("image"),(req,res)=>{
    const reseña = req.body.resena
    const idres = req.body.idres
    const iduser = req.body.iduser
    const nameuser = req.body.nameuser
    const imguser = req.body.imguser

    conexion.query('INSERT INTO reseñas SET ?', {reseña:reseña, idres_reseña:idres, iduser_reseña: iduser, nombreuser_reseña:nameuser, imguser_reseña:imguser}, (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/RestauranteProfileUser/'+idres+"/"+iduser)
        }
    })
})

router.post("/savemenu",upload.single("image"),(req,res)=>{
    const nombre_menu = req.body.nombre_menu
    const descripcion_menu = req.body.descripcion_menu
    const img_menu = req.file.filename
    const precio_menu = req.body.precio_menu
    const idres_menu = req.body.idres_menu
    const iduser_menu= req.body.iduser_menu

    conexion.query('INSERT INTO menu SET ?', {nombre_menu:nombre_menu, descripcion_menu:descripcion_menu, img_menu: img_menu, precio_menu:precio_menu, idres_menu, iduser_menu:iduser_menu, fechacreacion:Date.now()}, (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/Restaurante'+"/%20"+idres_menu+"/%20"+iduser_menu)
        }
    })
})

router.post("/saveres",upload.single("image"),(req,res)=>{
    const name_res = req.body.name_res
    const hora_open = req.body.hora_open
    const hora_close =  req.body.hora_close
    const icono_res = req.file.filename
    const direccion_res = req.body.direccion_res
    const iduser_res = req.body.iduser_res

    conexion.query('INSERT INTO restaurantes SET ?', {name_res:name_res, hora_open:hora_open, hora_close: hora_close, icono_res:icono_res, direccion_res:direccion_res, iduser_res:iduser_res, iconofecha_res:Date.now()}, (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/Perfil/'+iduser_res)
        }
    })
})

router.post("/Tomar", upload.single("image"),(req,res)=>{
    const iduser = req.body.iduser
    const estado_reserva = req.body.estado_reserva
    const idreserva = req.body.idreserva
    const idres = req.body.idres

    conexion.query('UPDATE dias_reserva SET ? WHERE iddias_reserva =?', [{iduser_reserva:iduser, estado_reserva:estado_reserva}, idreserva], (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/Restaurante/'+idres+"/"+iduser)
        }
    })
})

router.post("/update", upload.single("image"),(req,res)=>{
    const id = req.body.idmenu
    const nombre_menu = req.body.nombre_menu
    const descripcion_menu = req.body.descripcion_menu
    const img_menu = req.file.filename
    const precio_menu = req.body.precio_menu

    conexion.query('UPDATE menu SET ? WHERE idmenu =?', [{nombre_menu:nombre_menu, descripcion_menu:descripcion_menu, img_menu:img_menu, precio_menu:precio_menu, fechacreacion:Date.now()}, id], (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/Restaurante')
        }
    })
})

router.post("/Aceptar", upload.single("image"),(req,res)=>{
    const estado = req.body.estado
    const iduser = req.body.idusuario
    const idres = req.body.idres_orden
    const idcarrito =  req.body.idcarrito

    conexion.query('UPDATE ordenes_restaurante SET ?; UPDATE carrito_compras SET ? WHERE idcarrito_compras =?', [{estado_orden:estado},{estado:estado},idcarrito], (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/Restaurante/%20'+idres+"/%20"+iduser)
        }
    })
})

router.post("/Rechazar", upload.single("image"),(req,res)=>{
    const estado = req.body.estado
    const iduser = req.body.idusuario
    const idres = req.body.idres_orden
    const idcarrito =  req.body.idcarrito

    conexion.query('UPDATE ordenes_restaurante SET ?; UPDATE carrito_compras SET ? WHERE idcarrito_compras =?; DELETE FROM ordenes_restaurante WHERE estado_orden = "Rechazado"', [{estado_orden:estado},{estado:estado},idcarrito], (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/Restaurante/%20'+idres+"/%20"+iduser)
        }
    })
})

router.post("/updateOrden", upload.single("image"),(req,res)=>{
    const idmenu = req.body.idmenu
    const nombre_menu = req.body.nombre_menu
    const precio_menu = req.body.precio_menu
    const img_menu = req.body.img_menu
    const idres_menu = req.body.idres_menu
    const idusuarios = req.body.name
    const name_res = req.body.name_res
    const direccion_user = req.body.direccion_user
    const nombre_user = req.body.nombre_user
    const telefono_user = req.body.telefono_user
    const img_user = req.body.img_user
    

    conexion.query('INSERT INTO carrito_compras SET ?;SET @last_id_in_table1 = LAST_INSERT_ID(); INSERT INTO ordenes_restaurante SET ?;SET @last_id_in_table2 = LAST_INSERT_ID(); UPDATE ordenes_restaurante SET idcarrito_producto = (@last_id_in_table1) WHERE idordenes_restaurante = @last_id_in_table2', [{nombre_producto:nombre_menu, imgmenu_producto:img_menu, precio_producto:precio_menu, idmenu_producto:idmenu, idusuario:idusuarios, nombreres_producto:name_res, idres_producto:idres_menu},{direccion_orden:direccion_user, nombrecliente_orden:nombre_user,  telefono_orden:telefono_user, imguser_orden:img_user, precio_orden:precio_menu, nombremenu_orden:nombre_menu, iduser_orden:idusuarios, idres_orden:idres_menu}], (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/RestauranteProfileUser/'+idres_menu+"/"+idusuarios)
        }
    })
})

router.post("/updateinfouser", upload.single("image"),(req,res)=>{
    const id = req.body.idusuarios
    const user_nombre = req.body.user_nombre
    const user_correo = req.body.user_correo
    const user_img = req.file.filename
    const user_direccion = req.body.user_direccion
    const user_telefono = req.body.user_telefono

    conexion.query('UPDATE usuarios SET ? WHERE idusuarios =?', [{user_nombre:user_nombre, user_correo:user_correo, user_img:user_img, user_direccion:user_direccion, user_telefono:user_telefono, user_imgfecha:Date.now()}, id], (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/Perfil/'+id)
        }
    })
})

router.post("/updateinfores", upload.single("image"),(req,res)=>{
    const id = req.body.idrestaurantes
    const name_res = req.body.name_res
    const hora_close = req.body.hora_close
    const icono_res = req.file.filename
    const hora_open = req.body.hora_open
    const direccion_res = req.body.direccion_res

    conexion.query('UPDATE restaurantes SET ? WHERE idrestaurantes =?', [{name_res:name_res, hora_close:hora_close, icono_res:icono_res, hora_open:hora_open, direccion_res:direccion_res, iconofecha_res:Date.now()}, id], (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/Restaurante/'+id)
        }
    })
})

router.post("/updatefondores", upload.single("image"),(req,res)=>{
    const id = req.body.idrestaurantes
    const fondo_res = req.file.filename

    conexion.query('UPDATE restaurantes SET ? WHERE idrestaurantes =?', [{fondo_res:fondo_res, fondofecha_res:Date.now()}, id], (error,results)=>{
        if(error){
            console.log(error)
        }else{
            res.redirect('/Restaurante/'+id)
        }
    })
})

module.exports = router