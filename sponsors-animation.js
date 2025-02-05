// Canvas 设置
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

// 设置canvas尺寸
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// 粒子类
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.life = Math.random() * 100 + 100;
        this.opacity = Math.random() * 0.35 + 0.25;
        this.originalOpacity = this.opacity;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        if (this.life <= 0 ||
            this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// 创建粒子数组
const particles = [];
const particleCount = 75;
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// 连线函数
function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 80)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// 动画循环
function animate() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawLines();
    requestAnimationFrame(animate);
}

// 开始动画
animate();

// 导航栏滚动处理
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const nav = document.querySelector('nav');
            const langSwitch = document.querySelector('.language-switch');

            // 向下滚动超过100px时隐藏
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                nav.classList.add('hidden');
                langSwitch.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
                langSwitch.classList.remove('hidden');
            }

            lastScrollY = window.scrollY;
            ticking = false;
        });
        ticking = true;
    }
});

// 字体加载检测
document.fonts.ready.then(() => {
    const logo = document.querySelector('.logo');
    const langSwitch = document.querySelector('.language-switch');
    logo.classList.add('font-loaded');
    langSwitch.style.opacity = '1';
}); 