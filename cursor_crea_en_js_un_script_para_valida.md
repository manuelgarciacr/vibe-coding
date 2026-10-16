# crea en js un script para validar un email
_Exported on 10/16/2026 at 10:53:19 GMT+2 from Cursor (3.24.9)_

---

**User**

crea en js un script para validar un email

sugiere mejoras para este código para: legibilidad

---

**Cursor**

Voy a revisar el código abierto y el contexto del ejercicio para proponerte mejoras concretas de legibilidad.

El código hace bien el cálculo, pero se lee peor de lo necesario por números mágicos, el bucle indexado y mezclar cálculo con `console.log`.

**1. Nombres y constantes en lugar de comentarios**

`100` y `0.9` obligan a leer el comentario. Extrae umbral y descuento:

```js
const IMPORT_MINIM_DESCOMPTE = 100;
const FACTOR_DESCOMPTE = 0.9; // 10%
```

**2. Evita el índice si no lo usas**

`productes[i].preu * productes[i].quantitat` es ruidoso. Con `for...of` o `reduce` se ve el producto, no el array:

```js
for (const producte of productes) {
  total += producte.preu * producte.quantitat;
}
```

**3. Separa cálculo y presentación**

Ahora `calcularTotal` calcula, aplica descuento y imprime. Para leerlo, mejor que la función solo devuelva el número y el `console.log` quede fuera (o en otra función).

**4. Extrae el subtotal de cada línea**

Una función pequeña aclara la intención:

```js
function importLinia(producte) {
  return producte.preu * producte.quantitat;
}
```

**5. Template strings**

`"Total: " + total` se lee peor que `` `Total: ${total}` ``.

---

Versión más legible, misma lógica:

```js
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
```

Cada función hace una cosa; los nombres explican el “por qué” del descuento sin depender del comentario.

Si quieres, lo aplico en `Exercici5/app.js`.

---

**User**

aplicalo

---

**Cursor**

He aplicado los cambios en `Exercici5/app.js`.

- Constantes para el umbral y el factor de descuento
- `importLinia` y `aplicarDescompte` aparte del total
- `reduce` en lugar del `for` con índice
- `console.log` fuera de `calcularTotal`

El resultado sigue siendo el mismo: subtotal 90, sin descuento porque no supera 100.

---

**User**

explica los cambios

---

**Cursor**

El comportamiento no ha cambiado: se suma `preu * quantitat` de cada producto y, si el total supera 100, se aplica un 10 % de descuento. Lo que cambió es **cómo se expresa** esa lógica.

**Antes**, una sola función hacía tres cosas: recorrer el array, aplicar el descuento e imprimir. Los números `100` y `0.9` estaban sueltos y el bucle usaba índices (`productes[i]`), así que había que leer el comentario y el `i` para entender qué pasaba.

**Ahora** queda así, por partes:

**Constantes**  
`IMPORT_MINIM_DESCOMPTE` y `FACTOR_DESCOMPTE` dan nombre a las reglas de negocio. Al leer `if (total > IMPORT_MINIM_DESCOMPTE)` se entiende el criterio sin ir al comentario.

**`importLinia`**  
Calcula el importe de una línea. El parámetro `{ preu, quantitat }` es *destructuring*: solo se usan esos dos campos. Queda claro que el nombre del producto no entra en el cálculo.

**`aplicarDescompte`**  
Aísla la regla “si supera el umbral, multiplica por 0.9; si no, deja el total”. `calcularTotal` ya no mezcla suma y descuento.

**`reduce` en `calcularTotal`**  
Sustituye el `for` con índice. Empieza en `0` y, por cada producto, suma `importLinia`. El acumulador se llama `acumulat` y el resultado `subtotal`, así se distingue el total antes del descuento del total final.

**`console.log` fuera**  
`calcularTotal` solo **devuelve** un número. Imprimir es otra responsabilidad. Así la función se puede reutilizar (tests, otra pantalla) sin escribir en consola. El template `` `Total: ${total}` `` sustituye la concatenación `"Total: " + total`.

En resumen: mismas cuentas, código más cercano al lenguaje del problema (línea, subtotal, descuento) y cada función con un solo trabajo.

---

**User**

actualiza a ECMA script y explica porque los cambios

---

**Cursor**

Voy a modernizar el script con sintaxis ECMAScript actual y dejar el archivo listo para explicarte cada cambio.

He actualizado `Exercici5/app.js` a un estilo ECMAScript moderno (ES2015+). El resultado sigue siendo el mismo; cambia la sintaxis.

**Funciones flecha (`const fn = () =>`)**  
En lugar de `function importLinia(...) { ... }`. En ES6 las funciones se declaran como constantes: no se pueden reasignar y el nombre queda junto a la definición. En las de una sola expresión se puede omitir `return` (`importLinia`, `aplicarDescompte`).

**Parámetros por defecto**  
`{ preu = 0, quantitat = 0 } = {}` y `productes = []` son de ES6. Si falta un producto, un campo o el array, no aparece `undefined * undefined` ni un error al recorrer. El `= {}` cubre la llamada sin argumento: si no, destructuring de `undefined` fallaría.

**Operador ternario**  
`aplicarDescompte` pasa de un `if` con dos `return` a una expresión. Encaja con las flechas de una línea: “si supera el umbral, aplica factor; si no, el mismo total”.

**`.map` + `.reduce`**  
`.map(importLinia)` convierte cada producto en su importe (ES5, muy habitual en ES6+). `.reduce` solo suma números, no objetos. El flujo se lee: productos → importes de línea → subtotal → descuento.

**`const` y plantillas**  
Ya estaban: `const` evita reasignar totales y listas; `` `Total: ${total}` `` es el interpolado de ES6 frente a `"Total: " + total`.

No hace falta `var`, bucles con índice ni concatenar strings. El código declara datos inmutables a nivel de referencia y describe transformaciones sobre el array, que es el estilo habitual de ECMAScript actual.

