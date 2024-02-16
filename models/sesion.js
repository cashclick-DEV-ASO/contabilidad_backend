import { Modelo } from "./modelo.js"

const qrySesion = "SELECT vencimiento FROM sesion WHERE token = ?"
const qryActualizaSesion =
    "UPDATE sesion SET vencimiento = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE token = ?"

export class SesionModel extends Modelo {
    constructor(db) {
        super(db)
    }

    /**
     * @param {string} token - Token de sesión
     * @returns {object} Objeto JSON para enviar como respuesta
     * @description Valida que el token de sesión sea válido
     */
    async validaSesion(token) {
        let conexion = null
        let sesionCaducada = false
        let mensaje = "Sesión válida."
        let error = null

        if (!token)
            return console.log(
                "La función validaSesion de la clase SesionModel no recibió el token."
            )

        try {
            conexion = await this.db.getConnection()
            await conexion.beginTransaction()

            const [sesion] = await conexion.query(qrySesion, [token])
            if (sesion.length == 0) throw new Error("No se ha iniciado sesión.")
            if (sesion.length > 1) throw new Error("Token duplicado.")

            if (new Date() > sesion[0].vencimiento) throw new Error("Sesión expirada.")

            await conexion.query(qryActualizaSesion, [token])
            await conexion.commit()
        } catch (e) {
            if (conexion) conexion.rollback()
            error = e
            sesionCaducada = true
            mensaje = "Acceso denegado."
        } finally {
            if (conexion) conexion.release()
        }

        return this.respuesta(!sesionCaducada, mensaje, null, error, sesionCaducada)
    }
}
