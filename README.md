# API de Gestión de Citas Médicas

Este proyecto es una API desarrollada con Node.js y Express para gestionar información de doctores, especialidades médicas y citas. Permite consultar disponibilidad, agendar y consultar citas, y obtener información detallada de los doctores.

## ¿Cómo descargar, instalar y ejecutar el proyecto?

1. **Clonar el repositorio desde GitHub**

   ```bash
   git clone https://github.com/rjuliao/CodeWorkshop
   ```

2. **Navegar al directorio del proyecto**

   ```bash
   cd CodeWorkshop
   ```

3. **Instalar las dependencias**

   ```bash
   npm install
   ```

4. **Ejecutar el servidor con nodemon**

   ```bash
   npm run dev
   ```

## Endpoints disponibles y ejemplos de uso

### 1. Obtener todos los doctores

**GET /doctors/**

Devuelve un arreglo JSON con todos los doctores registrados.

**Ejemplo de respuesta:**

```json
[
  {
    "id": "1a2b3c",
    "name": "Juan Pérez",
    "medical_field": "CARD",
    ...
  },
  ...
]
```

### 2. Obtener doctores por especialidad médica

**GET /doctors/{nombre_especialidad}**

Filtra y devuelve doctores según el nombre de la especialidad médica. El nombre debe coincidir con el registrado en `medical_fields.json`.

**Ejemplo de uso:**

```
GET /doctors/Cardiología
```

**Ejemplo de respuesta:**

```json
[
  {
    "id": "1a2b3c",
    "name": "Juan Pérez",
    "medical_field": "CARD",
    ...
  }
]
```

### 3. Consultar disponibilidad de un doctor por fecha

**GET /doctors/availability/id={doctorId}/date={DD-MM-YYYY}**

Devuelve los bloques de 30 minutos disponibles para agendar una cita con el doctor en la fecha indicada.

**Ejemplo de uso:**

```
GET /doctors/availability/id=1a2b3c/date=10-08-2025
```

**Ejemplo de respuesta:**

```json
{
  "doctor_id": "1a2b3c",
  "date": "10-08-2025",
  "available_slots": ["09:30", "10:00", "10:30", ...]
}
```

### 4. Consultar disponibilidad semanal de un doctor

**GET /doctors/availability/{id}**

Devuelve la disponibilidad semanal del doctor por día y hora.

**Ejemplo de uso:**

```
GET /doctors/availability/1a2b3c
```

**Ejemplo de respuesta:**

```json
{
  "doctor_id": "1a2b3c",
  "availability": {
    "Monday": ["09:00", "09:30", ...],
    "Tuesday": ["10:00", "10:30", ...],
    ...
  }
}
```

## Notas

- Los datos de doctores, especialidades y citas se encuentran en el directorio `/data`.
- El formato de hora para los bloques de disponibilidad y citas es 24 horas.
- Puedes modificar y ampliar los endpoints según las necesidades del proyecto.
