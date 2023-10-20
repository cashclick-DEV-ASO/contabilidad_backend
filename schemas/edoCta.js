import z from "zod"

const edoCtaSchema = z.object({
    periodo: z.number(),
    archivo: z.string(),
    idCta: z.number(),
    movimientos: z.array(z.object({
        linea: z.number(),
        informacion: z.string(),
        fechaCreacion: z.coerce.date(),
        fechaValor: z.coerce.date(), //.transform
        concepto: z.string(),
        tipo: z.string().max(1).toUpperCase(),
        monto: z.number(),
        idLayout: z.number()
    })).min(1)
})

export const validaEdoCta = datos => {
    return edoCtaSchema.safeParse(datos)
}