// ============================================================
// Portfolio interactions
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

    // --- Smooth scrolling for in-page anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // --- Active nav link highlighting on scroll ---
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = navLinks
        .map(l => document.querySelector(l.getAttribute('href')))
        .filter(Boolean);

    if (sections.length) {
        const spy = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    const active = navLinks.find(l => l.getAttribute('href') === '#' + entry.target.id);
                    if (active) active.classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        sections.forEach(s => spy.observe(s));
    }

    // --- Cursor spotlight glow ---
    const spotlight = document.querySelector('.spotlight');
    if (spotlight && window.matchMedia('(hover: hover)').matches) {
        window.addEventListener('pointermove', e => {
            spotlight.style.setProperty('--mx', e.clientX + 'px');
            spotlight.style.setProperty('--my', e.clientY + 'px');
        });
    }

    // --- Reveal on scroll ---
    const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'none';
                reveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.work-item, .project-card, .stack-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        reveal.observe(el);
    });

    // --- Scroll-to-top button ---
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', '맨 위로');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function () {
        const show = window.scrollY > 500;
        scrollBtn.style.opacity = show ? '1' : '0';
        scrollBtn.style.visibility = show ? 'visible' : 'hidden';
    });

    scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});


// pressentation
if (document.querySelector('.presentation-wrapper')) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    function showSlide(n) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (n + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;

        // URL 업데이트 (브라우저 히스토리에 추가하지 않음)
        const url = new URL(window.location);
        url.searchParams.set('page', currentSlide + 1);
        window.history.replaceState({}, '', url);
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            showSlide(currentSlide + 1);
        }
    }

    function previousSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }

    // 쿼리스트링에서 페이지 번호 읽기
    function loadPageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');

        if (page) {
            const pageNum = parseInt(page, 10);
            // 페이지 번호가 유효한 범위인지 확인 (1부터 시작)
            if (pageNum >= 1 && pageNum <= totalSlides) {
                currentSlide = pageNum - 1;
                slides[currentSlide].classList.add('active');
                const prevBtn = document.getElementById('prevBtn');
                const nextBtn = document.getElementById('nextBtn');
                if (prevBtn) prevBtn.disabled = currentSlide === 0;
                if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
                return;
            }
        }

        // 쿼리스트링이 없거나 유효하지 않으면 첫 페이지 표시
        if (slides.length > 0) {
            slides[0].classList.add('active');
            const prevBtn = document.getElementById('prevBtn');
            if (prevBtn) prevBtn.disabled = true;
        }
    }

    // 키보드 네비게이션
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight' || event.key === ' ') {
            nextSlide();
        } else if (event.key === 'ArrowLeft') {
            previousSlide();
        }
    });

    // 페이지 로드 시 쿼리스트링 확인
    loadPageFromURL();

    // 전역 함수로 등록 (HTML onclick에서 사용)
    window.nextSlide = nextSlide;
    window.previousSlide = previousSlide;
    window.showSlide = showSlide;
}
