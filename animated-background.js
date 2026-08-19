// Animated Background with stars and shooting stars
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'animated-bg';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
        pointer-events: none;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;

    // Настройки
    const config = {
        starCount: 100,
        shootingStarFrequency: 0.005,
        starSpeed: 0.3,
        shootingStarSpeed: 15,
    };

    let stars = [];
    let shootingStars = [];

    // Инициализация размеров
    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };

    // Класс обычной фоновой звезды
    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * config.starSpeed;
            this.speedY = (Math.random() - 0.5) * config.starSpeed;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Если ушла за экран — возвращаем с другой стороны
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Класс падающей звезды (кометы)
    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            // Начинаем где-то сверху или справа
            this.x = Math.random() * width;
            this.y = Math.random() * (height / 2);
            this.len = Math.random() * 80 + 10; // Длина хвоста
            this.speed = Math.random() * 10 + 10; // Скорость полета
            this.size = Math.random() * 1 + 0.1; // Толщина

            // Угол падения (примерно 45 градусов вниз-влево или вниз-вправо)
            this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1);

            // Вычисляем вектор движения
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;

            this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
            this.active = false;
        }

        update() {
            if (this.active) {
                this.x -= this.vx; // Летим влево-вниз
                this.y += this.vy;

                // Если улетела за экран, сбрасываем
                if (this.x < -100 || this.y > height + 100) {
                    this.active = false;
                    this.reset();
                }
            } else {
                if (this.waitTime < new Date().getTime()) {
                    this.active = true;
                }
            }
        }

        draw() {
            if (!this.active) return;

            // Градиент для хвоста (от прозрачного к белому)
            const gradient = ctx.createLinearGradient(
                this.x, this.y,
                this.x + this.len * Math.cos(this.angle),
                this.y - this.len * Math.sin(this.angle)
            );
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.size;
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + this.len * Math.cos(this.angle),
                this.y - this.len * Math.sin(this.angle)
            );
            ctx.stroke();
        }
    }

    // Создаем объекты
    const init = () => {
        resize();
        stars = [];
        for (let i = 0; i < config.starCount; i++) {
            stars.push(new Star());
        }

        shootingStars = [];
        // Создаем несколько комет
        for (let i = 0; i < 3; i++) {
            shootingStars.push(new ShootingStar());
        }
    };

    // Анимационный цикл
    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        // Рисуем фон (точки)
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // Рисуем падающие звезды
        shootingStars.forEach(star => {
            star.update();
            star.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);

    init();
    animate();
})();
