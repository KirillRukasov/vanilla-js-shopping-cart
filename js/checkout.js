class CheckoutModule {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.customerData = {};
        this.paymentData = {};
        this.deliveryData = {};
        this.activeModal = null;
    }
    
    showCheckout() {
        if (window.app.cart.items.length === 0) {
            this.showEmptyCartMessage();
            return;
        }
        
        window.BannersModule?.cleanupBanners();
        const modal = this.createCheckoutModal();
        this.activeModal = modal;
        modal.showModal();
    }
    
    showEmptyCartMessage() {
        window.BannersModule?.showCustomBanner({
            title: '¡Carrito vacío!',
            message: 'Agrega algunos productos antes de proceder al pago',
            action: 'Ver productos',
            category: 'cart',
            duration: 5000,
            callback: () => {
                document.getElementById('productos')?.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }
    
    createCheckoutModal() {
        const modalContainer = document.getElementById('modal');
        this.clearModalContainer(modalContainer);
        
        const dialog = document.createElement('dialog');
        dialog.className = 'modal checkout-modal';
        
        const checkoutDiv = document.createElement('div');
        checkoutDiv.className = 'checkout-container';
        
        // Header con progress bar
        const header = this.createCheckoutHeader();
        
        // Contenido del paso actual
        const content = this.createStepContent();
        
        // Footer con navegación
        const footer = this.createCheckoutFooter(dialog, modalContainer);
        
        checkoutDiv.append(header, content, footer);
        dialog.append(checkoutDiv);
        modalContainer.append(dialog);
        
        // Agregar navegación con teclado
        this.addCheckoutKeyboardNavigation(dialog);
        
        return dialog;
    }
    
    createCheckoutHeader() {
        const header = document.createElement('header');
        header.className = 'checkout-header';
        
        const title = document.createElement('h2');
        title.textContent = 'Finalizar Compra';
        
        const progressBar = this.createProgressBar();
        
        header.append(title, progressBar);
        return header;
    }
    
    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const steps = [
            { number: 1, title: 'Datos Personales', icon: '👤' },
            { number: 2, title: 'Entrega y Pago', icon: '🚚' },
            { number: 3, title: 'Confirmación', icon: '✅' }
        ];
        
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = `progress-step ${this.currentStep >= step.number ? 'active' : ''} ${this.currentStep > step.number ? 'completed' : ''}`;
            
            const stepNumber = document.createElement('div');
            stepNumber.className = 'step-number';
            stepNumber.textContent = this.currentStep > step.number ? '✓' : step.icon;
            
            const stepTitle = document.createElement('div');
            stepTitle.className = 'step-title';
            stepTitle.textContent = step.title;
            
            stepElement.append(stepNumber, stepTitle);
            progressContainer.append(stepElement);
            
            if (index < steps.length - 1) {
                const connector = document.createElement('div');
                connector.className = `step-connector ${this.currentStep > step.number ? 'completed' : ''}`;
                progressContainer.append(connector);
            }
        });
        
        return progressContainer;
    }
    
    createStepContent() {
        const content = document.createElement('div');
        content.className = 'checkout-content';
        content.id = 'checkout-step-content';
        
        switch (this.currentStep) {
            case 1:
                content.append(this.createPersonalDataStep());
                break;
            case 2:
                content.append(this.createDeliveryPaymentStep());
                break;
            case 3:
                content.append(this.createConfirmationStep());
                break;
        }
        
        return content;
    }
    
    createPersonalDataStep() {
        const step = document.createElement('div');
        step.className = 'checkout-step personal-data-step';
        
        const stepTitle = document.createElement('h3');
        stepTitle.textContent = 'Datos Personales';
        
        const form = document.createElement('form');
        form.className = 'checkout-form';
        form.id = 'personal-data-form';
        
        const fields = [
            { name: 'firstName', label: 'Nombre *', type: 'text', required: true, placeholder: 'Ej: Juan' },
            { name: 'lastName', label: 'Apellido *', type: 'text', required: true, placeholder: 'Ej: Pérez' },
            { name: 'email', label: 'Correo Electrónico *', type: 'email', required: true, placeholder: 'juan@ejemplo.com' },
            { name: 'phone', label: 'Teléfono *', type: 'tel', required: true, placeholder: '+54 11 1234-5678' },
            { name: 'document', label: 'DNI/Documento *', type: 'text', required: true, placeholder: '12.345.678' }
        ];
        
        fields.forEach(field => {
            const fieldGroup = this.createFormField(field);
            form.append(fieldGroup);
        });
        
        step.append(stepTitle, form);
        return step;
    }
    
    createDeliveryPaymentStep() {
        const step = document.createElement('div');
        step.className = 'checkout-step delivery-payment-step';
        
        const stepTitle = document.createElement('h3');
        stepTitle.textContent = 'Entrega y Pago';
        
        const deliverySection = this.createDeliverySection();
        
        const paymentSection = this.createPaymentSection();
        
        step.append(stepTitle, deliverySection, paymentSection);
        return step;
    }
    
    createDeliverySection() {
        const section = document.createElement('div');
        section.className = 'form-section';
        
        const title = document.createElement('h4');
        title.textContent = '📦 Información de Entrega';
        
        const form = document.createElement('form');
        form.className = 'checkout-form';
        form.id = 'delivery-form';
        
        const deliveryTypeGroup = document.createElement('div');
        deliveryTypeGroup.className = 'field-group';
        
        const deliveryLabel = document.createElement('label');
        deliveryLabel.textContent = 'Tipo de Entrega *';
        deliveryLabel.className = 'field-label';
        
        const deliveryOptions = document.createElement('div');
        deliveryOptions.className = 'radio-group';
        
        const deliveryTypes = [
            { value: 'home', label: 'Entrega a domicilio (+$500)', icon: '🏠' },
            { value: 'pickup', label: 'Retiro en tienda (Gratis)', icon: '🏪' },
            { value: 'express', label: 'Entrega express (+$1500)', icon: '⚡' }
        ];
        
        deliveryTypes.forEach((type, index) => {
            const option = this.createRadioOption('deliveryType', type.value, type.label, type.icon, index === 0);
            deliveryOptions.append(option);
        });
        
        deliveryTypeGroup.append(deliveryLabel, deliveryOptions);
        
        const addressFields = this.createAddressFields();
        
        const dateField = this.createFormField({
            name: 'deliveryDate',
            label: 'Fecha de Entrega Preferida *',
            type: 'date',
            required: true
        });
        
        form.append(deliveryTypeGroup, addressFields, dateField);
        section.append(title, form);
        
        this.addDeliveryTypeListeners(deliveryOptions, addressFields);
        
        return section;
    }
    
    createAddressFields() {
        const addressContainer = document.createElement('div');
        addressContainer.className = 'address-fields';
        addressContainer.id = 'address-fields';
        
        const fields = [
            { name: 'address', label: 'Dirección *', type: 'text', required: true, placeholder: 'Ej: Av. Corrientes 1234' },
            { name: 'city', label: 'Ciudad *', type: 'text', required: true, placeholder: 'Ej: Buenos Aires' },
            { name: 'postalCode', label: 'Código Postal *', type: 'text', required: true, placeholder: 'Ej: 1001' },
            { name: 'notes', label: 'Notas adicionales', type: 'textarea', required: false, placeholder: 'Ej: Timbre roto, tocar puerta' }
        ];
        
        fields.forEach(field => {
            const fieldGroup = this.createFormField(field);
            addressContainer.append(fieldGroup);
        });
        
        return addressContainer;
    }
    
    createPaymentSection() {
        const section = document.createElement('div');
        section.className = 'form-section';
        
        const title = document.createElement('h4');
        title.textContent = '💳 Método de Pago';
        
        const form = document.createElement('form');
        form.className = 'checkout-form';
        form.id = 'payment-form';
        
        const paymentTypeGroup = document.createElement('div');
        paymentTypeGroup.className = 'field-group';
        
        const paymentLabel = document.createElement('label');
        paymentLabel.textContent = 'Forma de Pago *';
        paymentLabel.className = 'field-label';
        
        const paymentOptions = document.createElement('div');
        paymentOptions.className = 'radio-group';
        
        const paymentTypes = [
            { value: 'credit', label: 'Tarjeta de Crédito', icon: '💳', installments: true },
            { value: 'debit', label: 'Tarjeta de Débito', icon: '💳', installments: false },
            { value: 'transfer', label: 'Transferencia Bancaria', icon: '🏦', installments: false },
            { value: 'cash', label: 'Efectivo (solo retiro en tienda)', icon: '💵', installments: false }
        ];
        
        paymentTypes.forEach((type, index) => {
            const option = this.createRadioOption('paymentType', type.value, type.label, type.icon, index === 0);
            paymentOptions.append(option);
        });
        
        paymentTypeGroup.append(paymentLabel, paymentOptions);
        
        const cardFields = this.createCardFields();
        
        const installmentsField = this.createInstallmentsField();
        
        form.append(paymentTypeGroup, cardFields, installmentsField);
        section.append(title, form);
        
        this.addPaymentTypeListeners(paymentOptions, cardFields, installmentsField);
        
        return section;
    }
    
    createCardFields() {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-fields';
        cardContainer.id = 'card-fields';
        
        const fields = [
            { name: 'cardNumber', label: 'Número de Tarjeta *', type: 'text', required: true, placeholder: '1234 5678 9012 3456' },
            { name: 'cardName', label: 'Nombre en la Tarjeta *', type: 'text', required: true, placeholder: 'JUAN PEREZ' },
            { name: 'cardExpiry', label: 'Vencimiento *', type: 'text', required: true, placeholder: 'MM/AA' },
            { name: 'cardCvv', label: 'CVV *', type: 'text', required: true, placeholder: '123' }
        ];
        
        const cardRow1 = document.createElement('div');
        cardRow1.className = 'form-row';
        cardRow1.append(this.createFormField(fields[0]));
        
        const cardRow2 = document.createElement('div');
        cardRow2.className = 'form-row';
        cardRow2.append(this.createFormField(fields[1]));
        
        const cardRow3 = document.createElement('div');
        cardRow3.className = 'form-row';
        cardRow3.append(
            this.createFormField(fields[2]),
            this.createFormField(fields[3])
        );
        
        cardContainer.append(cardRow1, cardRow2, cardRow3);
        return cardContainer;
    }
    
    createInstallmentsField() {
        const container = document.createElement('div');
        container.className = 'installments-field';
        container.id = 'installments-field';
        container.style.display = 'none';
        
        const label = document.createElement('label');
        label.textContent = 'Cuotas *';
        label.className = 'field-label';
        
        const select = document.createElement('select');
        select.name = 'installments';
        select.className = 'form-input';
        
        const installmentOptions = [
            { value: '1', text: '1 cuota sin interés' },
            { value: '3', text: '3 cuotas sin interés' },
            { value: '6', text: '6 cuotas con 10% de interés' },
            { value: '12', text: '12 cuotas con 20% de interés' }
        ];
        
        installmentOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            select.append(optionElement);
        });
        
        container.append(label, select);
        return container;
    }
    
    createConfirmationStep() {
        const step = document.createElement('div');
        step.className = 'checkout-step confirmation-step';
        
        const stepTitle = document.createElement('h3');
        stepTitle.textContent = 'Confirmación de Compra';
        
        const orderSummary = this.createOrderSummary();
        
        const customerSummary = this.createCustomerSummary();
        
        const termsSection = this.createTermsSection();
        
        step.append(stepTitle, orderSummary, customerSummary, termsSection);
        return step;
    }
    
    createOrderSummary() {
        const section = document.createElement('div');
        section.className = 'order-summary';
        
        const title = document.createElement('h4');
        title.textContent = '📋 Resumen del Pedido';
        
        const itemsList = document.createElement('div');
        itemsList.className = 'order-items';
        
        window.app.cart.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            
            const itemInfo = document.createElement('div');
            itemInfo.className = 'order-item-info';
            
            const itemName = document.createElement('h5');
            itemName.textContent = item.product.name;
            
            const itemDetails = document.createElement('p');
            itemDetails.textContent = `${item.quantity} x ${Utils.formatPrice(item.product.price)}`;
            
            itemInfo.append(itemName, itemDetails);
            
            const itemTotal = document.createElement('div');
            itemTotal.className = 'order-item-total';
            itemTotal.textContent = Utils.formatPrice(item.product.price * item.quantity);
            
            itemElement.append(itemInfo, itemTotal);
            itemsList.append(itemElement);
        });
        
        const totalsSection = this.createTotalsSection();
        
        section.append(title, itemsList, totalsSection);
        return section;
    }
    
    createTotalsSection() {
        const totals = document.createElement('div');
        totals.className = 'order-totals';
        
        const subtotal = window.app.cart.calculateTotal();
        const deliveryCost = this.calculateDeliveryCost();
        const total = subtotal + deliveryCost;
        
        const subtotalRow = this.createTotalRow('Subtotal', Utils.formatPrice(subtotal));
        const deliveryRow = this.createTotalRow('Envío', Utils.formatPrice(deliveryCost));
        const totalRow = this.createTotalRow('Total', Utils.formatPrice(total), true);
        
        totals.append(subtotalRow, deliveryRow, totalRow);
        return totals;
    }
    
    createTotalRow(label, amount, isTotal = false) {
        const row = document.createElement('div');
        row.className = `total-row ${isTotal ? 'total-final' : ''}`;
        
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        
        const amountSpan = document.createElement('span');
        amountSpan.textContent = amount;
        
        row.append(labelSpan, amountSpan);
        return row;
    }
    
    createCustomerSummary() {
        const section = document.createElement('div');
        section.className = 'customer-summary';
        
        const title = document.createElement('h4');
        title.textContent = '👤 Datos de Entrega y Pago';
        
        const summaryContent = document.createElement('div');
        summaryContent.className = 'summary-content';
        summaryContent.id = 'customer-summary-content';
        
        this.updateCustomerSummary(summaryContent);
        
        section.append(title, summaryContent);
        return section;
    }
    
    updateCustomerSummary(container) {
        container.innerHTML = '';
        
        if (this.customerData.firstName) {
            const personalInfo = document.createElement('div');
            personalInfo.className = 'summary-section';
            personalInfo.innerHTML = `
                <strong>Cliente:</strong> ${this.customerData.firstName} ${this.customerData.lastName}<br>
                <strong>Email:</strong> ${this.customerData.email}<br>
                <strong>Teléfono:</strong> ${this.customerData.phone}
            `;
            container.append(personalInfo);
        }
        
        if (this.deliveryData.deliveryType) {
            const deliveryInfo = document.createElement('div');
            deliveryInfo.className = 'summary-section';
            let deliveryText = `<strong>Entrega:</strong> `;
            
            switch (this.deliveryData.deliveryType) {
                case 'home':
                    deliveryText += `A domicilio - ${this.deliveryData.address}, ${this.deliveryData.city}`;
                    break;
                case 'pickup':
                    deliveryText += 'Retiro en tienda';
                    break;
                case 'express':
                    deliveryText += `Express - ${this.deliveryData.address}, ${this.deliveryData.city}`;
                    break;
            }
            
            if (this.deliveryData.deliveryDate) {
                deliveryText += `<br><strong>Fecha:</strong> ${this.deliveryData.deliveryDate}`;
            }
            
            deliveryInfo.innerHTML = deliveryText;
            container.append(deliveryInfo);
        }
        
        if (this.paymentData.paymentType) {
            const paymentInfo = document.createElement('div');
            paymentInfo.className = 'summary-section';
            let paymentText = `<strong>Pago:</strong> `;
            
            switch (this.paymentData.paymentType) {
                case 'credit':
                    paymentText += `Tarjeta de Crédito`;
                    if (this.paymentData.installments > 1) {
                        paymentText += ` - ${this.paymentData.installments} cuotas`;
                    }
                    break;
                case 'debit':
                    paymentText += 'Tarjeta de Débito';
                    break;
                case 'transfer':
                    paymentText += 'Transferencia Bancaria';
                    break;
                case 'cash':
                    paymentText += 'Efectivo';
                    break;
            }
            
            paymentInfo.innerHTML = paymentText;
            container.append(paymentInfo);
        }
    }
    
    createTermsSection() {
        const section = document.createElement('div');
        section.className = 'terms-section';
        
        const checkboxGroup = document.createElement('div');
        checkboxGroup.className = 'checkbox-group';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'terms-checkbox';
        checkbox.name = 'acceptTerms';
        checkbox.required = true;
        
        const label = document.createElement('label');
        label.htmlFor = 'terms-checkbox';
        label.innerHTML = 'Acepto los <a href="#" target="_blank">términos y condiciones</a> y la <a href="#" target="_blank">política de privacidad</a> *';
        
        checkboxGroup.append(checkbox, label);
        section.append(checkboxGroup);
        
        return section;
    }
    
    createFormField(field) {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'field-group';
        
        const label = document.createElement('label');
        label.textContent = field.label;
        label.className = 'field-label';
        label.htmlFor = field.name;
        
        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }
        
        input.name = field.name;
        input.id = field.name;
        input.className = 'form-input';
        input.placeholder = field.placeholder || '';
        input.required = field.required || false;
        
        input.addEventListener('blur', (e) => {
            this.validateField(e.target);
        });
        
        input.addEventListener('input', (e) => {
            this.clearFieldError(e.target);
        });
        
        fieldGroup.append(label, input);
        return fieldGroup;
    }
    
    createRadioOption(name, value, label, icon, checked = false) {
        const option = document.createElement('div');
        option.className = 'radio-option';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = name;
        input.value = value;
        input.id = `${name}-${value}`;
        input.checked = checked;
        
        const labelElement = document.createElement('label');
        labelElement.htmlFor = `${name}-${value}`;
        labelElement.innerHTML = `${icon} ${label}`;
        
        option.append(input, labelElement);
        return option;
    }

    addDeliveryTypeListeners(deliveryOptions, addressFields) {
        const radios = deliveryOptions.querySelectorAll('input[name="deliveryType"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const selectedType = e.target.value;
                const shouldShowAddress = selectedType === 'home' || selectedType === 'express';
                
                addressFields.style.display = shouldShowAddress ? 'block' : 'none';
                
                const addressInputs = addressFields.querySelectorAll('input[required], textarea[required]');
                addressInputs.forEach(input => {
                    input.required = shouldShowAddress;
                });
            });
        });
    }
    
    addPaymentTypeListeners(paymentOptions, cardFields, installmentsField) {
        const radios = paymentOptions.querySelectorAll('input[name="paymentType"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const selectedType = e.target.value;
                const showCardFields = selectedType === 'credit' || selectedType === 'debit';
                const showInstallments = selectedType === 'credit';
                
                cardFields.style.display = showCardFields ? 'block' : 'none';
                installmentsField.style.display = showInstallments ? 'block' : 'none';
                
                const cardInputs = cardFields.querySelectorAll('input[required]');
                cardInputs.forEach(input => {
                    input.required = showCardFields;
                });
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldGroup = field.closest('.field-group');
        let isValid = true;
        let errorMessage = '';
        
        this.clearFieldError(field);
        
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }
        
        if (value && isValid) {
            switch (field.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Ingresa un email válido';
                    }
                    break;
                    
                case 'tel':
                    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
                    if (!phoneRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Ingresa un teléfono válido';
                    }
                    break;
            }
            
            // Validaciones específicas por nombre
            switch (field.name) {
                case 'cardNumber':
                    const cardRegex = /^[\d\s]{13,19}$/;
                    if (!cardRegex.test(value.replace(/\s/g, ''))) {
                        isValid = false;
                        errorMessage = 'Número de tarjeta inválido';
                    }
                    break;
                    
                case 'cardExpiry':
                    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
                    if (!expiryRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Formato: MM/AA';
                    }
                    break;
                    
                case 'cardCvv':
                    const cvvRegex = /^\d{3,4}$/;
                    if (!cvvRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'CVV inválido (3-4 dígitos)';
                    }
                    break;
                    
                case 'postalCode':
                    const postalRegex = /^\d{4,8}$/;
                    if (!postalRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Código postal inválido';
                    }
                    break;
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        const fieldGroup = field.closest('.field-group');
        field.classList.add('error');
        
        let errorElement = fieldGroup.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            fieldGroup.append(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        const fieldGroup = field.closest('.field-group');
        field.classList.remove('error');
        
        const errorElement = fieldGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    validateCurrentStep() {
        let isValid = true;
        
        switch (this.currentStep) {
            case 1:
                isValid = this.validatePersonalData();
                break;
            case 2:
                isValid = this.validateDeliveryPayment();
                break;
            case 3:
                isValid = this.validateTermsAcceptance();
                break;
        }
        
        return isValid;
    }
    
    validatePersonalData() {
        const form = document.getElementById('personal-data-form');
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            const formData = new FormData(form);
            this.customerData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                document: formData.get('document')
            };
        }
        
        return isValid;
    }
    
    validateDeliveryPayment() {
        let isValid = true;
        
        const deliveryForm = document.getElementById('delivery-form');
        const deliveryType = deliveryForm.querySelector('input[name="deliveryType"]:checked')?.value;
        
        if (!deliveryType) {
            this.showStepError('Selecciona un tipo de entrega');
            isValid = false;
        }
        
        if (deliveryType === 'home' || deliveryType === 'express') {
            const addressInputs = deliveryForm.querySelectorAll('#address-fields input[required]');
            addressInputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
        }
        
        const deliveryDate = deliveryForm.querySelector('input[name="deliveryDate"]');
        if (!this.validateField(deliveryDate)) {
            isValid = false;
        }
        
        const paymentForm = document.getElementById('payment-form');
        const paymentType = paymentForm.querySelector('input[name="paymentType"]:checked')?.value;
        
        if (!paymentType) {
            this.showStepError('Selecciona un método de pago');
            isValid = false;
        }
        
        if (paymentType === 'credit' || paymentType === 'debit') {
            const cardInputs = paymentForm.querySelectorAll('#card-fields input[required]');
            cardInputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
        }
        
        if (isValid) {
            const deliveryFormData = new FormData(deliveryForm);
            this.deliveryData = {
                deliveryType,
                deliveryDate: deliveryFormData.get('deliveryDate'),
                address: deliveryFormData.get('address'),
                city: deliveryFormData.get('city'),
                postalCode: deliveryFormData.get('postalCode'),
                notes: deliveryFormData.get('notes')
            };
            
            const paymentFormData = new FormData(paymentForm);
            this.paymentData = {
                paymentType,
                installments: paymentFormData.get('installments') || 1,
                cardNumber: paymentFormData.get('cardNumber'),
                cardName: paymentFormData.get('cardName'),
                cardExpiry: paymentFormData.get('cardExpiry'),
                cardCvv: paymentFormData.get('cardCvv')
            };
        }
        
        return isValid;
    }
    
    validateTermsAcceptance() {
        const termsCheckbox = document.getElementById('terms-checkbox');
        
        if (!termsCheckbox.checked) {
            this.showStepError('Debes aceptar los términos y condiciones');
            return false;
        }
        
        return true;
    }
    
    showStepError(message) {
        const content = document.getElementById('checkout-step-content');
        
        let errorElement = content.querySelector('.step-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'step-error';
            content.prepend(errorElement);
        }
        
        errorElement.textContent = message;
        
        setTimeout(() => {
            if (errorElement && errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }
    
    calculateDeliveryCost() {
        switch (this.deliveryData.deliveryType) {
            case 'home':
                return 500;
            case 'express':
                return 1500;
            case 'pickup':
            default:
                return 0;
        }
    }
    
    // =============================================================================
    // NAVEGACIÓN Y FOOTER
    // =============================================================================
    
    createCheckoutFooter(dialog, modalContainer) {
        const footer = document.createElement('footer');
        footer.className = 'checkout-footer';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'checkout-buttons';
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn-secondary';
        cancelButton.textContent = 'Cancelar';
        cancelButton.addEventListener('click', () => {
            this.cancelCheckout(dialog, modalContainer);
        });
        
        let prevButton = null;
        if (this.currentStep > 1) {
            prevButton = document.createElement('button');
            prevButton.className = 'btn-secondary';
            prevButton.textContent = '← Anterior';
            prevButton.addEventListener('click', () => {
                this.goToPreviousStep();
            });
        }
        
        const nextButton = document.createElement('button');
        nextButton.className = 'btn-primary';
        
        if (this.currentStep < this.totalSteps) {
            nextButton.textContent = 'Siguiente →';
            nextButton.addEventListener('click', () => {
                this.goToNextStep();
            });
        } else {
            nextButton.textContent = '🎉 Finalizar Compra';
            nextButton.addEventListener('click', () => {
                this.completeOrder();
            });
        }
        
        buttonContainer.append(cancelButton);
        if (prevButton) {
            buttonContainer.append(prevButton);
        }
        buttonContainer.append(nextButton);
        
        footer.append(buttonContainer);
        return footer;
    }
    
    goToNextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.updateCheckoutModal();
        }
    }
    
    goToPreviousStep() {
        this.currentStep--;
        this.updateCheckoutModal();
    }
    
    updateCheckoutModal() {
        const progressContainer = this.activeModal.querySelector('.progress-container');
        const newProgressBar = this.createProgressBar();
        progressContainer.parentNode.replaceChild(newProgressBar, progressContainer);
        
        const content = this.activeModal.querySelector('.checkout-content');
        const newContent = this.createStepContent();
        content.parentNode.replaceChild(newContent, content);
        
        const footer = this.activeModal.querySelector('.checkout-footer');
        const dialog = this.activeModal;
        const modalContainer = document.getElementById('modal');
        const newFooter = this.createCheckoutFooter(dialog, modalContainer);
        footer.parentNode.replaceChild(newFooter, footer);
        
        if (this.currentStep === 3) {
            const customerSummaryContent = document.getElementById('customer-summary-content');
            if (customerSummaryContent) {
                this.updateCustomerSummary(customerSummaryContent);
            }
        }
    }
    
    completeOrder() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        this.showOrderProcessing();
        
        setTimeout(() => {
            this.showOrderSuccess();
        }, 2000);
    }
    
    showOrderProcessing() {
        const content = document.getElementById('checkout-step-content');
        content.innerHTML = '';
        
        const processingDiv = document.createElement('div');
        processingDiv.className = 'order-processing';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const message = document.createElement('h3');
        message.textContent = 'Procesando tu pedido...';
        
        const subMessage = document.createElement('p');
        subMessage.textContent = 'Por favor espera, estamos confirmando tu compra.';
        
        processingDiv.append(spinner, message, subMessage);
        content.append(processingDiv);
        
        const buttons = this.activeModal.querySelectorAll('.checkout-footer button');
        buttons.forEach(button => {
            button.disabled = true;
        });
    }
    
    showOrderSuccess() {
        const content = document.getElementById('checkout-step-content');
        content.innerHTML = '';
        
        const successDiv = document.createElement('div');
        successDiv.className = 'order-success';
        
        const icon = document.createElement('div');
        icon.className = 'success-icon';
        icon.textContent = '🎉';
        
        const title = document.createElement('h3');
        title.textContent = '¡Compra realizada con éxito!';
        
        const orderNumber = document.createElement('p');
        orderNumber.className = 'order-number';
        orderNumber.textContent = `Número de pedido: #${Date.now()}`;
        
        const message = document.createElement('p');
        message.textContent = `Gracias ${this.customerData.firstName}, recibirás un email con los detalles de tu compra.`;
        
        const total = document.createElement('p');
        total.className = 'order-total';
        total.textContent = `Total pagado: ${Utils.formatPrice(window.app.cart.calculateTotal() + this.calculateDeliveryCost())}`;
        
        successDiv.append(icon, title, orderNumber, message, total);
        content.append(successDiv);
        
        const footer = this.activeModal.querySelector('.checkout-footer');
        footer.innerHTML = '';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'btn-primary';
        closeButton.textContent = 'Cerrar';
        closeButton.addEventListener('click', () => {
            this.completeCheckoutProcess();
        });
        
        footer.append(closeButton);
    }
    
    completeCheckoutProcess() {
        window.app.cart.clearCart();
        
        this.activeModal.close();
        this.clearModalContainer(document.getElementById('modal'));
        this.activeModal = null;
        
        this.currentStep = 1;
        this.customerData = {};
        this.paymentData = {};
        this.deliveryData = {};
        
        setTimeout(() => {
            window.BannersModule?.showCustomBanner({
                title: '¡Gracias por tu compra!',
                message: 'Te enviaremos actualizaciones por email',
                action: 'Seguir comprando',
                category: 'success',
                duration: 8000
            });
        }, 500);
    }
    
    cancelCheckout(dialog, modalContainer) {
        if (confirm('¿Estás seguro de que quieres cancelar la compra?')) {
            dialog.close();
            this.clearModalContainer(modalContainer);
            this.activeModal = null;
            
            this.currentStep = 1;
            this.customerData = {};
            this.paymentData = {};
            this.deliveryData = {};
        }
    }
    
    addCheckoutKeyboardNavigation(dialog) {
        const handleKeyPress = (event) => {
            switch(event.key) {
                case 'Escape':
                    event.preventDefault();
                    this.cancelCheckout(dialog, document.getElementById('modal'));
                    break;
                case 'Enter':
                    if (event.target.type !== 'textarea') {
                        event.preventDefault();
                        const nextButton = dialog.querySelector('.btn-primary');
                        if (nextButton && !nextButton.disabled) {
                            nextButton.click();
                        }
                    }
                    break;
            }
        };
        
        dialog.addEventListener('keydown', handleKeyPress);
        
        setTimeout(() => {
            const firstInput = dialog.querySelector('input, textarea, select');
            if (firstInput) {
                firstInput.focus();
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
}

window.CheckoutModule = new CheckoutModule();