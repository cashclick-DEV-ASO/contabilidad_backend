import mysql from 'mysql2/promise'
import { manejoExito, manejoError } from '../utils.js'

const configuracion = process.env.DATABASE_URL ?? process.env.DEFAULT_DB_CONFIG

const conexion = await mysql.createConnection(configuracion)

export class EdoCtaModel {
    static async insertarEdoCta({ datos }) {
        const { periodo, archivo, id_cta, fechaCaptura } = datos

        try {
            const dbResultado = await conexion.query(`INSERT INTO edo_cta VALUES (?,?,?,?,?)`,
                ["NULL", periodo, archivo, fechaCaptura, id_cta])
            return manejoExito({ idCreado: dbResultado[0].insertId })
        } catch (error) {
            return manejoError({ error })
        }
    }


}