/**
 * FlexShop - Exercici 6
 * Arquitectura Neta: Model-Vista-Controlador (MVC) amb Ports i Adaptadors (Hexagonal)
 *
 * Capes:
 * 1. Domini / Models: Product, Cart, FormValidator, VALIDATORS
 * 2. Ports i Adaptadors d'Infraestructura: ICartStorage, LocalStorageCartAdapter, MemoryCartAdapter
 * 3. Vistes (Presentació / DOM): CartView, CheckoutFormView, ProductsGridView, NotificationView
 * 4. Controladors (Aplicació): ShopController
 */

const STORAGE_KEY = "flexshop-cart";
const CARD_DIGITS = 16;
const NOTIFICATION_MS = 3000;

// Utilitat d'accés segur al DOM per a entorns de navegador
const $ = (id) => (typeof document !== "undefined" ? document.getElementById(id) : null);

/* ==========================================================================
   1. CAPA DE DOMINI / MODELS (CORE DOMAIN)
   ========================================================================== */

/**
 * Entitat Producte immutable amb validació de regles de negoci.
 */
class Product {
    #id;
    #name;
    #price;

    constructor({ id, name, price }) {
        if (!id || typeof id !== "string" || !id.trim()) {
            throw new Error("L'identificador del producte és invàlid.");
        }
        if (!name || typeof name !== "string" || !name.trim()) {
            throw new Error("El nom del producte no és vàlid.");
        }
        const numericPrice = Number(price);
        if (Number.isNaN(numericPrice) || numericPrice <= 0) {
            throw new Error("El preu del producte ha de ser un número positiu.");
        }

        this.#id = id.trim();
        this.#name = name.trim();
        this.#price = numericPrice;
        Object.freeze(this);
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get price() {
        return this.#price;
    }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            price: this.#price,
        };
    }
}

/**
 * Funció de compatibilitat per a validació de productes
 */
function validateProduct(product) {
    if (!product || typeof product !== "object") {
        throw new Error("El producte no té un format vàlid.");
    }
    new Product({
        id: product.id,
        name: product.name,
        price: product.price,
    });
    return true;
}

/**
 * Generadors de regles de validació pures i reutilitzables (DRY).
 */
const VALIDATORS = {
    required: (message = "Aquest camp és obligatori") => (value) => {
        return Boolean(value && String(value).trim().length > 0) ? null : message;
    },

    minLength: (min, message) => (value) => {
        if (!value) return null;
        return String(value).trim().length >= min
            ? null
            : (message || `Ha de tenir almenys ${min} caràcters`);
    },

    pattern: (regex, message) => (value) => {
        if (!value) return null;
        return regex.test(String(value).trim()) ? null : message;
    },

    email: (message = "Si us plau, introdueix un email vàlid") => (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return VALIDATORS.pattern(emailRegex, message)(value);
    },

    creditCard: (message = `El número de targeta ha de tenir ${CARD_DIGITS} dígits`) => (value) => {
        if (!value) return null;
        const digits = String(value).replace(/[\s-]/g, "");
        if (!/^\d+$/.test(digits)) {
            return "El número de targeta només pot contenir dígits";
        }
        if (digits.length !== CARD_DIGITS) {
            return message;
        }
        return null;
    },
};

/**
 * Esquema de validació per defecte.
 */
const FORM_RULES = {
    name: [
        VALIDATORS.required("Si us plau, introdueix el teu nom complet"),
        VALIDATORS.minLength(2, "El nom ha de tenir almenys 2 caràcters"),
    ],
    email: [
        VALIDATORS.required("L'email és obligatori"),
        VALIDATORS.email("Si us plau, introdueix un email vàlid"),
    ],
    card: [
        VALIDATORS.required("El número de targeta és obligatori"),
        VALIDATORS.creditCard(`El número de targeta ha de tenir ${CARD_DIGITS} dígits`),
    ],
};

/**
 * Model de Validació (Pure Domain).
 * Gestiona regles, estat d'errors i avaluació sense dependències del DOM.
 */
class FormValidator {
    #rules = {};
    #errors = {};

    constructor(rules = FORM_RULES) {
        this.#rules = { ...rules };
    }

    get errors() {
        return { ...this.#errors };
    }

    get isValid() {
        return Object.keys(this.#errors).length === 0;
    }

    hasRule(field) {
        return Boolean(this.#rules[field]);
    }

    validateField(field, value) {
        const fieldRules = this.#rules[field];
        if (!fieldRules) return null;

        for (const rule of fieldRules) {
            const error = rule(value);
            if (error) {
                this.#errors[field] = error;
                return error;
            }
        }

        delete this.#errors[field];
        return null;
    }

    validateForm(formData) {
        this.#errors = {};

        for (const field of Object.keys(this.#rules)) {
            const value = formData?.[field] ?? "";
            const error = this.validateField(field, value);
            if (error) {
                this.#errors[field] = error;
            }
        }

        return Object.keys(this.#errors).length === 0;
    }

    getFieldError(field) {
        return this.#errors[field] || null;
    }

    clearErrors() {
        this.#errors = {};
    }

    // Mètode de compatibilitat visual
    showErrors() {
        FormUI.clearFieldErrors();
        FormUI.displayErrors(this.#errors);
    }
}

/* ==========================================================================
   2. PORTS I ADAPTADORS D'INFRAESTRUCTURA (HEXAGONAL)
   ========================================================================== */

/**
 * Port de persistència del carret
 */
class ICartStorage {
    load() {
        throw new Error("Mètode load() no implementat.");
    }
    save(items) {
        throw new Error("Mètode save() no implementat.");
    }
}

/**
 * Adaptador d'emmagatzematge en memòria (ideal per a tests i entorns aïllats)
 */
class MemoryCartAdapter extends ICartStorage {
    #memory = [];

    constructor(initialItems = []) {
        super();
        this.#memory = Array.isArray(initialItems) ? [...initialItems] : [];
    }

    load() {
        return this.#memory.map((item) => ({ ...item }));
    }

    save(items) {
        this.#memory = items.map((item) => ({ ...item }));
    }
}

/**
 * Adaptador de persistència a LocalStorage amb tolerància a fallades
 */
class LocalStorageCartAdapter extends ICartStorage {
    #key;
    #fallback;

    constructor(key = STORAGE_KEY) {
        super();
        this.#key = key;
        this.#fallback = new MemoryCartAdapter();
    }

    load() {
        if (typeof localStorage === "undefined") {
            return this.#fallback.load();
        }
        try {
            const raw = localStorage.getItem(this.#key);
            if (!raw) return [];

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                console.warn("Les dades de la cistella emmagatzemades no són un array. Es reinicia.");
                return [];
            }

            return parsed.filter((item) => {
                return (
                    item &&
                    typeof item.id === "string" &&
                    typeof item.name === "string" &&
                    typeof item.price === "number" &&
                    !Number.isNaN(item.price) &&
                    typeof item.quantity === "number" &&
                    item.quantity > 0
                );
            });
        } catch (error) {
            console.error("Error en carregar la cistella des de LocalStorage:", error);
            return [];
        }
    }

    save(items) {
        if (typeof localStorage === "undefined") {
            this.#fallback.save(items);
            return;
        }
        try {
            localStorage.setItem(this.#key, JSON.stringify(items));
        } catch (error) {
            console.warn("No s'ha pogut desar la cistella al LocalStorage (mode privat o quota excedida):", error);
            this.#fallback.save(items);
        }
    }
}

// Àlies per a compatibilitat
const CartStorage = LocalStorageCartAdapter;

/**
 * Model del Carret (Pure Domain Model).
 * Totalment desacoblat del DOM i de la tecnologia d'emmagatzematge mitjançant injecció.
 */
class Cart {
    #items = [];
    #storage;
    #listeners = new Set();

    constructor({ storage = new LocalStorageCartAdapter(), initialItems = null } = {}) {
        this.#storage = storage;
        this.#items = initialItems ? [...initialItems] : this.#storage.load();
    }

    get items() {
        return this.#items.map((item) => ({ ...item }));
    }

    get isEmpty() {
        return this.#items.length === 0;
    }

    get totalItems() {
        return this.#items.reduce((total, item) => total + (item.quantity || 0), 0);
    }

    get totalPrice() {
        return this.#items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
    }

    getTotalItems() {
        return this.totalItems;
    }

    getTotalPrice() {
        return this.totalPrice;
    }

    findItem(productId) {
        const item = this.#items.find((entry) => entry.id === productId);
        return item ? { ...item } : null;
    }

    hasItem(productId) {
        return this.#items.some((entry) => entry.id === productId);
    }

    addItem(product) {
        try {
            validateProduct(product);

            const existing = this.#items.find((item) => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                this.#items.push({
                    id: String(product.id),
                    name: String(product.name).trim(),
                    price: Number(product.price),
                    quantity: 1,
                });
            }

            this.#persistAndNotify({ type: "itemAdded", product });
        } catch (error) {
            console.error("Error en afegir producte:", error);
            showNotification(error.message || "No s'ha pogut afegir el producte", "error");
        }
        return this;
    }

    removeItem(productId) {
        if (!productId) return this;
        const prevCount = this.#items.length;
        this.#items = this.#items.filter((item) => item.id !== productId);

        if (this.#items.length !== prevCount) {
            this.#persistAndNotify({ type: "itemRemoved", productId });
        }
        return this;
    }

    updateQuantity(productId, quantity) {
        const item = this.#items.find((entry) => entry.id === productId);
        if (!item) return this;

        const parsedQty = Number.parseInt(quantity, 10);
        if (Number.isNaN(parsedQty) || parsedQty <= 0) {
            return this.removeItem(productId);
        }

        item.quantity = parsedQty;
        this.#persistAndNotify({ type: "quantityUpdated", productId, quantity: parsedQty });
        return this;
    }

    clear() {
        if (this.#items.length === 0) return this;
        this.#items = [];
        this.#persistAndNotify({ type: "cleared" });
        return this;
    }

    clearCart() {
        return this.clear();
    }

    /**
     * Patró Observer: Permet que les Vistes i Controladors es subscriguin als canvis d'estat.
     */
    subscribe(listener) {
        if (typeof listener !== "function") return () => {};
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }

    #persistAndNotify(event) {
        this.#storage.save(this.#items);
        this.updateCartCount();
        for (const listener of this.#listeners) {
            try {
                listener(this, event);
            } catch (err) {
                console.error("Error en listener de Cart:", err);
            }
        }
    }

    // Mètodes de compatibilitat visual
    updateCartCount() {
        CartUI.updateBadge(this);
    }

    showCart() {
        CartUI.openCheckout(this);
    }

    showCheckout() {
        CartUI.showCheckoutSection();
    }

    hideCheckout() {
        CartUI.hideCheckoutSection();
    }
}

/* ==========================================================================
   3. CAPA DE PRESENTACIÓ / VISTES (VIEWS)
   ========================================================================== */

/**
 * Vista per a les notificacions flotants (Toasts).
 */
class NotificationView {
    static show(message, type = "success") {
        if (typeof document === "undefined" || !document?.body) {
            return;
        }

        const isError = type === "error";
        const notification = document.createElement("div");
        notification.className = `notification ${isError ? "is-error" : ""}`;
        notification.setAttribute("role", isError ? "alert" : "status");
        notification.setAttribute("aria-live", isError ? "assertive" : "polite");
        notification.setAttribute("aria-atomic", "true");
        notification.textContent = message;
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add("is-visible");
        });

        setTimeout(() => {
            notification.classList.remove("is-visible");
            setTimeout(() => notification.remove(), 300);
        }, NOTIFICATION_MS);
    }
}

/**
 * Vista del Carret (botó, insígnia comptadora, resum interactiu i panell de checkout).
 */
class CartView {
    #badgeEl;
    #cartLinkEl;
    #checkoutSectionEl;
    #cartSummaryEl;
    #checkoutFormEl;
    #checkoutSuccessEl;

    constructor() {
        this.#badgeEl = $("cart-count");
        this.#cartLinkEl = $("cart-link");
        this.#checkoutSectionEl = $("checkout-section");
        this.#cartSummaryEl = $("cart-summary");
        this.#checkoutFormEl = $("checkout-form");
        this.#checkoutSuccessEl = $("checkout-success");
    }

    render(cartModel) {
        this.renderBadge(cartModel);
        this.renderSummary(cartModel);
    }

    renderBadge(cartModel) {
        if (!this.#badgeEl && !this.#cartLinkEl) return;
        const total = cartModel ? cartModel.totalItems : 0;

        if (this.#badgeEl) {
            const prevCount = Number.parseInt(this.#badgeEl.textContent, 10) || 0;
            this.#badgeEl.textContent = String(total);
            this.#badgeEl.classList.toggle("is-visible", total > 0);

            if (total > prevCount) {
                this.#badgeEl.classList.remove("bounce");
                if (typeof this.#badgeEl.offsetWidth !== "undefined") {
                    void this.#badgeEl.offsetWidth;
                }
                this.#badgeEl.classList.add("bounce");
            }
        }

        if (this.#cartLinkEl) {
            const labelText = total === 1
                ? "Cistella de la compra: 1 article"
                : `Cistella de la compra: ${total} articles`;
            this.#cartLinkEl.setAttribute("aria-label", labelText);
        }
    }

    renderSummary(cartModel) {
        if (!this.#cartSummaryEl) return;

        if (!cartModel || cartModel.isEmpty) {
            this.#cartSummaryEl.innerHTML = `
                <div class="cart-summary-empty">
                    <span class="empty-icon" aria-hidden="true">🛒</span>
                    <p>La teva cistella està buida.</p>
                    <a href="#productes" class="btn btn-secondary btn-sm" id="btn-back-to-shop">Explorar productes</a>
                </div>
            `;
            if (this.#checkoutFormEl) {
                this.#checkoutFormEl.style.display = "none";
            }
            return;
        }

        if (this.#checkoutFormEl && (!this.#checkoutSuccessEl || this.#checkoutSuccessEl.style.display === "none")) {
            this.#checkoutFormEl.style.display = "";
        }

        const itemsHtml = cartModel.items.map((item) => `
            <li class="cart-item-row" data-id="${item.id}">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price-each">€${item.price} / unitat</span>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control" role="group" aria-label="Quantitat per a ${item.name}">
                        <button type="button" class="btn-qty btn-decrement" data-id="${item.id}" aria-label="Reduir quantitat de ${item.name}">−</button>
                        <span class="cart-item-qty" aria-live="polite" aria-label="Quantitat actual: ${item.quantity}">${item.quantity}</span>
                        <button type="button" class="btn-qty btn-increment" data-id="${item.id}" aria-label="Augmentar quantitat de ${item.name}">+</button>
                    </div>
                    <span class="cart-item-subtotal" aria-label="Subtotal: ${item.price * item.quantity} euros">€${item.price * item.quantity}</span>
                    <button type="button" class="btn-remove-item" data-id="${item.id}" aria-label="Eliminar ${item.name} de la cistella" title="Eliminar producte">✕</button>
                </div>
            </li>
        `).join("");

        this.#cartSummaryEl.innerHTML = `
            <div class="cart-summary-content">
                <h3 class="cart-summary-title">Resum de la Comanda</h3>
                <ul class="cart-items-list" role="list">
                    ${itemsHtml}
                </ul>
                <div class="cart-summary-footer">
                    <span class="cart-summary-total-label">Total a pagar:</span>
                    <span class="cart-summary-total-amount" aria-label="Total: ${cartModel.totalPrice} euros">€${cartModel.totalPrice}</span>
                </div>
            </div>
        `;
    }

    showSuccess(customerName, totalPrice) {
        if (!this.#checkoutSuccessEl) return;

        if (this.#checkoutFormEl) this.#checkoutFormEl.style.display = "none";
        if (this.#cartSummaryEl) this.#cartSummaryEl.style.display = "none";

        const orderId = Math.floor(100000 + Math.random() * 900000);
        const now = new Date();
        const formattedDate = now.toLocaleDateString("ca-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        this.#checkoutSuccessEl.innerHTML = `
            <div class="success-card">
                <div class="success-icon" aria-hidden="true">🎉</div>
                <h3 class="success-title">Gràcies per la teva compra, <span class="customer-name">${customerName || "estimat client"}</span>!</h3>
                <p class="success-subtitle">Hem processat la teva comanda correctament.</p>
                <div class="success-details">
                    <div class="success-detail-row">
                        <span>Número de comanda:</span>
                        <strong>#FLX-${orderId}</strong>
                    </div>
                    <div class="success-detail-row">
                        <span>Import abonat:</span>
                        <strong class="success-total">€${totalPrice}</strong>
                    </div>
                    <div class="success-detail-row">
                        <span>Data:</span>
                        <time datetime="${now.toISOString()}">${formattedDate}</time>
                    </div>
                </div>
                <button type="button" class="btn btn-primary btn-continue-shopping" id="btn-continue-shopping">Continuar comprant</button>
            </div>
        `;

        this.#checkoutSuccessEl.style.display = "block";
        if (typeof this.#checkoutSuccessEl.focus === "function") {
            this.#checkoutSuccessEl.focus();
        }
    }

    openCheckout() {
        if (!this.#checkoutSectionEl) return;
        this.#checkoutSectionEl.classList.add("is-visible");
        this.#checkoutSectionEl.setAttribute("aria-hidden", "false");
        if (this.#cartLinkEl) {
            this.#cartLinkEl.setAttribute("aria-expanded", "true");
        }
        if (typeof this.#checkoutSectionEl.scrollIntoView === "function") {
            this.#checkoutSectionEl.scrollIntoView({ behavior: "smooth" });
        }
    }

    closeCheckout() {
        if (!this.#checkoutSectionEl) return;
        this.#checkoutSectionEl.classList.remove("is-visible");
        this.#checkoutSectionEl.setAttribute("aria-hidden", "true");
        if (this.#cartLinkEl) {
            this.#cartLinkEl.setAttribute("aria-expanded", "false");
        }
        if (this.#checkoutSuccessEl) {
            this.#checkoutSuccessEl.style.display = "none";
            this.#checkoutSuccessEl.innerHTML = "";
        }
        if (this.#checkoutFormEl) {
            this.#checkoutFormEl.style.display = "";
        }
        if (this.#cartSummaryEl) {
            this.#cartSummaryEl.style.display = "";
        }
    }

    bindToggleCart(handler) {
        if (!this.#cartLinkEl) return;
        this.#cartLinkEl.addEventListener("click", (event) => {
            event.preventDefault();
            handler();
        });
    }

    bindItemQuantityChange(handler) {
        if (!this.#checkoutSectionEl) return;
        this.#checkoutSectionEl.addEventListener("click", (event) => {
            const btnInc = event.target.closest(".btn-increment");
            const btnDec = event.target.closest(".btn-decrement");
            if (btnInc && btnInc.dataset.id) {
                event.preventDefault();
                handler(btnInc.dataset.id, 1);
            } else if (btnDec && btnDec.dataset.id) {
                event.preventDefault();
                handler(btnDec.dataset.id, -1);
            }
        });
    }

    bindItemRemove(handler) {
        if (!this.#checkoutSectionEl) return;
        this.#checkoutSectionEl.addEventListener("click", (event) => {
            const btnRemove = event.target.closest(".btn-remove-item");
            if (btnRemove && btnRemove.dataset.id) {
                event.preventDefault();
                handler(btnRemove.dataset.id);
            }
        });
    }

    bindContinueShopping(handler) {
        if (!this.#checkoutSectionEl) return;
        this.#checkoutSectionEl.addEventListener("click", (event) => {
            const btn = event.target.closest("#btn-continue-shopping, #btn-back-to-shop");
            if (btn) {
                event.preventDefault();
                handler();
            }
        });
    }

    // Mètodes estàtics de compatibilitat
    static updateBadge(cart) {
        new CartView().render(cart);
    }

    static openCheckout(cart) {
        if (cart.isEmpty) {
            NotificationView.show("La cistella està buida! Afegeix algun producte primer.", "error");
            return;
        }
        new CartView().openCheckout();
    }

    static showCheckoutSection() {
        new CartView().openCheckout();
    }

    static hideCheckoutSection() {
        new CartView().closeCheckout();
    }
}

const CartUI = CartView;

/**
 * Vista del Formulari de Checkout.
 * Gestiona inputs, estats d'error visuals i accessibilitat WAI-ARIA.
 */
class CheckoutFormView {
    #formEl;
    #cancelBtnEl;

    constructor() {
        this.#formEl = $("checkout-form");
        this.#cancelBtnEl = $("cancel-checkout");
    }

    get formElement() {
        return this.#formEl;
    }

    getFormData() {
        if (!this.#formEl) return {};
        return Object.fromEntries(new FormData(this.#formEl).entries());
    }

    setFieldError(field, message) {
        const input = $(field);
        const errorEl = $(`${field}-error`);
        if (!input || !errorEl) return;

        const hasError = Boolean(message);
        input.classList.toggle("error", hasError);
        input.setAttribute("aria-invalid", String(hasError));

        if (hasError) {
            errorEl.textContent = message;
            input.setAttribute("aria-describedby", `${field}-error`);
        }
        errorEl.classList.toggle("is-visible", hasError);
    }

    hasFieldError(field) {
        const input = $(field);
        return input ? input.classList.contains("error") : false;
    }

    displayErrors(errors) {
        for (const [field, message] of Object.entries(errors)) {
            this.setFieldError(field, message);
        }
    }

    clearFieldErrors() {
        if (!this.#formEl) return;
        this.#formEl.querySelectorAll(".error-message").forEach((el) => {
            el.classList.remove("is-visible");
        });
        this.#formEl.querySelectorAll("input").forEach((input) => {
            input.classList.remove("error");
            input.setAttribute("aria-invalid", "false");
        });
    }

    reset() {
        if (!this.#formEl) return;
        this.#formEl.reset();
    }

    bindFieldBlur(handler) {
        if (!this.#formEl) return;
        this.#formEl.addEventListener("focusout", (event) => {
            const { name, value } = event.target;
            if (name) handler(name, value);
        });
    }

    bindFieldInput(handler) {
        if (!this.#formEl) return;
        this.#formEl.addEventListener("input", (event) => {
            const { name, value } = event.target;
            if (name) handler(name, value, event.target);
        });
    }

    bindSubmit(handler) {
        if (!this.#formEl) return;
        this.#formEl.addEventListener("submit", (event) => {
            event.preventDefault();
            handler(this.getFormData());
        });
    }

    bindCancel(handler) {
        if (!this.#cancelBtnEl) return;
        this.#cancelBtnEl.addEventListener("click", () => {
            handler();
        });
    }
}

const FormUI = {
    setFieldError: (field, message) => new CheckoutFormView().setFieldError(field, message),
    clearFieldErrors: () => new CheckoutFormView().clearFieldErrors(),
    displayErrors: (errors) => new CheckoutFormView().displayErrors(errors),
};

function setFieldError(field, message) {
    FormUI.setFieldError(field, message);
}

function clearFieldErrors() {
    FormUI.clearFieldErrors();
}

function showNotification(message, type = "success") {
    NotificationView.show(message, type);
}

/**
 * Vista del Catàleg de Productes.
 */
class ProductsGridView {
    #gridEl;

    constructor() {
        this.#gridEl = typeof document !== "undefined" ? document.querySelector(".products-grid") : null;
    }

    bindAddToCart(handler) {
        if (!this.#gridEl) return;
        this.#gridEl.addEventListener("click", (event) => {
            const button = event.target.closest(".add-to-cart");
            if (!button) return;

            event.preventDefault();
            const productData = readProductFromButton(button);
            handler(productData, button);
        });
    }
}

function readProductFromButton(button) {
    if (!button || !button.dataset) {
        throw new Error("No s'han pogut llegir les dades del botó de compra.");
    }

    const price = Number.parseFloat(button.dataset.price);
    const product = {
        id: button.dataset.id?.trim() || "",
        name: button.dataset.name?.trim() || "",
        price,
    };

    validateProduct(product);
    return product;
}

function formatCardNumber(value) {
    const digits = String(value || "")
        .replace(/\D/g, "")
        .slice(0, CARD_DIGITS);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/* ==========================================================================
   4. CAPA DE CONTROLADORS (CONTROLLER / APPLICATION)
   ========================================================================== */

/**
 * Controlador Principal de la Botiga (MVC Application Controller).
 * Coordina el flux entre Vistes i Models de Domini.
 */
class ShopController {
    #cart;
    #validator;
    #cartView;
    #checkoutView;
    #productsView;
    #notificationView;

    constructor({
        cart,
        validator,
        cartView,
        checkoutView,
        productsView,
        notificationView,
    }) {
        this.#cart = cart;
        this.#validator = validator;
        this.#cartView = cartView;
        this.#checkoutView = checkoutView;
        this.#productsView = productsView;
        this.#notificationView = notificationView;
    }

    init() {
        // 1. Subscripció reactiva al Model de la Cistella (Observer Pattern)
        this.#cart.subscribe((cart, event) => {
            this.#cartView.render(cart);
            if (event?.type === "itemAdded" && event.product?.name) {
                this.#notificationView.show(`S'ha afegit "${event.product.name}" a la cistella!`, "success");
            }
        });

        // 2. Render inicial de la vista
        this.#cartView.render(this.#cart);

        // 3. Vincular esdeveniments de les Vistes als mètodes del Controlador
        this.#productsView.bindAddToCart((product, btn) => this.handleAddToCart(product, btn));
        this.#cartView.bindToggleCart(() => this.handleToggleCheckout());

        if (typeof this.#cartView.bindItemQuantityChange === "function") {
            this.#cartView.bindItemQuantityChange((id, delta) => this.handleUpdateQuantity(id, delta));
        }
        if (typeof this.#cartView.bindItemRemove === "function") {
            this.#cartView.bindItemRemove((id) => this.handleRemoveItem(id));
        }
        if (typeof this.#cartView.bindContinueShopping === "function") {
            this.#cartView.bindContinueShopping(() => this.handleContinueShopping());
        }

        this.#checkoutView.bindFieldBlur((field, value) => this.handleFieldBlur(field, value));
        this.#checkoutView.bindFieldInput((field, value) => this.handleFieldInput(field, value));
        this.#checkoutView.bindSubmit((formData) => this.handleSubmitCheckout(formData));
        this.#checkoutView.bindCancel(() => this.handleCancelCheckout());

        // 4. Formatejador en viu de la targeta de crèdit
        const cardInput = $("card");
        if (cardInput) {
            cardInput.addEventListener("input", (event) => {
                event.target.value = formatCardNumber(event.target.value);
            });
        }
    }

    handleAddToCart(product, button) {
        try {
            this.#cart.addItem(product);
            if (button && !button.classList.contains("is-added")) {
                const originalText = button.textContent;
                button.classList.add("is-added");
                button.textContent = "Afegit! ✓";
                setTimeout(() => {
                    button.classList.remove("is-added");
                    button.textContent = originalText;
                }, 900);
            }
        } catch (error) {
            console.error("Error processant producte:", error);
            this.#notificationView.show("No s'ha pogut afegir el producte a la cistella.", "error");
        }
    }

    handleUpdateQuantity(productId, delta) {
        const item = this.#cart.findItem(productId);
        if (!item) return;
        const newQty = item.quantity + delta;
        this.#cart.updateQuantity(productId, newQty);
    }

    handleRemoveItem(productId) {
        this.#cart.removeItem(productId);
        this.#notificationView.show("Producte eliminat de la cistella.", "success");
    }

    handleContinueShopping() {
        this.#cartView.closeCheckout();
        const catalog = typeof document !== "undefined" ? document.getElementById("productes") : null;
        if (catalog && typeof catalog.scrollIntoView === "function") {
            catalog.scrollIntoView({ behavior: "smooth" });
        }
    }

    handleToggleCheckout() {
        if (this.#cart.isEmpty) {
            this.#notificationView.show("La cistella està buida! Afegeix algun producte primer.", "error");
            return;
        }
        this.#cartView.openCheckout();
    }

    handleFieldBlur(field, value) {
        if (!this.#validator.hasRule(field)) return;
        const error = this.#validator.validateField(field, value);
        this.#checkoutView.setFieldError(field, error);
    }

    handleFieldInput(field, value) {
        if (!this.#validator.hasRule(field)) return;
        if (this.#checkoutView.hasFieldError(field)) {
            const error = this.#validator.validateField(field, value);
            this.#checkoutView.setFieldError(field, error);
        }
    }

    handleSubmitCheckout(formData) {
        try {
            if (this.#cart.isEmpty) {
                this.#notificationView.show("La cistella està buida! Afegeix productes abans de finalitzar la compra.", "error");
                this.#cartView.closeCheckout();
                return;
            }

            if (!this.#validator.validateForm(formData)) {
                this.#checkoutView.displayErrors(this.#validator.errors);
                this.#notificationView.show("Si us plau, revisa els camps amb errors abans de continuar.", "error");
                return;
            }

            const totalPrice = this.#cart.totalPrice;
            const customerName = (formData.name || "").trim();

            this.#cart.clear();
            this.#checkoutView.reset();
            this.#checkoutView.clearFieldErrors();

            if (typeof this.#cartView.showSuccess === "function") {
                this.#cartView.showSuccess(customerName, totalPrice);
            } else if (typeof alert !== "undefined") {
                alert(`✅ Compra confirmada!\n\nClient: ${customerName}\nTotal: €${totalPrice}\n\nGràcies per la teva compra!`);
                this.#cartView.closeCheckout();
            }

            this.#notificationView.show("Comanda confirmada amb èxit!", "success");
        } catch (error) {
            console.error("Error processant la compra:", error);
            this.#notificationView.show("S'ha produït un error inesperat en processar la compra.", "error");
        }
    }

    handleCancelCheckout() {
        this.#cartView.closeCheckout();
        this.#checkoutView.reset();
        this.#checkoutView.clearFieldErrors();
    }
}

/* ==========================================================================
   5. BOOTSTRAP / INICIALITZACIÓ DE L'APLICACIÓ
   ========================================================================== */

function initShop() {
    // Model de dades amb adaptador de persistència
    const storageAdapter = new LocalStorageCartAdapter(STORAGE_KEY);
    const cartModel = new Cart({ storage: storageAdapter });
    const validatorModel = new FormValidator(FORM_RULES);

    // Vistes del DOM
    const cartView = new CartView();
    const checkoutView = new CheckoutFormView();
    const productsView = new ProductsGridView();
    const notificationView = NotificationView;

    // Controlador que connecta Model i Vista
    const controller = new ShopController({
        cart: cartModel,
        validator: validatorModel,
        cartView,
        checkoutView,
        productsView,
        notificationView,
    });

    controller.init();
    return controller;
}

// Inicialitzar quan el DOM estigui a punt en entorns de navegador
if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initShop);
    } else {
        initShop();
    }
}

// Exportar per a proves unitàries en entorns Node.js / mòduls
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        STORAGE_KEY,
        CARD_DIGITS,
        VALIDATORS,
        FORM_RULES,
        Product,
        Cart,
        FormValidator,
        FormUI,
        CartStorage,
        CartUI,
        ICartStorage,
        MemoryCartAdapter,
        LocalStorageCartAdapter,
        CartView,
        CheckoutFormView,
        ProductsGridView,
        NotificationView,
        ShopController,
        validateProduct,
        readProductFromButton,
        formatCardNumber,
        setFieldError,
        clearFieldErrors,
        showNotification,
        initShop,
    };
}
