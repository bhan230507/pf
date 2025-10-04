// 포트폴리오 프로젝트 데이터를 저장할 변수
let portfolioProjects = [];

// JSON 파일에서 데이터 로드
async function loadProjectData() {
    try {
        const response = await fetch('templates/data.json');
        const data = await response.json();
        portfolioProjects = data.portfolioProjects;
        renderCards();
    } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
        // 오류 시 기본 데이터 사용
        portfolioProjects = [];
    }
}

// 카드 생성 함수
function createCard(project) {
    const featuresList = project.features.map(feature => `<li>${feature}</li>`).join('');
    const techStackList = project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
    
    return `
        <div class="card rarity-${project.rarity}" onclick="openProject(${project.id})">
            <div class="card-thumbnail">
                <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" class="clickable-image">
            </div>
            <div class="card-content">
                <h3 class="card-title">${project.title}</h3>
                <div class="card-category">${project.category}</div>
                <div class="card-description-wrapper">
                    <p class="card-description">${project.description}</p>
                </div>
                <div class="card-meta">
                    <div class="card-author">
                        <div class="author-avatar">${project.author.charAt(0)}</div>
                        <span class="author-name">${project.author}</span>
                    </div>
                </div>
            </div>
            <div class="card-detail">
                <h3 class="detail-title">${project.title}</h3>
                <div class="detail-category">${project.category}</div>
                <div class="detail-description-wrapper">
                    <p class="detail-description">${project.detailDescription}</p>
                </div>
                <div class="tech-stack">
                    <h4>기술 스택</h4>
                    <div class="tech-tags">
                        ${techStackList}
                    </div>
                </div>
                <ul class="detail-features">
                    ${featuresList}
                </ul>
            </div>
        </div>
    `;
}

// 프로젝트 상세 보기 함수
function openProject(id) {
    const project = portfolioProjects.find(p => p.id === id);
    if (project) {
        // 프로젝트별 상세 페이지로 이동
        const projectPages = {
            1: 'templates/project1-etl.html',
            2: 'templates/project2-promotion.html',
            3: 'templates/project3-realtime.html',
            4: 'templates/project4-dashboard.html',
            5: 'templates/project5-trend.html',
            6: 'templates/project6-rag.html',
            7: 'templates/project7-geospatial.html',
            8: 'templates/project8-keyword.html',
            9: 'templates/project9-baemin.html'
        };
        
        const pageUrl = projectPages[id];
        if (pageUrl) {
            window.location.href = pageUrl;
        }
    }
}

// 카드 렌더링
function renderCards() {
    const cardsGrid = document.getElementById('portfolio-cards');
    if (cardsGrid) {
        cardsGrid.innerHTML = portfolioProjects.map(project => createCard(project)).join('');
    }
}

// 파티클 효과 생성
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20; // 60에서 20으로 줄임

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        particlesContainer.appendChild(particle);
    }
}

// 이미지 모달 열기
function openImageModal(imageSrc, imageAlt) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt;
    modal.classList.add('active');
    
    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

// 이미지 모달 닫기
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
}

// 스킬 상세 내용 토글 (모바일용)
function toggleSkillDetail(element) {
    // 모바일에서만 작동
    if (window.innerWidth <= 768) {
        element.classList.toggle('expanded');
    }
}

// 카드 호버 효과 개선
function setupCardHoverEffects() {
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.card')) {
            const card = e.target.closest('.card');
            card.style.zIndex = '10';
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.card')) {
            const card = e.target.closest('.card');
            card.style.zIndex = '1';
        }
    });
}

// 탭 전환 기능
function showTab(tabName) {
    // 모든 탭 컨텐츠 숨기기
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 모든 탭 버튼 비활성화
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // 선택된 탭 컨텐츠 표시
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // 선택된 탭 버튼 활성화
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // Portfolio 탭이 활성화될 때만 프로젝트 데이터 로드 및 렌더링
    if (tabName === 'portfolio') {
        loadProjectData();
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // URL 해시 확인하여 탭 설정
    const hash = window.location.hash;
    if (hash === '#portfolio-tab' || hash === '#portfolio-cards') {
        showTab('portfolio');
        // 포트폴리오 카드 위치로 스크롤
        setTimeout(() => {
            const portfolioCards = document.getElementById('portfolio-cards');
            if (portfolioCards) {
                portfolioCards.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    } else {
        // 기본 탭 설정
        showTab('portfolio');
    }
    
    createParticles();
    setupCardHoverEffects();
    
    // 이미지 클릭 이벤트 설정
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('clickable-image')) {
            e.preventDefault();
            e.stopPropagation();
            const imageSrc = e.target.src;
            const imageAlt = e.target.alt;
            openImageModal(imageSrc, imageAlt);
        }
        
        // 카드 클릭 이벤트 방지 (상세 설명 내 버튼 클릭 시)
        if (e.target.closest('.card-detail .play-button')) {
            e.stopPropagation();
        }
    });
    
    // 모달 배경 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('image-modal')) {
            closeImageModal();
        }
    });

    // 해시 변경 이벤트 감지
    window.addEventListener('hashchange', function() {
        const newHash = window.location.hash;
        if (newHash === '#portfolio-tab' || newHash === '#portfolio-cards') {
            showTab('portfolio');
            setTimeout(() => {
                const portfolioCards = document.getElementById('portfolio-cards');
                if (portfolioCards) {
                    portfolioCards.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }
    });
}); 