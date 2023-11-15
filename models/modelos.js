import db from "../DB/pool.js"
import { LoginModel } from "./login.js"
import { SesionModel } from "./sesion.js"
import { EdoCtaModel } from "./edoCta.js"
import { NoConfigModelo } from "./noConfig.js"

/**
 * Clase que contiene los modelos de la aplicación.
 * @class
 */
export class Modelos {
	/**
	 * Retorna una instancia del modelo LoginModel.
	 * @returns {LoginModel} Instancia del modelo LoginModel.
	 */
	get login() {
		return new LoginModel(db)
	}

	/**
	 * Retorna una instancia del modelo SesionModel.
	 * @returns {SesionModel} Instancia del modelo SesionModel.
	 */
	get sesion() {
		return new SesionModel(db)
	}

	/**
	 * Retorna una instancia del modelo EdoCtaModel.
	 * @returns {EdoCtaModel} Instancia del modelo EdoCtaModel.
	 */
	get edoCta() {
		return new EdoCtaModel(db)
	}

	/**
	 * Retorna una instancia del modelo NoConfigModelo.
	 * @returns {NoConfigModelo} Instancia del modelo NoConfigModelo.
	 */
	get noConfig() {
		return new NoConfigModelo(db)
	}
}
