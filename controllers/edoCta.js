import { validaEdoCta } from "../schemas/edoCta.js"

export class EdoCtaController {
    constructor(edoCtaModel) {
        this.edoCtaModel = edoCtaModel
    }
    

    insertarTransacciones = async (req, res) => {
        const valores = req.body

        const validacion = validaEdoCta(valores)

        if (!validacion.success)
            return res.status(400).json({ error: JSON.parse(validacion.error.message) })

        let resultado = {
            archivo: await this.edoCtaModel.insertaEdoCta(valores),
            movimientos: {}
        }

        if (resultado.archivo.success) {
            resultado.movimientos = await this.edoCtaModel.insertaMovimientos(valores)
            if (resultado.movimientos.success) return res.status(201).json(resultado)

            const reverso = await this.edoCtaModel.eliminaEdoCta(resultado.archivo.informacion.idCreado)
            if (reverso.success)
                resultado.archivo.informacion.mensaje = `Esta operación se revirtio al no poder insertar los movimientos. (Filas Eliminadas: ${reverso.informacion.eliminado})`
            else
                resultado = {
                    ErrorCritico: "Ocurrió un error al insertar los movimientos y no se pudo revertir la operación."
                }
        }

        return res.status(500).json(resultado)
    }
}