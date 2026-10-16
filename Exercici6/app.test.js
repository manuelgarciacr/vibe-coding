/**
 * Tests unitaris per a Exercici6 (FlexShop)
 * Execució: `node --test Exercici6/app.test.js` o `node Exercici6/app.test.js`
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

const {
    VALIDATORS,
    FORM_RULES,
    Product,
    Cart,
    FormValidator,
    FormUI,
    CartStorage,
    MemoryCartAdapter,
    ShopController,
    validateProduct,
    readProductFromButton,
    formatCardNumber,
    STORAGE_KEY,
} = require("./app.js");

/* ==========================================================================
   1. Proves de Regles de Validació (VALIDATORS)
   ========================================================================== */

describe("VALIDATORS", () => {
    describe("required", () => {
        const isRequired = VALIDATORS.required("Camp requerit");

        it("ha de retornar error amb valors buits o espais", () => {
            assert.strictEqual(isRequired(""), "Camp requerit");
            assert.strictEqual(isRequired("   "), "Camp requerit");
            assert.strictEqual(isRequired(null), "Camp requerit");
            assert.strictEqual(isRequired(undefined), "Camp requerit");
        });

        it("ha de retornar null quan el camp conté text vàlid", () => {
            assert.strictEqual(isRequired("Hola"), null);
            assert.strictEqual(isRequired(" a "), null);
        });
    });

    describe("minLength", () => {
        const minTwo = VALIDATORS.minLength(2, "Mínim 2 caràcters");

        it("ha de retornar error si el text té menys caràcters dels requerits", () => {
            assert.strictEqual(minTwo("A"), "Mínim 2 caràcters");
            assert.strictEqual(minTwo(" A "), "Mínim 2 caràcters");
        });

        it("ha de retornar null si té la longitud mínima o superior", () => {
            assert.strictEqual(minTwo("AB"), null);
            assert.strictEqual(minTwo("Text llarg"), null);
        });

        it("no ha de fallar si el valor és buit (responsabilitat de 'required')", () => {
            assert.strictEqual(minTwo(""), null);
            assert.strictEqual(minTwo(null), null);
        });
    });

    describe("email", () => {
        const checkEmail = VALIDATORS.email("Email no vàlid");

        it("ha d'acceptar emails amb format correcte", () => {
            assert.strictEqual(checkEmail("usuari@example.com"), null);
            assert.strictEqual(checkEmail("nom.cognom@domini.cat"), null);
            assert.strictEqual(checkEmail("test+extra@sub.domini.org"), null);
        });

        it("ha de rebutjar emails invàlids", () => {
            assert.strictEqual(checkEmail("sense-arrova"), "Email no vàlid");
            assert.strictEqual(checkEmail("usuari@"), "Email no vàlid");
            assert.strictEqual(checkEmail("@domini.com"), "Email no vàlid");
            assert.strictEqual(checkEmail("usuari@domini"), "Email no vàlid");
            assert.strictEqual(checkEmail("usuari domini@test.com"), "Email no vàlid");
        });
    });

    describe("creditCard", () => {
        const checkCard = VALIDATORS.creditCard("Targeta de 16 dígits requerida");

        it("ha d'acceptar 16 dígits amb o sense espais/guions", () => {
            assert.strictEqual(checkCard("1234567890123456"), null);
            assert.strictEqual(checkCard("1234 5678 9012 3456"), null);
            assert.strictEqual(checkCard("1234-5678-9012-3456"), null);
        });

        it("ha de rebutjar números amb menys o més de 16 dígits", () => {
            assert.strictEqual(checkCard("123456"), "Targeta de 16 dígits requerida");
            assert.strictEqual(checkCard("12345678901234567"), "Targeta de 16 dígits requerida");
        });

        it("ha de rebutjar caràcters no numèrics", () => {
            assert.strictEqual(
                checkCard("1234-5678-9012-ABCD"),
                "El número de targeta només pot contenir dígits"
            );
        });
    });
});

/* ==========================================================================
   2. Proves del Validador de Formulari (FormValidator & FORM_RULES)
   ========================================================================== */

describe("FormValidator", () => {
    let validator;

    beforeEach(() => {
        validator = new FormValidator(FORM_RULES);
    });

    it("ha de rebutjar un formulari buit i identificar tots els camps erronis", () => {
        const isValid = validator.validateForm({});
        assert.strictEqual(isValid, false);
        assert.ok(validator.errors.name, "Hauria de contenir error a 'name'");
        assert.ok(validator.errors.email, "Hauria de contenir error a 'email'");
        assert.ok(validator.errors.card, "Hauria de contenir error a 'card'");
    });

    it("ha de validar correctament un formulari amb dades vàlides", () => {
        const formData = {
            name: "Maria Garcia",
            email: "maria.garcia@example.com",
            card: "4532 1122 3344 5566",
        };

        const isValid = validator.validateForm(formData);
        assert.strictEqual(isValid, true);
        assert.deepStrictEqual(validator.errors, {});
    });

    it("ha de validar camps individuals amb validateField()", () => {
        assert.strictEqual(validator.validateField("name", "M"), "El nom ha de tenir almenys 2 caràcters");
        assert.strictEqual(validator.validateField("name", "Maria"), null);

        assert.strictEqual(validator.validateField("email", "correu_incorrecte"), "Si us plau, introdueix un email vàlid");
        assert.strictEqual(validator.validateField("email", "correcte@flexshop.cat"), null);
    });

    it("ha de verificar si un camp té regles mitjançant hasRule()", () => {
        assert.strictEqual(validator.hasRule("name"), true);
        assert.strictEqual(validator.hasRule("email"), true);
        assert.strictEqual(validator.hasRule("inexistent"), false);
    });

    it("ha de protegir l'estat intern d'errors contra mutacions externes", () => {
        validator.validateForm({});
        const errorsCopy = validator.errors;
        errorsCopy.name = "Mutació externa";
        assert.notStrictEqual(validator.getFieldError("name"), "Mutació externa");
    });

    it("ha de netejar errors mitjançant clearErrors()", () => {
        validator.validateForm({});
        assert.strictEqual(validator.isValid, false);
        validator.clearErrors();
        assert.strictEqual(validator.isValid, true);
        assert.deepStrictEqual(validator.errors, {});
    });
});

/* ==========================================================================
   3. Proves de Format i Validació de Productes
   ========================================================================== */

describe("Format i Validació de Productes", () => {
    describe("formatCardNumber", () => {
        it("ha d'afegir espais cada 4 dígits i limitar a 16 caràcters", () => {
            assert.strictEqual(formatCardNumber("12345678"), "1234 5678");
            assert.strictEqual(formatCardNumber("1234567890123456"), "1234 5678 9012 3456");
            // Descarta caràcters que superin els 16 dígits
            assert.strictEqual(formatCardNumber("12345678901234569999"), "1234 5678 9012 3456");
        });

        it("ha d'eliminar lletres o símbols automàticament", () => {
            assert.strictEqual(formatCardNumber("12ab34cd56"), "1234 56");
        });
    });

    describe("validateProduct", () => {
        it("ha d'acceptar un producte correcte", () => {
            const valid = { id: "p1", name: "Laptop Ultra", price: 899 };
            assert.strictEqual(validateProduct(valid), true);
        });

        it("ha de llençar un Error si el producte és null o no és un objecte", () => {
            assert.throws(() => validateProduct(null), /format vàlid/);
            assert.throws(() => validateProduct("producte"), /format vàlid/);
        });

        it("ha de llençar un Error si falta l'id o el nom", () => {
            assert.throws(() => validateProduct({ id: "", name: "Laptop", price: 100 }), /identificador/);
            assert.throws(() => validateProduct({ id: "1", name: "", price: 100 }), /nom del producte/);
        });

        it("ha de llençar un Error si el preu és negatiu, zero o NaN", () => {
            assert.throws(() => validateProduct({ id: "1", name: "Laptop", price: -10 }), /preu.*positiu/);
            assert.throws(() => validateProduct({ id: "1", name: "Laptop", price: 0 }), /preu.*positiu/);
            assert.throws(() => validateProduct({ id: "1", name: "Laptop", price: Number.NaN }), /preu.*positiu/);
        });
    });

    describe("readProductFromButton", () => {
        it("ha d'extreure correctament les dades d'un botó", () => {
            const mockButton = {
                dataset: {
                    id: "3",
                    name: "Auriculars Wireless",
                    price: "199",
                },
            };
            const product = readProductFromButton(mockButton);
            assert.deepStrictEqual(product, {
                id: "3",
                name: "Auriculars Wireless",
                price: 199,
            });
        });

        it("ha de llençar un Error si el botó no té dataset vàlid o el preu és erroni", () => {
            assert.throws(() => readProductFromButton(null), /No s'han pogut llegir/);
            assert.throws(
                () => readProductFromButton({ dataset: { id: "1", name: "Test", price: "no-number" } }),
                /preu/
            );
        });
    });
});

/* ==========================================================================
   4. Proves del Carret de Compra (Cart)
   ========================================================================== */

describe("Cart", () => {
    let mockStorage;
    let originalLocalStorage;

    beforeEach(() => {
        mockStorage = {};
        originalLocalStorage = global.localStorage;
        global.localStorage = {
            getItem: (key) => mockStorage[key] || null,
            setItem: (key, val) => {
                mockStorage[key] = String(val);
            },
            removeItem: (key) => {
                delete mockStorage[key];
            },
            clear: () => {
                mockStorage = {};
            },
        };
    });

    it("s'ha d'inicialitzar buit si no hi ha dades a LocalStorage", () => {
        const cart = new Cart();
        assert.strictEqual(cart.getTotalItems(), 0);
        assert.strictEqual(cart.getTotalPrice(), 0);
        assert.deepStrictEqual(cart.items, []);
    });

    it("ha d'afegir un producte correctament i calcular el total", () => {
        const cart = new Cart();
        cart.addItem({ id: "1", name: "Smartphone", price: 500 });

        assert.strictEqual(cart.getTotalItems(), 1);
        assert.strictEqual(cart.getTotalPrice(), 500);
        assert.strictEqual(cart.items[0].quantity, 1);
    });

    it("ha d'incrementar la quantitat si el producte ja existeix", () => {
        const cart = new Cart();
        cart.addItem({ id: "1", name: "Smartphone", price: 500 });
        cart.addItem({ id: "1", name: "Smartphone", price: 500 });

        assert.strictEqual(cart.getTotalItems(), 2);
        assert.strictEqual(cart.getTotalPrice(), 1000);
        assert.strictEqual(cart.items.length, 1);
        assert.strictEqual(cart.items[0].quantity, 2);
    });

    it("no ha d'afegir productes invàlids i ha de capturar l'error", () => {
        const cart = new Cart();
        cart.addItem({ id: "invàlid", name: "", price: -50 });
        assert.strictEqual(cart.getTotalItems(), 0);
    });

    it("ha d'eliminar productes amb removeItem()", () => {
        const cart = new Cart();
        cart.addItem({ id: "1", name: "Smartphone", price: 500 });
        cart.addItem({ id: "2", name: "Funda", price: 20 });

        cart.removeItem("1");
        assert.strictEqual(cart.getTotalItems(), 1);
        assert.strictEqual(cart.items[0].id, "2");
    });

    it("ha d'actualitzar la quantitat amb updateQuantity() i eliminar si quantitat <= 0", () => {
        const cart = new Cart();
        cart.addItem({ id: "1", name: "Smartphone", price: 500 });

        cart.updateQuantity("1", 5);
        assert.strictEqual(cart.getTotalItems(), 5);

        cart.updateQuantity("1", 0);
        assert.strictEqual(cart.getTotalItems(), 0);
        assert.strictEqual(cart.items.length, 0);
    });

    it("ha de buidar el carret amb clearCart()", () => {
        const cart = new Cart();
        cart.addItem({ id: "1", name: "Smartphone", price: 500 });
        cart.clearCart();

        assert.strictEqual(cart.getTotalItems(), 0);
        assert.strictEqual(cart.items.length, 0);
    });

    it("ha de recuperar dades des de LocalStorage de forma segura", () => {
        mockStorage[STORAGE_KEY] = JSON.stringify([
            { id: "1", name: "Llibre", price: 25, quantity: 2 },
        ]);

        const cart = new Cart();
        assert.strictEqual(cart.getTotalItems(), 2);
        assert.strictEqual(cart.getTotalPrice(), 50);
    });

    it("ha de tolerar LocalStorage corrupte sense llençar errors no controlats", () => {
        mockStorage[STORAGE_KEY] = "{ JSON_INVÀLID: broken";

        const cart = new Cart();
        assert.strictEqual(cart.getTotalItems(), 0);
        assert.deepStrictEqual(cart.items, []);
    });

    it("ha de descartar elements amb dades incompletes a LocalStorage", () => {
        mockStorage[STORAGE_KEY] = JSON.stringify([
            { id: "1", name: "Correcte", price: 10, quantity: 1 },
            { id: "2", price: "sense-nom" },
            null,
            "element-invalid",
        ]);

        const cart = new Cart();
        assert.strictEqual(cart.items.length, 1);
        assert.strictEqual(cart.items[0].name, "Correcte");
    });

    it("ha de protegir l'estat intern d'ítems (#items) contra mutacions externes", () => {
        const cart = new Cart();
        cart.addItem({ id: "1", name: "Smartphone", price: 500 });
        const itemsCopy = cart.items;
        itemsCopy.push({ id: "hack", name: "Infiltrat", price: 0 });
        itemsCopy[0].price = 9999;

        assert.strictEqual(cart.items.length, 1);
        assert.strictEqual(cart.items[0].price, 500);
        assert.strictEqual(cart.hasItem("hack"), false);
    });

    it("ha de notificar canvis als subscriptors mitjançant el patró Observer (subscribe)", () => {
        const cart = new Cart();
        const events = [];
        const unsubscribe = cart.subscribe((c, event) => events.push(event.type));

        cart.addItem({ id: "1", name: "Smartphone", price: 500 });
        cart.updateQuantity("1", 3);
        cart.removeItem("1");

        assert.deepStrictEqual(events, ["itemAdded", "quantityUpdated", "itemRemoved"]);

        unsubscribe();
        cart.addItem({ id: "2", name: "Tablet", price: 300 });
        assert.strictEqual(events.length, 3);
    });

    it("ha de funcionar amb una instància personalitzada de CartStorage", () => {
        const customStorage = new CartStorage("custom-key");
        const cart = new Cart({ storage: customStorage });
        cart.addItem({ id: "p1", name: "Auriculars", price: 100 });
        assert.strictEqual(cart.totalItems, 1);
        assert.strictEqual(cart.isEmpty, false);
    });
});

/* ==========================================================================
   5. Proves d'Arquitectura MVC i Hexagonal (Ports & Adapters)
   ========================================================================== */

describe("Arquitectura MVC & Hexagonal", () => {
    describe("Product (Entitat de Domini)", () => {
        it("ha de crear un producte immutable i accessible", () => {
            const product = new Product({ id: "p1", name: "Teclat Mecànic", price: 80 });
            assert.strictEqual(product.id, "p1");
            assert.strictEqual(product.name, "Teclat Mecànic");
            assert.strictEqual(product.price, 80);
            assert.throws(() => {
                "use strict";
                product.price = 99;
            }, TypeError);
            assert.strictEqual(product.price, 80);
        });
    });

    describe("MemoryCartAdapter (Adaptador Hexagonal)", () => {
        it("ha de persistir i carregar en memòria sense dependre de LocalStorage", () => {
            const adapter = new MemoryCartAdapter([{ id: "1", name: "Rata", price: 20, quantity: 1 }]);
            const items = adapter.load();
            assert.strictEqual(items.length, 1);

            items.push({ id: "fake", name: "Fake", price: 0 });
            assert.strictEqual(adapter.load().length, 1);
        });
    });

    describe("ShopController (Controlador d'Aplicació MVC)", () => {
        it("ha de coordinar l'addició de productes i actualització de la vista", () => {
            const memoryStorage = new MemoryCartAdapter();
            const cart = new Cart({ storage: memoryStorage });
            const validator = new FormValidator(FORM_RULES);

            let renderedCount = null;
            let notifiedMessage = null;

            const mockCartView = {
                render: (c) => { renderedCount = c.totalItems; },
                openCheckout: () => {},
                closeCheckout: () => {},
                bindToggleCart: () => {},
            };
            const mockCheckoutView = {
                bindFieldBlur: () => {},
                bindFieldInput: () => {},
                bindSubmit: () => {},
                bindCancel: () => {},
                setFieldError: () => {},
                clearFieldErrors: () => {},
                displayErrors: () => {},
                reset: () => {},
            };
            const mockProductsView = {
                bindAddToCart: () => {},
            };
            const mockNotificationView = {
                show: (msg) => { notifiedMessage = msg; },
            };

            const controller = new ShopController({
                cart,
                validator,
                cartView: mockCartView,
                checkoutView: mockCheckoutView,
                productsView: mockProductsView,
                notificationView: mockNotificationView,
            });

            controller.init();
            assert.strictEqual(renderedCount, 0);

            controller.handleAddToCart({ id: "10", name: "Monitor 4K", price: 400 });
            assert.strictEqual(renderedCount, 1);
            assert.strictEqual(cart.totalPrice, 400);
            assert.ok(notifiedMessage.includes("Monitor 4K"));
        });

        it("ha de gestionar l'actualització de quantitats i eliminació d'ítems des del resum", () => {
            const memoryStorage = new MemoryCartAdapter();
            const cart = new Cart({ storage: memoryStorage });
            const validator = new FormValidator(FORM_RULES);

            let lastNotification = "";
            const mockCartView = {
                render: () => {},
                openCheckout: () => {},
                closeCheckout: () => {},
                bindToggleCart: () => {},
            };
            const mockCheckoutView = {
                bindFieldBlur: () => {},
                bindFieldInput: () => {},
                bindSubmit: () => {},
                bindCancel: () => {},
                setFieldError: () => {},
                clearFieldErrors: () => {},
                displayErrors: () => {},
                reset: () => {},
            };
            const mockProductsView = { bindAddToCart: () => {} };
            const mockNotificationView = { show: (msg) => { lastNotification = msg; } };

            const controller = new ShopController({
                cart,
                validator,
                cartView: mockCartView,
                checkoutView: mockCheckoutView,
                productsView: mockProductsView,
                notificationView: mockNotificationView,
            });

            controller.init();
            cart.addItem({ id: "1", name: "Smartphone", price: 500 });
            assert.strictEqual(cart.totalItems, 1);

            // Incrementar quantitat (+1)
            controller.handleUpdateQuantity("1", 1);
            assert.strictEqual(cart.totalItems, 2);
            assert.strictEqual(cart.totalPrice, 1000);

            // Decrementar quantitat (-1)
            controller.handleUpdateQuantity("1", -1);
            assert.strictEqual(cart.totalItems, 1);

            // Eliminar ítem
            controller.handleRemoveItem("1");
            assert.strictEqual(cart.isEmpty, true);
            assert.ok(lastNotification.includes("eliminat"));
        });

        it("ha de processar checkout vàlid mostrant la confirmació showSuccess() i buidant la cistella", () => {
            const memoryStorage = new MemoryCartAdapter();
            const cart = new Cart({ storage: memoryStorage });
            const validator = new FormValidator(FORM_RULES);

            cart.addItem({ id: "1", name: "Smartphone", price: 500 });

            let successCustomer = null;
            let successTotal = null;
            let formWasReset = false;

            const mockCartView = {
                render: () => {},
                openCheckout: () => {},
                closeCheckout: () => {},
                bindToggleCart: () => {},
                showSuccess: (name, total) => {
                    successCustomer = name;
                    successTotal = total;
                },
            };
            const mockCheckoutView = {
                bindFieldBlur: () => {},
                bindFieldInput: () => {},
                bindSubmit: () => {},
                bindCancel: () => {},
                setFieldError: () => {},
                clearFieldErrors: () => {},
                displayErrors: () => {},
                reset: () => { formWasReset = true; },
            };
            const mockProductsView = { bindAddToCart: () => {} };
            const mockNotificationView = { show: () => {} };

            const controller = new ShopController({
                cart,
                validator,
                cartView: mockCartView,
                checkoutView: mockCheckoutView,
                productsView: mockProductsView,
                notificationView: mockNotificationView,
            });

            controller.init();

            controller.handleSubmitCheckout({
                name: "Maria Garcia",
                email: "maria@example.com",
                card: "1234567890123456",
            });

            assert.strictEqual(successCustomer, "Maria Garcia");
            assert.strictEqual(successTotal, 500);
            assert.strictEqual(cart.isEmpty, true);
            assert.strictEqual(formWasReset, true);
        });
    });
});


