import z from "zod"

const loginSchema = z.object({
    user: z.string().email().default("No Recibido"),
    pass: z.string().default("No Recibido"),
    ip: z.string().ip().default("No Recibido"),
    host: z.string().default("No Recibido")
})

export const validaLogin = (datos) => loginSchema.safeParse(datos)