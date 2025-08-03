class App {
    constructor() {
        this.currentCategory = 'all';
        this.cart = new ShoppingCart();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderComponents();
        this.cart.notifyUpdate(); // Actualizar display inicial
        console.log('Aplicación inicializada correctamente');
    }
    
    setupEventListeners() {
        document.addEventListener('cartUpdated', (e) => {
            this.updateCartDisplay(e.detail);
        });
        
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });

        document.addEventListener('checkoutStarted', (e) => {
            console.log('Checkout iniciado:', e.detail);
        });

        document.addEventListener('orderCompleted', (e) => {
            console.log('Pedido completado:', e.detail);
        });

        document.addEventListener('checkoutCancelled', (e) => {
            console.log('Checkout cancelado');
        });
    }
    
    renderComponents() {
        window.ProductsModule.createCategoryNavigation();
        
        window.ProductsModule.renderProducts();
        
        const cartButton = document.querySelector('#mini-carrito button');
        cartButton?.addEventListener('click', () => {
            window.ModalsModule.showCartModal();
        });
    }
    
    updateCartDisplay(cartData) {
        const itemsSpan = document.querySelector('#mini-carrito p:first-child span');
        const totalSpan = document.querySelector('#mini-carrito p:nth-child(2) span');
        
        if (itemsSpan) itemsSpan.textContent = cartData.quantity;
        if (totalSpan) totalSpan.textContent = Utils.formatPrice(cartData.total);
    }
    
    handleGlobalKeyboard(event) {
        if (event.key === 'Escape') {
            window.BannersModule?.removeBanner();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});