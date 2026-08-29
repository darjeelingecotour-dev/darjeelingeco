document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') mobileMenu.classList.add('hidden');
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled', 'shadow-md');
                navbar.classList.replace('bg-white/80', 'bg-white/95');
            } else {
                navbar.classList.remove('scrolled', 'shadow-md');
                navbar.classList.replace('bg-white/95', 'bg-white/80');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // 3. Animated Counters (Intersection Observer)
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-target') || '0', 10);
            const duration = 2000;
            const start = performance.now();
            
            const update = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // easeOutQuad
                const easeProgress = progress * (2 - progress);
                const current = Math.floor(easeProgress * target);
                
                el.textContent = new Intl.NumberFormat().format(current);
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = new Intl.NumberFormat().format(target);
                }
            };
            requestAnimationFrame(update);
        };

        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => counterObserver.observe(c));
    }

    // 4. Testimonial Carousel
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('carousel-next');
        const prevBtn = document.getElementById('carousel-prev');
        const dots = Array.from(document.querySelectorAll('.carousel-dot'));
        
        let currentIndex = 0;
        let autoPlayInterval;

        const updateCarousel = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('bg-primary', i === index);
                dot.classList.toggle('bg-gray-300', i !== index);
            });
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel(currentIndex);
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel(currentIndex);
        };

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
        
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel(currentIndex);
                resetAutoplay();
            });
        });

        const startAutoplay = () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        };
        
        const resetAutoplay = () => {
            clearInterval(autoPlayInterval);
            startAutoplay();
        };

        carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.addEventListener('mouseleave', startAutoplay);
        
        updateCarousel(0);
        startAutoplay();
    }

    // 5. Carbon Calculator
    const calcForm = document.getElementById('carbon-calc');
    if (calcForm) {
        calcForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const regionRate = parseInt(document.getElementById('calc-region').value, 10);
            const duration = parseInt(document.getElementById('calc-duration').value, 10);
            const groupSize = parseInt(document.getElementById('calc-group').value, 10);
            
            const co2 = regionRate * duration * groupSize;
            const trees = Math.ceil(co2 / 22);
            
            document.getElementById('calc-results').classList.remove('hidden');
            
            // Animate numbers
            const co2El = document.getElementById('result-co2');
            co2El.textContent = '0';
            setTimeout(() => co2El.textContent = co2, 50);
            
            document.getElementById('result-trees').textContent = `${trees} tree${trees !== 1 ? 's' : ''}`;
            
            // Animate gauge
            const gaugePercent = Math.min((co2 / 1000) * 100, 100);
            const ring = document.querySelector('.calc-gauge-ring');
            if (ring) {
                const offset = 251.2 - (251.2 * gaugePercent) / 100;
                setTimeout(() => {
                    ring.style.strokeDashoffset = offset;
                }, 100);
            }
        });
    }

    // 6. Tour Search & Filter (Fuse.js)
    const initSearch = () => {
        const searchInput = document.getElementById('tour-search');
        const toursGrid = document.getElementById('tours-grid');
        
        if (searchInput && toursGrid && window.Fuse) {
            const tourCards = Array.from(toursGrid.querySelectorAll('.tour-card'));
            const noResults = document.getElementById('no-results');
            const clearFilters = document.getElementById('clear-filters');
            const filterBtns = document.querySelectorAll('.filter-btn');
            
            // Extract data for fuse
            const toursData = tourCards.map(card => ({
                element: card,
                title: card.getAttribute('data-title') || '',
                region: card.getAttribute('data-region') || '',
                tags: card.getAttribute('data-tags') || ''
            }));
            
            const fuse = new Fuse(toursData, {
                keys: ['title', 'region', 'tags'],
                threshold: 0.3
            });
            
            let currentSearch = '';
            let currentRegion = 'all';
            
            const applyFilters = () => {
                let results = toursData;
                
                if (currentSearch) {
                    const searchResults = fuse.search(currentSearch);
                    results = searchResults.map(r => r.item);
                }
                
                if (currentRegion !== 'all') {
                    results = results.filter(item => item.region === currentRegion);
                }
                
                tourCards.forEach(card => card.style.display = 'none');
                
                if (results.length > 0) {
                    results.forEach(item => {
                        item.element.style.display = 'flex'; // maintain flex layout for cards
                    });
                    noResults.classList.add('hidden');
                } else {
                    noResults.classList.remove('hidden');
                }
            };
            
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value.trim();
                applyFilters();
            });
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => {
                        b.classList.remove('bg-primary', 'text-white');
                        b.classList.add('bg-gray-100', 'text-gray-600');
                    });
                    btn.classList.remove('bg-gray-100', 'text-gray-600');
                    btn.classList.add('bg-primary', 'text-white');
                    
                    currentRegion = btn.getAttribute('data-region');
                    applyFilters();
                });
            });
            
            if (clearFilters) {
                clearFilters.addEventListener('click', () => {
                    searchInput.value = '';
                    currentSearch = '';
                    filterBtns[0].click(); // Click 'all'
                });
            }
        }
    };
    
    // Make sure Fuse is loaded before initializing search
    if (document.getElementById('tour-search')) {
        if (window.Fuse) {
            initSearch();
        } else {
            // Wait for Fuse to load if deferred
            window.addEventListener('load', initSearch);
        }
    }

    // 7. Scroll Animations
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    if (scrollElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        scrollElements.forEach(el => scrollObserver.observe(el));
    }

    // 8. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 9. Eco-Lodge Drag Scroll
    const sliders = document.querySelectorAll('.eco-scroll');
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast
            slider.scrollLeft = scrollLeft - walk;
        });
    });

    // 10. Leaflet Map (Contact Page)
    const initMap = () => {
        const mapContainer = document.getElementById('contact-map');
        if (mapContainer && window.L) {
            // Kolkata coordinates
            const lat = 22.5726;
            const lng = 88.3639;
            
            const map = L.map('contact-map').setView([lat, lng], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            L.marker([lat, lng]).addTo(map)
                .bindPopup('<b>SarkarTravels</b><br>Kolkata Office.')
                .openPopup();
                
            // Fix map rendering issues when unhidden/resized
            setTimeout(() => map.invalidateSize(), 100);
        }
    };
    
    if (document.getElementById('contact-map')) {
        if (window.L) {
            initMap();
        } else {
            window.addEventListener('load', initMap);
        }
    }
});
