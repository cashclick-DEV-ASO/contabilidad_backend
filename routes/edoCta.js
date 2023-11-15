import { Router } from "express"
import { EdoCtaController } from "../controllers/edoCta.js"

/**
 * Define las rutas y controladores para el endpoint de estado de cuenta.
 * @param {Object} app - Objeto de la aplicación Express.
 * @param {Object} modelos - Objeto con los modelos de la base de datos.
 * @returns {void}
 */
export const edoCtaRouter = (app, modelos) => {
	const enrutador = Router()
	const controlador = new EdoCtaController(modelos.edoCta)

	enrutador.post("/", controlador.insertarTransacciones)
	// enrutador.post("/", controlador.create)

	app.use("/edo_cta", enrutador)
}
