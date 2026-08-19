// ==================== INITIALIZATION ==================== 

document.addEventListener('DOMContentLoaded', () => {
    initAnimatedParticles();
    initSmoothScroll();
    initHeaderScroll();
    initCustomCursor();
    initModalKeyboard();
    initWindowsTerminal();
    initWidgets();
});

// ==================== CUSTOM CURSOR ==================== 

function initCustomCursor() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const pointer = document.querySelector(".pointer");
    if (!pointer) return;

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        pointer.style.left = (mouseX - 10) + 'px';
        pointer.style.top = (mouseY - 10) + 'px';
        pointer.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        pointer.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        pointer.style.opacity = '1';
    });
}

// ==================== ANIMATED PARTICLES ==================== 

function initAnimatedParticles() {
    const container = document.querySelector('.animated-particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, #00d4ff, transparent);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            pointer-events: none;
            animation: particle-float ${Math.random() * 20 + 20}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes particle-float {
            0%, 100% {
                transform: translateY(0) translateX(0);
                opacity: 0.2;
            }
            25% {
                opacity: 0.5;
            }
            50% {
                transform: translateY(-100px) translateX(50px);
                opacity: 0.3;
            }
            75% {
                opacity: 0.4;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== SMOOTH SCROLL ==================== 

function initSmoothScroll() {
    // Function to handle anchor click
    function handleAnchorClick(e) {
        const href = this.getAttribute('href');
        
        if (!href || href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        if (!target) {
            return;
        }
        
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Attach to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', handleAnchorClick);
    });
}

// ==================== HEADER SCROLL EFFECT ==================== 

function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 18, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'linear-gradient(180deg, rgba(10, 10, 18, 0.8), rgba(10, 10, 18, 0.6))';
            header.style.backdropFilter = 'blur(16px)';
        }
    });
}

// ==================== MODAL KEYBOARD HANDLER ==================== 

function initModalKeyboard() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSupportModal();
        }
    });
}

// ==================== SUPPORT MODAL ==================== 

function openSupportModal() {
    const modal = document.getElementById('supportModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeSupportModal(event) {
    const modal = document.getElementById('supportModal');
    if (modal && (!event || event.target === modal)) {
        modal.classList.remove('active');
    }
}

// ==================== WINDOWS TERMINAL TYPEWRITER ==================== 

function initWindowsTerminal() {
    const commands = [
        "Connect-Telegram -Proxy 'Global'",
        "Test-Connection -Speed 'Ultra-Fast'",
        "Status: ✓ All Systems Online"
    ];

    let cmdIndex = 0;
    let charIndex = 0;
    let currentCmd = "";
    let isDeleting = false;

    function typeTerminal() {
        currentCmd = commands[cmdIndex];
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        const target = document.getElementById("win-typewriter");
        if (target) {
            target.textContent = currentCmd.substring(0, charIndex);
        }

        let speed = isDeleting ? 30 : 60;
        if (!isDeleting && charIndex === currentCmd.length) {
            speed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            cmdIndex = (cmdIndex + 1) % commands.length;
            speed = 500;
        }

        setTimeout(typeTerminal, speed);
    }

    setTimeout(typeTerminal, 1000);
}

// ==================== WIDGETS MODULE ==================== 

function initWidgets() {
    // Config
    const CONFIG = {
        ping: { key: 'tw_ping', min: 10, max: 80 }
    };

    // Get or create initial ping value
    function getPingValue() {
        let saved = localStorage.getItem(CONFIG.ping.key);
        if (saved) {
            return parseInt(saved);
        }
        const initial = Math.floor(Math.random() * (CONFIG.ping.max - CONFIG.ping.min + 1)) + CONFIG.ping.min;
        localStorage.setItem(CONFIG.ping.key, initial);
        return initial;
    }

    let currentPing = getPingValue();

    // Display ping value in both sections
    function displayPing(value) {
        const pingEl = document.getElementById('w-ping');
        if (pingEl) {
            pingEl.textContent = value;
        }
    }

    // Initialize display
    displayPing(currentPing);

    // Button handler
    const btnEl = document.getElementById('btn-ping-intro');
    if (btnEl) {
        btnEl.addEventListener('click', function() {
            btnEl.disabled = true;
            btnEl.textContent = 'MEASURING...';

            setTimeout(() => {
                // Generate new ping with ±8 variance
                const variance = Math.floor(Math.random() * 17) - 8; // -8 to +8
                let newPing = currentPing + variance;

                // Clamp to 10-80
                if (newPing < CONFIG.ping.min) newPing = CONFIG.ping.min;
                if (newPing > CONFIG.ping.max) newPing = CONFIG.ping.max;

                currentPing = newPing;
                localStorage.setItem(CONFIG.ping.key, newPing);

                // Animate to new value
                const pingEl = document.getElementById('w-ping');
                if (pingEl) {
                    animateNumber(pingEl, parseInt(pingEl.textContent) || currentPing, newPing, 400);
                }

                // Re-enable button
                btnEl.disabled = false;
                btnEl.textContent = 'CHECK AGAIN';
            }, 600);
        });
    }

    // Simple animation
    function animateNumber(el, from, to, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // EaseOutCubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(from + (to - from) * easeProgress);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }
}

// ==================== LEGACY WIDGETS NAMESPACE (for compatibility) ==================== 

const WIDGETS = {
    triggerSync: function() {
        const btn = document.getElementById('btn-ping-intro');
        if (btn) {
            btn.click();
        }
    }
};


// ==================== STARFIELD ANIMATION ==================== 

(function() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) {
        console.error('Starfield: Canvas element not found!');
        return;
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const STAR_COUNT = 200; // Чуть больше для заметности

    const CONFIG = {
        color: '234, 234, 234', // #EAEAEA
        baseSpeed: 0.1,
        twinkleSpeed: 0.008,
        parallaxFactor: 0.03
    };

    let mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX - width / 2) * CONFIG.parallaxFactor;
        mouse.y = (e.clientY - height / 2) * CONFIG.parallaxFactor;
    });

    function resize() {
        // Принудительно задаем размеры в пикселях
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Пересоздаем звезды при ресайзе
        stars = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.8 + 0.3,
            alpha: Math.random(),
            speedX: (Math.random() - 0.5) * CONFIG.baseSpeed,
            speedY: (Math.random() - 0.5) * CONFIG.baseSpeed,
            twinkleDir: Math.random() > 0.5 ? 1 : -1
        }));
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            // Движение + параллакс
            star.x += star.speedX + mouse.x * star.size * 0.05;
            star.y += star.speedY + mouse.y * star.size * 0.05;

            // Мерцание
            star.alpha += CONFIG.twinkleSpeed * star.twinkleDir;
            if (star.alpha > 1 || star.alpha < 0.1) star.twinkleDir *= -1;

            // Границы экрана
            if (star.x < 0) star.x = width;
            if (star.x > width) star.x = 0;
            if (star.y < 0) star.y = height;
            if (star.y > height) star.y = 0;

            // Отрисовка
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${CONFIG.color}, ${star.alpha})`;

            // Свечение только для крупных звезд
            if (star.size > 1.2) {
                ctx.shadowBlur = 6;
                ctx.shadowColor = `rgba(${CONFIG.color}, 0.4)`;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    // Инициализация
    window.addEventListener('resize', resize);
    resize(); // Вызываем сразу, не ждем DOMContentLoaded
    animate();
})();
