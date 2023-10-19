import express, { json } from "express"
import { corsRules } from "./middlewares/cors.js"
import "dotenv/config"

import { edoCtaRouter } from "./routes/edoCta.js"

const createApp = () => {
	const HOST = process.env.API_HOST ?? "localhost"
	const PORT = process.env.PORT ?? 0
	const app = express()

	app.use(json())
	app.use(corsRules())
	app.disable("x-powered-by")

	edoCtaRouter(app)

	app.get("/status", (req, res) => {
		res.status(200).json({ status: "OK" })
	})

	app.listen(PORT, () => {
		console.log(`Servidor en linea: http://${HOST}:${PORT}`)
	})
}

createApp()