import { AnuncioAuto } from './anuncioAuto.js';
import { mostrarSpinner, ocultarSpinner } from './spinner.js';
import { columnas, transaccion } from './columnas.js';
import { validarFormulario } from './validaciones.js';

const formulario = document.forms[0];
const btnGuardar = document.getElementById("btn-guardar");
const btnModificar = document.getElementById("btn-modificar");
const btnEliminar = document.getElementById("btn-eliminar");
const btnBorrar = document.getElementById("btn-borrar");
const btnRestablecer = document.getElementById("btn-restablecer");
const filtroTransaccion = document.getElementById("transaccion-filtro");
const promedioTransaccion = document.getElementById("promedio-transaccion");
const items = [];
let selectedItem = null;

document.addEventListener("DOMContentLoaded", onInit);

function onInit() {
    generarCheckboxes();
    llenarSelectTransaccion();
    cargarItemsYRellenarTabla();
    escuchandoFormulario();
    escucharGuardar();
    escucharModificar();
    escucharEliminar();
    escucharBorrarTodo();
    escucharRestablecerColumnas();
    escucharFiltroTransaccion();
    escucharRestablecerFiltro();
    escucharChecks();
    updateFooterYear();
}

// Función para llenar el select de transacción
function llenarSelectTransaccion() {
    transaccion.forEach(transaccionItem => {
        const option = document.createElement("option");
        option.value = transaccionItem;
        option.textContent = transaccionItem;
        if (transaccionItem === "Seleccione") {
            option.disabled = true;
            option.selected = true;
        }
        filtroTransaccion.appendChild(option);
    });
}

// Función para generar los checkboxes para cada columna de la tabla
function generarCheckboxes() {
    const checkboxRow = document.getElementById("checkbox-row");

    columnas.forEach(columna => {
        const th = document.createElement("th");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.id = `check-${columna}`;
        th.appendChild(checkbox);
        checkboxRow.appendChild(th);
    });
}

// Función para escuchar el evento de borrar todos los datos
function escucharBorrarTodo() {
    btnBorrar.addEventListener("click", async () => {
        const confirmacion = confirm("¿Estás seguro de que quieres borrar todos los datos?");
        if (confirmacion) {
            mostrarSpinner();
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('DELETE', 'http://localhost:3000/autos', true);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        items.length = 0;
                        renderTabla();
                        alert("Todos los datos han sido borrados.");
                    }
                    ocultarSpinner();
                };
                xhr.send();
            } catch (error) {
                console.error("Error al borrar todos los datos:", error);
                ocultarSpinner();
            }
        }
    });
}

// Función para escuchar el evento de restablecer columnas
function escucharRestablecerColumnas() {
    btnRestablecer.addEventListener("click", () => {
        const checks = document.querySelectorAll("thead input[type='checkbox']");
        checks.forEach(check => {
            check.checked = true;
            const columnClass = check.id.replace("check-", "");
            const columnas = document.querySelectorAll(`.${columnClass}`);
            columnas.forEach(col => {
                col.style.display = "";
            });
            check.parentElement.style.display = "";
            document.querySelectorAll(`th.${columnClass}`).forEach(th => {
                th.style.display = "";
            });
        });
    });
}

// Función para cargar los ítems desde el servidor
async function cargarItems() {
    try {
        const response = await fetch('http://localhost:3000/autos');
        if (!response.ok) {
            throw new Error('Error al cargar items');
        }
        const data = await response.json();
        items.length = 0;
        items.push(...data.map(obj => new AnuncioAuto(
            obj.id,
            obj.titulo,
            obj.transaccion,
            obj.descripcion,
            obj.precio,
            obj.kms,
            obj.puertas,
            obj.potencia
        )));
    } catch (error) {
        console.error("Error al cargar items:", error);
    }
}

// Función para crear una fila en la tabla
function crearFila(item) {
    const template = document.getElementById("row-template").content;
    const clone = document.importNode(template, true);

    clone.querySelector(".id").textContent = item.id;
    clone.querySelector(".titulo").textContent = item.titulo;
    clone.querySelector(".transaccion").textContent = item.transaccion;
    clone.querySelector(".descripcion").textContent = item.descripcion;
    clone.querySelector(".precio").textContent = item.precio;
    clone.querySelector(".kms").textContent = item.kms;
    clone.querySelector(".puertas").textContent = item.puertas;
    clone.querySelector(".potencia").textContent = item.potencia;

    clone.querySelector("tr").addEventListener("click", () => {
        cargarFormulario(item);
        selectedItem = item;
        btnModificar.disabled = false;
        btnEliminar.disabled = false;
        btnGuardar.disabled = true;
        document.getElementById("form-item").scrollIntoView({ behavior: "smooth" }); // Desplazar el foco al formulario
    });

    return clone;
}

// Función para renderizar la tabla con los ítems cargados
function renderTabla(filtrados = items) {
    const tabla = document.getElementById("data-table");
    const tbody = tabla.querySelector('tbody');

    if (!tabla || !tbody) {
        console.error("No se encontró la tabla o tbody.");
        return;
    }

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    const fragment = document.createDocumentFragment();

    filtrados.forEach(item => {
        fragment.appendChild(crearFila(item));
    });

    tbody.appendChild(fragment);
}

// Función para escuchar el evento de envío del formulario
function escuchandoFormulario() {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const model = obtenerModeloDeFormulario();
        const validacion = validarFormulario(model); // Validar formulario

        if (!validacion.valid) {
            mostrarAlerta(validacion.mensaje);
            return;
        }

        const respuesta = model.verify();

        if (respuesta.success) {
            mostrarAlerta("Formulario verificado exitosamente.");
        } else {
            mostrarAlerta(respuesta.rta);
        }
    });
}

// Función para obtener el modelo de datos desde el formulario
function obtenerModeloDeFormulario() {
    const fechaActual = new Date();
    const id = selectedItem ? selectedItem.id : fechaActual.getTime();
    const titulo = formulario.querySelector("#titulo").value;
    const transaccion = document.querySelector('input[name="transaccion"]:checked').value;
    const descripcion = formulario.querySelector("#descripcion").value;
    const precio = formulario.querySelector("#precio").value;
    const kms = formulario.querySelector("#kms").value;
    const puertas = formulario.querySelector("#puertas").value;
    const potencia = formulario.querySelector("#potencia").value;

    return new AnuncioAuto(id, titulo, transaccion, descripcion, precio, kms, puertas, potencia);
}

async function guardarModelo(model) {
    mostrarSpinner();
    try {
        const response = await fetch('http://localhost:3000/autos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(model)
        });

        if (!response.ok) {
            throw new Error('Error al guardar el modelo');
        }

        await cargarItemsYRellenarTabla(); // Actualizar la tabla después de guardar

    } catch (error) {
        console.error("Error al guardar modelo:", error);
        mostrarError(error.message);
    } finally {
        ocultarSpinner(); // Asegurarse de ocultar el spinner en cualquier caso
    }
}

// Función para cargar los datos en el formulario
function cargarFormulario(item) {
    formulario.querySelector("#titulo").value = item.titulo;
    document.querySelector(`input[name="transaccion"][value="${item.transaccion}"]`).checked = true;
    formulario.querySelector("#descripcion").value = item.descripcion;
    formulario.querySelector("#precio").value = item.precio;
    formulario.querySelector("#kms").value = item.kms;
    formulario.querySelector("#puertas").value = item.puertas;
    formulario.querySelector("#potencia").value = item.potencia;
}

function mostrarError(error) {
    alert(error);
}

function mostrarAlerta(mensaje) {
    alert(mensaje);
}

function actualizarFormulario() {
    formulario.reset();
    selectedItem = null;
    btnModificar.disabled = true;
    btnEliminar.disabled = true;
}

async function cargarItemsYRellenarTabla() {
    mostrarSpinner();
    try {
        items.length = 0;
        await cargarItems();
        renderTabla();
    } catch (error) {
        console.error("Error al cargar items y rellenar tabla:", error);
    } finally {
        ocultarSpinner();
    }
}

function escucharGuardar() {
    btnGuardar.addEventListener("click", async () => {
        const model = obtenerModeloDeFormulario();
        const validacion = validarFormulario(model); // Validar formulario

        if (!validacion.valid) {
            mostrarAlerta(validacion.mensaje);
            return;
        }

        const respuesta = model.verify();

        if (respuesta.success) {
            try {
                await guardarModelo(model);
                actualizarFormulario();
            } catch (error) {
                mostrarError(error);
            }
        } else {
            mostrarAlerta(respuesta.rta);
        }
    });
}

function escucharModificar() {
    btnModificar.addEventListener("click", async () => {
        if (!selectedItem) return;
        const confirmacion = confirm("¿Estás seguro de que quieres modificar este elemento?");
        if (confirmacion) {
            const model = obtenerModeloDeFormulario();
            const validacion = validarFormulario(model); // Validar formulario

            if (!validacion.valid) {
                mostrarAlerta(validacion.mensaje);
                return;
            }

            mostrarSpinner();
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', `http://localhost:3000/autos/${selectedItem.id}`, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const index = items.findIndex(item => item.id === selectedItem.id);
                        items[index] = model;
                        renderTabla();
                        actualizarFormulario();
                        btnGuardar.disabled = false; // Habilitar el botón guardar después de modificar
                    }
                    ocultarSpinner();
                };
                xhr.send(JSON.stringify(model));
            } catch (error) {
                console.error("Error al modificar modelo:", error);
                ocultarSpinner();
            }
        }
    });
}

function escucharEliminar() {
    btnEliminar.addEventListener("click", async () => {
        if (!selectedItem) return;
        const confirmacion = confirm("¿Estás seguro de que quieres eliminar este elemento?");
        if (confirmacion) {
            mostrarSpinner();
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('DELETE', `http://localhost:3000/autos/${selectedItem.id}`, true);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const index = items.findIndex(item => item.id === selectedItem.id);
                        items.splice(index, 1);
                        renderTabla();
                        actualizarFormulario();
                        btnGuardar.disabled = false; // Habilitar el botón guardar después de eliminar
                    }
                    ocultarSpinner();
                };
                xhr.send();
            } catch (error) {
                console.error("Error al eliminar modelo:", error);
                ocultarSpinner();
            }
        }
    });
}

function escucharFiltroTransaccion() {
    filtroTransaccion.addEventListener("change", () => {
        const transaccion = filtroTransaccion.value.trim();
        if (transaccion === "") {
            promedioTransaccion.value = "N/A";
            renderTabla();
        } else {
            const filtrados = items.filter(item => item.transaccion === transaccion);
            if (filtrados.length === 0) {
                promedioTransaccion.value = "N/A";
            } else {
                const promedio = filtrados.reduce((acc, item) => acc + parseFloat(item.precio), 0) / filtrados.length;
                promedioTransaccion.value = promedio.toFixed(2);
            }
            renderTabla(filtrados);
        }
    });
}

function escucharRestablecerFiltro() {
    const btnRestablecerFiltro = document.getElementById("btn-restablecer-filtro");
    btnRestablecerFiltro.addEventListener("click", () => {
        filtroTransaccion.value = ""; 
        promedioTransaccion.value = "N/A";
        renderTabla(); 
    });
}

function escucharChecks() {
    const checks = document.querySelectorAll("thead input[type='checkbox']");
    checks.forEach(check => {
        check.addEventListener("change", () => {
            if (check.id === 'check-id') {
                check.checked = true; 
                return;
            }
            const columnClass = check.id.replace("check-", "");
            const columnas = document.querySelectorAll(`.${columnClass}`);
            columnas.forEach(col => {
                col.style.display = check.checked ? "" : "none";
            });
            const header = document.querySelectorAll(`th.${columnClass}`);
            header.forEach(col => {
                col.style.display = check.checked ? "" : "none";
            });
            check.parentElement.style.display = check.checked ? "" : "none";
        });
    });
}

function updateFooterYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
}
