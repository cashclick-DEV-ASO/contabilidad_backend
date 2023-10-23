export class Modelo {
    constructor(db) {
        this.db = db;
    }

    conexion = null
    error = null
    mensaje = null
    token = null

    /**
     * @param {object} informacion - Información que se enviará como respuesta
     * @param {object} error - Error que se mostrara en consola
     * @param {boolean} mostrarError - Indica si se mostrará el error en consola
     * @returns {object} Objeto JSON para enviar como respuesta
    */
    responde(informacion, error = null, mostrarError = true) {
        const resultado = {};
        resultado.success = true;
        resultado.informacion = informacion;

        if (error) {
            resultado.success = false;
            mostrarError && console.log(error);
        }
        
        this.limpiar();
        return resultado;
    }

    /**
     * @param {string} mensaje - Mensaje que se mostrará en la consola
     */
    sinDatos(mensaje = "") {
        return responde(
            { mensaje: "No se proporcionaron datos a procesar." },
            {
                fecha: new Date(),
                mensaje
            });
    }

    /**
     * @param {string} fecha - Fecha en formato ISO
     * @returns {string} Fecha con un formato amigable con MySQL
     * @description Convierte una fecha en formato ISO a un formato amigable con MySQL
     * @example fechaMySQL("25/10/2021") // "2021-10-25 00:00:00"
     */
    fechaMySQL(fecha) {
        const fechaISO = new Date(fecha).toISOString();
        return fechaISO.slice(0, 10) + " " + fechaISO.slice(11, 19);
    }

    limpiar() {
        this.conexion = null
        this.error = null
        this.mensaje = null
        this.token = null
    }
}
