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
		if (!token)
			return this.sinDatos(
				"La función validaSesion de la clase SesionModel no recibió el token."
			)

		try {
			this.conexion = await this.db.getConnection()
			await this.conexion.beginTransaction()

			const [sesion] = await this.conexion.query(qrySesion, [token])
			if (sesion.length == 0) throw new Error("No se ha iniciado sesión.")
			if (sesion.length > 1) throw new Error("Token duplicado.")

			if (new Date() > sesion[0].vencimiento)
				throw new Error("Sesión expirada.")
			await this.conexion.query(qryActualizaSesion, [token])
			await this.conexion.commit()
		} catch (e) {
			if (this.conexion) this.conexion.rollback()
			this.error = e
			this.sesionCaducada = true
			this.mensaje = "Acceso denegado."
		} finally {
			if (this.conexion) this.conexion.release()
		}

		return this.responde(
			{ mensaje: this.mensaje, sesionCaducada: this.sesionCaducada },
			this.error,
			false
		)
	}
}
