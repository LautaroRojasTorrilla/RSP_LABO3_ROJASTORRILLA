# Administrador de Anuncios

Este proyecto es una alternativa de resolución para el segundo parcial de la materia "Laboratorio 3". 
El objetivo es desarrollar una aplicación web para gestionar anuncios de automóviles utilizando tecnologías modernas como Node.js, Express, y Bootstrap.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para aplicaciones web en Node.js.
- **Bootstrap**: Framework de CSS para el diseño responsivo y componentes de UI.
- **HTML5**: Estructura del contenido web.
- **CSS3**: Estilos personalizados.
- **JavaScript (ES6)**: Lógica del frontend.
- **Google Fonts**: Fuentes personalizadas.

## Funcionalidades

- **Crear, leer, actualizar y eliminar (CRUD) anuncios**: Gestiona anuncios de automóviles.
- **Filtrado y cálculo de promedio**: Filtra anuncios por tipo de transacción y calcula el precio promedio.
- **Interfaz dinámica y responsiva**: Utiliza Bootstrap para un diseño atractivo y adaptable.
- **Simulación de demora**: Middleware en el servidor para simular tiempos de espera.
- **Spinner de carga**: Indica al usuario que se está procesando una operación.

## Semántica Utilizada en el HTML

Se ha utilizado una estructura HTML semántica para mejorar la accesibilidad y la claridad del código. A continuación, se detallan algunas de las etiquetas semánticas utilizadas:

- `<header>`: Define el encabezado de la página, que incluye el logo y el menú de navegación.
- `<nav>`: Contiene los enlaces de navegación.
- `<section>`: Agrupa contenido relacionado. Se utilizó para la sección "Información del Anuncio", "Filtrado y Promedio" y "Datos Registrados".
- `<form>`: Define el formulario de ingreso de datos para el anuncio.
- `<footer>`: Define el pie de página, que incluye enlaces adicionales y derechos reservados.
- `<template>`: Define estructuras HTML que se repiten en el documento, como las filas de la tabla de datos.

## Clases de Bootstrap Utilizadas

A continuación, se detallan las 10 clases de Bootstrap más relevantes que se han utilizado en el proyecto para mejorar el diseño y la responsividad:

- **`bg-primary`**: Aplica un fondo de color primario.
- **`text-white`**: Aplica un color de texto blanco.
- **`container`**: Centra y aplica márgenes automáticos a los elementos hijos.
- **`d-flex`**: Aplica una disposición de flexbox.
- **`justify-content-between`**: Distribuye los elementos con espacio entre ellos.
- **`align-items-center`**: Alinea verticalmente los elementos en el centro.
- **`nav`**: Define una barra de navegación.
- **`btn`**: Aplica estilos a los botones.
- **`form-control`**: Aplica estilos a los elementos de entrada del formulario.
- **`row`**: Define una fila para el diseño en cuadrícula.


## Estructura del Proyecto

```plaintext
/project-root
│
├── /backend
│   ├── app.js
│   ├── endpoints.txt
│   └── package.json
│
├── /frontend
│   ├── /assets
│   │   ├── /images
│   │   │   ├── image1.png
│   │   │   ├── image2.png
│   │   │   └── ...
│   │
│   ├── /styles
│   │   ├── index.css
│
│   ├── /js
│   │   ├── columnas.js
│   │   ├── anuncio.js
│   │   ├── anuncioAuto.js
│   │   ├── spinner.js
│   │   ├── scripts.js
│   │   └── validaciones.js
│
├── index.html


