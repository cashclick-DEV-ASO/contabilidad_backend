import cors from "cors"

export const configuracionCORS = (aceptados = process.env.ORIGINS || "*") => cors({
	origin: (origin, callback) => {
		if (aceptados.split(",").includes(origin)){
			console.log("Origin aceptado:", origin);

			return callback(null, true)
		}

		if (!origin) return callback(null, true)
		console.log("Origin erro:", origin);
	
		return callback("Not allowed")
	}
})