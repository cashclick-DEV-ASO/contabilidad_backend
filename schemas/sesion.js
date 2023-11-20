import z from "zod"
// import crypto from "node:crypto"

const sesionSchema = z.object({
	token: z.string().uuid(),
})

export const validaToken = datos => sesionSchema.safeParse(datos)

// console.log(validaToken({ token: crypto.randomUUID() }))
