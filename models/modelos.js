import db from "../DB/pool.js"
import { LoginModel } from "./login.js"
import { SesionModel } from "./sesion.js"
import { EdoCtaModel } from "./edoCta.js"

export class Modelos {
    get login() {
        return new LoginModel(db)
    }

    get sesion() {
        return new SesionModel(db)
    }

    get edoCta() {
        return new EdoCtaModel(db)
    }
}