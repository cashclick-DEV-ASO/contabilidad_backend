import { Router } from "express"
import { EdoCtaController } from "../controllers/edoCtas.js"
import { defaultModel } from "../models/edoCta.js"

export const edoCtaRouter = ({ app, edoCtaModel = defaultModel }) => {

	const edoCtaRouter = Router()

	const edoCtaController = new EdoCtaController({ edoCtaModel })

	edoCtaRouter.get("/", edoCtaController.getAll)
	edoCtaRouter.post("/", edoCtaController.create)

	edoCtaRouter.get("/:id", edoCtaController.getById)
	edoCtaRouter.delete("/:id", edoCtaController.delete)
	edoCtaRouter.patch("/:id", edoCtaController.update)

	app.use("/edo_cta", edoCtaRouter)
}