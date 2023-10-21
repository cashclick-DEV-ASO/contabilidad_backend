import { responde, fechaMySQL } from "../utils.js"
import db from "../DB/pool.js"

const qryEdoCta = "INSERT INTO edo_cta (periodo, archivo, id_cuenta) VALUES (?,?,?)"
const qryMovimientos = "INSERT INTO transaccion_banco (id_edo_cta, linea, informacion, fecha_creacion, fecha_valor, concepto, tipo, monto, id_layout) VALUES ?"

export class EdoCtaModel {
    static async insertaTransacciones(datos) {
        if (!datos) return sinDatos(`La función insertaTransacciones de la clase EdoCtaModel no recibió datos.`)

        let conexion = null
        let error = null
        let msg = "Transacciones insertadas correctamente."

        try {
            conexion = await db.getConnection()
            await conexion.beginTransaction()
            const { periodo, archivo, idCta } = datos
            const [resultadoEdoCta] = await conexion.query(qryEdoCta, [periodo, archivo, idCta])
            if (resultadoEdoCta.affectedRows == 0) throw new Error("No se logro insertar el estado de cuenta.")
            const idArchivo = resultadoEdoCta.insertId
            const valores = datos.movimientos.map(movimiento => {
                return [idArchivo, movimiento.linea, movimiento.informacion, fechaMySQL(movimiento.fechaCreacion), movimiento.fechaValor, movimiento.concepto, movimiento.tipo, movimiento.monto, movimiento.idLayout]
            })
            const [resultadoMov] = await conexion.query(qryMovimientos, [valores])
            if (resultadoMov.affectedRows == 0) throw new Error("No se logro insertar las transacciones.")
            await conexion.commit()
        } catch (e) {
            await conexion.rollback()
            error = e
            msg = "Error al insertar las transacciones."
        } finally {
            conexion.release()
        }
        return responde({ msg }, error)
    }

    sinDatos = (message = "") => {
        return responde(
            { msg: "No se proporcionaron datos para registrar." },
            {
                fecha: new Date(),
                message
            })
    }
}