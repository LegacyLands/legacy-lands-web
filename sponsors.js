// 移除硬编码的数据
let sponsorsData = []; // 改为空数组，等待从JSON加载

let currentPage = 1;
const itemsPerPage = 20;
let currentTier = 'all';
let searchQuery = '';

// 初始化页面
function initSponsors() {
    loadSponsors();
    initializeEventListeners();
}

// 加载赞助者
function loadSponsors() {
    const grid = document.querySelector('.sponsors-grid');
    if (!grid) {
        console.error('找不到 sponsors-grid 元素');
        return;
    }

    const filteredSponsors = filterSponsors();
    const paginatedSponsors = paginateSponsors(filteredSponsors);

    grid.innerHTML = '';

    // 简化布局逻辑，直接按顺序显示
    paginatedSponsors.forEach((sponsor, index) => {
        const card = createSponsorCard(sponsor, index);
        grid.appendChild(card);
    });

    // 在所有赞助者卡片加载完成后显示赞助按钮
    const sponsorUsSection = document.querySelector('.sponsor-us-section');
    if (sponsorUsSection) {
        // 使用 setTimeout 确保在卡片动画完成后显示按钮
        setTimeout(() => {
            sponsorUsSection.classList.add('show');
        }, 1500); // 延迟时间可以根据需要调整
    }
}

// 创建赞助者卡片
function createSponsorCard(sponsor, index) {
    const card = document.createElement('div');
    card.className = 'sponsor-card';
    card.style.setProperty('--card-index', index);

    const defaultAvatarPath = './assets/avatars/sponsor.jpg';
    const avatarSrc = sponsor.logo || defaultAvatarPath;
    const currentLang = window.currentLang || 'en'; // 从 language.js 获取当前语言

    const avatarHtml = `<img src="${avatarSrc}" alt="${sponsor.name[currentLang]}" onerror="this.src='${defaultAvatarPath}'"/>`;

    card.innerHTML = `
        <div class="sponsor-avatar">
            ${avatarHtml}
        </div>
        <div class="sponsor-name" data-name-en="${sponsor.name.en}" data-name-zh="${sponsor.name.zh}">
            ${sponsor.name[currentLang]}
        </div>
        <div class="sponsor-tier tier-${sponsor.tier}" data-i18n="sponsors.card.tier.${sponsor.tier.toLowerCase()}">
            ${translations[currentLang]?.sponsors?.card?.tier?.[sponsor.tier.toLowerCase()] || sponsor.tier}
        </div>
        <div class="sponsor-description" data-desc-en="${sponsor.description.en}" data-desc-zh="${sponsor.description.zh}">
            ${sponsor.description[currentLang]}
        </div>
        <div class="sponsor-date">${formatDate(sponsor.date)}</div>
    `;

    return card;
}

// 事件监听器
function initializeEventListeners() {
    // 等级筛选
    document.querySelectorAll('.tier-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTier = e.target.dataset.tier;
            resetAndReload();
        });
    });

    // 搜索
    const searchInput = document.getElementById('sponsorSearch');
    let debounceTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            searchQuery = e.target.value.toLowerCase();
            resetAndReload();
        }, 300);
    });
}

// 工具函数
function filterSponsors() {
    return sponsorsData.filter(sponsor => {
        const tierMatch = currentTier === 'all' || sponsor.tier.toLowerCase() === currentTier.toLowerCase();

        // 多语言搜索支持
        const searchMatch = !searchQuery || (
            // 搜索英文名称
            sponsor.name.en.toLowerCase().includes(searchQuery) ||
            // 搜索中文名称
            sponsor.name.zh.toLowerCase().includes(searchQuery) ||
            // 搜索英文描述
            sponsor.description.en.toLowerCase().includes(searchQuery) ||
            // 搜索中文描述
            sponsor.description.zh.toLowerCase().includes(searchQuery) ||
            // 搜索等级
            sponsor.tier.toLowerCase().includes(searchQuery)
        );

        return tierMatch && searchMatch;
    });
}

function paginateSponsors(sponsors) {
    const start = (currentPage - 1) * itemsPerPage;
    return sponsors.slice(start, start + itemsPerPage);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function resetAndReload() {
    currentPage = 1;
    const grid = document.querySelector('.sponsors-grid');
    grid.innerHTML = '';

    // 重新加载时隐藏赞助按钮
    const sponsorUsSection = document.querySelector('.sponsor-us-section');
    if (sponsorUsSection) {
        sponsorUsSection.classList.remove('show');
    }

    // 重新加载并添加重置动画类
    loadSponsors();
    document.querySelectorAll('.sponsor-card').forEach(card => {
        card.classList.add('reset-animation');
    });
}

// 添加一个全局变量导出，以便 language.js 可以访问
window.sponsorsData = sponsorsData;
window.resetAndReload = resetAndReload;

// 修改加载数据的函数
async function loadSponsorsData() {
    try {
        // 直接使用硬编码的数据作为备选
        const fallbackData = {
            "sponsors": [
                {
                    "id": 1,
                    "name": {
                        "en": "Zhang San",
                        "zh": "张三"
                    },
                    "tier": "diamond",
                    "date": "2024-03-15",
                    "logo": "",
                    "description": {
                        "en": "Diamond Sponsor",
                        "zh": "钻石赞助商"
                    }
                },
                {
                    "id": 2,
                    "name": {
                        "en": "Li Si",
                        "zh": "李四"
                    },
                    "tier": "gold",
                    "date": "2024-03-14",
                    "logo": "",
                    "description": {
                        "en": "Gold Sponsor",
                        "zh": "黄金赞助商"
                    }
                },
                {
                    "id": 3,
                    "name": {
                        "en": "Wang Wu",
                        "zh": "王五"
                    },
                    "tier": "silver",
                    "date": "2024-03-13",
                    "logo": "",
                    "description": {
                        "en": "Silver Sponsor",
                        "zh": "白银赞助商"
                    }
                },
                {
                    "id": 4,
                    "name": {
                        "en": "Zhao Liu",
                        "zh": "赵六"
                    },
                    "tier": "bronze",
                    "date": "2024-03-12",
                    "logo": "",
                    "description": {
                        "en": "Bronze Sponsor",
                        "zh": "青铜赞助商"
                    }
                }
            ]
        };

        try {
            // 首先尝试从文件加载
            const response = await fetch('assets/data/sponsors.json');
            if (response.ok) {
                const data = await response.json();
                if (data.sponsors && Array.isArray(data.sponsors)) {
                    sponsorsData = data.sponsors;
                } else {
                    throw new Error('JSON 格式无效');
                }
            } else {
                throw new Error('无法加载文件');
            }
        } catch (e) {
            console.log('从文件加载失败，使用备选数据');
            // 如果加载失败，使用备选数据
            sponsorsData = fallbackData.sponsors;
        }

        // 导出到全局变量，使 language.js 可以访问
        window.sponsorsData = sponsorsData;
        window.resetAndReload = resetAndReload;

        // 初始化页面
        initSponsors();

    } catch (error) {
        console.error('加载数据失败:', error);
        const grid = document.querySelector('.sponsors-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message">
                    <p>加载赞助商数据失败</p>
                    <p>错误信息: ${error.message}</p>
                    <button onclick="retryLoad()" class="retry-button">重试</button>
                </div>
            `;
        }
    }
}

// 添加更多的错误处理信息到重试函数
function retryLoad() {
    console.log('尝试重新加载数据...');
    const grid = document.querySelector('.sponsors-grid');
    if (grid) {
        grid.innerHTML = '<div class="loading-message">正在加载赞助商数据...</div>';
    }
    loadSponsorsData();
}

// 修改页面加载初始化部分
document.addEventListener('DOMContentLoaded', () => {
    // 初始化画布
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
        animate();
    }

    // 加载数据
    loadSponsorsData();
});

// 修改动画循环，使用纯黑色背景
function animate() {
    if (!canvas || !ctx) return;

    // 使用纯黑色背景
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制所有气泡
    bubbles.forEach(bubble => {
        bubble.update();
        bubble.draw(ctx);
    });

    requestAnimationFrame(animate);
}

// 修改 Bubble 类中的 reset 方法
class Bubble {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        // 更大范围的随机大小
        this.size = Math.random() * 8 + 1; // 气泡大小在1-9之间随机
        this.speed = this.size * 0.04; // 调整速度与大小的关系
        this.alpha = Math.random() * 0.2 + 0.05; // 提高透明度范围到 0.05-0.25
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.005;
        this.wobbleRange = 0.2;
        this.acceleration = 0;
        this.maxSpeed = this.size * 0.12;
        // 使用纯灰色
        const grayValue = 160 + Math.random() * 60; // 灰色值在160-220之间
        this.color = `rgba(${grayValue}, ${grayValue}, ${grayValue}`;
    }

    update() {
        // 添加平滑的加速度
        this.acceleration += 0.0001;
        this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);

        // 更平滑的移动
        this.y -= this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * this.wobbleRange;

        // 重置气泡
        if (this.y < -this.size) {
            this.reset();
            this.acceleration = 0; // 重置加速度
        }
    }

    draw(ctx) {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        gradient.addColorStop(0, `${this.color}, ${this.alpha})`);
        gradient.addColorStop(1, `${this.color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 增加气泡数量和多样性
const bubbles = Array(50).fill().map(() => new Bubble());

// 修改画布初始化
function setCanvasSize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
} 