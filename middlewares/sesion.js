import { SesionContoller } from "../controllers/sesion.js"

/**
 * @param {Modelos} modelos - Catalogo con los modelos a utilizar
 * @returns {function} Función que valida la sesión
 * @description Valida que el token de sesión sea válido
 */
export const validaSesion = modelos => {
	const listaBlanca = ["/login", "/status"]
	const controlador = new SesionContoller(modelos.sesion)

	// Regresa una función que valida la sesión
	return async (req, res, next) => {
		if (listaBlanca.includes(req.path)) return next()

		if (await controlador.validaSesion(req, res)) next()
	}
}
