def calcular_mitjana(llista):
    if not llista:
        raise ValueError("The list cannot be empty.")
    suma = sum(llista)
    mitjana = suma / len(llista)
    return mitjana

# Test with invalid data (empty list)
try:
    print(calcular_mitjana([]))
except ValueError as e:
    print(f"Caught expected error: {e}")

# Test with valid data
print(calcular_mitjana([10, 20, 30]))  # Returns 20.0
