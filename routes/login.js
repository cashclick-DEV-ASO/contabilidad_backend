import { Router } from "express"
import { LoginController } from "../controllers/login.js"

/**
 * Define las rutas y controladores para el login.
 * @param {Object} app - Objeto de la aplicación Express.
 * @param {Object} modelos - Objeto con los modelos de la base de datos.
 * @returns {void}
 */
export const loginRouter = (app, modelos) => {
	const enrutador = Router()
	const controlador = new LoginController(modelos.login)

	enrutador.post("/", controlador.login)

	app.use("/login", enrutador)
}
