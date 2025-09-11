document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) {
        console.error('Stars canvas not found.');
        return;
    }
    const ctx = canvas.getContext('2d');

    let stars = [];
    let shootingStars = [];
    const numStars = 300; // Increased star count
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    function setCanvasSize() {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }

    class Star {
        constructor(x, y, size, speed) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = speed;
            this.alpha = Math.random(); // For twinkling
            this.twinkleSpeed = Math.random() * 0.05;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {
            this.alpha += this.twinkleSpeed;
            if (this.alpha > 1 || this.alpha < 0) {
                this.twinkleSpeed = -this.twinkleSpeed;
            }

            this.y += this.speed;
            if (this.y > canvasHeight) {
                this.y = 0 - this.size;
                this.x = Math.random() * canvasWidth;
            }
        }
    }

    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight * 0.5;
            this.len = Math.random() * 80 + 10;
            this.speed = Math.random() * 10 + 6;
            this.size = Math.random() * 1 + 0.1;
            this.active = true;
        }

        draw() {
            if (!this.active) return;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = this.size;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.len, this.y - this.len);
            ctx.stroke();
        }

        update() {
            if (!this.active) return;
            this.x -= this.speed;
            this.y += this.speed;
            if (this.x < -this.len || this.y >= canvasHeight) {
                this.active = false;
            }
        }
    }

    function init() {
        setCanvasSize();
        stars = [];
        for (let i = 0; i < numStars; i++) {
            const size = Math.random() * 1.5 + 0.5;
            const x = Math.random() * canvasWidth;
            const y = Math.random() * canvasHeight;
            const speed = Math.random() * 0.5 + 0.1; // Slower stars
            stars.push(new Star(x, y, size, speed));
        }
        shootingStars = [new ShootingStar()];
    }

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        stars.forEach(star => {
            star.draw();
            star.update();
        });

        shootingStars.forEach((star, index) => {
            star.draw();
            star.update();
            if (!star.active) {
                shootingStars.splice(index, 1);
            }
        });

        // Add a new shooting star periodically
        if (Math.random() < 0.005 && shootingStars.length < 3) {
            shootingStars.push(new ShootingStar());
        }

        requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', init);
});
