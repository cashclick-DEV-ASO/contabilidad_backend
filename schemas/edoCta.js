import z from "zod"

const trnSchema = z.object({
    linea: z.number(),
    informacion: z.string(),
    fechaCreacion: z.coerce.date().transform(fecha => fecha.toISOString().slice(0, 10)),
    fechaValor: z.coerce.date().transform(fecha => fecha.toISOString().slice(0, 10)),
    concepto: z.string(),
    tipo: z.string().max(1).toUpperCase(),
    monto: z.number(),
    idLayout: z.number(),
})

const edoCtaSchema = z.object({
    periodo: z.number(),
    archivo: z.string(),
    idCta: z.number(),
    movimientos: z.array(trnSchema).min(1)
})

export const validaEdoCta = datos => edoCtaSchema.safeParse(datos)