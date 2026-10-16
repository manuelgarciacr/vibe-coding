const STORAGE_KEY = "flexshop-cart";
const CARD_DIGITS = 16;
const NOTIFICATION_MS = 3000;

const $ = (id) => document.getElementById(id);

class Cart {
    constructor() {
        this.items = this.loadFromStorage();
        this.updateCartCount();
    }

    addItem(product) {
        const existing = this.items.find((item) => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }

        this.saveToStorage();
        this.updateCartCount();
        showNotification(`S'ha afegit ${product.name} a la cistella!`);
    }

    removeItem(productId) {
        this.items = this.items.filter((item) => item.id !== productId);
        this.saveToStorage();
        this.updateCartCount();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find((entry) => entry.id === productId);
        if (!item) {
            return;
        }

        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
            this.removeItem(productId);
            return;
        }

        this.saveToStorage();
        this.updateCartCount();
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    updateCartCount() {
        const badge = $("cart-count");
        const total = this.getTotalItems();
        badge.textContent = String(total);
        badge.classList.toggle("is-visible", total > 0);
    }

    saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        } catch {
            // Quota or private mode: keep working in memory only.
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    showCart() {
        if (this.items.length === 0) {
            alert("La cistella està buida!");
            return;
        }
        this.showCheckout();
    }

    showCheckout() {
        const section = $("checkout-section");
        section.classList.add("is-visible");
        section.scrollIntoView({ behavior: "smooth" });
    }

    hideCheckout() {
        $("checkout-section").classList.remove("is-visible");
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartCount();
        this.hideCheckout();
    }
}

class FormValidator {
    constructor() {
        this.errors = {};
    }

    validateName(name) {
        if (!name || name.trim().length < 2) {
            return "El nom ha de tenir almenys 2 caràcters";
        }
        return null;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return "Si us plau, introdueix un email vàlid";
        }
        return null;
    }

    validateCard(card) {
        const digits = card.replace(/[\s-]/g, "");

        if (!digits || digits.length !== CARD_DIGITS) {
            return "El número de targeta ha de tenir 16 dígits";
        }
        if (!/^\d+$/.test(digits)) {
            return "El número de targeta només pot contenir dígits";
        }
        return null;
    }

    validateForm({ name, email, card }) {
        this.errors = {};
        const nameError = this.validateName(name);
        const emailError = this.validateEmail(email);
        const cardError = this.validateCard(card);

        if (nameError) this.errors.name = nameError;
        if (emailError) this.errors.email = emailError;
        if (cardError) this.errors.card = cardError;

        return Object.keys(this.errors).length === 0;
    }

    showErrors() {
        clearFieldErrors();
        Object.entries(this.errors).forEach(([field, message]) => {
            setFieldError(field, message);
        });
    }
}

function setFieldError(field, message) {
    const input = $(field);
    const errorEl = $(`${field}-error`);
    if (!input || !errorEl) {
        return;
    }

    const hasError = Boolean(message);
    input.classList.toggle("error", hasError);
    if (hasError) {
        errorEl.textContent = message;
    }
    errorEl.classList.toggle("is-visible", hasError);
}

function clearFieldErrors() {
    document.querySelectorAll(".error-message").forEach((el) => {
        el.classList.remove("is-visible");
    });
    document.querySelectorAll("input").forEach((input) => {
        input.classList.remove("error");
    });
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.setAttribute("role", "status");
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

function formatCardNumber(value) {
    return value
        .replace(/[\s-]/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
}

function readProductFromButton(button) {
    return {
        id: button.dataset.id,
        name: button.dataset.name,
        price: Number.parseInt(button.dataset.price, 10),
    };
}

function initShop() {
    const cart = new Cart();
    const validator = new FormValidator();
    const checkoutForm = $("checkout-form");

    document.querySelector(".products-grid").addEventListener("click", (event) => {
        const button = event.target.closest(".add-to-cart");
        if (!button) {
            return;
        }
        event.preventDefault();
        cart.addItem(readProductFromButton(button));
    });

    $("cart-link").addEventListener("click", (event) => {
        event.preventDefault();
        cart.showCart();
    });

    $("card").addEventListener("input", (event) => {
        event.target.value = formatCardNumber(event.target.value);
    });

    checkoutForm.addEventListener("focusout", (event) => {
        const field = event.target.name;
        if (!field) {
            return;
        }

        const checks = {
            name: validator.validateName,
            email: validator.validateEmail,
            card: validator.validateCard,
        };
        const check = checks[field];
        if (!check) {
            return;
        }

        setFieldError(field, check.call(validator, event.target.value));
    });

    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = {
            name: $("name").value,
            email: $("email").value,
            card: $("card").value,
        };

        if (!validator.validateForm(formData)) {
            validator.showErrors();
            return;
        }

        alert(`✅ Compra confirmada!\n\nTotal: €${cart.getTotalPrice()}\n\nGràcies per la teva compra!`);
        cart.clearCart();
        checkoutForm.reset();
        clearFieldErrors();
    });

    $("cancel-checkout").addEventListener("click", () => {
        cart.hideCheckout();
        checkoutForm.reset();
        clearFieldErrors();
    });
}

initShop();
