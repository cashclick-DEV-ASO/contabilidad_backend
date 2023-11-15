import { Router } from "express"
import { NoConfigController } from "../controllers/noConfig.js"

/**
 * Define las rutas y controladores para las consultas que no requieren configuración previa.
 * @param {Object} app - Objeto de la aplicación Express.
 * @param {Object} modelos - Objeto con los modelos de la base de datos.
 * @returns {void}
 */
export const noConfig = (app, modelos) => {
	const enrutador = Router()
	const controlador = new NoConfigController(modelos.noConfig)

	enrutador.post("/", controlador.postQuery)
	enrutador.get("/", controlador.getQuery)
	enrutador.patch("/", controlador.postQuery)

	app.use("/noConfig", enrutador)
}
