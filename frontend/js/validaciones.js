export function validarFormulario(data) {
    let valid = true;
    let mensaje = '';

    // Verificar que todos los campos estén completados
    if (!data.titulo || !data.transaccion || !data.descripcion || !data.precio || !data.kms || !data.puertas || !data.potencia) {
        valid = false;
        mensaje += 'Todos los campos deben estar completados.\n';
    }

    // Verificar que los campos numéricos no sean negativos
    if (data.precio < 0) {
        valid = false;
        mensaje += 'El precio no puede ser negativo.\n';
    }
    if (data.kms < 0) {
        valid = false;
        mensaje += 'Los kilómetros no pueden ser negativos.\n';
    }
    if (data.puertas < 0) {
        valid = false;
        mensaje += 'El número de puertas no puede ser negativo.\n';
    }
    if (data.potencia < 0) {
        valid = false;
        mensaje += 'La potencia no puede ser negativa.\n';
    }

    return { valid, mensaje };
}
