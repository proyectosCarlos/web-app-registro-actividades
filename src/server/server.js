const express = require("express");
const path = require("path");
const cors = require("cors");

const startServer = (options) => {
  const { port, public_path = "public" } = options;

  const app = express();

  app.use(cors());
  app.use(express.static(public_path));

  app.get("/", (req, res) => {
    const indexPath = path.join(
      __dirname + `../../../${public_path}/index.html`
    );
    res.sendFile(indexPath);
  });

  app.listen(port, () => {});

  //crud usuarios
  app.get("/api/usuarios", (req, res) => {
    res.status(200).json({ message: "bienvenido usuario!" });
  });
};

module.exports = {
  startServer,
};
