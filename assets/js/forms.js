/**
 * Form handling functionality
 */

class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.bindContactForm();
        this.initializeFormValidation();
        this.setupFloatingLabels();
    }

    bindContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactFormSubmit(contactForm);
        });
    }

    async handleContactFormSubmit(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Show loading state
        this.setButtonLoading(submitButton, true);

        try {
            // Validate form
            if (!this.validateForm(form)) {
                throw new Error('Please fill in all required fields correctly.');
            }

            // Simulate form submission (replace with actual endpoint)
            await this.simulateFormSubmission(formData);

            // Show success message
            this.showMessage('success', this.getLocalizedMessage('form_success'));
            
            // Reset form
            form.reset();
            this.resetFloatingLabels(form);

        } catch (error) {
            // Show error message
            this.showMessage('error', error.message || this.getLocalizedMessage('form_error'));
        } finally {
            // Reset button state
            this.setButtonLoading(submitButton, false, originalText);
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // Remove previous error styling
        field.classList.remove('error');
        this.removeFieldError(field);

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = this.getLocalizedMessage('field_required');
        }
        // Validate email
        else if (fieldType === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = this.getLocalizedMessage('email_invalid');
        }
        // Validate phone (basic validation)
        else if (fieldType === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = this.getLocalizedMessage('phone_invalid');
        }

        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Basic phone validation - allows various formats
        const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    showFieldError(field, message) {
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        const formGroup = field.closest('.form__group');
        if (formGroup) {
            formGroup.appendChild(errorElement);
        }
    }

    removeFieldError(field) {
        const formGroup = field.closest('.form__group');
        if (formGroup) {
            const errorElement = formGroup.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    setupFloatingLabels() {
        const formInputs = document.querySelectorAll('.form__group input, .form__group textarea');
        
        formInputs.forEach(input => {
            // Set initial state
            this.updateLabelState(input);
            
            // Add event listeners
            input.addEventListener('focus', () => this.updateLabelState(input));
            input.addEventListener('blur', () => this.updateLabelState(input));
            input.addEventListener('input', () => this.updateLabelState(input));
        });
    }

    updateLabelState(input) {
        const formGroup = input.closest('.form__group');
        const label = formGroup.querySelector('label');
        
        if (!label) return;

        if (input.value.trim() || input === document.activeElement) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    }

    resetFloatingLabels(form) {
        const labels = form.querySelectorAll('.form__group label');
        labels.forEach(label => label.classList.remove('active'));
    }

    setButtonLoading(button, isLoading, originalText = '') {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = `
                <svg class="loading-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="32" stroke-dashoffset="32">
                        <animate attributeName="stroke-dashoffset" dur="1s" values="32;0;32" repeatCount="indefinite"/>
                    </circle>
                </svg>
                ${this.getLocalizedMessage('sending')}
            `;
        } else {
            button.disabled = false;
            button.textContent = originalText || this.getLocalizedMessage('send_message');
        }
    }

    showMessage(type, message) {
        // Remove any existing messages
        this.removeMessages();

        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.innerHTML = `
            <div class="form-message__content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.insertBefore(messageElement, contactForm.firstChild);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeMessages();
        }, 5000);
    }

    removeMessages() {
        const messages = document.querySelectorAll('.form-message');
        messages.forEach(message => message.remove());
    }

    async simulateFormSubmission(formData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log form data (for development)
        console.log('Form submission data:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        // In a real application, you would send this data to your server
        // Example:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     body: formData
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Failed to send message');
        // }
    }

    getLocalizedMessage(key) {
        const currentLang = window.languageSwitcher ? window.languageSwitcher.getCurrentLanguage() : 'en';
        
        const messages = {
            en: {
                field_required: 'This field is required',
                email_invalid: 'Please enter a valid email address',
                phone_invalid: 'Please enter a valid phone number',
                form_success: 'Thank you! Your message has been sent successfully.',
                form_error: 'Sorry, there was an error sending your message. Please try again.',
                sending: 'Sending...',
                send_message: 'Send Message'
            },
            fr: {
                field_required: 'Ce champ est obligatoire',
                email_invalid: 'Veuillez entrer une adresse email valide',
                phone_invalid: 'Veuillez entrer un numéro de téléphone valide',
                form_success: 'Merci ! Votre message a été envoyé avec succès.',
                form_error: 'Désolé, une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.',
                sending: 'Envoi en cours...',
                send_message: 'Envoyer le Message'
            }
        };

        return messages[currentLang]?.[key] || messages.en[key] || key;
    }

    initializeFormValidation() {
        // Real-time validation
        const formInputs = document.querySelectorAll('.form__group input, .form__group textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim()) {
                    this.validateField(input);
                }
            });

            input.addEventListener('input', () => {
                // Remove error styling while typing
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    this.removeFieldError(input);
                }
            });
        });
    }
}

// Add form-specific styles
const formStyles = document.createElement('style');
formStyles.textContent = `
    .form__group {
        position: relative;
    }
    
    .form__group input.error,
    .form__group textarea.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .field-error {
        display: block;
        color: var(--error-color);
        font-size: var(--font-size-small);
        margin-top: 0.25rem;
        margin-left: 1rem;
    }
    
    .form-message {
        padding: 1rem;
        border-radius: var(--radius-md);
        margin-bottom: 1.5rem;
        animation: slideInDown 0.3s ease-out;
    }
    
    .form-message--success {
        background-color: rgba(16, 185, 129, 0.1);
        border: 1px solid var(--success-color);
        color: var(--success-color);
    }
    
    .form-message--error {
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid var(--error-color);
        color: var(--error-color);
    }
    
    .form-message__content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .loading-spinner {
        animation: spin 1s linear infinite;
        margin-right: 0.5rem;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form__group label.active {
        top: -0.5rem;
        left: 0.75rem;
        font-size: var(--font-size-small);
        color: var(--primary-color);
    }
`;

document.head.appendChild(formStyles);

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.formHandler = new FormHandler();
});
