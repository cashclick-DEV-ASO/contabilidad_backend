import express, { json } from "express"
import { configuracionCORS } from "./middlewares/cors.js"
import { validaSesion } from "./middlewares/sesion.js"
import "dotenv/config"

import { Modelos } from "./models/modelos.js"
import { loginRouter } from "./routes/login.js"
import { edoCtaRouter } from "./routes/edoCta.js"

const createApp = () => {
	if (!process.env.ORIGINS)
		return console.error("No se han definido los origenes aceptados")

	const HOST = process.env.HOST ?? "127.0.0.1"
	const PORT = process.env.PORT ?? null
	const SRV_URL = `${HOST}${PORT ? `:${PORT}` : ""}`
	const app = express()
	const modelos = new Modelos()

	// Middlewares
	app.use(json())
	app.use(configuracionCORS())
	app.use(validaSesion(modelos))
	app.disable("x-powered-by")

	// Rutas
	loginRouter(app, modelos)
	edoCtaRouter(app, modelos)

	app.get("/status", (req, res) =>
		res.status(200).json({ status: "OK", message: "Servidor en linea" })
	)

	// Manejo de errores
	app.use((err, req, res, next) => {
		console.log("Error")
		if (err)
			return res
				.status(500)
				.json({ status: "ERROR", message: err.message })
	})

	app.use((req, res) =>
		res.status(404).send("<h1>404</h1><p>Resourse not found</p>")
	)

	// Inicia el servidor
	app.listen(PORT, HOST.replace("http://", "").replace("https://", ""), () =>
		console.log(`Servidor backend en linea en: ${SRV_URL}`)
	)
}

createApp()
