package storage

import (
	"fmt"
	"sync"
	"time"
	"user-photo-api/models"
)

// Store gestiona el almacenamiento en memoria concurrente.
type Store struct {
	mu           sync.RWMutex
	users        map[string]models.User
	photos       map[string]models.Photo
	userCounter  int
	photoCounter int
}

var DB *Store

func init() {
	DB = NewStore()
}

func NewStore() *Store {
	return &Store{
		users:  make(map[string]models.User),
		photos: make(map[string]models.Photo),
	}
}

// ================= USER OPERATIONS =================

func (s *Store) GetAllUsers() []models.User {
	s.mu.RLock()
	defer s.mu.RUnlock()

	users := make([]models.User, 0, len(s.users))
	for _, user := range s.users {
		users = append(users, user)
	}
	return users
}

func (s *Store) GetUserByID(id string) (models.User, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	user, exists := s.users[id]
	return user, exists
}

func (s *Store) CreateUser(req models.CreateUserRequest) models.User {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.userCounter++
	id := fmt.Sprintf("%d", s.userCounter)

	user := models.User{
		ID:    id,
		Name:  req.Name,
		Email: req.Email,
	}
	s.users[id] = user
	return user
}

func (s *Store) UpdateUser(id string, req models.UpdateUserRequest) (models.User, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	user, exists := s.users[id]
	if !exists {
		return models.User{}, false
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Email != "" {
		user.Email = req.Email
	}

	s.users[id] = user
	return user, true
}

func (s *Store) DeleteUser(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.users[id]; !exists {
		return false
	}

	delete(s.users, id)

	// Eliminar fotos pertenecientes a este usuario (cascada)
	for photoID, photo := range s.photos {
		if photo.UserID == id {
			delete(s.photos, photoID)
		}
	}

	return true
}

// ================= PHOTO OPERATIONS =================

func (s *Store) GetPhotosByUserID(userID string) ([]models.Photo, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if _, exists := s.users[userID]; !exists {
		return nil, false
	}

	photos := make([]models.Photo, 0)
	for _, photo := range s.photos {
		if photo.UserID == userID {
			photos = append(photos, photo)
		}
	}
	return photos, true
}

func (s *Store) GetPhotoByID(userID, photoID string) (models.Photo, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	photo, exists := s.photos[photoID]
	if !exists || photo.UserID != userID {
		return models.Photo{}, false
	}

	return photo, true
}

func (s *Store) CreatePhoto(userID string, req models.CreatePhotoRequest) (models.Photo, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.users[userID]; !exists {
		return models.Photo{}, false
	}

	s.photoCounter++
	id := fmt.Sprintf("%d", s.photoCounter)

	photo := models.Photo{
		ID:        id,
		UserID:    userID,
		Title:     req.Title,
		URL:       req.URL,
		CreatedAt: time.Now(),
	}

	s.photos[id] = photo
	return photo, true
}

func (s *Store) UpdatePhoto(userID, photoID string, req models.UpdatePhotoRequest) (models.Photo, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	photo, exists := s.photos[photoID]
	if !exists || photo.UserID != userID {
		return models.Photo{}, false
	}

	if req.Title != "" {
		photo.Title = req.Title
	}
	if req.URL != "" {
		photo.URL = req.URL
	}

	s.photos[photoID] = photo
	return photo, true
}

func (s *Store) DeletePhoto(userID, photoID string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	photo, exists := s.photos[photoID]
	if !exists || photo.UserID != userID {
		return false
	}

	delete(s.photos, photoID)
	return true
}
