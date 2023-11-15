import { Modelo } from "./modelo.js"

export class NoConfigModelo extends Modelo {
	constructor(db) {
		super(db)
	}

	async post(datos) {
		if (!datos)
			return this.responde({ mensaje: "No se recibieron datos." }, true)

		this.mensaje = "Consulta ejecutada correctamente."

		let resultado = null

		try {
			this.conexion = await this.db.getConnection()
			const { query, parametros } = datos
			resultado = await this.conexion.query(query, parametros ?? [])
			resultado = resultado[0] ?? []
		} catch (error) {
			this.error = error
			this.mensaje = "Error al ejecutar la consulta."
		} finally {
			if (this.conexion) this.conexion.release()
		}

		return this.responde({ mensaje: this.mensaje, resultado }, this.error)
	}

	async get(qry) {
		this.mensaje = "Consulta ejecutada correctamente."

		let resultado = null

		try {
			this.conexion = await this.db.getConnection()
			resultado = await this.get(qry)
		} catch (error) {
			this.error = e
			this.mensaje = "Error al ejecutar la consulta."
		} finally {
			if (this.conexion) this.conexion.release()
		}

		return this.responde({ mensaje: this.mensaje, resultado }, this.error)
	}
}
