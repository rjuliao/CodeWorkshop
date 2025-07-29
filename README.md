# Proyecto Node.js con Express

Este es un proyecto básico de Node.js que utiliza Express para crear una API simple.

## Requisitos previos

- Node.js y npm deben estar instalados en tu sistema.

## Instrucciones de instalación

1. **Clonar el repositorio**

   Clona este repositorio en tu máquina local usando el siguiente comando:

   ```bash
   git clone [<URL_DEL_REPOSITORIO>](https://github.com/rjuliao/CodeWorkshop)
   ```

2. **Navegar al directorio del proyecto**

   Entra en la carpeta del proyecto:

   ```bash
   cd <NOMBRE_DEL_DIRECTORIO>
   ```

3. **Instalar las dependencias**

   Ejecuta el siguiente comando para instalar las dependencias necesarias:

   ```bash
   npm install
   ```

## Ejecutar el servidor

Para iniciar el servidor, ejecuta el siguiente comando:

```bash
node index.js
```

## Probar la API

Abre tu navegador web y dirígete a `http://localhost:3000/doctors`.

## Actualizaciones del Proyecto

- Se ha implementado middleware para aceptar mensajes JSON, lo que permite manejar cuerpos de solicitud en formato JSON.
- Las rutas relacionadas con `/doctors` se han modularizado en un archivo separado: `doctors/doctors.js` para mejorar la organización del código.
- Se han agregado datos adicionales en el directorio `/data`, incluyendo `doctors.json`, `medical_fields.json`, y `doctor_info.json`, proporcionando una estructura de datos más rica para nuestras operaciones.

## Nuevas funcionalidades del API

1. **Obtener todos los doctores**

   `GET /doctors/` devuelve una lista completa de todos los doctores disponibles. Esta ruta responde con un JSON que incluye todos los registros de doctores.

2. **Obtener doctores por nombre de especialidad médica**

   `GET /doctors/{nombre_especialidad}` permite filtrar y obtener doctores según el nombre de la especialidad médica proporcionada. Asegúrate de utilizar el nombre correcto tal como está registrado en el archivo `medical_fields.json`. Devuelve un error 404 si la especialidad médica no es encontrada.

---
