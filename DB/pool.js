import mysql from "mysql2/promise"

const configuracion = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
}

const pool = mysql.createPool(configuracion)

export default pool