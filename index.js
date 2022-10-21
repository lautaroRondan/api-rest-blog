const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

// inicializar app
console.log("app de node arrancada");

// conectar a la base de datos
conexion();

// crear servidor node
const app = express();
const puerto = 3900;

// configurar cors
app.use(cors());

// convertir body a objeto js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// rutas
const rutas_articulo = require("./rutas/articulo");

app.use("/api", rutas_articulo);

//rutas de pruebas hardcodeadas
app.get("/probando", (req, res)=>{

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
});

// crear servidor y escuchar peticiones
app.listen(puerto, ()=>{
    console.log("servidor corriendo en el puerto "+puerto);
});