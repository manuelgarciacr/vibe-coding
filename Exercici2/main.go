package main

import (
	"log"
	"os"
	"user-photo-api/routes"
)

func main() {
	router := routes.SetupRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Iniciando servidor API en http://localhost:%s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Error crítico al arrancar el servidor: %v", err)
	}
}
