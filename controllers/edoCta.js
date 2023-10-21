import { validaEdoCta } from "../schemas/edoCta.js"

export class EdoCtaController {
    constructor(edoCtaModel) {
        this.edoCtaModel = edoCtaModel
    }

    insertarTransacciones = async (req, res) => {
        const validacion = validaEdoCta(req.body)
        if (validacion.error) return res.status(400).json({ error: JSON.parse(validacion.error.message) })

        const resultado = await this.edoCtaModel.insertaTransacciones(validacion.data)
        if (resultado.success) return res.status(201).json(resultado)

        return res.status(500).json(resultado)
    }
}