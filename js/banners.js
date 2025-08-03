class BannersModule {
    constructor() {
        this.currentBanner = null;
        this.bannerTimeout = null;
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.currentBanner) {
                this.removeBanner();
            }
        });
    }
    
    getRandomOffer(categoryId) {
        const offers = window.AppData.categoryOffers[categoryId];
        if (!offers || offers.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * offers.length);
        return offers[randomIndex];
    }
    
    showBanner(categoryId) {
        if (this.currentBanner) {
            this.removeBanner();
        }
        
        if (categoryId === 'all') {
            return;
        }
        
        const offer = this.getRandomOffer(categoryId);
        if (!offer) {
            return;
        }
        
        setTimeout(() => {
            this.currentBanner = this.createBannerElement(offer, categoryId);
            document.body.append(this.currentBanner);
            
            setTimeout(() => {
                if (this.currentBanner) {
                    this.currentBanner.classList.add('show');
                }
            }, 100);
            
            this.bannerTimeout = setTimeout(() => {
                this.removeBanner();
            }, 10000);
        }, 300);
    }
    
    createBannerElement(offer, categoryId) {
        const banner = document.createElement('div');
        banner.id = 'floating-banner';
        banner.className = `floating-banner ${categoryId}`;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'banner-close';
        closeButton.textContent = '×';
        closeButton.setAttribute('aria-label', 'Cerrar banner');
        closeButton.addEventListener('click', () => {
            this.removeBanner();
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
        
        this.configureBannerAction(actionButton, offer);
        
        if (offer.discount > 0) {
            const discountBadge = document.createElement('span');
            discountBadge.className = 'discount-badge';
            discountBadge.textContent = `-${offer.discount}%`;
            banner.append(discountBadge);
        }
        
        const icon = this.createCategoryIcon(categoryId);
        if (icon) {
            content.prepend(icon);
        }
        
        content.append(title, message, actionButton);
        banner.append(closeButton, content);
        
        return banner;
    }
    
    configureBannerAction(actionButton, offer) {
        if (offer.productId) {
            actionButton.addEventListener('click', () => {
                const product = window.ProductsModule.getProductById(offer.productId);
                if (product) {
                    window.ModalsModule.showProductDetail(product);
                    this.removeBanner();
                }
            });
        } else if (offer.categoryId) {
            actionButton.addEventListener('click', () => {
                window.ProductsModule.filterByCategory(offer.categoryId);
                window.ProductsModule.updateActiveCategory(offer.categoryId);
                this.removeBanner();
            });
        } else {
            actionButton.addEventListener('click', () => {
                document.getElementById('productos')?.scrollIntoView({ 
                    behavior: 'smooth' 
                });
                this.removeBanner();
            });
        }
    }
    
    createCategoryIcon(categoryId) {
        const iconContainer = document.createElement('div');
        iconContainer.className = 'banner-icon';
        
        let iconText = '';
        switch (categoryId) {
            case 'electronics':
                iconText = '📱';
                break;
            case 'clothing':
                iconText = '👕';
                break;
            case 'accessories':
                iconText = '🎒';
                break;
            default:
                return null;
        }
        
        iconContainer.textContent = iconText;
        return iconContainer;
    }
    
    removeBanner() {
        if (this.currentBanner) {
            if (this.bannerTimeout) {
                clearTimeout(this.bannerTimeout);
                this.bannerTimeout = null;
            }
            
            this.currentBanner.classList.add('hide');
            
            setTimeout(() => {
                if (this.currentBanner && this.currentBanner.parentNode) {
                    this.currentBanner.remove();
                }
                this.currentBanner = null;
            }, 300);
        }
    }
    
    cleanupBanners() {
        this.removeBanner();
    }
    
    isBannerVisible() {
        return this.currentBanner !== null;
    }
    
    showCustomBanner(config) {
        if (this.currentBanner) {
            this.removeBanner();
        }
        
        const customOffer = {
            title: config.title || '¡Oferta especial!',
            message: config.message || 'No te pierdas esta oportunidad',
            action: config.action || 'Ver más',
            discount: config.discount || 0,
            ...config
        };
        
        setTimeout(() => {
            this.currentBanner = this.createBannerElement(customOffer, config.category || 'general');
            document.body.append(this.currentBanner);
            
            setTimeout(() => {
                if (this.currentBanner) {
                    this.currentBanner.classList.add('show');
                }
            }, 100);
            
            const duration = config.duration || 10000;
            this.bannerTimeout = setTimeout(() => {
                this.removeBanner();
            }, duration);
        }, 300);
    }
    
    showWelcomeBanner() {
        if (sessionStorage.getItem('welcomeBannerShown')) {
            return;
        }
        
        setTimeout(() => {
            this.showCustomBanner({
                title: '¡Bienvenido!',
                message: 'Descubre nuestros productos con ofertas exclusivas',
                action: 'Explorar',
                category: 'welcome',
                duration: 8000,
                categoryId: 'all'
            });
            
            sessionStorage.setItem('welcomeBannerShown', 'true');
        }, 2000);
    }
    
    showCartAbandonmentBanner() {
        if (window.app.cart.items.length > 0) {
            this.showCustomBanner({
                title: '¡No olvides tu carrito!',
                message: 'Tienes productos esperándote. ¡Completa tu compra!',
                action: 'Ver carrito',
                category: 'cart',
                duration: 6000,
                callback: () => {
                    window.ModalsModule.showCartModal();
                }
            });
        }
    }
}

window.BannersModule = new BannersModule();