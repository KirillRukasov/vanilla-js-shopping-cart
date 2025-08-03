const IMAGE_BASE_PATH = 'img/products/';
const FALLBACK_IMAGE = 'img/producto-ejemplo.svg';

class Utils {
    static formatPrice(price) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    }

    static getImageUrl(imageName) {
        if (!imageName) return FALLBACK_IMAGE;
        if (imageName.startsWith('http') || imageName.startsWith('img/')) {
            return imageName;
        }
        return IMAGE_BASE_PATH + imageName;
    }

    static handleImageError(img, fallbackSrc = FALLBACK_IMAGE) {
        img.onerror = function() {
            this.src = fallbackSrc;
            this.onerror = null;
        };
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static preloadImages(imageSources) {
        imageSources.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    static getCategoryName(categoryId) {
        const category = window.AppData.categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    }

    static formatCardNumber(number) {
        return number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    static formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'America/Argentina/Buenos_Aires'
        };
        return new Date(date).toLocaleDateString('es-AR', options);
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    }

    static generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }
}

window.Utils = Utils;