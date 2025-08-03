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
    ...
  }
]
```

---

### 2. Crear un nuevo paciente

**POST /patients**

Crea un nuevo usuario paciente en el sistema.

**Parámetros (JSON en el body):**

- `email`: Email del paciente (string)
- `password`: Contraseña del paciente (string)

**Ejemplo de uso:**

```bash
curl -X POST http://localhost:3000/patients \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"miclave"}'
```

**Respuesta exitosa:**

```json
{
  "message": "Paciente creado exitosamente.",
  "id": "p1001"
}
```

---

### 3. Autenticar paciente

**POST /patients/auth**

Permite autenticar a un paciente usando su email y contraseña.

**Parámetros (JSON en el body):**

- `email`: Email del paciente (string)
- `password`: Contraseña del paciente (string)

**Ejemplo de uso:**

```bash
curl -X POST http://localhost:3000/patients/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"miclave"}'
```

**Respuesta exitosa:**

```json
{
  "message": "Autenticación exitosa.",
  "id": "p1001"
}
```

---

### 4. Crear una nueva cita médica

**POST /appointments**

Crea una nueva cita médica entre un paciente y un doctor.

**Parámetros (JSON en el body):**

- `scheduled_date`: Fecha de la cita en formato DD/MM/YYYY (string)
- `scheduled_time`: Horario de la cita en formato "HH:MM - HH:MM" (string, 24 horas)
- `doctor_id`: ID del doctor (string)
- `patient_id`: ID del paciente (string)
- `patient_email`: Email del paciente (string)

**Ejemplo de uso:**

```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "scheduled_date": "10/08/2025",
    "scheduled_time": "09:00 - 09:30",
    "doctor_id": "1a2b3c",
    "patient_id": "p1001",
    "patient_email": "usuario@example.com"
  }'
```

**Respuesta exitosa:**

```json
{
  "message": "Appointment created successfully.",
  "id": "a1"
}
```

---

### 5. Eliminar una cita médica

**DELETE /appointments/:id**

Elimina una cita médica existente usando el ID de la cita.

**Parámetros (URL):**

- `id`: ID de la cita médica (string)

**Ejemplo de uso:**

```bash
curl -X DELETE http://localhost:3000/appointments/a1
```

**Respuesta exitosa:**

```json
{
  "message": "Appointment deleted successfully."
}
```

---

### 6. Consultar todas las citas de un paciente

**GET /patients/:id/appointments**

Devuelve todas las citas médicas asociadas a un paciente.

**Parámetros (URL):**

- `id`: ID del paciente (string)

**Ejemplo de uso:**

```bash
curl http://localhost:3000/patients/p1001/appointments
```

**Respuesta exitosa:**

```json
[
  {
    "date": "10/08/2025",
    "time": "09:00 - 09:30",
    "doctor_name": "Juan Pérez",
    "doctor_id": "1a2b3c",
    "medical_field": "Cardiología"
  }
]
```

## Notas

- Los datos de doctores, especialidades y citas se encuentran en el directorio `/data`.
- El formato de hora para los bloques de disponibilidad y citas es 24 horas.
- Puedes modificar y ampliar los endpoints según las necesidades del proyecto.
