import { Modelo } from "./modelo.js"

const qryEdoCta = "INSERT INTO edo_cta (periodo, archivo, id_cuenta) VALUES (?,?,?)"
const qryMovimientos = "INSERT INTO transaccion_banco (id_edo_cta, linea, informacion, fecha_creacion, fecha_valor, concepto, tipo, monto, id_layout) VALUES ?"

export class EdoCtaModel extends Modelo {
    constructor(db) { super(db) }

    static async insertaTransacciones(datos) {
        if (!datos) return this.sinDatos("La función insertaTransacciones de la clase EdoCtaModel no recibió datos.")

        this.mensaje = "Transacciones agreagadas correctamente."

        try {
            this.conexion = await this.db.getConnection()
            await this.conexion.beginTransaction()
            const { periodo, archivo, idCta } = datos
            const [resultadoEdoCta] = await this.conexion.query(qryEdoCta, [periodo, archivo, idCta])
            if (resultadoEdoCta.affectedRows == 0) throw new Error("No se logro insertar el estado de cuenta.")
            const idArchivo = resultadoEdoCta.insertId
            const valores = datos.movimientos.map(movimiento => {
                return [idArchivo, movimiento.linea, movimiento.informacion, this.fechaMySQL(movimiento.fechaCreacion), this.fechaMySQL(movimiento.fechaValor), movimiento.concepto, movimiento.tipo, movimiento.monto, movimiento.idLayout]
            })
            const [resultadoMov] = await conexion.query(qryMovimientos, [valores])
            if (resultadoMov.affectedRows == 0) throw new Error("No se logro insertar las transacciones.")
            await this.conexion.commit()
        } catch (e) {
            if (this.conexion) this.conexion.rollback()
            this.error = e
            this.mensaje = "Error al insertar las transacciones."
        } finally {
            if (this.conexion) this.conexion.release()
        }

        return this.responde({ mensaje: this.mensaje }, this.error)
    }
}