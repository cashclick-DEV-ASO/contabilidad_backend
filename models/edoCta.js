import mysql from 'mysql2/promise'
import { responde } from '../utils.js'

const configuracion = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

const conexion = await mysql.createConnection(configuracion)

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

            if (dbResultado[0].affectedRows == 0) throw new Error("No se insertó el estado de cuenta.")

            datos.idArchivo = dbResultado[0].insertId
            return responde({ idCreado: datos.idArchivo })
        } catch (error) {
            return responde({ mensaje: "Error al insertar el estado de cuenta." }, error)
        }
    }

    /**
     * @param {number} id - ID del estado de cuenta a eliminar
     * @returns {object} Objeto JSON con el resultado de la operación
     */
    static async eliminaEdoCta(id) {
        if (!id) return sinDatos()

        try {
            const dbResultado = await conexion.query(
                `DELETE FROM edo_cta WHERE id = ?`,
                [id])

            return responde({ eliminado: dbResultado[0].affectedRows })
        } catch (error) {
            return responde({ mensaje: "Error al eliminar el estado de cuenta." }, error)
        }
    }

    /**
     * @param {object} datos - Objeto con las transacciones a insertar
     * @returns {object} Objeto JSON con el resultado de la operación
     */
    static async insertaMovimientos(datos) {
        if (!datos || datos.movimientos.length == 0) return sinDatos()
        let e
        const qry = "INSERT INTO transaccion_banco (id_edo_cta, linea, informacion, fecha_creacion, fecha_valor, concepto, tipo, monto, id_layout) VALUES ?"
        const valores = datos.movimientos.map(movimiento => {
            return [datos.idArchivo, movimiento.linea, movimiento.informacion, movimiento.fechaCreacion, movimiento.fechaValor, movimiento.concepto, movimiento.tipo, movimiento.monto, movimiento.idLayout]
        })
        try {
            await conexion.beginTransaction()
            const [response, meta] = await conexion.query(qry, [valores])
            await conexion.commit()

            return responde({ msg: "Transacciones insertadas correctamente." })
        } catch (error) {
            await conexion.rollback()
            e = error
        }
        return responde({ msg: "Error al insertar las transacciones." }, e)
    }

    sinDatos = (funcion = "") => {
        this.errorInfo.mensaje = "No se proporcionaron datos para registrar."
        return responde(this.errorInfo, {
            fecha: new Date(),
            modulo: "EdoCtaModel",
            funcion,
            message: "Los parametros requeridos no fueron proporcionados.",
        })
    }
}