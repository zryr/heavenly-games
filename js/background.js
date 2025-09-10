document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) {
        console.error('Stars canvas not found.');
        return;
    }
    const ctx = canvas.getContext('2d');

    let stars = [];
    const numStars = 200;
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
        }

        draw() {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {
            this.y += this.speed;
            if (this.y > canvasHeight) {
                this.y = 0 - this.size;
                this.x = Math.random() * canvasWidth;
            }
        }
    }

    function init() {
        setCanvasSize();
        stars = [];
        for (let i = 0; i < numStars; i++) {
            const size = Math.random() * 2 + 0.5;
            const x = Math.random() * canvasWidth;
            const y = Math.random() * canvasHeight;
            const speed = Math.random() * 1.5 + 0.5;
            stars.push(new Star(x, y, size, speed));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        stars.forEach(star => {
            star.draw();
            star.update();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', init);
});
