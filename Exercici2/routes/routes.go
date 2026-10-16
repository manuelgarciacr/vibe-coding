package routes

import (
	"net/http"
	"user-photo-api/controllers"

	"github.com/gin-gonic/gin"
)

// SetupRouter configura las rutas de la aplicación.
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Endpoint de comprobación de salud (Health Check)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "UP",
			"message": "API Gin en funcionamiento",
		})
	})

	// Grupo de rutas para la API versión 1
	apiV1 := r.Group("/api/v1")
	{
		users := apiV1.Group("/users")
		{
			// CRUD Usuarios
			users.GET("", controllers.GetUsers)          // Listar todos los usuarios
			users.POST("", controllers.CreateUser)       // Crear nuevo usuario
			users.GET("/:id", controllers.GetUser)       // Obtener un usuario por ID
			users.PUT("/:id", controllers.UpdateUser)    // Actualizar un usuario por ID
			users.DELETE("/:id", controllers.DeleteUser) // Eliminar usuario por ID

			// CRUD Fotos anidadas por Usuario
			photos := users.Group("/:id/photos")
			{
				photos.GET("", controllers.GetUserPhotos)          // Listar fotos del usuario
				photos.POST("", controllers.CreatePhoto)          // Crear foto para el usuario
				photos.GET("/:photoId", controllers.GetPhoto)     // Ver detalle de una foto
				photos.PUT("/:photoId", controllers.UpdatePhoto)  // Actualizar una foto
				photos.DELETE("/:photoId", controllers.DeletePhoto)// Eliminar una foto
			}
		}
	}

	return r
}
