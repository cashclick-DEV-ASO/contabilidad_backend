import { validaEdoCta } from "../schemas/edoCta.js"

export class EdoCtaController {
    constructor(edoCtaModel) {
        this.edoCtaModel = edoCtaModel
    }

    
    insertarTransacciones = (req, res) => {
        const valores = req.body
        const validacion = validaEdoCta(valores)

        if (!validacion.success)
            return res.status(400).json({ error: JSON.parse(validacion.error.message) })

        const resultado = {
            archivo: undefined,
            movimientos: undefined
        }

        resultado.archivo = this.edoCtaModel.insertaEdoCta(valores)

        if (resultado.archivo.success) {
            resultado.movimientos = this.edoCtaModel.insertamovimientos(valores)
            if (resultado.movimientos.success)
                return res.status(201).json(resultado)
            resultado.movimientos.informacion = transacciones.informacion
        }

        return res.status(500).json(resultado)
    }
}