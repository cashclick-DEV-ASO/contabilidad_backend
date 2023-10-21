import express, { json } from "express"
import { configuracionCORS } from "./middlewares/cors.js"
import { responde } from "./utils.js"
import "dotenv/config"

import { edoCtaRouter } from "./routes/edoCta.js"

const createApp = () => {
	const HOST = process.env.HOST ?? "0.0.0.0"
	const PORT = process.env.PORT ?? 0
	const app = express()

	app.use(json())
	app.use(configuracionCORS())
	app.disable("x-powered-by")

	app.get("/status", (req, res) => {
		res.status(200).json({ status: "OK", message: "Servidor en linea" })
	})

	edoCtaRouter(app)

	app.use((req, res) => res.status(404).send("<h1>404</h1><p>Resourse not found</p>"))
	app.use((err, req, res, next) => {
		console.error(err.stack)
		res.status(500).send("<h1>500</h1><p>Server error</p>")
	})
	app.listen(PORT, HOST, () => console.log(`Servidor en linea: http://${HOST}:${PORT}`))
}

createApp()