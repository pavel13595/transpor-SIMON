/**
 * Language switching functionality
 */

class LanguageSwitcher {
    constructor() {
        this.currentLanguage = 'fr';
        this.init();
    }

    init() {
        this.loadSavedLanguage();
        this.bindEvents();
        this.updateContent();
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && ['en', 'fr'].includes(savedLang)) {
            this.currentLanguage = savedLang;
        } else {
            this.currentLanguage = 'fr';
        }
    }

    bindEvents() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetLang = e.target.dataset.lang;
                this.switchLanguage(targetLang);
            });
        });
    }

    switchLanguage(targetLang) {
        if (targetLang === this.currentLanguage) return;
        
        this.currentLanguage = targetLang;
        localStorage.setItem('preferred-language', targetLang);
        
        this.updateButtons();
        this.updateContent();
        this.updatePageMeta();
    }

    updateButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLanguage) {
                btn.classList.add('active');
            }
        });
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-en][data-fr]');
        
        elements.forEach(element => {
            const text = element.dataset[this.currentLanguage];
            if (text) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update form labels specifically
        this.updateFormLabels();
    }

    updateFormLabels() {
        const labels = document.querySelectorAll('label[data-en][data-fr]');
        
        labels.forEach(label => {
            const text = label.dataset[this.currentLanguage];
            if (text) {
                label.textContent = text;
            }
        });
    }

    updatePageMeta() {
        const titles = {
            en: 'SIMON STOCKAGE GLOBAL - Global Transport & Storage Solutions',
            fr: 'SIMON STOCKAGE GLOBAL - Solutions de Transport et Stockage Mondiales'
        };

        const descriptions = {
            en: 'Reliable logistics across Europe and worldwide. International freight, domestic logistics, warehouse storage and customs clearance.',
            fr: 'Logistique fiable à travers l\'Europe et le monde entier. Fret international, logistique nationale, stockage en entrepôt et dédouanement.'
        };

        document.title = titles[this.currentLanguage];
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', descriptions[this.currentLanguage]);
        }

        document.documentElement.lang = this.currentLanguage;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.languageSwitcher = new LanguageSwitcher();
});

// Expose language data for easy maintenance
window.languageData = {
    en: {
        // Navigation
        'About': 'About',
        'Services': 'Services', 
        'Why Us': 'Why Us',
        'Contact': 'Contact',
        
        // Hero Section
        'Global Transport & Storage Solutions': 'Global Transport & Storage Solutions',
        'Reliable logistics across Europe and worldwide': 'Reliable logistics across Europe and worldwide',
        'Get a Quote': 'Get a Quote',
        
        // About Section
        'About SIMON STOCKAGE GLOBAL': 'About SIMON STOCKAGE GLOBAL',
        'Years Experience': 'Years Experience',
        'Countries Served': 'Countries Served',
        'Deliveries Monthly': 'Deliveries Monthly',
        'Customer Support': 'Customer Support',
        
        // Services Section
        'Our Services': 'Our Services',
        'International Freight': 'International Freight',
        'Domestic Logistics': 'Domestic Logistics',
        'Warehouse Storage': 'Warehouse Storage',
        'Customs Clearance': 'Customs Clearance',
        
        // Advantages Section
        'Why Choose Us': 'Why Choose Us',
        'On-Time Delivery': 'On-Time Delivery',
        'Real-Time Tracking': 'Real-Time Tracking',
        'Full Insurance': 'Full Insurance',
        '24/7 Support': '24/7 Support',
        
        // Contact Section
        'Contact Us': 'Contact Us',
        'Address': 'Address',
        'Phone': 'Phone',
        'Your Name': 'Your Name',
        'Email Address': 'Email Address',
        'Phone Number': 'Phone Number',
        'Your Message': 'Your Message',
        'Send Message': 'Send Message',
        
        // Footer
        'Your trusted logistics partner': 'Your trusted logistics partner',
        'Contact Information': 'Contact Information',
        'Follow Us': 'Follow Us',
        'All rights reserved': 'All rights reserved'
    },
    
    fr: {
        // Navigation
        'About': 'À propos',
        'Services': 'Services',
        'Why Us': 'Pourquoi nous',
        'Contact': 'Contact',
        
        // Hero Section
        'Global Transport & Storage Solutions': 'Solutions de Transport et Stockage Mondiales',
        'Reliable logistics across Europe and worldwide': 'Logistique fiable à travers l\'Europe et le monde entier',
        'Get a Quote': 'Demander un devis',
        
        // About Section
        'About SIMON STOCKAGE GLOBAL': 'À propos de SIMON STOCKAGE GLOBAL',
        'Years Experience': 'Années d\'expérience',
        'Countries Served': 'Pays desservis',
        'Deliveries Monthly': 'Livraisons mensuelles',
        'Customer Support': 'Support client',
        
        // Services Section
        'Our Services': 'Nos Services',
        'International Freight': 'Fret International',
        'Domestic Logistics': 'Logistique Nationale',
        'Warehouse Storage': 'Stockage en Entrepôt',
        'Customs Clearance': 'Dédouanement',
        
        // Advantages Section
        'Why Choose Us': 'Pourquoi Nous Choisir',
        'On-Time Delivery': 'Livraison à Temps',
        'Real-Time Tracking': 'Suivi en Temps Réel',
        'Full Insurance': 'Assurance Complète',
        '24/7 Support': 'Support 24/7',
        
        // Contact Section
        'Contact Us': 'Contactez-nous',
        'Address': 'Adresse',
        'Phone': 'Téléphone',
        'Your Name': 'Votre Nom',
        'Email Address': 'Adresse Email',
        'Phone Number': 'Numéro de Téléphone',
        'Your Message': 'Votre Message',
        'Send Message': 'Envoyer le Message',
        
        // Footer
        'Your trusted logistics partner': 'Votre partenaire logistique de confiance',
        'Contact Information': 'Informations de Contact',
        'Follow Us': 'Suivez-nous',
        'All rights reserved': 'Tous droits réservés'
    }
};
