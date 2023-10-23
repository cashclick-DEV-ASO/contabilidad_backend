import z from "zod"

const sesionSchema = z.object({
    token: z.string().uuid()
})

export const validaToken = datos => sesionSchema.safeParse(datos)