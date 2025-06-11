class PresentationManager {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 16;
        this.slides = document.querySelectorAll('.slide');
        this.progressFill = document.getElementById('progressFill');
        this.progressDots = document.querySelectorAll('.progress-dot');
        this.currentSlideElement = document.getElementById('currentSlide');
        this.totalSlidesElement = document.getElementById('totalSlides');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.init();
    }
    
    init() {
        console.log('Initializing presentation with', this.slides.length, 'slides');
        
        // Ensure all slides are properly set up
        this.slides.forEach((slide, index) => {
            slide.style.display = 'flex'; // Ensure slides are visible
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Set initial state
        this.updateSlideDisplay();
        this.updateProgressBar();
        this.updateNavigationButtons();
        this.updateProgressDots();
        
        // Add event listeners with proper error handling
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextSlide();
            });
        }
        
        // Add progress dot click handlers with proper delegation
        this.progressDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Progress dot clicked:', index);
                this.goToSlide(index);
            });
            
            // Add keyboard support for dots
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.goToSlide(index);
                }
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Add touch/swipe support for mobile
        this.addTouchSupport();
        
        // Set total slides in counter
        if (this.totalSlidesElement) {
            this.totalSlidesElement.textContent = this.totalSlides;
        }
        
        console.log('Presentation initialized successfully');
    }
    
    goToSlide(slideIndex) {
        console.log('Going to slide:', slideIndex + 1, 'of', this.totalSlides);
        
        // Validate slide index
        if (slideIndex < 0 || slideIndex >= this.totalSlides) {
            console.warn('Invalid slide index:', slideIndex);
            return;
        }
        
        if (slideIndex === this.currentSlide) {
            console.log('Already on slide', slideIndex + 1);
            return;
        }
        
        // Remove active class from current slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
        }
        
        // Update current slide index
        this.currentSlide = slideIndex;
        
        // Add active class to new slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
        
        // Update UI elements
        this.updateSlideDisplay();
        this.updateProgressBar();
        this.updateNavigationButtons();
        this.updateProgressDots();
        
        // Trigger animations
        this.triggerSlideAnimations();
        
        console.log('Successfully moved to slide:', this.currentSlide + 1);
    }
    
    nextSlide() {
        console.log('Next slide requested, current:', this.currentSlide + 1);
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            console.log('Already on last slide');
        }
    }
    
    previousSlide() {
        console.log('Previous slide requested, current:', this.currentSlide + 1);
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        } else {
            console.log('Already on first slide');
        }
    }
    
    updateSlideDisplay() {
        if (this.currentSlideElement) {
            this.currentSlideElement.textContent = this.currentSlide + 1;
        }
    }
    
    updateProgressBar() {
        if (this.progressFill) {
            const progressPercentage = ((this.currentSlide + 1) / this.totalSlides) * 100;
            this.progressFill.style.width = `${progressPercentage}%`;
        }
    }
    
    updateProgressDots() {
        this.progressDots.forEach((dot, index) => {
            if (index === this.currentSlide) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('active');
                dot.removeAttribute('aria-current');
            }
        });
    }
    
    updateNavigationButtons() {
        // Update previous button
        if (this.prevBtn) {
            if (this.currentSlide === 0) {
                this.prevBtn.disabled = true;
                this.prevBtn.setAttribute('aria-disabled', 'true');
            } else {
                this.prevBtn.disabled = false;
                this.prevBtn.removeAttribute('aria-disabled');
            }
        }
        
        // Update next button
        if (this.nextBtn) {
            if (this.currentSlide === this.totalSlides - 1) {
                this.nextBtn.disabled = true;
                this.nextBtn.setAttribute('aria-disabled', 'true');
            } else {
                this.nextBtn.disabled = false;
                this.nextBtn.removeAttribute('aria-disabled');
            }
        }
    }
    
    handleKeyboard(e) {
        // Only handle keyboard if not in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Prevent default behavior for navigation keys
        const navigationKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Home', 'End'];
        if (navigationKeys.includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                this.previousSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // Spacebar
                this.nextSlide();
                break;
            case 'Home':
                this.goToSlide(0);
                break;
            case 'End':
                this.goToSlide(this.totalSlides - 1);
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const slidesContainer = document.getElementById('slidesContainer');
        if (!slidesContainer) return;
        
        slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        slidesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
            
            // Only process horizontal swipes that are longer than vertical ones
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - go to previous slide
                    this.previousSlide();
                } else {
                    // Swipe left - go to next slide
                    this.nextSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    triggerSlideAnimations() {
        // Trigger animations for the current slide
        setTimeout(() => {
            const currentSlide = this.slides[this.currentSlide];
            if (!currentSlide) return;
            
            // Animate stat cards and numbers
            const animatedElements = currentSlide.querySelectorAll('.stat-card, .gas-impact-card, .spec-card, .benefit-card, .opportunity-card, .step-card');
            animatedElements.forEach((el, index) => {
                el.style.animation = 'none';
                el.offsetHeight; // Trigger reflow
                el.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
            });
            
            // Animate numbers
            const numbers = currentSlide.querySelectorAll('.big-number, .impact-number, .spec-number, .stat-number, .growth-number, .market-value');
            numbers.forEach((number, index) => {
                setTimeout(() => {
                    this.animateNumber(number);
                }, index * 100);
            });
        }, 100);
    }
    
    animateNumber(element) {
        const originalText = element.textContent;
        const hasPercent = originalText.includes('%');
        const hasX = originalText.includes('x');
        const hasEuro = originalText.includes('€');
        const hasM = originalText.includes('M');
        const hasComma = originalText.includes(',');
        
        // Extract numeric value
        let numericValue = parseFloat(originalText.replace(/[^\d.]/g, ''));
        
        if (isNaN(numericValue) || numericValue === 0) return;
        
        let current = 0;
        const increment = numericValue / 20;
        const duration = 800;
        const stepTime = duration / 20;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            
            // Add back formatting
            if (hasPercent) {
                element.textContent = displayValue + '%';
            } else if (hasX) {
                if (hasComma && displayValue >= 1000) {
                    element.textContent = displayValue.toLocaleString() + 'x';
                } else {
                    element.textContent = displayValue + 'x';
                }
            } else if (hasEuro && hasM) {
                element.textContent = '€' + displayValue + 'M';
            } else if (hasM) {
                element.textContent = displayValue + 'M';
            } else if (hasComma && displayValue >= 1000) {
                element.textContent = displayValue.toLocaleString();
            } else {
                element.textContent = displayValue;
            }
        }, stepTime);
    }
    
    // Method to get current slide info for debugging
    getCurrentSlideInfo() {
        return {
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            currentSlideElement: this.slides[this.currentSlide],
            progress: ((this.currentSlide + 1) / this.totalSlides) * 100
        };
    }
}

// Utility functions
class PresentationUtils {
    static addAccessibilityFeatures() {
        // Add ARIA labels to navigation elements
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.setAttribute('aria-label', 'Diapositiva anterior');
            prevBtn.setAttribute('role', 'button');
        }
        
        if (nextBtn) {
            nextBtn.setAttribute('aria-label', 'Diapositiva siguiente');
            nextBtn.setAttribute('role', 'button');
        }
        
        // Add progress dots ARIA labels
        const progressDots = document.querySelectorAll('.progress-dot');
        progressDots.forEach((dot, index) => {
            dot.setAttribute('aria-label', `Ir a diapositiva ${index + 1}`);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
        });
        
        // Add live region for slide changes
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'slide-announcer';
        document.body.appendChild(liveRegion);
    }
    
    static announceSlideChange(slideNumber, totalSlides) {
        const announcer = document.getElementById('slide-announcer');
        if (announcer) {
            announcer.textContent = `Diapositiva ${slideNumber} de ${totalSlides}`;
        }
    }
    
    static addPresentationMode() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                const presentation = document.querySelector('.presentation-container');
                if (!document.fullscreenElement) {
                    presentation.requestFullscreen().catch(err => {
                        console.log('Fullscreen not supported:', err);
                    });
                } else {
                    document.exitFullscreen();
                }
            }
        });
        
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                document.body.classList.add('fullscreen-mode');
            } else {
                document.body.classList.remove('fullscreen-mode');
            }
        });
    }
    
    static enhanceVisuals() {
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('.stat-card, .tech-feature, .spec-card, .benefit-card, .opportunity-card, .partner-feature, .step-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            el.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Add loading effects for images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0.3';
                img.style.filter = 'blur(2px)';
                img.style.transition = 'opacity 0.3s ease, filter 0.3s ease';
                
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                    img.style.filter = 'none';
                });
            }
            
            img.addEventListener('error', (e) => {
                console.warn('Image failed to load:', e.target.src);
                e.target.style.display = 'none';
            });
        });
    }
}

// Add CSS animations
function addAnimationStyles() {
    if (document.getElementById('presentation-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'presentation-animations';
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
        
        .fullscreen-mode .navigation-controls {
            bottom: 40px;
        }
        
        .fullscreen-mode .progress-bar {
            height: 8px;
        }
        
        /* Ensure consistent slide heights */
        .slide-content {
            min-height: calc(100vh - 200px);
        }
        
        /* Improve button states */
        .nav-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
        
        .nav-btn:hover:not(:disabled) {
            transform: translateY(-1px);
        }
        
        /* Progress dot improvements */
        .progress-dot {
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .progress-dot:hover {
            transform: scale(1.2);
        }
        
        .progress-dot:focus {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing HDR Presentation System...');
    
    try {
        // Add animation styles
        addAnimationStyles();
        
        // Initialize the main presentation manager
        const presentationManager = new PresentationManager();
        
        // Add utilities
        PresentationUtils.addAccessibilityFeatures();
        PresentationUtils.addPresentationMode();
        PresentationUtils.enhanceVisuals();
        
        // Override slide changes to include announcements and animations
        const originalGoToSlide = presentationManager.goToSlide.bind(presentationManager);
        presentationManager.goToSlide = function(slideIndex) {
            originalGoToSlide(slideIndex);
            PresentationUtils.announceSlideChange(slideIndex + 1, this.totalSlides);
        };
        
        // Add to global scope for debugging
        window.presentationManager = presentationManager;
        window.PresentationUtils = PresentationUtils;
        
        // Prevent context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (presentationManager) {
                presentationManager.updateProgressBar();
            }
        });
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && presentationManager) {
                setTimeout(() => {
                    presentationManager.triggerSlideAnimations();
                }, 100);
            }
        });
        
        console.log('HDR Presentation System initialized successfully');
        console.log(`Total slides: ${presentationManager.totalSlides}`);
        console.log('Navigation: Arrow keys, Space, or use navigation buttons');
        console.log('Fullscreen: Press F11');
        
    } catch (error) {
        console.error('Error initializing presentation:', error);
    }
});