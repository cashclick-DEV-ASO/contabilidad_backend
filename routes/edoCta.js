import { Router } from "express"
import { EdoCtaController } from "../controllers/edoCta.js"
import { EdoCtaModel as defaultModel } from "../models/edoCta.js"

/**
* @param {Object} app - Express app
* @param {Object} edoCtaModel - Modelo de estado de cuenta
* @returns {void} Router de estado de cuenta
*/
export const edoCtaRouter = (app, edoCtaModel = defaultModel) => {
	const edoCtaRouter = Router()
	const edoCtaController = new EdoCtaController(edoCtaModel)

	edoCtaRouter.post("/", edoCtaController.insertarTransacciones)
	// edoCtaRouter.post("/", edoCtaController.create)

	// edoCtaRouter.get("/:id", edoCtaController.getById)
	// edoCtaRouter.delete("/:id", edoCtaController.delete)
	// edoCtaRouter.patch("/:id", edoCtaController.update)

	app.use("/edo_cta", edoCtaRouter)
}