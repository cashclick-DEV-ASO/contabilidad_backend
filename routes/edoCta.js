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

	edoCtaRouter.get("/", (req, res) => {
		return res.status(200).json({ success: true })
	})
	edoCtaRouter.post("/", edoCtaController.insertarTransacciones)
	// edoCtaRouter.post("/", edoCtaController.create)

	app.use("/edo_cta", edoCtaRouter)
}