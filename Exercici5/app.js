function calcularTotal(productes) {
  let total = 0;
  for (let i = 0; i < productes.length; i++) {
    total += productes[i].preu * productes[i].quantitat;
  }
  if (total > 100) {
    total = total * 0.9; // 10% de descompte
  }
  console.log("Total: " + total);
  return total;
}

const productes = [
  { nom: "Llibre", preu: 20, quantitat: 2 },
  { nom: "Bolígraf", preu: 5, quantitat: 10 },
];
calcularTotal(productes);