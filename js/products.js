class ProductsModule {
    constructor() {
        this.currentCategory = 'all';
    }
    
    createCategoryNavigation() {
        const main = document.querySelector('main');
        const existingNav = document.getElementById('category-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        const categoryNav = document.createElement('nav');
        categoryNav.id = 'category-nav';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = 'Categorías';
        categoryNav.append(categoryTitle);
        
        const categoryList = document.createElement('ul');
        categoryList.className = 'category-list';
        
        window.AppData.categories.forEach(category => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = category.name;
            button.className = this.currentCategory === category.id ? 'active' : '';
            button.dataset.categoryId = category.id;
            
            button.addEventListener('click', () => {
                this.filterByCategory(category.id);
                this.updateActiveCategory(category.id);
            });
            
            li.append(button);
            categoryList.append(li);
        });
        
        categoryNav.append(categoryList);
        
        const productsTitle = main.querySelector('h2');
        main.insertBefore(categoryNav, productsTitle);
    }
    
    filterByCategory(categoryId) {
        this.currentCategory = categoryId;
        
        let filteredProducts;
        if (categoryId === 'all') {
            filteredProducts = window.AppData.products;
        } else {
            filteredProducts = window.AppData.products.filter(product => product.category === categoryId);
        }
        
        this.renderProducts(filteredProducts);
        
        window.BannersModule?.showBanner(categoryId);
    }
    
    updateActiveCategory(categoryId) {
        const categoryButtons = document.querySelectorAll('#category-nav button');
        categoryButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.categoryId === categoryId) {
                button.classList.add('active');
            }
        });
    }
    
    renderProducts(productsToRender = window.AppData.products) {
        const productsList = document.getElementById('productos');
        if (!productsList) return;
        
        productsList.innerHTML = '';
        
        productsToRender.forEach(product => {
            const productElement = this.createProductElement(product);
            productsList.append(productElement);
        });
    }
    
    createProductElement(product) {
        const li = document.createElement('li');
        li.className = 'product-item';
        li.dataset.productId = product.id;
        
        const img = document.createElement('img');
        img.src = Utils.getImageUrl(product.image);
        img.alt = product.name;
        img.loading = 'lazy';
        Utils.handleImageError(img);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'product-content';
        
        const title = document.createElement('h3');
        title.textContent = product.name;
        
        const description = document.createElement('p');
        description.className = 'product-description';
        description.textContent = product.description;
        
        const priceP = document.createElement('p');
        priceP.className = 'product-price';
        priceP.textContent = Utils.formatPrice(product.price);
        
        const category = document.createElement('p');
        category.className = 'product-category';
        category.textContent = Utils.getCategoryName(product.category);
        
        if (product.rating) {
            const rating = this.createProductRating(product.rating);
            contentDiv.append(title, description, priceP, category, rating);
        } else {
            contentDiv.append(title, description, priceP, category);
        }
        
        const addButton = document.createElement('button');
        addButton.className = 'add-to-cart-btn';
        addButton.textContent = 'Agregar';
        
        if (product.stock === 0) {
            addButton.textContent = 'Sin stock';
            addButton.disabled = true;
            li.classList.add('out-of-stock');
        }
        
        addButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleAddToCart(product, addButton);
        });
        
        contentDiv.append(addButton);
        
        li.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                window.ModalsModule.showProductDetail(product);
            }
        });
        
        li.append(img, contentDiv);
        return li;
    }
    
    createProductRating(rating) {
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'product-rating';
        
        const stars = document.createElement('span');
        stars.className = 'rating-stars';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        let starsHTML = '★'.repeat(fullStars);
        if (hasHalfStar) {
            starsHTML += '☆';
        }
        starsHTML += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
        
        stars.textContent = starsHTML;
        
        const ratingText = document.createElement('span');
        ratingText.className = 'rating-text';
        ratingText.textContent = `(${rating})`;
        
        ratingDiv.append(stars, ratingText);
        return ratingDiv;
    }
    
    handleAddToCart(product, button) {
        if (product.stock === 0) return;
        
        window.app.cart.addProduct(product);
        
        const originalText = button.textContent;
        button.textContent = '¡Agregado!';
        button.disabled = true;
        button.classList.add('added');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = product.stock === 0;
            button.classList.remove('added');
        }, 1500);
    }
    
    searchProducts(query) {
        if (!query.trim()) {
            this.renderProducts();
            return;
        }
        
        const filtered = window.AppData.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            Utils.getCategoryName(product.category).toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderProducts(filtered);
    }
    
    sortProducts(sortBy = 'name', order = 'asc') {
        const products = [...window.AppData.products];
        
        products.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
                case 'price':
                    valueA = a.price;
                    valueB = b.price;
                    break;
                case 'rating':
                    valueA = a.rating || 0;
                    valueB = b.rating || 0;
                    break;
                case 'name':
                default:
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
            }
            
            if (order === 'desc') {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            } else {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            }
        });
        
        this.renderProducts(products);
    }
    
    getProductById(id) {
        return window.AppData.products.find(product => product.id === parseInt(id));
    }
}

window.ProductsModule = new ProductsModule();