import { Anuncio } from "./anuncio.js";

class AnuncioAuto extends Anuncio {
    constructor(id, titulo, transaccion, descripcion, precio, kms, puertas, potencia) {
        super(id, titulo, transaccion, descripcion, precio);
        this.kms = kms;
        this.puertas = puertas;
        this.potencia = potencia;
    }

    verify() {
        return this.checkNombre();
    }

    checkNombre() {
        return { success: true, rta: null };
    }
}

export { AnuncioAuto };