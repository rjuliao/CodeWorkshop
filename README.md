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

A continuación se listan todos los endpoints disponibles en el sistema, agrupados por funcionalidad y archivo correspondiente:

---

### Endpoints de Doctores (`doctors.js`)

#### 1. Obtener todos los doctores

**GET /doctors/**

Devuelve un arreglo JSON con todos los doctores registrados.

**Ejemplo de uso:**

```bash
curl http://localhost:3000/doctors/
```

**Respuesta:**

```json
[
  {
    "id": "1a2b3c",
    "name": "Juan Pérez",
    "medical_field": "Cardiología",
    ...
  }
]
```

---

#### 2. Obtener doctores por especialidad médica

**GET /doctors/field/:field**

Devuelve un arreglo JSON con todos los doctores que pertenecen a una especialidad médica específica.

**Parámetros (URL):**

- `field`: Nombre o ID de la especialidad médica (string)

**Ejemplo de uso:**

```bash
curl http://localhost:3000/doctors/field/Cardiología
```

**Respuesta:**

```json
[
  {
    "id": "1a2b3c",
    "name": "Juan Pérez",
    "medical_field": "Cardiología"
  }
]
```

---

#### 3. Obtener disponibilidad de un doctor por ID

**GET /doctors/:id/availability**

Devuelve los bloques de horario disponibles para un doctor específico.

**Parámetros (URL):**

- `id`: ID del doctor (string)

**Ejemplo de uso:**

```bash
curl http://localhost:3000/doctors/1a2b3c/availability
```

**Respuesta:**

```json
{
  "doctor_id": "1a2b3c",
  "availability": ["09:00 - 09:30", "10:00 - 10:30"]
}
```

---

#### 4. Validar disponibilidad de horario de un doctor en una fecha específica

**POST /doctors/:id/validate-availability**

Valida si un doctor tiene disponible un horario en una fecha específica.

**Parámetros (JSON en el body):**

- `scheduled_date`: Fecha a consultar en formato DD/MM/YYYY (string)
- `scheduled_time`: Horario a consultar en formato "HH:MM - HH:MM" (string, 24 horas)

**Ejemplo de uso:**

```bash
curl -X POST http://localhost:3000/doctors/1a2b3c/validate-availability \
  -H "Content-Type: application/json" \
  -d '{"scheduled_date":"10/08/2025","scheduled_time":"09:00 - 09:30"}'
```

**Respuesta:**

```json
{
  "available": true
}
```

---

#### 5. Obtener todos los doctores con información extendida

**GET /doctors/extended**

Devuelve un arreglo JSON con todos los doctores y su información extendida, incluyendo especialidad, disponibilidad y datos de contacto.

**Ejemplo de uso:**

```bash
curl http://localhost:3000/doctors/extended
```

**Respuesta:**

```json
[
  {
    "id": "1a2b3c",
    "name": "Juan Pérez",
    "medical_field": "Cardiología",
    "availability": ["09:00 - 09:30", "10:00 - 10:30"],
    "contact": {
      "email": "juan.perez@example.com",
      "phone": "+123456789"
    }
  }
]
```

---

### Endpoints de Pacientes (`patients.js`)

#### 6. Crear un nuevo paciente

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

**Respuesta:**

```json
{
  "message": "Paciente creado exitosamente.",
  "id": "p1001"
}
```

---

#### 7. Autenticar paciente

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

**Respuesta:**

```json
{
  "message": "Autenticación exitosa.",
  "id": "p1001"
}
```

---

#### 8. Consultar todas las citas de un paciente

**GET /patients/:id/appointments**

Devuelve todas las citas médicas asociadas a un paciente.

**Parámetros (URL):**

- `id`: ID del paciente (string)

**Ejemplo de uso:**

```bash
curl http://localhost:3000/patients/p1001/appointments
```

**Respuesta:**

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

---

### Endpoints de Citas Médicas (`appointments.js`)

#### 9. Crear una nueva cita médica

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

**Respuesta:**

```json
{
  "message": "Appointment created successfully.",
  "id": "a1"
}
```

---

#### 10. Eliminar una cita médica

**DELETE /appointments/:id**

Elimina una cita médica existente usando el ID de la cita.

**Parámetros (URL):**

- `id`: ID de la cita médica (string)

**Ejemplo de uso:**

```bash
curl -X DELETE http://localhost:3000/appointments/a1
```

**Respuesta:**

```json
{
  "message": "Appointment deleted successfully."
}
```

---

#### 11. Validaciones adicionales en la creación de citas

- No se permite crear dos citas iguales para el mismo doctor, paciente, fecha y hora.
- No se permite que dos pacientes diferentes reserven el mismo doctor, fecha y hora.
- Se valida que el doctor y el paciente existan antes de crear la cita.
- Se valida el formato del horario.

---

#### 12. Reagendar una cita médica

**PUT /appointments/:id/reschedule**

Permite a un paciente cambiar la fecha y hora de una cita médica existente.

**Parámetros (URL):**

- `id`: ID de la cita médica (string)

**Parámetros (JSON en el body):**

- `new_date`: Nueva fecha de la cita en formato DD/MM/YYYY (string)
- `new_time`: Nuevo horario de la cita en formato "HH:MM - HH:MM" (string, 24 horas)
- `patient_id`: ID del paciente (string)
- `doctor_id`: ID del doctor (string)

**Ejemplo de uso:**

```bash
curl -X PUT http://localhost:3000/appointments/a1/reschedule \
  -H "Content-Type: application/json" \
  -d '{
    "new_date": "12/08/2025",
    "new_time": "10:00 - 10:30",
    "patient_id": "p1001",
    "doctor_id": "1a2b3c"
  }'
```

**Respuesta exitosa:**

```json
{
  "message": "Appointment rescheduled successfully."
}
```

**Validaciones importantes:**

- No se permite reagendar citas en fines de semana (sábado o domingo).
- No se permite reagendar si el doctor ya tiene una cita en la nueva fecha y hora.
- Se valida que el paciente exista.
- Se valida que el doctor exista.
- Se valida el formato de la nueva fecha y hora.

---

## Endpoint de Formularios Médicos (`medication.js`)

#### 13. Crear un nuevo formulario médico con medicamentos prescritos

**POST /medical_form**

Permite a un paciente registrar un nuevo formulario médico con los medicamentos que le fueron prescritos por un doctor.

**Parámetros (JSON en el body):**

- `patient_id`: ID del paciente (string)
- `doctor_id`: ID del doctor (string)
- `medicines`: Lista de IDs de medicamentos prescritos (array de strings)

**Ejemplo de uso:**

```bash
curl -X POST http://localhost:3000/medical_form \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "p1001",
    "doctor_id": "1a2b3c",
    "medicines": ["med1", "med2", "med5"]
  }'
```

**Respuesta exitosa:**

```json
{
  "message": "Medical form created successfully.",
  "id": "mf1"
}
```

**Validaciones importantes:**

- El paciente debe existir en el sistema.
- El doctor debe existir en el sistema.
- Todos los medicamentos deben existir en el sistema.
- Se crea un nuevo registro en el archivo `medical_form.json` con el ID del formulario, ID y nombre del doctor, ID del paciente y la lista de medicamentos.
