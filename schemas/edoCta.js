import z from "zod"

const edoCtaSchema = z.object({
    periodo: z.int({
        required_error: "El periodo es requerido.",
        invalid_type_error: "El periodo debe ser numerico."
    }),
    archivo: z.string(),
    id_cta: z.int(),
    fechaCaptura: z.date().default(new Date()),
})

export const validaEdoCta = datos => {
    return edoCtaSchema.safeParse(datos)
}