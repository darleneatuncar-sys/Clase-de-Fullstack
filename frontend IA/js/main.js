document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Particles canvas
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.color = Math.random() > 0.5 ? '168, 85, 247' : '6, 182, 212';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                }
            }
        }
        draw() {
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Typing effect
    const typingEl = document.getElementById('typing');
    const words = ['Full Stack Developer', 'UI/UX Designer', 'Creative Coder', 'Problem Solver'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typingEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 500;
        }

        setTimeout(typeEffect, delay);
    }
    typeEffect();

    // Navbar scroll
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));

    // GSAP Hero animation
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
        .from('.hero-title', { opacity: 0, y: 40, duration: 0.7 })
        .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.6 }, '-=0.3')
        .from('.hero-description', { opacity: 0, y: 30, duration: 0.6 }, '-=0.3')
        .from('.hero-buttons', { opacity: 0, y: 30, duration: 0.6 }, '-=0.3')
        .from('.hero-socials', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
        .from('.scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.3');

    // GSAP Scroll animations
    gsap.from('.section-tag', {
        scrollTrigger: { trigger: '.section-tag', start: 'top 85%' },
        opacity: 0, y: 20, duration: 0.5
    });

    gsap.from('.section-title', {
        scrollTrigger: { trigger: '.section-title', start: 'top 85%' },
        opacity: 0, y: 30, duration: 0.6
    });

    gsap.from('.about-avatar', {
        scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
        opacity: 0, x: -50, rotation: -10, duration: 1, ease: 'back.out(1.7)'
    });

    gsap.from('.about-content', {
        scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
        opacity: 0, x: 50, duration: 1
    });

    gsap.from('.stat-card', {
        scrollTrigger: { trigger: '.about-stats', start: 'top 85%' },
        opacity: 0, y: 40, duration: 0.6, stagger: 0.15
    });

    gsap.from('.carousel-wrapper', {
        scrollTrigger: { trigger: '.carousel-wrapper', start: 'top 85%' },
        opacity: 0, y: 40, duration: 0.8
    });

    gsap.from('.skills-categories', {
        scrollTrigger: { trigger: '.skills-categories', start: 'top 85%' },
        opacity: 0, y: 40, duration: 0.8
    });

    gsap.from('.contact-info', {
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
        opacity: 0, x: -50, duration: 1
    });

    gsap.from('.contact-form', {
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
        opacity: 0, x: 50, duration: 1
    });

    // Skill bars animation
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.getPropertyValue('--fill');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(fill => {
        fill.style.width = '0%';
        skillObserver.observe(fill);
    });

    // Counter animation
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                let count = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        entry.target.textContent = target;
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(count);
                    }
                }, 30);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    // Carousel class
    class Carousel {
        constructor(element, options = {}) {
            this.carousel = element;
            this.track = element.querySelector('.carousel-track');
            this.cards = [...this.track.children];
            this.prevBtn = element.querySelector('.carousel-btn-prev');
            this.nextBtn = element.querySelector('.carousel-btn-next');
            this.dotsContainer = element.parentElement.querySelector('.carousel-dots');
            this.currentIndex = 0;
            this.autoPlay = options.autoPlay !== false;
            this.autoPlayInterval = options.autoPlayInterval || 5000;
            this.autoplayTimer = null;
            this.isDragging = false;
            this.startX = 0;
            this.currentTranslate = 0;
            this.prevTranslate = 0;

            this.init();
        }

        getCardsPerView() {
            const w = window.innerWidth;
            if (w <= 768) return 1;
            if (w <= 1024) return 2;
            return this.carousel.classList.contains('carousel-projects') ? 2 : 3;
        }

        getMaxIndex() {
            const perView = this.getCardsPerView();
            return Math.max(0, this.cards.length - perView);
        }

        init() {
            this.createDots();
            this.updatePosition();
            this.bindEvents();

            if (this.autoPlay) {
                this.startAutoplay();
                this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
                this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
            }
        }

        createDots() {
            if (!this.dotsContainer) return;
            this.dotsContainer.innerHTML = '';
            const maxIdx = this.getMaxIndex();
            for (let i = 0; i <= maxIdx; i++) {
                const dot = document.createElement('button');
                dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', () => this.goTo(i));
                this.dotsContainer.appendChild(dot);
            }
        }

        updateDots() {
            if (!this.dotsContainer) return;
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }

        updatePosition() {
            const card = this.cards[0];
            if (!card) return;
            const style = window.getComputedStyle(this.track);
            const gap = parseInt(style.gap) || 24;
            const cardWidth = card.offsetWidth + gap;
            this.currentTranslate = -(this.currentIndex * cardWidth);
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
            this.updateDots();
        }

        goTo(index) {
            const maxIdx = this.getMaxIndex();
            this.currentIndex = Math.max(0, Math.min(index, maxIdx));
            this.updatePosition();
        }

        next() {
            if (this.currentIndex >= this.getMaxIndex()) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updatePosition();
        }

        prev() {
            if (this.currentIndex <= 0) {
                this.currentIndex = this.getMaxIndex();
            } else {
                this.currentIndex--;
            }
            this.updatePosition();
        }

        startAutoplay() {
            this.stopAutoplay();
            this.autoplayTimer = setInterval(() => this.next(), this.autoPlayInterval);
        }

        stopAutoplay() {
            if (this.autoplayTimer) {
                clearInterval(this.autoplayTimer);
                this.autoplayTimer = null;
            }
        }

        bindEvents() {
            this.prevBtn.addEventListener('click', () => { this.prev(); this.resetAutoplay(); });
            this.nextBtn.addEventListener('click', () => { this.next(); this.resetAutoplay(); });

            // Touch / drag
            this.track.addEventListener('mousedown', this.dragStart.bind(this));
            this.track.addEventListener('mousemove', this.dragMove.bind(this));
            this.track.addEventListener('mouseup', this.dragEnd.bind(this));
            this.track.addEventListener('mouseleave', this.dragEnd.bind(this));

            this.track.addEventListener('touchstart', this.dragStart.bind(this), { passive: true });
            this.track.addEventListener('touchmove', this.dragMove.bind(this), { passive: true });
            this.track.addEventListener('touchend', this.dragEnd.bind(this));

            // Keyboard
            this.carousel.setAttribute('tabindex', '0');
            this.carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') { this.prev(); this.resetAutoplay(); }
                if (e.key === 'ArrowRight') { this.next(); this.resetAutoplay(); }
            });

            // Resize
            window.addEventListener('resize', () => {
                this.createDots();
                this.currentIndex = Math.min(this.currentIndex, this.getMaxIndex());
                this.updatePosition();
            });
        }

        dragStart(e) {
            this.isDragging = true;
            this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            this.track.style.transition = 'none';
        }

        dragMove(e) {
            if (!this.isDragging) return;
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const diff = currentX - this.startX;
            this.track.style.transform = `translateX(${this.currentTranslate + diff}px)`;
        }

        dragEnd(e) {
            if (!this.isDragging) return;
            this.isDragging = false;
            const endX = e.type.includes('mouse') ? e.pageX : (e.changedTouches && e.changedTouches[0].clientX) || this.startX;
            const diff = endX - this.startX;

            this.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

            if (Math.abs(diff) > 50) {
                if (diff < 0) this.next();
                else this.prev();
            } else {
                this.updatePosition();
            }
            this.resetAutoplay();
        }

        resetAutoplay() {
            if (this.autoPlay) {
                this.stopAutoplay();
                this.startAutoplay();
            }
        }
    }

    // Init carousels
    new Carousel(document.getElementById('servicesCarousel'), { autoPlay: true, autoPlayInterval: 4000 });
    new Carousel(document.getElementById('projectsCarousel'), { autoPlay: true, autoPlayInterval: 5000 });

    // Card tilt effect
    document.querySelectorAll('.service-card, .project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<span>Enviando...</span>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span>Mensaje Enviado!</span>';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                contactForm.reset();
            }, 2500);
        }, 1500);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});