import { validaEdoCta } from "../schemas/edoCta.js"

export class EdoCtaController {
    constructor({ edoCtaModel }) {
        this.edoCtaModel = edoCtaModel
    }

    insert = (req, res) => {
        const { valores } = req.body
        const validacion = validaEdoCta(valores)
        
        if (!validacion.success)
            return res.status(400).json({ error: JSON.parse(validacion.error.message) })

        res.json(this.edoCtaModel.insert({ valores }))
    }
}