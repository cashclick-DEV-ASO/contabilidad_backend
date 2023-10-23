import validaciones from "../schemas/edoCta.js"

export class EdoCtaController {
    constructor(modelo) {
        this.modelo = modelo
    }

    async insertarTransacciones(req, res) {
        const validacion = validaciones.insertaTransacciones(req.body)
        if (validacion.error) return res.status(400).json({ error: JSON.parse(validacion.error.message) })

        const resultado = await this.modelo.insertaTransacciones(validacion.data)
        if (resultado.success) return res.status(201).json(resultado)

        return res.status(500).json(resultado)
    }
}