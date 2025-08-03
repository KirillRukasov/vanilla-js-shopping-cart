class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }
    
    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
    
    calculateQuantity() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    addProduct(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }
        
        this.saveToStorage();
        this.notifyUpdate();
    }
    
    removeProduct(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.saveToStorage();
        this.notifyUpdate();
    }
    
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeProduct(productId);
            } else {
                item.quantity = newQuantity;
                this.saveToStorage();
                this.notifyUpdate();
            }
        }
    }
    
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.notifyUpdate();
    }
    
    saveToStorage() {
        try {
            localStorage.setItem('shopping-cart', JSON.stringify(this.items));
        } catch (e) {
            console.warn('No se pudo guardar el carrito en localStorage:', e);
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('shopping-cart');
            if (saved) {
                this.items = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('No se pudo cargar el carrito desde localStorage:', e);
            this.items = [];
        }
    }
    
    notifyUpdate() {
        document.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                items: this.items,
                total: this.calculateTotal(),
                quantity: this.calculateQuantity()
            }
        }));
    }

    calculateTotalWithDelivery(deliveryType = 'pickup') {
        const subtotal = this.calculateTotal();
        const deliveryCost = window.AppData.deliveryOptions[deliveryType]?.cost || 0;
        return subtotal + deliveryCost;
    }

    calculateInstallmentAmount(installments = 1) {
        const total = this.calculateTotal();
        const installmentData = window.AppData.installmentOptions.find(opt => opt.value === installments.toString());
        const rate = installmentData?.rate || 0;
        const totalWithInterest = total * (1 + rate);
        return Math.round(totalWithInterest / installments);
    }

    getCartSummary() {
        return {
            items: this.items,
            quantity: this.calculateQuantity(),
            subtotal: this.calculateTotal(),
            itemCount: this.items.length
        };
    }

    validateStock() {
        const outOfStock = [];
        this.items.forEach(item => {
            if (item.product.stock !== undefined && item.product.stock < item.quantity) {
                outOfStock.push({
                    product: item.product,
                    requested: item.quantity,
                    available: item.product.stock
                });
            }
        });
        return outOfStock;
    }
}

window.ShoppingCart = ShoppingCart;