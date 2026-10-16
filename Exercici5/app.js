const IMPORT_MINIM_DESCOMPTE = 100;
const FACTOR_DESCOMPTE = 0.9;

const importLinia = ({ preu = 0, quantitat = 0 } = {}) => preu * quantitat;

const aplicarDescompte = (total) =>
  total > IMPORT_MINIM_DESCOMPTE ? total * FACTOR_DESCOMPTE : total;

const calcularTotal = (productes = []) => {
  const subtotal = productes
    .map(importLinia)
    .reduce((acumulat, importActual) => acumulat + importActual, 0);

  return aplicarDescompte(subtotal);
};

const productes = [
  { nom: "Llibre", preu: 20, quantitat: 2 },
  { nom: "Bolígraf", preu: 5, quantitat: 10 },
];

const total = calcularTotal(productes);
console.log(`Total: ${total}`);
