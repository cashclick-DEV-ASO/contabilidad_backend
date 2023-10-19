import mysql from 'mysql2/promise'
import { responde } from '../utils.js'

const configuracion = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

const conexion = await mysql.createConnection(JSON.parse(configuracion))

export class EdoCtaModel {
    static errorInfo = {
        modulo: "EdoCtaModel",
        funcion: "",
        mensaje: ""
    }

    /**
     * @param {object} datos - Objeto con los datos para insertar el estado de cuenta
     * @returns {object} Objeto JSON con el resultado de la operación
     */
    static async insertaEdoCta(datos) {
        if (!datos) return sinDatos()

        try {
            const { periodo, archivo, idCta } = datos
            const dbResultado = await conexion.query(
                `INSERT INTO edo_cta (periodo, archivo, id_cuenta) VALUES (?,?,?)`,
                [periodo, archivo, idCta])
            return responde({ idCreado: dbResultado[0].insertId })
        } catch (error) {
            this.errorInfo.mensaje = "Error al insertar el estado de cuenta."
            return responde(this.errorInfo, error)
        }
    }

    /**
     * @param {object} datos - Objeto con las transacciones a insertar
     * @returns {object} Objeto JSON con el resultado de la operación
     */
    static async insertamovimientos(datos) {
        if (!datos) return sinDatos()
        //`INSERT INTO transaccion_banco (id_edo_cta, linea, informacion, fecha_creacion, fecha_valor, concepto, tipo, monto, id_layout)
        try {
            const { id_edo_cta, fecha, descripcion, cargo, abono } = datos
            const dbResultado = await conexion.query(
                `INSERT INTO transaccion_banco (id_edo_cta, linea, informacion, fecha_creacion, fecha_valor, concepto, tipo, monto, id_layout) VALUES (?,?,?,?,?)`,
                [id_edo_cta, fecha, descripcion, cargo, abono])
            return responde({ idCreado: dbResultado[0].insertId })
        } catch (error) {
            this.errorInfo.mensaje = "Error al insertar las transacciones."
            return responde(this.errorInfo, error)
        }
    }

    sinDatos = () => {
        this.errorInfo.mensaje = "No se proporcionaron datos."
        return responde(this.errorInfo, {
            modulo: "EdoCtaModel",
            message: "El parametro requerido no fue proporcionado.",
            fecha: new Date()
        })
    }
}