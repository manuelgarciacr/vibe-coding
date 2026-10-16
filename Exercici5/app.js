const IMPORT_MINIM_DESCOMPTE = 100;
const FACTOR_DESCOMPTE = 0.9;

function importLinia({ preu, quantitat }) {
  return preu * quantitat;
}

function aplicarDescompte(total) {
  if (total > IMPORT_MINIM_DESCOMPTE) {
    return total * FACTOR_DESCOMPTE;
  }
  return total;
}

function calcularTotal(productes) {
  const subtotal = productes.reduce(
    (acumulat, producte) => acumulat + importLinia(producte),
    0
  );
  return aplicarDescompte(subtotal);
}

const productes = [
  { nom: "Llibre", preu: 20, quantitat: 2 },
  { nom: "Bolígraf", preu: 5, quantitat: 10 },
];

const total = calcularTotal(productes);
console.log(`Total: ${total}`);
