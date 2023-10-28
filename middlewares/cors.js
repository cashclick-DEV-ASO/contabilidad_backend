import cors from "cors"

export const configuracionCORS = (aceptados = process.env.ORIGINS || "*") => cors({
	origin: (origin, callback) => {
		if (aceptados.split(",").includes(origin))
		return callback(null, true)

		if (!origin)
			return callback(null, true)
		console.log(origin);
		return callback("Not allowed")
	}
})