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
function drawLines(fadeOpacity = 1) {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 80) * fadeOpacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// 动画循环
let fadeOutStartTime = null;
const fadeOutDuration = 5000; // 5秒

function animate(timestamp) {
    if (!fadeOutStartTime) fadeOutStartTime = timestamp;
    const fadeProgress = (timestamp - fadeOutStartTime) / fadeOutDuration;

    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (fadeProgress <= 1) {
        const opacity = 1 - fadeProgress;
        particles.forEach(particle => {
            particle.opacity = Math.min(particle.originalOpacity * opacity, 0.5);
            particle.update();
            particle.draw();
        });

        drawLines(opacity);
    }

    requestAnimationFrame(animate);
}

animate();

// 动画控制
const mainTitle = document.querySelector('.main-title');
const floatingChars = document.querySelectorAll('.floating-characters span');
const codeContainers = document.querySelectorAll('.code-container');
const descriptionContainers = document.querySelectorAll('.description-container');
const hero = document.querySelector('.hero');

// 初始化所有元素为隐藏状态
mainTitle.style.opacity = '0';
floatingChars.forEach(char => char.style.opacity = '0');
codeContainers.forEach(container => container.style.opacity = '0');
descriptionContainers.forEach(container => container.style.opacity = '0');

// 添加组织部分的动画观察
const orgContent = document.querySelector('.org-content');
const memberCards = document.querySelectorAll('.member-card');

// 创建观察器
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target === mainTitle) {
                mainTitle.style.animation = 'fadeIn 2s ease-out forwards';

                // 触发浮动字符动画
                floatingChars.forEach((char, index) => {
                    char.style.animation = `floatIn 1.5s ease-out forwards ${0.5 + index * 0.3}s`;
                });
            } else if (entry.target === orgContent) {
                // 触发组织内容的动画
                const title = orgContent.querySelector('.org-title');
                const description = orgContent.querySelector('.org-description');
                const cards = orgContent.querySelectorAll('.member-card');

                // 标题动画
                title.style.animationPlayState = 'running';

                // 描述动画，延迟0.3秒
                setTimeout(() => {
                    description.style.animationPlayState = 'running';
                }, 300);

                // 成员卡片动画，依次延迟显示
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animationPlayState = 'running';
                    }, 600 + index * 200); // 从0.6秒开始，每个卡片间隔0.2秒
                });
            } else if (entry.target.classList.contains('code-container')) {
                // 代码容器动画
                entry.target.style.animation = 'codeAppear 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards';

                // 获取相邻的描述容器
                const descContainer = entry.target.closest('.code-section').querySelector('.description-container');
                if (descContainer) {
                    descContainer.style.animation = 'slideLeft 1s ease-out forwards';

                    // 触发标签动画
                    const tags = descContainer.querySelectorAll('.feature-tags span');
                    tags.forEach((tag, index) => {
                        tag.style.animation = `tagReveal 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards ${0.8 + index * 0.2}s`;
                    });

                    // 触发 GitHub 按钮动画
                    const githubLink = descContainer.querySelector('.github-link');
                    if (githubLink) {
                        githubLink.style.animation = 'buttonFadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards 1.4s';
                    }
                }
            } else if (entry.target.classList.contains('mission-content')) {
                // 触发使命部分的动画
                const title = entry.target.querySelector('.mission-title');
                const subtitle = entry.target.querySelector('.mission-subtitle');
                const line = entry.target.querySelector('.mission-line');
                const cards = entry.target.querySelectorAll('.mission-card');

                // 标题和副标题动画
                title.style.animationPlayState = 'running';
                subtitle.style.animationPlayState = 'running';
                line.style.animationPlayState = 'running';

                // 卡片动画，依次延迟显示
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animationPlayState = 'running';
                    }, 800 + index * 200);
                });
            } else if (entry.target.classList.contains('contact-content')) {
                // 触发联系方式部分的动画
                const title = entry.target.querySelector('.contact-title');
                const subtitle = entry.target.querySelector('.contact-subtitle');
                const line = entry.target.querySelector('.contact-line');
                const cards = entry.target.querySelectorAll('.contact-card');
                const footer = entry.target.querySelector('.footer');

                // 标题和副标题动画
                title.style.animationPlayState = 'running';
                subtitle.style.animationPlayState = 'running';
                line.style.animationPlayState = 'running';

                // 卡片动画，依次延迟显示
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animationPlayState = 'running';
                    }, 800 + index * 200);
                });

                // 页脚动画
                footer.style.animationPlayState = 'running';
            }

            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// 观察所有需要动画的元素
observer.observe(mainTitle);
observer.observe(orgContent);
codeContainers.forEach(container => observer.observe(container));
const missionContent = document.querySelector('.mission-content');
observer.observe(missionContent);
const contactContent = document.querySelector('.contact-content');
observer.observe(contactContent);

// 修改轮播逻辑
const slider = {
    track: document.querySelector('.members-track'),
    prevBtn: document.querySelector('.nav-arrow.prev'),
    nextBtn: document.querySelector('.nav-arrow.next'),
    dots: document.querySelector('.slider-dots'),
    isDragging: false,
    startPos: 0,
    currentTranslate: 0,
    prevTranslate: 0,

    init() {
        if (!this.track) return;
        this.bindEvents();

        // 计算最大拖动距离
        const trackWidth = this.track.scrollWidth;
        const containerWidth = this.track.parentElement.clientWidth;
        this.maxTranslate = containerWidth * 0.1; // 右边保持10%的余量
        this.minTranslate = -(trackWidth - containerWidth + containerWidth * 0.8); // 左边增加到80%的容器宽度

        // 移除轮播点和导航按钮
        this.dots.style.display = 'none';
        this.prevBtn.style.display = 'none';
        this.nextBtn.style.display = 'none';
    },

    bindEvents() {
        // 添加拖动事件
        this.track.addEventListener('mousedown', this.startDragging.bind(this));
        this.track.addEventListener('touchstart', this.startDragging.bind(this));
        window.addEventListener('mousemove', this.drag.bind(this));
        window.addEventListener('touchmove', this.drag.bind(this));
        window.addEventListener('mouseup', this.stopDragging.bind(this));
        window.addEventListener('touchend', this.stopDragging.bind(this));

        // 防止拖动时选中文本
        this.track.addEventListener('selectstart', (e) => e.preventDefault());
    },

    startDragging(e) {
        this.isDragging = true;
        this.startPos = this.getPositionX(e);
        this.track.style.cursor = 'grabbing';
        this.track.classList.add('dragging');
    },

    drag(e) {
        if (!this.isDragging) return;

        const currentPosition = this.getPositionX(e);
        const diff = currentPosition - this.startPos;
        const walk = diff * 1.0;

        // 添加边界限制
        const nextTranslate = this.prevTranslate + walk;
        this.currentTranslate = Math.max(
            this.minTranslate,
            Math.min(this.maxTranslate, nextTranslate)
        );

        this.setSliderPosition();
    },

    stopDragging() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.track.style.cursor = 'grab';
        this.track.classList.remove('dragging');
        this.track.classList.add('snap');

        // 添加弹性效果
        requestAnimationFrame(() => {
            this.prevTranslate = this.currentTranslate;
            // 300ms 后移除 snap 类
            setTimeout(() => {
                this.track.classList.remove('snap');
            }, 300);
        });
    },

    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    },

    setSliderPosition() {
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }
};

// 初始化轮询
slider.init();

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