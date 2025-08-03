class ModalsModule {
    constructor() {
        this.currentImageIndex = 0;
        this.activeModal = null;
    }
    
    showProductDetail(product) {
        window.BannersModule?.cleanupBanners();
        
        const modal = this.createProductDetailModal(product);
        this.activeModal = modal;
        modal.showModal();
    }
    
    showCartModal() {
        window.BannersModule?.cleanupBanners();
        
        const modal = this.createCartModal();
        this.activeModal = modal;
        modal.showModal();
    }
    
    createProductDetailModal(product) {
        const modalContainer = document.getElementById('modal');
        this.clearModalContainer(modalContainer);
        
        const dialog = document.createElement('dialog');
        dialog.className = 'modal product-detail-modal';
        
        const detailDiv = document.createElement('div');
        detailDiv.className = 'detalle enhanced';
        
        const imageSection = this.createImageGallery(product);
        const infoSection = this.createProductInfo(product);
        const specsSection = this.createSpecificationsSection(product);
        const footer = this.createProductActions(product, dialog, modalContainer);
        
        detailDiv.append(imageSection, infoSection, specsSection, footer);
        dialog.append(detailDiv);
        modalContainer.append(dialog);
        
        this.addKeyboardNavigation(dialog, product);
        
        return dialog;
    }
    
    createImageGallery(product) {
        const imageSection = document.createElement('div');
        imageSection.className = 'image-gallery';
        
        this.currentImageIndex = 0;
        
        const mainImage = document.createElement('img');
        mainImage.className = 'main-image';
        mainImage.src = Utils.getImageUrl(product.gallery ? product.gallery[0] : product.image);
        mainImage.alt = product.name;
        mainImage.loading = 'lazy';
        Utils.handleImageError(mainImage);
        
        if (product.gallery && product.gallery.length > 1) {
            const prevButton = this.createNavButton('prev', '‹', 'Imagen anterior');
            const nextButton = this.createNavButton('next', '›', 'Imagen siguiente');
            
            const imageIndicator = document.createElement('div');
            imageIndicator.className = 'image-indicator';
            imageIndicator.textContent = `1 / ${product.gallery.length}`;
            
            const thumbnails = this.createThumbnails(product, mainImage, imageIndicator);
            
            prevButton.addEventListener('click', () => {
                this.navigateGallery(product, mainImage, imageIndicator, thumbnails, -1);
            });
            
            nextButton.addEventListener('click', () => {
                this.navigateGallery(product, mainImage, imageIndicator, thumbnails, 1);
            });
            
            Utils.preloadImages(product.gallery);
            
            imageSection.append(prevButton, mainImage, nextButton, imageIndicator, thumbnails);
        } else {
            imageSection.append(mainImage);
        }
        
        return imageSection;
    }
    
    createNavButton(className, text, ariaLabel) {
        const button = document.createElement('button');
        button.className = `nav-button ${className}`;
        button.textContent = text;
        button.setAttribute('aria-label', ariaLabel);
        return button;
    }
    
    createThumbnails(product, mainImage, imageIndicator) {
        const thumbnails = document.createElement('div');
        thumbnails.className = 'thumbnails';
        
        product.gallery.forEach((imageSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = Utils.getImageUrl(imageSrc);
            thumb.alt = `${product.name} - imagen ${index + 1}`;
            thumb.className = index === 0 ? 'active' : '';
            thumb.loading = 'lazy';
            Utils.handleImageError(thumb);
            
            thumb.addEventListener('click', () => {
                this.currentImageIndex = index;
                this.updateMainImage(mainImage, product.gallery[index], imageIndicator, product.gallery.length, thumbnails);
            });
            
            thumbnails.append(thumb);
        });
        
        return thumbnails;
    }
    
    navigateGallery(product, mainImage, imageIndicator, thumbnails, direction) {
        if (direction === 1) {
            this.currentImageIndex = this.currentImageIndex < product.gallery.length - 1 ? this.currentImageIndex + 1 : 0;
        } else {
            this.currentImageIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : product.gallery.length - 1;
        }
        
        this.updateMainImage(mainImage, product.gallery[this.currentImageIndex], imageIndicator, product.gallery.length, thumbnails);
    }
    
    updateMainImage(mainImage, newSrc, indicator, totalImages, thumbnails) {
        mainImage.style.opacity = '0.7';
        
        setTimeout(() => {
            mainImage.src = Utils.getImageUrl(newSrc);
            indicator.textContent = `${this.currentImageIndex + 1} / ${totalImages}`;
            
            const thumbs = thumbnails.querySelectorAll('img');
            thumbs.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === this.currentImageIndex);
            });
            
            mainImage.style.opacity = '1';
        }, 150);
    }
    
    createProductInfo(product) {
        const infoSection = document.createElement('div');
        infoSection.className = 'product-info';
        
        const title = document.createElement('h3');
        title.textContent = product.name;
        
        const category = document.createElement('p');
        category.className = 'category';
        category.textContent = Utils.getCategoryName(product.category);
        
        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = Utils.formatPrice(product.price);
        
        infoSection.append(title, category, price);
        
        if (product.rating) {
            const rating = this.createRatingElement(product.rating);
            infoSection.append(rating);
        }
        
        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = product.fullDescription || product.description;
        infoSection.append(description);
        
        if (product.stock !== undefined) {
            const stock = this.createStockElement(product.stock);
            infoSection.append(stock);
        }
        
        return infoSection;
    }
    
    createRatingElement(rating) {
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'rating';
        
        const stars = document.createElement('span');
        stars.className = 'stars';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        let starsText = '★'.repeat(fullStars);
        if (hasHalfStar) starsText += '☆';
        starsText += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
        
        stars.textContent = starsText;
        
        const ratingText = document.createElement('span');
        ratingText.textContent = `${rating}/5`;
        
        ratingDiv.append(stars, ratingText);
        return ratingDiv;
    }
    
    createStockElement(stock) {
        const stockDiv = document.createElement('p');
        stockDiv.className = 'stock';
        
        if (stock > 10) {
            stockDiv.textContent = `✓ En stock (${stock} disponibles)`;
            stockDiv.classList.add('in-stock');
        } else if (stock > 0) {
            stockDiv.textContent = `⚠ Últimas ${stock} unidades`;
            stockDiv.classList.add('low-stock');
        } else {
            stockDiv.textContent = '✗ Sin stock';
            stockDiv.classList.add('out-of-stock');
        }
        
        return stockDiv;
    }
    
    createSpecificationsSection(product) {
        if (!product.specifications) return document.createElement('div');
        
        const specsSection = document.createElement('div');
        specsSection.className = 'specifications';
        
        const specsTitle = document.createElement('h4');
        specsTitle.textContent = 'Especificaciones técnicas';
        
        const specsGrid = document.createElement('div');
        specsGrid.className = 'specs-grid';
        
        Object.entries(product.specifications).forEach(([key, value]) => {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item';
            
            const specLabel = document.createElement('span');
            specLabel.className = 'spec-label';
            specLabel.textContent = key;
            
            const specValue = document.createElement('span');
            specValue.className = 'spec-value';
            specValue.textContent = value;
            
            specItem.append(specLabel, specValue);
            specsGrid.append(specItem);
        });
        
        specsSection.append(specsTitle, specsGrid);
        return specsSection;
    }
    
    createProductActions(product, dialog, modalContainer) {
        const footer = document.createElement('footer');
        footer.className = 'product-actions';
        
        const quantityContainer = this.createQuantitySelector(product);
        const closeButton = this.createCloseButton(dialog, modalContainer);
        const addButton = this.createAddButton(product, quantityContainer);
        
        footer.append(quantityContainer, closeButton, addButton);
        return footer;
    }
    
    createQuantitySelector(product) {
        const container = document.createElement('div');
        container.className = 'quantity-container';
        
        const label = document.createElement('label');
        label.textContent = 'Cantidad:';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.max = product.stock || '99';
        input.value = '1';
        input.className = 'quantity-input';
        
        if (product.stock === 0) {
            input.disabled = true;
        }
        
        container.append(label, input);
        return container;
    }
    
    createCloseButton(dialog, modalContainer) {
        const button = document.createElement('button');
        button.className = 'secondary';
        button.textContent = 'Cerrar';
        button.addEventListener('click', () => {
            dialog.close();
            this.clearModalContainer(modalContainer);
            this.activeModal = null;
        });
        return button;
    }
    
    createAddButton(product, quantityContainer) {
        const button = document.createElement('button');
        button.className = 'primary';
        button.textContent = 'Agregar al carrito';
        
        if (product.stock === 0) {
            button.textContent = 'Sin stock';
            button.disabled = true;
        }
        
        button.addEventListener('click', () => {
            const quantityInput = quantityContainer.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value) || 1;
            
            for (let i = 0; i < quantity; i++) {
                window.app.cart.addProduct(product);
            }
            
            const originalText = button.textContent;
            button.textContent = `¡${quantity} agregado${quantity > 1 ? 's' : ''}!`;
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = product.stock === 0;
            }, 2000);
        });
        
        return button;
    }
    
    createCartModal() {
        const modalContainer = document.getElementById('modal');
        this.clearModalContainer(modalContainer);
        
        const dialog = document.createElement('dialog');
        dialog.className = 'modal cart-modal';
        
        const cartDiv = document.createElement('div');
        cartDiv.className = 'carrito';
        
        const header = this.createCartHeader();
        const itemsList = this.createCartItemsList();
        const footer = this.createCartFooter(dialog, modalContainer);
        
        cartDiv.append(header, itemsList, footer);
        dialog.append(cartDiv);
        modalContainer.append(dialog);
        
        return dialog;
    }
    
    createCartHeader() {
        const header = document.createElement('header');
        
        const itemsSpan = document.createElement('span');
        itemsSpan.textContent = `Productos: ${window.app.cart.calculateQuantity()}`;
        
        const totalSpan = document.createElement('span');
        totalSpan.textContent = `Total: ${Utils.formatPrice(window.app.cart.calculateTotal())}`;
        
        header.append(itemsSpan, totalSpan);
        return header;
    }
    
    createCartItemsList() {
        const ul = document.createElement('ul');
        ul.className = 'cart-items';
        
        if (window.app.cart.items.length === 0) {
            const li = document.createElement('li');
            li.className = 'empty-cart';
            li.textContent = 'El carrito está vacío';
            ul.append(li);
        } else {
            window.app.cart.items.forEach(item => {
                const li = this.createCartItem(item);
                ul.append(li);
            });
        }
        
        return ul;
    }
    
    createCartItem(item) {
        const li = document.createElement('li');
        li.className = 'cart-item';
        
        const productInfo = document.createElement('div');
        productInfo.className = 'item-info';
        
        const name = document.createElement('h4');
        name.textContent = item.product.name;
        
        const details = document.createElement('p');
        details.textContent = `${item.quantity} x ${Utils.formatPrice(item.product.price)} = ${Utils.formatPrice(item.product.price * item.quantity)}`;
        
        productInfo.append(name, details);
        
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        const quantityControls = this.createQuantityControls(item);
        const removeButton = this.createRemoveButton(item);
        
        actions.append(quantityControls, removeButton);
        li.append(productInfo, actions);
        
        return li;
    }
    
    createQuantityControls(item) {
        const controls = document.createElement('div');
        controls.className = 'quantity-controls';
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '-';
        decreaseBtn.className = 'quantity-btn decrease';
        decreaseBtn.addEventListener('click', () => {
            window.app.cart.updateQuantity(item.product.id, item.quantity - 1);
            this.refreshCartModal();
        });
        
        const quantity = document.createElement('span');
        quantity.textContent = item.quantity;
        quantity.className = 'quantity-display';
        
        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.className = 'quantity-btn increase';
        increaseBtn.addEventListener('click', () => {
            window.app.cart.updateQuantity(item.product.id, item.quantity + 1);
            this.refreshCartModal();
        });
        
        controls.append(decreaseBtn, quantity, increaseBtn);
        return controls;
    }
    
    createRemoveButton(item) {
        const button = document.createElement('button');
        button.textContent = 'Eliminar';
        button.className = 'remove-btn';
        button.addEventListener('click', () => {
            window.app.cart.removeProduct(item.product.id);
            this.refreshCartModal();
        });
        return button;
    }
    
    createCartFooter(dialog, modalContainer) {
        const footer = document.createElement('footer');
        footer.className = 'cart-actions';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'secondary';
        closeButton.textContent = 'Seguir comprando';
        closeButton.addEventListener('click', () => {
            dialog.close();
            this.clearModalContainer(modalContainer);
            this.activeModal = null;
        });
        
        const clearButton = document.createElement('button');
        clearButton.className = 'danger';
        clearButton.textContent = 'Vaciar carrito';
        clearButton.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                window.app.cart.clearCart();
                this.refreshCartModal();
            }
        });
        
        const checkoutButton = document.createElement('button');
        checkoutButton.className = 'primary';
        checkoutButton.textContent = 'Proceder al pago';
        checkoutButton.addEventListener('click', () => {
            if (window.app.cart.items.length > 0) {
                dialog.close();
                this.clearModalContainer(modalContainer);
                this.activeModal = null;
                window.CheckoutModule?.showCheckout();
            } else {
                alert('El carrito está vacío');
            }
        });
        
        if (window.app.cart.items.length === 0) {
            checkoutButton.disabled = true;
            clearButton.disabled = true;
        }
        
        footer.append(closeButton, clearButton, checkoutButton);
        return footer;
    }
    
    refreshCartModal() {
        if (this.activeModal) {
            const cartData = {
                items: window.app.cart.items,
                total: window.app.cart.calculateTotal(),
                quantity: window.app.cart.calculateQuantity()
            };
            
            const header = this.activeModal.querySelector('header');
            if (header) {
                const spans = header.querySelectorAll('span');
                if (spans[0]) spans[0].textContent = `Productos: ${cartData.quantity}`;
                if (spans[1]) spans[1].textContent = `Total: ${Utils.formatPrice(cartData.total)}`;
            }
            
            const itemsList = this.activeModal.querySelector('.cart-items');
            if (itemsList) {
                itemsList.remove();
                const newItemsList = this.createCartItemsList();
                const cartDiv = this.activeModal.querySelector('.carrito');
                const footer = cartDiv.querySelector('footer');
                cartDiv.insertBefore(newItemsList, footer);
            }
            
            const footer = this.activeModal.querySelector('.cart-actions');
            if (footer) {
                const clearBtn = footer.querySelector('.danger');
                const checkoutBtn = footer.querySelector('.primary');
                const isEmpty = window.app.cart.items.length === 0;
                
                if (clearBtn) clearBtn.disabled = isEmpty;
                if (checkoutBtn) checkoutBtn.disabled = isEmpty;
            }
        }
    }
    
    addKeyboardNavigation(dialog, product) {
        const handleKeyPress = (event) => {
            switch(event.key) {
                case 'ArrowLeft':
                    if (product.gallery && product.gallery.length > 1) {
                        event.preventDefault();
                        dialog.querySelector('.nav-button.prev')?.click();
                    }
                    break;
                case 'ArrowRight':
                    if (product.gallery && product.gallery.length > 1) {
                        event.preventDefault();
                        dialog.querySelector('.nav-button.next')?.click();
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    dialog.close();
                    this.clearModalContainer(document.getElementById('modal'));
                    this.activeModal = null;
                    break;
                case 'Enter':
                    if (event.target.classList.contains('quantity-input')) {
                        event.preventDefault();
                        dialog.querySelector('.primary')?.click();
                    }
                    break;
            }
        };
        
        dialog.addEventListener('keydown', handleKeyPress);
        
        setTimeout(() => {
            const quantityInput = dialog.querySelector('.quantity-input');
            if (quantityInput && !quantityInput.disabled) {
                quantityInput.focus();
                quantityInput.select();
            }
        }, 300);
        
        dialog.addEventListener('close', () => {
            dialog.removeEventListener('keydown', handleKeyPress);
        });
    }
    
    clearModalContainer(modalContainer) {
        if (modalContainer) {
            modalContainer.innerHTML = '';
        }
    }
    
    closeActiveModal() {
        if (this.activeModal) {
            this.activeModal.close();
            this.clearModalContainer(document.getElementById('modal'));
            this.activeModal = null;
        }
    }
}

window.ModalsModule = new ModalsModule();