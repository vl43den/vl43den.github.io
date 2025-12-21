/**
 * Floating Particles - Subtle ambient background effect
 */
(function () {
    const PARTICLE_COUNT = 50;
    const PARTICLE_SIZE = { min: 1, max: 3 };
    const PARTICLE_SPEED = { min: 0.2, max: 0.8 };
    const PARTICLE_OPACITY = { min: 0.1, max: 0.4 };

    let canvas, ctx;
    let particles = [];
    let animationId;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = PARTICLE_SIZE.min + Math.random() * (PARTICLE_SIZE.max - PARTICLE_SIZE.min);
            this.speedX = (Math.random() - 0.5) * PARTICLE_SPEED.max;
            this.speedY = -PARTICLE_SPEED.min - Math.random() * (PARTICLE_SPEED.max - PARTICLE_SPEED.min);
            this.opacity = PARTICLE_OPACITY.min + Math.random() * (PARTICLE_OPACITY.max - PARTICLE_OPACITY.min);
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Reset if off screen
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(129, 140, 248, ${this.opacity})`;
            ctx.fill();
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    function init() {
        canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        resize();

        // Create particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        animate();

        window.addEventListener('resize', resize);

        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
