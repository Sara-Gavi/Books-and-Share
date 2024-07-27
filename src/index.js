// IMPORTAR BIBLIOTECAS

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

// CREAR VARIABLES

const server = express();
const port = 3000;

// CONFIGURACIÓN

server.use(cors());
server.use(express.json({ limit: "25mb" }));

// CONFIGURACIÓN DE MYSQL

const getConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_SCHEMA || "libros_db",
  });

  await connection.connect();

  console.log(
    `conexion establecida con la base de datos (identificador=${connection.threadId})`
  );
  return connection;
};

// ARRANCAR
server.listen(port, () => {
  console.log(`Servidor iniciado escuchando en http://localhost:${port}`);
});

// DEFINIR ENDPOINTS

server.get("/", function (req, res) {
  res.send("Hello World!");
});

// DEFINIR SERVIDORES ESTÁTICOS
// DEFINIR PÁGINA 404
