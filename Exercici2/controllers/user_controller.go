package controllers

import (
	"net/http"
	"user-photo-api/models"
	"user-photo-api/storage"

	"github.com/gin-gonic/gin"
)

// GetUsers devuelve la lista de todos los usuarios.
func GetUsers(c *gin.Context) {
	users := storage.DB.GetAllUsers()
	c.JSON(http.StatusOK, gin.H{
		"data":  users,
		"count": len(users),
	})
}

// GetUser devuelve un usuario específico por su ID.
func GetUser(c *gin.Context) {
	id := c.Param("id")
	user, exists := storage.DB.GetUserByID(id)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// CreateUser registra un nuevo usuario.
func CreateUser(c *gin.Context) {
	var req models.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := storage.DB.CreateUser(req)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Usuario creado correctamente",
		"data":    user,
	})
}

// UpdateUser actualiza los datos de un usuario existente.
func UpdateUser(c *gin.Context) {
	id := c.Param("id")

	var req models.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, exists := storage.DB.UpdateUser(id, req)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Usuario actualizado correctamente",
		"data":    user,
	})
}

// DeleteUser elimina un usuario y sus fotos asociadas.
func DeleteUser(c *gin.Context) {
	id := c.Param("id")

	if deleted := storage.DB.DeleteUser(id); !deleted {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Usuario y fotos asociadas eliminados correctamente"})
}
