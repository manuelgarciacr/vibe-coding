package models

// User representa a un usuario en el sistema.
type User struct {
	ID    string `json:"id"`
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
}

// CreateUserRequest define la carga para registrar un nuevo usuario.
type CreateUserRequest struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
}

// UpdateUserRequest define los campos modificables de un usuario.
type UpdateUserRequest struct {
	Name  string `json:"name"`
	Email string `json:"email" binding:"omitempty,email"`
}
