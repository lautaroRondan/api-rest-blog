const fs = require('fs');
const path = require('path');
const Articulo = require('../modelos/Articulo');
const {validarArticulos} = require('../helpers/validar');

const prueba = (req, res) =>{

    return res.status(200).json({
        mensaje: 'mensaje de prueba en el controlador de articulos'
    });
};

const nombres = (req, res)=>{

    console.log("se ha ejecutado el endpoint probando");

    return res.status(200).json([{
        nombre:'lauti',
        apellido: 'rondan'
    },
    {
        nombre:'lauti',
        apellido: 'rondan'
    }
]);
};

const crear = (req, res)=>{

    //recoger todos los datos de post
    let parametros = req.body;

    //validar datos
    try{
        validarArticulos(parametros);

    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: 'faltan datos para enviar'
        });
    }

    //crear el objeto a guardar
    const articulo = new Articulo(parametros);

    //guardar articulo en la base de datos
    articulo.save((error, articuloGuardado)=>{

        if(error || !articuloGuardado){
            return res.status(400).json({
                status: "error",
                mensaje: 'no se ha guardado'
            });
        }

        //devolver el resultado
        return res.status(200).json({
            status: 'success',
            mensaje: 'se ha guardado la informacion',
            articuloGuardado
        });
    })

}

const listar = (req, res)=>{

    let consulta = Articulo.find({}).sort({fecha: -1}).exec((error, articulos) =>{

        if(error || !articulos){
            return res.status(404).json({
                status: "error",
                mensaje: 'no se ha podido encontrar datos'
            });
        }

        return res.status(200).send({
            status: "success",
            articulos
        })

    });
}

const uno = (req, res)=>{

    //recoger el id
    let id = req.params.id;

    //buscar articulos
    Articulo.findById(id, (error, articulo)=>{

        if(error || !articulo){
            return res.status(404).json({
                status: "error",
                mensaje: 'no se ha podido encontrar datos'
            });
        }
         
        return res.status(200).json({
            status: "success",
            articulo
        })

    })

}

const borrar = (req, res)=>{

    let id = req.params.id;

    Articulo.findOneAndDelete({_id: id}, (error, articuloBorrado)=>{

        if(error || !articuloBorrado){
            return res.status(500).json({
                status: "error",
                mensaje: "no se pudo borrar el articulo"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "se ha eliminado el articulo"
        });
    })
}



const editar = (req, res)=>{

    let id = req.params.id;

    let parametros = req.body;

    try{
        validarArticulos( parametros);
    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: 'faltan datos para enviar'
        });
}

    Articulo.findOneAndUpdate({_id: id}, parametros, {new: true}, (error, articuloActualizado)=>{

        if(error || !articuloActualizado){
            return res.status(500).json({
                status: "error",
                mensaje: "error al actualizar el articulo"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        })
    })
}

const subir =  (req, res)=>{

    if(!req.file && !req.files){
        return res.status(400).json({
            status: 'error',
            mensaje: 'peticion invalida'
        });
    }
    
    let archivo = req.file.originalname;

    let archivoSplit = archivo.split("\.");
    let archivoExtencion = archivoSplit[1];

    if(archivoExtencion != "png" && archivoExtencion != "jpg" &&
       archivoExtencion != "jpeg" && archivoExtencion != "gif"){

        fs.unlink(req.file.path, (error=>{
            return res.status(400).json({
                status: 'error',
                mensaje: 'imagen invalida'
            })
        }));

       }else{

        let id = req.params.id;

    
        Articulo.findOneAndUpdate({_id: id}, {imagen: req.file.filename}, {new: true}, (error, articuloActualizado)=>{
    
            if(error || !articuloActualizado){
                return res.status(500).json({
                    status: "error",
                    mensaje: "error al actualizar el articulo"
                });
            }
    
            return res.status(200).json({
                status: "success",
                file: req.file,
                nombre:articuloActualizado
            })
        })
       }

}

const imagen = (req, res)=>{
    let fichero = req.params.fichero;

    let rutaFisica = './imagenes/articulos/'+fichero;

    fs.stat(rutaFisica, (error, existe)=>{
        if(existe){
            return res.sendFile(path.resolve(rutaFisica));
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "no se ha podido mostrar la imagen",
                ruta: rutaFisica,
                error: error
            });
        }
    })

}

const buscador= (req, res)=>{

    let busqueda = req.params.busqueda;

    Articulo.find({"$or":[
        {"titulo":{"$regex": busqueda, "$options": "i"}},
        {"contenido":{"$regex": busqueda, "$options": "i"}},
        
    ]})
        .sort({fecha: -1})
        .exec((error, articulos)=>{
            if(error || !articulos || articulos.length <= 0){
                return res.status(404).json({
                    status: "error",
                    mensaje: "no se ha encontrado ningun articulo"
                })
            }

            res.status(200).json({
                status: "success",
                articulos
            })
        })

}

module.exports = {
    prueba,
    nombres,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}