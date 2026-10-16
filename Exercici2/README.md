# API REST con Gin-Gonic: Usuarios y Fotos

Proyecto base de API REST desarrollado en Go usando el framework [Gin](https://github.com/gin-gonic/gin). Implementa un CRUD completo para **Usuarios** y un CRUD anidado para las **Fotos** de cada usuario.

---

## 📁 Estructura del Proyecto

```text
Exercici2/
├── go.mod                     # Definición del módulo y dependencias
├── main.go                    # Punto de entrada de la aplicación
├── models/
│   ├── user.go                # Modelos y DTOs para Usuarios
│   └── photo.go               # Modelos y DTOs para Fotos
├── storage/
│   └── memory_store.go        # Capa de datos en memoria (concurrencia segura)
├── controllers/
│   ├── user_controller.go     # Lógica HTTP para endpoints de usuarios
│   └── photo_controller.go    # Lógica HTTP para endpoints de fotos
└── routes/
    └── routes.go              # Definición de rutas y agrupación de la API
```

---

## 🚀 Pasos para Iniciar el Proyecto

### 1. Requisitos Previos
Tener instalado Go (versión 1.20 o superior). Puedes verificarlo con:
```bash
go version
```

### 2. Descargar e instalar las dependencias
Sitúate en la raíz del proyecto y ejecuta:
```bash
go mod tidy
```
*Esto descargará `github.com/gin-gonic/gin` y generará el archivo `go.sum`.*

### 3. Ejecutar la API
```bash
go run main.go
```
La aplicación arrancará por defecto en `http://localhost:8080`.

---

## 📌 Tabla de Endpoints

### 🩺 Salud del Servicio
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/health` | Comprobar estado de la API |

### 👤 Usuarios (`/api/v1/users`)
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/v1/users` | Listar todos los usuarios |
| `POST` | `/api/v1/users` | Crear un nuevo usuario |
| `GET` | `/api/v1/users/:id` | Ver detalle de un usuario |
| `PUT` | `/api/v1/users/:id` | Actualizar datos de un usuario |
| `DELETE` | `/api/v1/users/:id` | Eliminar un usuario (y sus fotos) |

### 📸 Fotos de Usuario (`/api/v1/users/:id/photos`)
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/v1/users/:id/photos` | Listar fotos del usuario |
| `POST` | `/api/v1/users/:id/photos` | Crear una foto para el usuario |
| `GET` | `/api/v1/users/:id/photos/:photoId` | Ver detalle de una foto específica |
| `PUT` | `/api/v1/users/:id/photos/:photoId` | Actualizar foto |
| `DELETE` | `/api/v1/users/:id/photos/:photoId` | Eliminar foto |

---

## 🧪 Ejemplos con `curl`

### 1. Comprobar salud
```bash
curl -X GET http://localhost:8080/health
```

### 2. Crear un usuario
```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Smith", "email": "alice@example.com"}'
```

### 3. Listar usuarios
```bash
curl -X GET http://localhost:8080/api/v1/users
```

### 4. Añadir una foto a un usuario (ID: 1)
```bash
curl -X POST http://localhost:8080/api/v1/users/1/photos \
  -H "Content-Type: application/json" \
  -d '{"title": "Vacaciones en la playa", "url": "https://picsum.photos/800/600"}'
```

### 5. Listar fotos del usuario (ID: 1)
```bash
curl -X GET http://localhost:8080/api/v1/users/1/photos
```

### 6. Actualizar una foto (Usuario 1, Foto 1)
```bash
curl -X PUT http://localhost:8080/api/v1/users/1/photos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Atardecer en la playa"}'
```

### 7. Eliminar una foto (Usuario 1, Foto 1)
```bash
curl -X DELETE http://localhost:8080/api/v1/users/1/photos/1
```

### 8. Eliminar un usuario (ID: 1)
```bash
curl -X DELETE http://localhost:8080/api/v1/users/1
```
