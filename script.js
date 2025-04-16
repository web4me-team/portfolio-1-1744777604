// 动画终端光标
function animateTerminalCursor() {
    setInterval(() => {
        const cursors = document.querySelectorAll('.terminal-cursor');
        cursors.forEach(cursor => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        });
    }, 500);
}

// 平滑滚动导航链接
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// 确保URL有http或https前缀
function ensureHttpPrefix(url) {
    if (!url) return '';
    return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

// 处理发布链接
function handlePublicationLinks() {
    // 尝试从URL参数获取简历数据
    const urlParams = new URLSearchParams(window.location.search);
    const resumeDataParam = urlParams.get('resumeData');
    
    if (resumeDataParam) {
        try {
            const resumeData = JSON.parse(decodeURIComponent(resumeDataParam));
            
            // 更新发布物及其链接（如果可用）
            if (resumeData.publications && resumeData.publications.length) {
                const publicationsContainer = document.getElementById('publications-container');
                publicationsContainer.innerHTML = ''; // 清除现有发布物
                
                resumeData.publications.forEach(pub => {
                    const pubElement = document.createElement('div');
                    pubElement.className = 'publication-item';
                    
                    let authorText = '';
                    if (pub.authors && pub.authors.length) {
                        authorText = pub.authors.join(', ');
                    }
                    
                    pubElement.innerHTML = `
                        <h3 class="publication-title">${pub.title || 'Untitled Publication'}</h3>
                        <div class="publication-meta">
                            <span class="publication-journal">${pub.journal || ''}</span>
                            <span class="publication-year">${pub.year || ''}</span>
                        </div>
                        <div class="publication-authors">
                            <p>${authorText}</p>
                        </div>
                        ${pub.links ? `
                        <div class="publication-links">
                            <a href="${ensureHttpPrefix(pub.links)}" target="_blank">
                                <i class="fas fa-external-link-alt"></i> View Paper
                            </a>
                        </div>` : ''}
                    `;
                    
                    publicationsContainer.appendChild(pubElement);
                });
            }
            
        } catch (error) {
            console.error('Error parsing resume data:', error);
        }
    }
}

// 修复所有外部链接
function fixExternalLinks() {
    // 找到所有具有href属性的a标签
    const allLinks = document.querySelectorAll('a[href]');
    
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // 跳过内部链接（以#或/开头）
        if (href.startsWith('#') || href.startsWith('/') || 
            href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }
        
        // 跳过已经有协议的链接
        if (href.match(/^https?:\/\//)) {
            return;
        }
        
        // 对外部链接添加https://前缀
        link.setAttribute('href', `https://${href}`);
    });
}

// 在DOM加载完成后调用所有功能
document.addEventListener('DOMContentLoaded', function() {
    animateTerminalCursor();
    setupSmoothScrolling();
    handlePublicationLinks();
    fixExternalLinks();
    
    // Add animation for research interests
    const researchInterests = document.querySelectorAll('.research-interest');
    researchInterests.forEach((interest, index) => {
        interest.style.opacity = '0';
        interest.style.transform = 'translateX(-20px)';
        interest.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            interest.style.opacity = '1';
            interest.style.transform = 'translateX(0)';
        }, 300 + (index * 150));
    });
    
    // Add scroll reveal effects
    const revealElements = document.querySelectorAll('.section-header, .education-item, .experience-item, .project-card, .publication-item, .teaching-item, .award-item, .contact-method');
    
    const revealOnScroll = function() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
                element.classList.add('revealed');
            }
        });
    };
    
    // Initial check and add event listener
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
}); 