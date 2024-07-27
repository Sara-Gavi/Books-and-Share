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

// DEFINIR ENDPOINTS

//Endpoint para obtener todos los libros
server.get("/api/books", async (req, res) => {
  try {
    const conn = await getConnection();
    const queryGetBooks = "SELECT * FROM books;";
    const [results] = await conn.query(queryGetBooks);
    conn.end();
    res.json({ info: { count: results.length }, results });
  } catch (error) {
    res.json({ success: false, error: "UPS! ha ocurrido un error" });
  }
});

//Endpoint para obtener un libro por si ID
server.get("/api/books/:id", async (req, res) => {
  try {
    const conn = await getConnection();
    const queryGetBook = "SELECT * FROM books WHERE id= ?;";
    const [book] = await conn.query(queryGetBook, [req.params.id]);
    conn.end();

    if (book.length === 0) {
      res.status(404).json({ error: "Oh! No hemos encontrado tu libro" });
      return;
    }
    res.json(book[0]);
  } catch (error) {
    res.json({ success: false, error: "UPS! ha ocurrido un error" });
  }
});

//Endpoint para agregar un nuevo libro
server.post("/api/books", async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.author ||
      !req.body.genre ||
      !req.body.synopsis
    ) {
      res.status(400).json({
        success: false,
        message: "¡HEY! Todos los campos son obligatorios",
      });
      return;
    }
    const conn = await getConnection();
    const insertBook =
      "INSERT INTO books (title, author, genre, synopsis) VALUES (?,?,?,?)";
    const [insertResult] = await conn.execute(insertBook, [
      req.body.title,
      req.body.author,
      req.body.genre,
      req.body.synopsis,
    ]);
    conn.end();
    res.json({
      success: true,
      id: insertResult.insertId,
      message: "¡Bien! Nuevo libro",
    });
  } catch (error) {
    res.json({ success: false, error: "UPS! ha ocurrido un error" });
  }
});
// DEFINIR SERVIDORES ESTÁTICOS
// DEFINIR PÁGINA 404

server.get("*", function (req, res) {
  res.status(404).send("Página no encontrada");
});

// ARRANCAR
server.listen(port, () => {
  console.log(`Servidor iniciado escuchando en http://localhost:${port}`);
});
