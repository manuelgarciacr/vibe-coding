package controllers

import (
	"net/http"
	"user-photo-api/models"
	"user-photo-api/storage"

	"github.com/gin-gonic/gin"
)

// GetUserPhotos lista todas las fotos asociadas a un usuario específico.
func GetUserPhotos(c *gin.Context) {
	userID := c.Param("id")

	photos, userExists := storage.DB.GetPhotosByUserID(userID)
	if !userExists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user_id": userID,
		"data":    photos,
		"count":   len(photos),
	})
}

// GetPhoto obtiene el detalle de una foto concreta de un usuario.
func GetPhoto(c *gin.Context) {
	userID := c.Param("id")
	photoID := c.Param("photoId")

	photo, exists := storage.DB.GetPhotoByID(userID, photoID)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Foto no encontrada para este usuario"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": photo})
}

// CreatePhoto asocia una nueva foto al usuario indicado.
func CreatePhoto(c *gin.Context) {
	userID := c.Param("id")

	var req models.CreatePhotoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	photo, userExists := storage.DB.CreatePhoto(userID, req)
	if !userExists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Foto creada correctamente",
		"data":    photo,
	})
}

// UpdatePhoto actualiza los datos de una foto de un usuario.
func UpdatePhoto(c *gin.Context) {
	userID := c.Param("id")
	photoID := c.Param("photoId")

	var req models.UpdatePhotoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	photo, exists := storage.DB.UpdatePhoto(userID, photoID, req)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Foto o usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Foto actualizada correctamente",
		"data":    photo,
	})
}

// DeletePhoto elimina una foto de un usuario.
func DeletePhoto(c *gin.Context) {
	userID := c.Param("id")
	photoID := c.Param("photoId")

	if deleted := storage.DB.DeletePhoto(userID, photoID); !deleted {
		c.JSON(http.StatusNotFound, gin.H{"error": "Foto o usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Foto eliminada correctamente"})
}
