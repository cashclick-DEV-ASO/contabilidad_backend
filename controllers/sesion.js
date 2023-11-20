import { validaToken } from "../schemas/sesion.js"

/**
 * @param {Modelos} modelos - Catalogo con los modelos a utilizar
 */
export class SesionContoller {
	constructor(modelo) {
		this.modelo = modelo
	}

	/**
	 * @param {Request} req - Objeto de tipo Request
	 * @param {Response} res - Objeto de tipo Response
	 * @returns {Response} Objeto de tipo Response
	 * @description Valida que el token de sesión sea válido
	 */
	async validaSesion(req, res) {
		const token =
			req.cookies.TOKEN ?? req.headers["token"] ?? req.headers["authorization"] ?? ""

		const validacion = validaToken({ token })
		if (validacion.error) {
			await res
				.status(401)
				.send(
					this.modelo.responde(
						{
							mensaje: "El token no es valido.",
							sesionCaducada: true,
						},
						`${new Date().toISOString()} - Se intento acceder con un token de formato diferente: ${token}`
					)
				)
				.end()
			return false
		}

		const resultado = await this.modelo.validaSesion(token)

		if (!resultado.success) {
			await res.status(401).send(resultado).end()
			return false
		}

		return true
	}
}
