// =====================================
// TIPOS E INTERFACES (TypeScript)
// =====================================

interface Product {
  id: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

type CardIssuer = 'visa' | 'mastercard' | 'amex' | 'default';

// =====================================
// SISTEMA DE INTERNACIONALIZACIÓN (i18n) Y LOCALIZACIÓN (l10n)
// =====================================

interface LocaleConfig {
  name: string;
  flag: string;
  localeCode: string;
  currency: string;
  translations: Record<string, string>;
}

const DEFAULT_LOCALES: Record<string, LocaleConfig> = {
  es: {
    name: 'Español',
    flag: '🇪🇸',
    localeCode: 'es-ES',
    currency: 'EUR',
    translations: {
      nav_home: 'Inicio',
      nav_products: 'Productos',
      nav_offers: 'Ofertas',
      nav_contact: 'Contacto',
      cart_label: 'Canasta',
      section_title: 'Productos Destacados',
      buy_btn: 'Comprar',
      added_feedback: '✓ ¡Añadido!',
      prod1_title: 'Auriculares Bluetooth Pro',
      prod1_desc: 'Cancelación de ruido activa y batería de hasta 30 horas con sonido de alta definición.',
      prod2_title: 'Smartwatch Deportivo',
      prod2_desc: 'Monitor de frecuencia cardíaca, resistencia al agua y GPS integrado para entrenamientos.',
      prod3_title: 'Altavoz Inteligente Mini',
      prod3_desc: 'Control por voz, sonido envolvente de 360 grados y conectividad multiplataforma.',
      cart_modal_title: '🛒 Canasta de Compra',
      cart_empty_title: '🛒 Tu canasta está vacía.',
      cart_empty_sub: 'Añade productos de la tienda para comenzar.',
      cart_unit: 'ud.',
      cart_total_label: 'Total:',
      cart_clear_btn: 'Vaciar canasta',
      cart_checkout_btn: 'Finalizar compra',
      cart_clear_confirm: '¿Deseas vaciar todos los productos de tu canasta?',
      cart_empty_alert: 'La canasta está vacía. Añade al menos un producto antes de proceder al pago.',
      checkout_modal_title: '💳 Pasarela de Pago Seguro',
      summary_label: 'Importe total a pagar:',
      card_holder_label: 'TITULAR DE LA TARJETA',
      card_holder_default: 'NOMBRE Y APELLIDOS',
      card_expiry_label: 'CADUCA',
      card_cvv_label: 'CVV / CV2',
      card_notice: 'Esta tarjeta es intransferible y está sujeta a los términos del emisor.',
      issuer_default: 'Tarjeta',
      form_name_label: 'Nombre completo del titular',
      form_name_placeholder: 'Ej. Carlos Santana Martínez',
      form_name_error: 'Por favor, introduce el nombre del titular (mínimo 3 letras).',
      form_email_label: 'Correo electrónico de confirmación',
      form_email_placeholder: 'ejemplo@correo.com',
      form_email_error: 'Introduce un correo electrónico válido (ejemplo@correo.com).',
      form_number_label: 'Número de tarjeta',
      form_number_error: 'Número de tarjeta inválido (comprueba los dígitos).',
      form_expiry_label: 'Caducidad (MM/AA)',
      form_expiry_error: 'Fecha inválida o vencida (MM/AA).',
      form_cvv_label: 'CVV / CV2',
      form_cvv_error: 'CVV de 3 o 4 dígitos requerido.',
      btn_back_to_cart: '← Volver a la canasta',
      btn_pay: 'Confirmar y Pagar',
      success_title: '¡Pago Realizado con Éxito!',
      success_desc: 'Hemos procesado tu pago de forma segura y confirmado tu pedido.',
      success_holder: 'Titular:',
      success_email: 'Correo:',
      success_method: 'Método:',
      success_ending: 'terminada en',
      success_total: 'Total pagado:',
      success_btn: 'Aceptar y continuar',
      footer_copy: 'Todos los derechos reservados.',
      footer_privacy: 'Privacidad',
      footer_terms: 'Términos',
      footer_support: 'Soporte'
    }
  },
  ca: {
    name: 'Català',
    flag: '🏴󠁥󠁳󠁣󠁴󠁿',
    localeCode: 'ca-ES',
    currency: 'EUR',
    translations: {
      nav_home: 'Inici',
      nav_products: 'Productes',
      nav_offers: 'Ofertes',
      nav_contact: 'Contacte',
      cart_label: 'Cistella',
      section_title: 'Productes Destacats',
      buy_btn: 'Comprar',
      added_feedback: '✓ ¡Afegit!',
      prod1_title: 'Auriculars Bluetooth Pro',
      prod1_desc: 'Cancel·lació de soroll activa i bateria de fins a 30 hores amb so d\'alta definició.',
      prod2_title: 'Rellotge Intel·ligent Esportiu',
      prod2_desc: 'Monitor de freqüència cardíaca, resistència a l\'aigua i GPS integrat per a entrenaments.',
      prod3_title: 'Altaveu Intel·ligent Mini',
      prod3_desc: 'Control per veu, so envoltant de 360 graus i connectivitat multiplataforma.',
      cart_modal_title: '🛒 Cistella de Compra',
      cart_empty_title: '🛒 La teva cistella és buida.',
      cart_empty_sub: 'Afegeix productes de la botiga per començar.',
      cart_unit: 'ut.',
      cart_total_label: 'Total:',
      cart_clear_btn: 'Buidar cistella',
      cart_checkout_btn: 'Tramitar comanda',
      cart_clear_confirm: 'Vols buidar tots els productes de la teva cistella?',
      cart_empty_alert: 'La cistella és buida. Afegeix com a mínim un producte abans de procedir al pagament.',
      checkout_modal_title: '💳 Passarel·la de Pagament Segur',
      summary_label: 'Import total a pagar:',
      card_holder_label: 'TITULAR DE LA TARGETA',
      card_holder_default: 'NOM I COGNOMS',
      card_expiry_label: 'CADUCA',
      card_cvv_label: 'CVV / CV2',
      card_notice: 'Aquesta targeta és intransferible i està subjecta als termes de l\'emissor.',
      issuer_default: 'Targeta',
      form_name_label: 'Nom complet del titular',
      form_name_placeholder: 'Ex. Carles Santana Martínez',
      form_name_error: 'Si us plau, introdueix el nom del titular (mínim 3 lletres).',
      form_email_label: 'Correu electrònic de confirmació',
      form_email_placeholder: 'exemple@correu.cat',
      form_email_error: 'Introdueix un correu electrònic vàlid (exemple@correu.cat).',
      form_number_label: 'Número de targeta',
      form_number_error: 'Número de targeta no vàlid (comprova els dígits).',
      form_expiry_label: 'Caducitat (MM/AA)',
      form_expiry_error: 'Data no vàlida o caducada (MM/AA).',
      form_cvv_label: 'CVV / CV2',
      form_cvv_error: 'Cal un CVV de 3 o 4 dígits.',
      btn_back_to_cart: '← Tornar a la cistella',
      btn_pay: 'Confirmar i Pagar',
      success_title: 'Pagament Realitzat amb Èxit!',
      success_desc: 'Hem processat el teu pagament de manera segura i confirmat la comanda.',
      success_holder: 'Titular:',
      success_email: 'Correu:',
      success_method: 'Mètode:',
      success_ending: 'acabada en',
      success_total: 'Total pagat:',
      success_btn: 'D\'acord i continuar',
      footer_copy: 'Tots els drets reservats.',
      footer_privacy: 'Privacitat',
      footer_terms: 'Termes',
      footer_support: 'Suport'
    }
  },
  en: {
    name: 'English',
    flag: '🇬🇧',
    localeCode: 'en-US',
    currency: 'EUR',
    translations: {
      nav_home: 'Home',
      nav_products: 'Products',
      nav_offers: 'Deals',
      nav_contact: 'Contact',
      cart_label: 'Cart',
      section_title: 'Featured Products',
      buy_btn: 'Buy Now',
      added_feedback: '✓ Added!',
      prod1_title: 'Pro Bluetooth Headphones',
      prod1_desc: 'Active noise cancellation and up to 30 hours of battery life with high-definition sound.',
      prod2_title: 'Sports Smartwatch',
      prod2_desc: 'Heart rate monitor, water resistance, and built-in GPS for workouts.',
      prod3_title: 'Mini Smart Speaker',
      prod3_desc: 'Voice control, 360-degree surround sound, and multi-platform connectivity.',
      cart_modal_title: '🛒 Shopping Cart',
      cart_empty_title: '🛒 Your cart is empty.',
      cart_empty_sub: 'Add products from the store to get started.',
      cart_unit: 'ea.',
      cart_total_label: 'Total:',
      cart_clear_btn: 'Clear cart',
      cart_checkout_btn: 'Checkout',
      cart_clear_confirm: 'Do you want to remove all items from your cart?',
      cart_empty_alert: 'Your cart is empty. Add at least one product before proceeding to payment.',
      checkout_modal_title: '💳 Secure Payment Gateway',
      summary_label: 'Total amount to pay:',
      card_holder_label: 'CARDHOLDER NAME',
      card_holder_default: 'FIRSTNAME LASTNAME',
      card_expiry_label: 'EXPIRES',
      card_cvv_label: 'CVV / CV2',
      card_notice: 'This card is non-transferable and subject to issuer terms.',
      issuer_default: 'Card',
      form_name_label: 'Cardholder full name',
      form_name_placeholder: 'e.g. John Doe',
      form_name_error: 'Please enter the cardholder name (minimum 3 letters).',
      form_email_label: 'Confirmation email address',
      form_email_placeholder: 'example@email.com',
      form_email_error: 'Enter a valid email address (example@email.com).',
      form_number_label: 'Card number',
      form_number_error: 'Invalid card number (check the digits).',
      form_expiry_label: 'Expiration (MM/YY)',
      form_expiry_error: 'Invalid or expired date (MM/YY).',
      form_cvv_label: 'CVV / CV2',
      form_cvv_error: '3 or 4-digit CVV required.',
      btn_back_to_cart: '← Back to cart',
      btn_pay: 'Confirm & Pay',
      success_title: 'Payment Successful!',
      success_desc: 'We have securely processed your payment and confirmed your order.',
      success_holder: 'Cardholder:',
      success_email: 'Email:',
      success_method: 'Payment Method:',
      success_ending: 'ending in',
      success_total: 'Total paid:',
      success_btn: 'Accept & Continue',
      footer_copy: 'All rights reserved.',
      footer_privacy: 'Privacy',
      footer_terms: 'Terms',
      footer_support: 'Support'
    }
  }
};

class I18nManager {
  private currentLang: string = 'es';
  private locales: Record<string, LocaleConfig> = {};
  private onLanguageChangeCallbacks: Array<(lang: string) => void> = [];

  constructor() {
    this.locales = { ...DEFAULT_LOCALES };
    const storedLang = localStorage.getItem('ecommerce_lang');
    if (storedLang && this.locales[storedLang]) {
      this.currentLang = storedLang;
    } else {
      this.currentLang = 'es';
    }
  }

  // Método de ampliación: permite registrar cualquier nuevo idioma en tiempo de ejecución
  public registerLocale(langCode: string, config: LocaleConfig): void {
    this.locales[langCode] = config;

    // Actualizar el menú desplegable si ya existe en el DOM
    const select = document.getElementById('lang-select') as HTMLSelectElement | null;
    if (select && !select.querySelector(`option[value="${langCode}"]`)) {
      const option = document.createElement('option');
      option.value = langCode;
      option.textContent = `${config.flag} ${langCode.toUpperCase()}`;
      select.appendChild(option);
    }
  }

  public getAvailableLanguages(): string[] {
    return Object.keys(this.locales);
  }

  public getLocaleConfig(lang?: string): LocaleConfig {
    const l = lang || this.currentLang;
    return this.locales[l] || this.locales['es'];
  }

  public getCurrentLang(): string {
    return this.currentLang;
  }

  public setLanguage(lang: string): void {
    if (!this.locales[lang]) {
      console.warn(`Idioma ${lang} no registrado.`);
      return;
    }

    this.currentLang = lang;
    localStorage.setItem('ecommerce_lang', lang);
    document.documentElement.lang = lang;

    // Actualizar elementos estáticos con data-i18n
    this.updateStaticDOM();

    // Notificar a los callbacks registrados
    this.onLanguageChangeCallbacks.forEach(cb => cb(lang));
  }

  public onLanguageChange(callback: (lang: string) => void): void {
    this.onLanguageChangeCallbacks.push(callback);
  }

  // Traducir una clave
  public t(key: string, fallback?: string): string {
    const locale = this.getLocaleConfig();
    if (locale.translations[key]) {
      return locale.translations[key];
    }
    // Fallback a español si no existe
    const fallbackLocale = this.locales['es'];
    if (fallbackLocale && fallbackLocale.translations[key]) {
      return fallbackLocale.translations[key];
    }
    return fallback !== undefined ? fallback : key;
  }

  // Formato de moneda según localización (l10n)
  public formatCurrency(amount: number): string {
    const locale = this.getLocaleConfig();
    try {
      return amount.toLocaleString(locale.localeCode, {
        style: 'currency',
        currency: locale.currency
      });
    } catch {
      return `${amount.toFixed(2)} €`;
    }
  }

  // Actualiza los textos y placeholders del DOM con data-i18n
  public updateStaticDOM(): void {
    // 1. Textos data-i18n
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (key) {
        el.textContent = this.t(key);
      }
    });

    // 2. Placeholders data-i18n-placeholder
    document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (key) {
        el.placeholder = this.t(key);
      }
    });

    // 3. Precios estáticos data-price-amount
    document.querySelectorAll<HTMLElement>('[data-price-amount]').forEach(el => {
      const amount = parseFloat(el.dataset.priceAmount || '0');
      el.textContent = this.formatCurrency(amount);
    });

    // 4. Valor por defecto de titular en la tarjeta si no se ha editado
    const cardHolderInput = document.getElementById('card-name') as HTMLInputElement | null;
    const cardHolderDisplay = document.getElementById('card-holder-display');
    if (cardHolderDisplay && (!cardHolderInput || cardHolderInput.value.trim().length === 0)) {
      cardHolderDisplay.textContent = this.t('card_holder_default');
    }
  }
}

// =====================================
// GESTOR DE LA CANASTA (LocalStorage)
// =====================================

class CartManager {
  private readonly storageKey: string = 'ecommerce_cart_items';
  private items: CartItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.items = stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch (error) {
      console.error('Error al cargar la canasta:', error);
      this.items = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (error) {
      console.error('Error al guardar en LocalStorage:', error);
    }
  }

  public addItem(product: Product): void {
    const index = this.items.findIndex(item => item.id === product.id);
    if (index > -1) {
      this.items[index].quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.saveToStorage();
  }

  public decreaseItem(productId: string): void {
    const index = this.items.findIndex(item => item.id === productId);
    if (index > -1) {
      if (this.items[index].quantity > 1) {
        this.items[index].quantity -= 1;
      } else {
        this.items.splice(index, 1);
      }
      this.saveToStorage();
    }
  }

  public removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
  }

  public clearCart(): void {
    this.items = [];
    this.saveToStorage();
  }

  public getItems(): CartItem[] {
    return [...this.items];
  }

  public getTotalCount(): number {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  public getTotalPrice(): number {
    return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}

// =====================================
// LOGOTIPOS SVG DE EMISORES
// =====================================

const ISSUER_LOGOS: Record<CardIssuer, string> = {
  visa: `
    <svg viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38.5 2.5L25.2 29.5H17.4L10.6 8.3C10.2 6.7 9.8 6.1 8.6 5.4C6.6 4.3 3.1 3.4 0 2.7L0.3 1.3H13.6C15.4 1.3 16.9 2.5 17.3 4.6L20.6 22.1L28.8 1.3H36.8L38.5 2.5ZM72.4 20.3C72.4 12.6 61.6 12.1 61.8 8.6C61.8 7.6 62.8 6.5 65.1 6.2C66.2 6.1 69.4 5.9 72.7 7.4L74 1.4C72.2 0.8 69.9 0.2 67 0.2C58.8 0.2 53.1 4.5 53 10.7C52.9 15.3 57 17.9 60.1 19.5C63.3 21 64.4 22.1 64.4 23.5C64.4 25.6 61.8 26.6 59.4 26.6C55.3 26.6 52.8 25.4 51 24.6L49.7 30.8C51.6 31.7 55.1 32.4 58.7 32.4C67.3 32.4 72.4 28.1 72.4 20.3ZM93.4 29.5H100L94.2 1.3H88.4C87.1 1.3 86 2 85.5 3.3L73.1 29.5H81.3L83 24.9H92.9L93.4 29.5ZM85.2 18.7L89.3 7.5L91.7 18.7H85.2ZM50.8 1.3L44.4 29.5H36.7L43.1 1.3H50.8Z" fill="#FFFFFF"/>
    </svg>
  `,
  mastercard: `
    <svg viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="34" cy="31" r="30" fill="#EB001B"/>
      <circle cx="66" cy="31" r="30" fill="#F79E1B"/>
      <path d="M50 8.7C57 14.3 61.4 22.8 61.4 31C61.4 39.2 57 47.7 50 53.3C43 47.7 38.6 39.2 38.6 31C38.6 22.8 43 14.3 50 8.7Z" fill="#FF5F00"/>
    </svg>
  `,
  amex: `
    <svg viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="62" rx="6" fill="#006FCF"/>
      <path d="M21.5 38.5L25.8 28.2L30.1 38.5H35.8L28.6 22.5H23L15.8 38.5H21.5ZM49.5 22.5H43.2L38.9 33.2L34.6 22.5H29.5V38.5H34.3V27.5L38.2 36.8H39.6L43.5 27.5V38.5H49.5V22.5ZM71.2 26.5H62.5V29.2H70V32.2H62.5V35.5H71.5V38.5H57.5V22.5H71.2V26.5ZM84.5 38.5L78.2 30.5L84.2 22.5H78L74.8 26.8L71.5 22.5H66L72 30.5L65.8 38.5H72L75.1 34.2L78.2 38.5H84.5Z" fill="#FFFFFF"/>
    </svg>
  `,
  default: `
    <svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="40" rx="6" stroke="#FFFFFF" stroke-width="3" stroke-opacity="0.8"/>
      <line x1="2" y1="13" x2="62" y2="13" stroke="#FFFFFF" stroke-width="3" stroke-opacity="0.8"/>
      <rect x="8" y="24" width="12" height="8" rx="2" fill="#FFFFFF" fill-opacity="0.8"/>
    </svg>
  `
};

// =====================================
// FUNCIONES DE VALIDACIÓN Y DETECCIÓN
// =====================================

function detectIssuer(cardNumber: string): CardIssuer {
  const clean = cardNumber.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  return 'default';
}

function validateLuhn(numberStr: string): boolean {
  const clean = numberStr.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function formatCardNumber(value: string, issuer: CardIssuer): string {
  const digits = value.replace(/\D/g, '');
  if (issuer === 'amex') {
    const part1 = digits.substring(0, 4);
    const part2 = digits.substring(4, 10);
    const part3 = digits.substring(10, 15);
    return [part1, part2, part3].filter(Boolean).join(' ');
  } else {
    return digits.substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  }
}

function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, '').substring(0, 4);
  if (digits.length >= 3) {
    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
  }
  return digits;
}

function validateExpiryDate(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (year > currentYear + 20) return false;

  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

function validateName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 3 && /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/.test(trimmed);
}

function validateCvv(cvv: string, issuer: CardIssuer): boolean {
  const digits = cvv.replace(/\D/g, '');
  if (issuer === 'amex') {
    return digits.length === 4;
  }
  return digits.length === 3;
}

// =====================================
// APLICACIÓN PRINCIPAL
// =====================================

document.addEventListener('DOMContentLoaded', () => {
  const i18n = new I18nManager();
  const cart = new CartManager();

  // Exponer i18n en window para permitir extensión externa (i18n.registerLocale(...))
  (window as unknown as { i18n: I18nManager }).i18n = i18n;

  // Selector de idioma
  const langSelect = document.getElementById('lang-select') as HTMLSelectElement | null;
  if (langSelect) {
    langSelect.value = i18n.getCurrentLang();
    langSelect.addEventListener('change', () => {
      i18n.setLanguage(langSelect.value);
    });
  }

  // Elementos Canasta
  const cartBtn = document.getElementById('cart-button');
  const cartCountBadge = document.getElementById('cart-count');
  const cartModal = document.getElementById('cart-modal');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Elementos Checkout & Tarjeta 3D
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const backToCartBtn = document.getElementById('back-to-cart-btn');
  const checkoutTotalDisplay = document.getElementById('checkout-total-display');
  const checkoutForm = document.getElementById('checkout-form') as HTMLFormElement | null;

  // Elementos visuales de la tarjeta 3D
  const creditCardEl = document.getElementById('credit-card');
  const cardBrandLogo = document.getElementById('card-brand-logo');
  const cardBackBrandLogo = document.getElementById('card-back-brand-logo');
  const cardNumberDisplay = document.getElementById('card-number-display');
  const cardHolderDisplay = document.getElementById('card-holder-display');
  const cardExpiryDisplay = document.getElementById('card-expiry-display');
  const cardCvvDisplay = document.getElementById('card-cvv-display');
  const issuerBadge = document.getElementById('issuer-badge');
  const inputCardIcon = document.getElementById('input-card-icon');

  // Inputs del formulario
  const cardNameInput = document.getElementById('card-name') as HTMLInputElement | null;
  const cardEmailInput = document.getElementById('card-email') as HTMLInputElement | null;
  const cardNumberInput = document.getElementById('card-number-input') as HTMLInputElement | null;
  const cardExpiryInput = document.getElementById('card-expiry-input') as HTMLInputElement | null;
  const cardCvvInput = document.getElementById('card-cvv-input') as HTMLInputElement | null;

  // Modal de éxito
  const successModal = document.getElementById('success-modal');
  const successDetails = document.getElementById('success-details');
  const successCloseBtn = document.getElementById('success-close-btn');

  // Menú hamburguesa
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Estado del emisor actual
  let currentIssuer: CardIssuer = 'default';

  // Función para obtener el título traducido del producto según su id
  const getProductTitle = (prodId: string): string => {
    switch (prodId) {
      case 'prod-1':
        return i18n.t('prod1_title');
      case 'prod-2':
        return i18n.t('prod2_title');
      case 'prod-3':
        return i18n.t('prod3_title');
      default:
        return 'Producto';
    }
  };

  // ------------------------------------
  // ACTUALIZACIÓN DE INTERFAZ DE CANASTA
  // ------------------------------------
  const updateCartBadge = (): void => {
    if (cartCountBadge) {
      cartCountBadge.textContent = cart.getTotalCount().toString();
    }
  };

  const renderCartUI = (): void => {
    updateCartBadge();
    if (!cartItemsContainer || !cartTotalPrice) return;

    const items = cart.getItems();
    cartTotalPrice.textContent = i18n.formatCurrency(cart.getTotalPrice());

    if (items.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <p>${i18n.t('cart_empty_title')}</p>
          <small>${i18n.t('cart_empty_sub')}</small>
        </div>
      `;
      return;
    }

    cartItemsContainer.innerHTML = items.map(item => {
      const localizedTitle = getProductTitle(item.id);
      return `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${localizedTitle}" class="cart-item-thumb">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${localizedTitle}</h4>
            <span class="cart-item-price">${i18n.formatCurrency(item.price)} ${i18n.t('cart_unit')}</span>
          </div>
          <div class="cart-item-qty-controls">
            <button class="qty-btn btn-decrease" data-id="${item.id}" title="Restar uno">-</button>
            <span class="cart-item-quantity">${item.quantity}</span>
            <button class="qty-btn btn-increase" data-id="${item.id}" title="Añadir uno">+</button>
          </div>
          <button class="remove-item-btn" data-id="${item.id}" title="Eliminar">&times;</button>
        </div>
      `;
    }).join('');

    // Eventos de botones dentro de la canasta
    cartItemsContainer.querySelectorAll('.btn-increase').forEach(button => {
      button.addEventListener('click', () => {
        const id = (button as HTMLElement).dataset.id;
        const item = cart.getItems().find(i => i.id === id);
        if (item) {
          cart.addItem(item);
          renderCartUI();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.btn-decrease').forEach(button => {
      button.addEventListener('click', () => {
        const id = (button as HTMLElement).dataset.id;
        if (id) {
          cart.decreaseItem(id);
          renderCartUI();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = (button as HTMLElement).dataset.id;
        if (id) {
          cart.removeItem(id);
          renderCartUI();
        }
      });
    });
  };

  const openCart = (): void => {
    renderCartUI();
    cartModal?.classList.add('open');
  };

  const closeCart = (): void => {
    cartModal?.classList.remove('open');
  };

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) closeCart();
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (cart.getItems().length > 0 && confirm(i18n.t('cart_clear_confirm'))) {
        cart.clearCart();
        renderCartUI();
      }
    });
  }

  // ------------------------------------
  // TRANSICIÓN AL FORMULARIO DE CHECKOUT
  // ------------------------------------
  const openCheckout = (): void => {
    if (cart.getItems().length === 0) {
      alert(i18n.t('cart_empty_alert'));
      return;
    }
    closeCart();

    if (checkoutTotalDisplay) {
      checkoutTotalDisplay.textContent = i18n.formatCurrency(cart.getTotalPrice());
    }

    checkoutModal?.classList.add('open');
    updateCardIssuerTheme('default');
  };

  const closeCheckout = (): void => {
    checkoutModal?.classList.remove('open');
    creditCardEl?.classList.remove('flipped');
  };

  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);
  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeCheckout();
    });
  }

  if (backToCartBtn) {
    backToCartBtn.addEventListener('click', () => {
      closeCheckout();
      openCart();
    });
  }

  // ------------------------------------
  // ACTUALIZACIÓN VISUAL DEL EMISOR DE TARJETA
  // ------------------------------------
  const updateCardIssuerTheme = (issuer: CardIssuer): void => {
    currentIssuer = issuer;

    if (creditCardEl) {
      creditCardEl.classList.remove('issuer-default', 'issuer-visa', 'issuer-mastercard', 'issuer-amex');
      creditCardEl.classList.add(`issuer-${issuer}`);
    }

    const logoSvg = ISSUER_LOGOS[issuer];
    if (cardBrandLogo) cardBrandLogo.innerHTML = logoSvg;
    if (cardBackBrandLogo) cardBackBrandLogo.innerHTML = logoSvg;
    if (inputCardIcon) inputCardIcon.innerHTML = logoSvg;

    if (issuerBadge) {
      issuerBadge.className = `issuer-pill ${issuer !== 'default' ? issuer : ''}`;
      const names: Record<CardIssuer, string> = {
        visa: 'Visa',
        mastercard: 'Mastercard',
        amex: 'American Express',
        default: i18n.t('issuer_default')
      };
      issuerBadge.textContent = names[issuer];
    }
  };

  // ------------------------------------
  // EFECTO 3D: GIRAR LA TARJETA AL PEDIR EL CV2 / CVV
  // ------------------------------------
  if (cardCvvInput && creditCardEl) {
    cardCvvInput.addEventListener('focus', () => {
      creditCardEl.classList.add('flipped');
    });

    cardCvvInput.addEventListener('blur', () => {
      creditCardEl.classList.remove('flipped');
    });
  }

  // ------------------------------------
  // SINCRONIZACIÓN EN TIEMPO REAL CON LA TARJETA 3D
  // ------------------------------------
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', () => {
      const detected = detectIssuer(cardNumberInput.value);
      if (detected !== currentIssuer) {
        updateCardIssuerTheme(detected);
      }

      const formatted = formatCardNumber(cardNumberInput.value, detected);
      cardNumberInput.value = formatted;

      if (cardNumberDisplay) {
        cardNumberDisplay.textContent = formatted.length > 0 ? formatted : '•••• •••• •••• ••••';
      }

      clearFieldError('group-card-number');
    });
  }

  if (cardNameInput) {
    cardNameInput.addEventListener('input', () => {
      const val = cardNameInput.value.trim();
      if (cardHolderDisplay) {
        cardHolderDisplay.textContent = val.length > 0 ? val.toUpperCase() : i18n.t('card_holder_default');
      }
      clearFieldError('group-card-name');
    });
  }

  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', () => {
      const formatted = formatExpiryDate(cardExpiryInput.value);
      cardExpiryInput.value = formatted;
      if (cardExpiryDisplay) {
        cardExpiryDisplay.textContent = formatted.length > 0 ? formatted : 'MM/AA';
      }
      clearFieldError('group-card-expiry');
    });
  }

  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', () => {
      const digits = cardCvvInput.value.replace(/\D/g, '');
      const maxLen = currentIssuer === 'amex' ? 4 : 3;
      cardCvvInput.value = digits.substring(0, maxLen);
      if (cardCvvDisplay) {
        cardCvvDisplay.textContent = cardCvvInput.value || '•••';
      }
      clearFieldError('group-card-cvv');
    });
  }

  if (cardEmailInput) {
    cardEmailInput.addEventListener('input', () => {
      clearFieldError('group-card-email');
    });
  }

  // ------------------------------------
  // GESTIÓN DE ERRORES EN ROJO
  // ------------------------------------
  const setFieldError = (groupId: string, show: boolean): void => {
    const group = document.getElementById(groupId);
    if (!group) return;
    if (show) {
      group.classList.add('has-error');
    } else {
      group.classList.remove('has-error');
    }
  };

  const clearFieldError = (groupId: string): void => {
    setFieldError(groupId, false);
  };

  // ------------------------------------
  // VALIDACIÓN DEL FORMULARIO DE PAGO
  // ------------------------------------
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (event: Event) => {
      event.preventDefault();

      let isValid = true;

      // 1. Validar nombre
      const nameVal = cardNameInput?.value || '';
      if (!validateName(nameVal)) {
        setFieldError('group-card-name', true);
        isValid = false;
      } else {
        setFieldError('group-card-name', false);
      }

      // 2. Validar email
      const emailVal = cardEmailInput?.value || '';
      if (!validateEmail(emailVal)) {
        setFieldError('group-card-email', true);
        isValid = false;
      } else {
        setFieldError('group-card-email', false);
      }

      // 3. Validar tarjeta (Luhn + emisor)
      const numberVal = cardNumberInput?.value || '';
      const issuer = detectIssuer(numberVal);
      const isLuhnValid = validateLuhn(numberVal);
      const cleanDigits = numberVal.replace(/\D/g, '');
      const hasValidLength = issuer === 'amex' ? cleanDigits.length === 15 : cleanDigits.length === 16;

      if (!isLuhnValid || !hasValidLength) {
        setFieldError('group-card-number', true);
        isValid = false;
      } else {
        setFieldError('group-card-number', false);
      }

      // 4. Validar fecha de caducidad
      const expiryVal = cardExpiryInput?.value || '';
      if (!validateExpiryDate(expiryVal)) {
        setFieldError('group-card-expiry', true);
        isValid = false;
      } else {
        setFieldError('group-card-expiry', false);
      }

      // 5. Validar CVV
      const cvvVal = cardCvvInput?.value || '';
      if (!validateCvv(cvvVal, issuer)) {
        setFieldError('group-card-cvv', true);
        isValid = false;
      } else {
        setFieldError('group-card-cvv', false);
      }

      if (!isValid) return;

      // ------------------------------------
      // PROCESO DE PAGO EXITOSO
      // ------------------------------------
      const totalAmount = cart.getTotalPrice();
      const lastFour = cleanDigits.slice(-4);
      const issuerLabel = issuer === 'default' ? i18n.t('issuer_default') : issuer.toUpperCase();

      if (successDetails) {
        successDetails.innerHTML = `
          <div><strong>${i18n.t('success_holder')}</strong> ${nameVal}</div>
          <div><strong>${i18n.t('success_email')}</strong> ${emailVal}</div>
          <div><strong>${i18n.t('success_method')}</strong> ${issuerLabel} ${i18n.t('success_ending')} •••• ${lastFour}</div>
          <div><strong>${i18n.t('success_total')}</strong> <span style="color:#28a745;font-weight:bold;">${i18n.formatCurrency(totalAmount)}</span></div>
        `;
      }

      cart.clearCart();
      renderCartUI();
      closeCheckout();
      checkoutForm.reset();
      updateCardIssuerTheme('default');
      if (cardNumberDisplay) cardNumberDisplay.textContent = '•••• •••• •••• ••••';
      if (cardHolderDisplay) cardHolderDisplay.textContent = i18n.t('card_holder_default');
      if (cardExpiryDisplay) cardExpiryDisplay.textContent = 'MM/AA';
      if (cardCvvDisplay) cardCvvDisplay.textContent = '•••';

      successModal?.classList.add('open');
    });
  }

  if (successCloseBtn && successModal) {
    successCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('open');
    });
  }

  // ------------------------------------
  // EVENTOS DE COMPRA EN CATÁLOGO
  // ------------------------------------
  const productCards = document.querySelectorAll<HTMLElement>('.product-card');
  productCards.forEach(card => {
    const addBtn = card.querySelector<HTMLButtonElement>('.add-to-cart-btn');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
      const id = card.dataset.id || '0';
      const price = parseFloat(card.dataset.price || '0');
      const image = card.dataset.image || '';

      cart.addItem({ id, price, image });
      updateCartBadge();

      // Feedback visual
      const originalText = addBtn.textContent;
      addBtn.textContent = i18n.t('added_feedback');
      addBtn.style.backgroundColor = '#28a745';

      setTimeout(() => {
        addBtn.textContent = originalText;
        addBtn.style.backgroundColor = '';
      }, 900);
    });
  });

  // ------------------------------------
  // MENÚ HAMBURGUESA
  // ------------------------------------
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
      const isExpanded = hamburgerBtn.classList.contains('active');
      hamburgerBtn.setAttribute('aria-expanded', isExpanded.toString());
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (event) => {
      const isClickInsideNavbar = (event.target as HTMLElement).closest('.navbar');
      if (!isClickInsideNavbar && navMenu.classList.contains('active')) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------------------------------------
  // REACCIÓN AL CAMBIO DE IDIOMA
  // ------------------------------------
  i18n.onLanguageChange(() => {
    renderCartUI();
    if (checkoutTotalDisplay) {
      checkoutTotalDisplay.textContent = i18n.formatCurrency(cart.getTotalPrice());
    }
    updateCardIssuerTheme(currentIssuer);
  });

  // Inicializar estado e idioma
  i18n.updateStaticDOM();
  updateCartBadge();
  updateCardIssuerTheme('default');
});
