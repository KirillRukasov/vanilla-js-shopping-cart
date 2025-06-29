'use strict';

/*
 * Rukasov Kirill
 */

// Array de productos
const products = [
    {
        id: 1,
        name: 'Celular Samsung Galaxy S25',
        description: 'Teléfono inteligente de última generación con cámara de 108MP y pantalla AMOLED de 6.7 pulgadas',
        price: 45000,
        image: 'img/products/s25-ultra-gold.png',
        category: 'Electrónicos',
    },
    {
        id: 2,
        name: 'Laptop Gigabyte AORUS 5 SE4',
        description: 'Laptop para gaming con procesador Intel i7, 16GB RAM y tarjeta gráfica RTX 3070',
        price: 120000,
        image: 'img/products/gigabyte-aorus.png',
        category: 'Electrónicos',
    },
    {
        id: 3,
        name: 'Auriculares Sony WF-XB700',
        description: 'Auriculares inalámbricos con cancelación de ruido activa y 30 horas de batería',
        price: 15000,
        image: 'img/products/wf-xb700-black.png',
        category: 'Electrónicos',
    },
    {
        id: 4,
        name: 'Camiseta Deportiva Elite',
        description: 'Camiseta de alto rendimiento con tecnología de absorción de humedad',
        price: 2500,
        image: 'img/products/camisetas-deportivas.png',
        category: 'Ropa',
    },
    {
        id: 5,
        name: 'Zapatillas Nike Air Max 97',
        description: 'Zapatillas para correr con amortiguación avanzada y suela antideslizante',
        price: 8500,
        image: 'img/products/air-max-97.png',
        category: 'Ropa',
    },
    {
        id: 6,
        name: 'Mochila Korin Flexpack Pro',
        description: 'Mochila resistente al agua con múltiples compartimentos y capacidad de 35L',
        price: 5200,
        image: 'img/products/korin-flexpack-pro.png',
        category: 'Accesorios',
    },
];

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

// DOM manipulation functions
function createProductElement(product) {
    const li = document.createElement('li');
    
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.loading = 'lazy';
    img.onerror = function() {
        this.src = 'img/producto-ejemplo.svg';
    };
    
    const div = document.createElement('div');
    
    const h3 = document.createElement('h3');
    h3.textContent = product.name;
    
    const description = document.createElement('p');
    description.textContent = product.description;
    
    const priceP = document.createElement('p');
    priceP.innerHTML = `Precio: $<span>${product.price}</span>`;
    
    const category = document.createElement('p');
    category.textContent = product.category;
    
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
    
    div.appendChild(h3);
    div.appendChild(description);
    div.appendChild(priceP);
    div.appendChild(category);
    div.appendChild(button);
    
    li.appendChild(img);
    li.appendChild(div);
    
    return li;
}

function renderProducts() {
    const productsList = document.getElementById('productos');
    // Clear existing products (except the example ones from HTML)
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const productElement = createProductElement(product);
        productsList.appendChild(productElement);
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
    img.src = product.image;
    img.alt = product.name;
    
    const h3 = document.createElement('h3');
    h3.textContent = product.name;
    
    const description = document.createElement('p');
    description.textContent = product.description;
    
    const priceP = document.createElement('p');
    priceP.innerHTML = `Precio: $<span>${product.price}</span>`;
    
    const category = document.createElement('p');
    category.textContent = product.category;
    
    const footer = document.createElement('footer');
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.addEventListener('click', () => {
        dialog.close();
        modalContainer.removeChild(dialog);
    });
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Agregar';
    addButton.addEventListener('click', () => {
        shoppingCart.addProduct(product);
        updateCartDisplay();
        dialog.close();
        modalContainer.removeChild(dialog);
    });
    
    footer.appendChild(closeButton);
    footer.appendChild(addButton);
    
    detailDiv.appendChild(img);
    detailDiv.appendChild(h3);
    detailDiv.appendChild(description);
    detailDiv.appendChild(priceP);
    detailDiv.appendChild(category);
    detailDiv.appendChild(footer);
    
    dialog.appendChild(detailDiv);
    modalContainer.appendChild(dialog);
    
    return dialog;
}

function showProductDetail(product) {
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
    
    header.appendChild(itemsSpan);
    header.appendChild(totalSpan);
    
    const ul = document.createElement('ul');
    
    if (shoppingCart.items.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'El carrito está vacío';
        ul.appendChild(li);
    } else {
        shoppingCart.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `${item.product.name} - ${item.quantity} x $${item.product.price} `;
            
            const removeLink = document.createElement('a');
            removeLink.href = '#';
            removeLink.textContent = 'Eliminar';
            removeLink.addEventListener('click', (e) => {
                e.preventDefault();
                shoppingCart.removeProduct(item.product.id);
                dialog.close();
                modalContainer.removeChild(dialog);
                updateCartDisplay();
            });
            
            li.appendChild(removeLink);
            ul.appendChild(li);
        });
    }
    
    const footer = document.createElement('footer');
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.addEventListener('click', () => {
        dialog.close();
        modalContainer.removeChild(dialog);
    });
    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Vaciar';
    clearButton.addEventListener('click', () => {
        shoppingCart.clearCart();
        dialog.close();
        modalContainer.removeChild(dialog);
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
        modalContainer.removeChild(dialog);
    });
    
    footer.appendChild(closeButton);
    footer.appendChild(clearButton);
    footer.appendChild(checkoutButton);
    
    cartDiv.appendChild(header);
    cartDiv.appendChild(ul);
    cartDiv.appendChild(footer);
    
    dialog.appendChild(cartDiv);
    modalContainer.appendChild(dialog);
    
    return dialog;
}

function showCartModal() {
    const modal = createCartModal();
    modal.showModal();
}

// Initialize the application
function initializeApp() {
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