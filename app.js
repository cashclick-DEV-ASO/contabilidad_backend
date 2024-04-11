import express, { json } from "express"
import { configuracionCORS } from "./middlewares/cors.js"
import { validaSesion } from "./middlewares/sesion.js"
import cookieParser from "cookie-parser"
import "dotenv/config"

import { Modelos } from "./models/modelos.js"
import { loginRouter } from "./routes/login.js"
import { edoCtaRouter } from "./routes/edoCta.js"
import { noConfig } from "./routes/noConfig.js"

const createApp = () => {
    if (!process.env.ORIGINS) return console.error("No se han definido los orígenes aceptados")

    const HOST = process.env.HOST ?? "127.0.0.1"
    const PORT = process.env.PORT ?? null
    const SRV_URL = `${HOST}${PORT ? `:${PORT}` : ""}`
    const app = express()
    const modelos = new Modelos()

    // Middlewares
    app.use(json({ limit: "50mb" }))
    app.use(cookieParser())
    app.use(configuracionCORS())
    app.use(validaSesion(modelos))
    app.options("*", configuracionCORS())
    app.disable("x-powered-by")

    // Rutas
    loginRouter(app, modelos)
    edoCtaRouter(app, modelos)
    noConfig(app, modelos)

    app.get("/status", (req, res) =>
        res.status(200).json({ status: "OK", message: "Servidor en linea" })
    )

    // Rutas de error
    app.use((err, req, res, next) => {
        if (!err) return res.status(404).send("<h1>404</h1><p>Resourse not found</p>")

        console.log(`Error: ${err.message}`)
        res.status(500).json({
            success: false,
            mensaje: `Usted no debería estar aquí.\n${err.message ? `Error:  ${err.message}` : ""}`
        })
    })

    // Inicia el servidor
    app.listen(PORT, HOST.replace("http://", "").replace("https://", ""), () =>
        console.log(`Servidor backend en linea en: ${SRV_URL}`)
    )
}

createApp()