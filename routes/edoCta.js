import { Router } from "express"
import { EdoCtaController } from "../controllers/edoCta.js"

/**
* @param {Object} app - Express app
* @param {Modelos} modelos - Catalogo con los modelos a utilizar
* @returns {void} Router de estado de cuenta
*/
export const edoCtaRouter = (app, modelos) => {
	const enrutador = Router()
	const controlador = new EdoCtaController(modelos.edoCta)

	enrutador.post("/", controlador.insertarTransacciones)
	// enrutador.post("/", controlador.create)

	app.use("/edo_cta", enrutador)
}