package models

import "time"

// Photo representa una foto asociada a un usuario.
type Photo struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Title     string    `json:"title" binding:"required"`
	URL       string    `json:"url" binding:"required,url"`
	CreatedAt time.Time `json:"created_at"`
}

// CreatePhotoRequest define la carga para añadir una foto a un usuario.
type CreatePhotoRequest struct {
	Title string `json:"title" binding:"required"`
	URL   string `json:"url" binding:"required,url"`
}

// UpdatePhotoRequest define los campos modificables de una foto.
type UpdatePhotoRequest struct {
	Title string `json:"title"`
	URL   string `json:"url" binding:"omitempty,url"`
}
