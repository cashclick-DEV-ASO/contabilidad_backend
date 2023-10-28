import { validaToken } from "../schemas/sesion.js"

/**
 * @param {Modelos} modelos - Catalogo con los modelos a utilizar
*/
export class SesionContoller {
    constructor(modelo) {
        this.modelo = modelo
    }

    /**
     * @param {Request} req - Objeto de tipo Request
     * @param {Response} res - Objeto de tipo Response
     * @returns {Response} Objeto de tipo Response
     * @description Valida que el token de sesión sea válido
     */
    async validaSesion(req, res) {
        const token = req.headers["token"]
        const validacion = validaToken({ token })
        if (validacion.error) return await res.status(401).send("<h1>401</h1><p>Recurso no autorizado.</p>")

        const resultado = await this.modelo.validaSesion(token)
        if (!resultado.success) return await res.status(401).send("<h1>401</h1><p>Se requiere inicio de sesión.</p>")
    }
}