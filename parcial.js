'use strict';

/*
 * Rukasov Kirill
 */

const IMAGE_BASE_PATH = 'img/products/';
const FALLBACK_IMAGE = 'img/producto-ejemplo.svg';

// sistema de categorías

const categories = [
    { id: 'all', name: 'Todos los productos' },
    { id: 'electronics', name: 'Electrónicos' },
    { id: 'clothing', name: 'Ropa' },
    { id: 'accessories', name: 'Accesorios' }
];


let currentCategory = 'all';

// banners

const categoryOffers = {
    electronics: [
        {
            title: '¡Oferta Flash!',
            message: '20% OFF en todos los smartphones Samsung',
            productId: 1,
            action: 'Ver producto',
            discount: 20
        },
        {
            title: '¡Último día!',
            message: 'Laptops gaming con envío gratis',
            productId: 2,
            action: 'Aprovecha ahora',
            discount: 15
        },
        {
            title: '¡Super promo!',
            message: 'Auriculares Sony - 2x1 en accesorios',
            productId: 3,
            action: 'Ver oferta',
            discount: 25
        }
    ],
    clothing: [
        {
            title: '¡Temporada de descuentos!',
            message: 'Ropa deportiva hasta 30% OFF',
            categoryId: 'clothing',
            action: 'Ver colección',
            discount: 30
        },
        {
            title: '¡Oferta especial!',
            message: 'Zapatillas Nike - Comprá 2 y llevate 3',
            productId: 5,
            action: 'Aprovechar',
            discount: 25
        },
        {
            title: '¡Liquidación!',
            message: 'Camisetas deportivas desde $1500',
            productId: 4,
            action: 'Comprar ahora',
            discount: 40
        }
    ],
    accessories: [
        {
            title: '¡Envío gratis!',
            message: 'Mochilas premium con 6 cuotas sin interés',
            productId: 6,
            action: 'Financiar compra',
            discount: 0
        },
        {
            title: '¡Combo perfecto!',
            message: 'Accesorios + 15% extra en segunda compra',
            categoryId: 'accessories',
            action: 'Ver combos',
            discount: 15
        }
    ]
};

let currentBanner = null;
let bannerTimeout = null;

// Array de productos
const products = [
    {
        id: 1,
        name: 'Celular Samsung Galaxy S25',
        description: 'Teléfono inteligente de última generación con cámara de 108MP y pantalla AMOLED de 6.7 pulgadas',
        price: 45000,
        image: 's25-ultra-gold.png',
        category: 'electronics',
    },
    {
        id: 2,
        name: 'Laptop Gigabyte AORUS 5 SE4',
        description: 'Laptop para gaming con procesador Intel i7, 16GB RAM y tarjeta gráfica RTX 3070',
        price: 120000,
        image: 'gigabyte-aorus.png',
        category: 'electronics',
    },
    {
        id: 3,
        name: 'Auriculares Sony WF-XB700',
        description: 'Auriculares inalámbricos con cancelación de ruido activa y 30 horas de batería',
        price: 15000,
        image: 'wf-xb700-black.png',
        category: 'electronics',
    },
    {
        id: 4,
        name: 'Camiseta Deportiva Elite',
        description: 'Camiseta de alto rendimiento con tecnología de absorción de humedad',
        price: 2500,
        image: 'camisetas-deportivas.png',
        category: 'clothing',
    },
    {
        id: 5,
        name: 'Zapatillas Nike Air Max 97',
        description: 'Zapatillas para correr con amortiguación avanzada y suela antideslizante',
        price: 8500,
        image: 'air-max-97.png',
        category: 'clothing',
    },
    {
        id: 6,
        name: 'Mochila Korin Flexpack Pro',
        description: 'Mochila resistente al agua con múltiples compartimentos y capacidad de 35L',
        price: 5200,
        image: 'korin-flexpack-pro.png',
        category: 'accessories',
    },
];

// banner functions

function getRandomOffer(categoryId) {
    if (!categoryOffers[categoryId] || categoryOffers[categoryId].length === 0) {
        return null;
    }
    
    const offers = categoryOffers[categoryId];
    const randomIndex = Math.floor(Math.random() * offers.length);
    return offers[randomIndex];
}

function createBannerElement(offer) {
    const banner = document.createElement('div');
    banner.id = 'floating-banner';
    banner.className = 'floating-banner';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'banner-close';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Cerrar banner');
    closeButton.addEventListener('click', () => {
        removeBanner();
    });
    
    const content = document.createElement('div');
    content.className = 'banner-content';
    
    const title = document.createElement('h4');
    title.textContent = offer.title;
    
    const message = document.createElement('p');
    message.textContent = offer.message;
    
    const actionButton = document.createElement('button');
    actionButton.className = 'banner-action';
    actionButton.textContent = offer.action;
    
    if (offer.productId) {
        actionButton.addEventListener('click', () => {
            const product = products.find(p => p.id === offer.productId);
            if (product) {
                showProductDetail(product);
                removeBanner();
            }
        });
    } else if (offer.categoryId) {
        actionButton.addEventListener('click', () => {
            filterByCategory(offer.categoryId);
            updateActiveCategory(offer.categoryId);
            removeBanner();
        });
    }
    
    if (offer.discount > 0) {
        const discountBadge = document.createElement('span');
        discountBadge.className = 'discount-badge';
        discountBadge.textContent = `-${offer.discount}%`;
        banner.append(discountBadge);
    }
    
    content.append(title, message, actionButton);
    banner.append(closeButton, content);
    
    return banner;
}

function showBanner(categoryId) {
    if (currentBanner) {
        removeBanner();
    }
    
    if (categoryId === 'all') {
        return;
    }
    
    const offer = getRandomOffer(categoryId);
    if (!offer) {
        return;
    }
    
    currentBanner = createBannerElement(offer);
    document.body.append(currentBanner);
    
    setTimeout(() => {
        currentBanner.classList.add('show');
    }, 100);
    
    bannerTimeout = setTimeout(() => {
        removeBanner();
    }, 10000);
}

function removeBanner() {
    if (currentBanner) {
        if (bannerTimeout) {
            clearTimeout(bannerTimeout);
            bannerTimeout = null;
        }
        
        currentBanner.classList.add('hide');
        
        setTimeout(() => {
            if (currentBanner && currentBanner.parentNode) {
                currentBanner.remove();
            }
            currentBanner = null;
        }, 300);
    }
}

function cleanupBanners() {
    removeBanner();
}

// nav function

function createCategoryNavigation() {
    const main = document.querySelector('main');
    const categoryNav = document.createElement('nav');
    categoryNav.id = 'category-nav';
    
    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = 'Categorías';
    categoryNav.appendChild(categoryTitle);
    
    const categoryList = document.createElement('ul');
    categoryList.className = 'category-list';
    
    categories.forEach(category => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = category.name;
        button.className = currentCategory === category.id ? 'active' : '';
        button.dataset.categoryId = category.id;
        
        button.addEventListener('click', () => {
            filterByCategory(category.id);
            updateActiveCategory(category.id);
        });
        
        li.appendChild(button);
        categoryList.appendChild(li);
    });
    
    categoryNav.appendChild(categoryList);
    
    const productsTitle = main.querySelector('h2');
    main.insertBefore(categoryNav, productsTitle);
}

// filtration function

function filterByCategory(categoryId) {
    currentCategory = categoryId;
    
    let filteredProducts;
    if (categoryId === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === categoryId);
    }
    
    renderProducts(filteredProducts);

    showBanner(categoryId);
}

function updateActiveCategory(categoryId) {
    const categoryButtons = document.querySelectorAll('#category-nav button');
    categoryButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.categoryId === categoryId) {
            button.classList.add('active');
        }
    });
}

// Shopping cart object
const shoppingCart = {
    items: [],
    
    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },
    
    calculateQuantity() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    addProduct(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }
    },
    
    removeProduct(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
    },
    
    clearCart() {
        this.items = [];
    }
};

// Supporting functions
function getImageUrl(imageName) {
    return IMAGE_BASE_PATH + imageName;
}

// DOM manipulation functions
function createProductElement(product) {
    const li = document.createElement('li');
    
    const img = document.createElement('img');
    img.src = getImageUrl(product.image);
    img.alt = product.name;
    img.loading = 'lazy';
    img.onerror = function() {
        this.src = FALLBACK_IMAGE;
    };
    
    const div = document.createElement('div');
    
    const h3 = document.createElement('h3');
    h3.textContent = product.name;
    
    const description = document.createElement('p');
    description.textContent = product.description;
    
    const priceP = document.createElement('p');
    const priceText = document.createTextNode('Precio: $');
    const priceSpan = document.createElement('span');
    priceSpan.textContent = product.price;
    priceP.append(priceText, priceSpan);
    
    const category = document.createElement('p');
    const categoryName = categories.find(cat => cat.id === product.category)?.name || product.category;
    category.textContent = categoryName;
    
    const button = document.createElement('button');
    button.textContent = 'Agregar';
    button.addEventListener('click', () => {
        shoppingCart.addProduct(product);
        updateCartDisplay();
    });
    
    // Add click event to show product detail
    li.addEventListener('click', (e) => {
        if (e.target !== button) {
            showProductDetail(product);
        }
    });

    div.append(h3, description, priceP, category, button);

    li.append(img, div);
    
    return li;
}

function renderProducts(productsToRender = products) {
    const productsList = document.getElementById('productos');
    // Clear existing products (except the example ones from HTML)
    productsList.replaceChildren();
    
    productsToRender.forEach(product => {
        const productElement = createProductElement(product);
        productsList.append(productElement);
    });
}

function updateCartDisplay() {
    const itemsSpan = document.querySelector('#mini-carrito p:first-child span');
    const totalSpan = document.querySelector('#mini-carrito p:nth-child(2) span');
    
    itemsSpan.textContent = shoppingCart.calculateQuantity();
    totalSpan.textContent = shoppingCart.calculateTotal();
}

function createProductDetailModal(product) {
    const modalContainer = document.getElementById('modal');
    
    const dialog = document.createElement('dialog');
    dialog.className = 'modal';
    
    const detailDiv = document.createElement('div');
    detailDiv.className = 'detalle';
    
    const img = document.createElement('img');
    img.src = getImageUrl(product.image);
    img.alt = product.name;
    
    const h3 = document.createElement('h3');
    h3.textContent = product.name;
    
    const description = document.createElement('p');
    description.textContent = product.description;
    
    const priceP = document.createElement('p');
    const priceText = document.createTextNode('Precio: $');
    const priceSpan = document.createElement('span');
    priceSpan.textContent = product.price;
    priceP.append(priceText, priceSpan);
    
    const category = document.createElement('p');
    const categoryName = categories.find(cat => cat.id === product.category)?.name || product.category;
    category.textContent = categoryName;
    
    const footer = document.createElement('footer');
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Agregar';
    addButton.addEventListener('click', () => {
        shoppingCart.addProduct(product);
        updateCartDisplay();
        dialog.close();
        dialog.remove();
    });

    footer.append(closeButton, addButton);

    detailDiv.append(img, h3, description, priceP, category, footer);
    
    dialog.append(detailDiv);
    modalContainer.append(dialog);
    
    return dialog;
}

function showProductDetail(product) {
    cleanupBanners();
    
    const modal = createProductDetailModal(product);
    modal.showModal();
}

function createCartModal() {
    const modalContainer = document.getElementById('modal');
    
    const dialog = document.createElement('dialog');
    dialog.className = 'modal';
    
    const cartDiv = document.createElement('div');
    cartDiv.className = 'carrito';
    
    const header = document.createElement('header');
    
    const itemsSpan = document.createElement('span');
    itemsSpan.textContent = `Productos: ${shoppingCart.calculateQuantity()}`;
    
    const totalSpan = document.createElement('span');
    totalSpan.textContent = `Total: $${shoppingCart.calculateTotal()}`;
    
    header.append(itemsSpan, totalSpan);
    
    const ul = document.createElement('ul');
    
    if (shoppingCart.items.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'El carrito está vacío';
        ul.append(li);
    } else {
        shoppingCart.items.forEach(item => {
            const li = document.createElement('li');
            li.append (
                document.createTextNode(`${item.product.name} - ${item.quantity} x $${item.product.price} `)
            );
            
            const removeLink = document.createElement('a');
            removeLink.href = '#';
            removeLink.textContent = 'Eliminar';
            removeLink.addEventListener('click', (e) => {
                e.preventDefault();
                shoppingCart.removeProduct(item.product.id);
                dialog.close();
                dialog.remove();
                updateCartDisplay();
            });
            
            li.append(removeLink);
            ul.append(li);
        });
    }
    
    const footer = document.createElement('footer');
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Vaciar';
    clearButton.addEventListener('click', () => {
        shoppingCart.clearCart();
        dialog.close();
        dialog.remove();
        updateCartDisplay();
    });
    
    const checkoutButton = document.createElement('button');
    checkoutButton.textContent = 'Proceder al pago';
    checkoutButton.addEventListener('click', () => {
        if (shoppingCart.items.length > 0) {
            alert(`Compra realizada por un total de $${shoppingCart.calculateTotal()}`);
            shoppingCart.clearCart();
            updateCartDisplay();
        } else {
            alert('El carrito está vacío');
        }
        dialog.close();
        dialog.remove();
    });

    footer.append(closeButton, clearButton, checkoutButton);

    cartDiv.append(header, ul, footer);
    
    dialog.append(cartDiv);
    modalContainer.append(dialog);
    
    return dialog;
}

function showCartModal() {
    cleanupBanners();
    
    const modal = createCartModal();
    modal.showModal();
}

// Initialize the application
function initializeApp() {
    // Create category navigation
    createCategoryNavigation();

    // Render products dynamically
    renderProducts();
    
    // Add event listener to cart button
    const cartButton = document.querySelector('#mini-carrito button');
    cartButton.addEventListener('click', showCartModal);
    
    // Update initial cart display
    updateCartDisplay();
    
    console.log('Aplicación inicializada correctamente');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);