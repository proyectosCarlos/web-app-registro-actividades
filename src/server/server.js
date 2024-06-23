const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql");


const connection = mysql.createConnection({
  host: "webdevdb.ctmwm6g6ahez.us-east-1.rds.amazonaws.com",
  user: "root",
  password: "2191359Slash",
  database: "deWeb",
});

function conectarDB() {
  connection.connect(err => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
    }
    console.log('Conectado a la base de datos MySQL');
  });
}

function desconectarDB() {
  connection.end(err => {
    if (err) {
      console.error('Error al cerrar la conexión:', err);
      return;
    }
    console.log('Conexión a la base de datos cerrada');
  });
}



const startServer = (options) => {
  const { port, public_path = "public" } = options;

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


  app.use(cors({ origin: "*" }));
  app.use(express.static(public_path));

  app.get("/", (req, res) => {
    const indexPath = path.join(
      __dirname + `../../../${public_path}/index.html`
    );
    res.sendFile(indexPath);
  });

  app.listen(port, () => {});

  //crud usuarios

  //crear usuarios
  app.post("/api/registrar/usuario", async (req, res) => { 

    const { nombre, apellido, correo, password } = req.body;

    connection.query(
      `SELECT count(nombre) as cantidad FROM usuarios WHERE correo = ?`, correo,
      async function  (err, results) {
        if (err) {
          res
            .status(400)
            .send({ message: `Error en la creacion del usuario ${err}` });
          return;
        }
        if(results[0].cantidad == 0){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptadoPassword = await bcrypt.hash(password, salt);

    connection.query(
            `INSERT INTO usuarios (nombre, apellido, correo, password ) VALUES ('${nombre}', '${apellido}', '${correo}', '${encryptadoPassword}')`,
            function (err, results) {
              if (err) {
                res
                  .status(400)
                  .send({ message: `Error en la creacion del usuario ${err}` });
                return;
              }
              res.status(200).json({estado: 'ok', message: `Usuario creado correctamente` });
         
            }
              );        
      }
      else{
        res.status(200).json({estado:'error', message: `ya existe un usuario con este correo` });
      }
    }
    );

  });


  app.post("/api/logear/usuario", async(req, res)=>{ 

    const { correo, password } = req.body;

    connection.query(
      `SELECT * FROM usuarios WHERE correo = ?`, correo,
      function (err, results) {
        if (err) {
          res
            .status(400)
            .send({ message: `Error en la creacion del usuario ${err}` });
          return;
        }
        

          if(results.length == 0){
            res
            .status(200)
            .send({estado:'error', message: `No existe un usuario con esta cuenta de correo, por favor registrate` });
          }
          else{
            bcrypt.compare(password, results[0].password, function(err, result) {
              // res.status(200).send(result);
              if(result == true){
                res
                .status(200)
                .send({estado:'ok', message: `Bienvenido` });
              }else{
                res
                .status(200)
                .send({estado:'error', message: `Error en la contraseña ${correo}`  });
              }
             
          });
          }
        
        
      }
    );

  })




  app.get('/api/consultar/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
};

module.exports = {
  startServer,
};
