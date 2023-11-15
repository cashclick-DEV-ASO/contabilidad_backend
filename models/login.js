import { Modelo } from "./modelo.js"
import crypto from "node:crypto"

const qryLogin = `SELECT * FROM usuario WHERE usuario = ? AND cast(aes_decrypt(password, '${process.env.DB_SECRET_KEY_PASS}') AS char) = ?`
const qrySesion = "INSERT INTO sesion (id_usuario, token) VALUES (?, ?)"
const qryLoginFallido =
	"INSERT INTO intento_acceso (usuario, pass, ip, host) VALUES (?, ?, ?, ?)"
const qryMapa =
	"SELECT m.* FROM mapa_navegacion_frontend m WHERE m.id IN (SELECT pf.id_mapa FROM permiso_frontend pf WHERE pf.id_perfil = ?) OR m.permanente = 1 ORDER BY padre, orden;"

export class LoginModel extends Modelo {
	constructor(db) {
		super(db)
	}

	async login(datos) {
		if (!datos)
			return this.sinDatos(
				"La función login de la clase LoginModel no recibió datos."
			)

		this.mensaje = "Sesión iniciada."

		try {
			this.conexion = await this.db.getConnection()
			await this.conexion.beginTransaction()
			const [resultado] = await this.conexion.query(qryLogin, [
				datos.user,
				datos.pass,
			])
			if (resultado.length == 0) return await this.loginFallido(datos)

			this.token = crypto.randomUUID()
			this.nombre = resultado[0].nombre
			const usuario = resultado[0].id
			const [resultadoSesion] = await this.conexion.query(qrySesion, [
				usuario,
				this.token,
			])

			if (resultadoSesion.affectedRows == 0) {
				this.token = null
				throw new Error("No se creo la sesión.")
			}

			const [mapa] = await this.conexion.query(
				qryMapa,
				resultado[0].id_perfil
			)
			const mapaJSON = this.construirMapa(mapa)
			if (!mapaJSON)
				throw new Error("Ocurrió un error al construir el mapa.")

			this.mapa = JSON.stringify(mapaJSON)

			await this.conexion.commit()
		} catch (e) {
			if (this.conexion) await this.conexion.rollback()
			this.error = e
			this.mensaje = "Error al autenticar al usuario."
		} finally {
			if (this.conexion) this.conexion.release()
		}

		return this.responde(
			{
				mensaje: this.mensaje,
				token: this.token,
				nombre: this.nombre,
				mapa: this.mapa,
			},
			this.error
		)
	}

	async loginFallido(datos, mensaje = null) {
		if (!datos)
			return this.sinDatos(
				"La función loginFallido de la clase LoginModel no recibió datos."
			)

		this.mensaje = mensaje || "Credenciales incorrectas."

		try {
			this.conexion = await this.db.getConnection()
			await this.conexion.beginTransaction()
			const [resultado] = await this.conexion.query(qryLoginFallido, [
				datos.user,
				datos.pass,
				datos.ip,
				datos.host,
			])
			if (resultado.length == 0)
				throw new Error({
					error: "No se inserto el intento de acceso.",
					datos,
				})
			await this.conexion.commit()
			this.error = { mensaje: "Intento de acceso fallido." }
		} catch (e) {
			if (this.conexion) this.conexion.rollback()
			this.error = e
		} finally {
			if (this.conexion) this.conexion.release()
		}

		return this.responde({ mensaje: this.mensaje }, this.error)
	}

	construirMapa(registros, padre = "") {
		const resultado = {}

		registros.forEach(registro => {
			const padreR = registro.padre ?? ""
			if (this.compararTextos(padreR, padre)) {
				resultado[registro.grupo] = {
					titulo: registro.titulo,
					vista:
						registro.vista ??
						this.construirMapa(registros, registro.grupo),
				}
			}
		})

		return resultado
	}

	compararTextos(texto1, texto2) {
		if (texto1 == null || texto2 == null) {
			return texto1 == texto2
		}

		const normalizar = texto =>
			texto
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "") // quita las marcas diacríticas
				.replace(/_/g, " ")

		return normalizar(texto1) === normalizar(texto2)
	}
}
