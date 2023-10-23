import { Router } from "express"
import { LoginController } from "../controllers/login.js"

/**
 * @param {Object} app - Express app
 * @param {Modelos} modelos - Catalogo con los modelos a utilizar
 * @returns {void} Router de login
 */
export const loginRouter = (app, modelos) => {
    const enrutador = Router()
    const controlador = new LoginController(modelos.login)

    enrutador.post("/", controlador.login)

    app.use("/login", enrutador)
}