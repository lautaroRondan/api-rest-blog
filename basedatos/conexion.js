const mongoose = require("mongoose");


const conexion = async()=>{

    try{

    //    await mongoose.connect("mongodb://localhost:27017/mi_blog");
       await mongoose.connect("mongodb+srv://lauti:lutyluty8@api-rest-blog.s47xrmn.mongodb.net/mi_blog");
       console.log("conectado correctamente");

    }catch(error){
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}

module.exports={
    conexion
}