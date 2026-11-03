/*!
* Start Bootstrap - Grayscale v7.0.3 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    initSeamlessVideo();
    initReveal();
    initTimelineProgress();

});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * Hero background loop.
 * res/video/hero-loop-*.mp4 has the crossfade baked in (its last 1.5s dissolve into its first
 * frames), so plain native `loop` on one <video> is seamless with a single decoder.
 * The video pauses while the hero is off screen so it isn't decoding behind the content.
 */
function initSeamlessVideo() {
    const video = document.getElementById('bg-video');
    if (!video) return;
    const show = () => video.classList.add('is-playing');
    if (prefersReducedMotion) {
        video.removeAttribute('autoplay');
        video.pause();
        show(); // still frame (poster), no fade
        return;
    }
    // Fade in from black on first playback, not on every loop or resume.
    if (!video.paused && video.currentTime > 0) show();
    else video.addEventListener('playing', show, { once: true });
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(show); // autoplay blocked: fade in the poster instead
        else video.pause();
    }).observe(video);
}

/* Fade/slide elements with .reveal into view as they enter the viewport. */
function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
}

/* Fill the timeline spine as the reader scrolls through the Career section. */
function initTimelineProgress() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    const items = timeline.querySelectorAll('.tl-item');
    let ticking = false;
    const update = () => {
        ticking = false;
        const r = timeline.getBoundingClientRect();
        const anchor = window.innerHeight * 0.6;
        const progress = Math.min(Math.max((anchor - r.top) / r.height, 0), 1);
        timeline.style.setProperty('--progress', progress.toFixed(4));
        items.forEach((item) => {
            const node = item.querySelector('.tl-node');
            if (node) item.classList.toggle('is-passed', node.getBoundingClientRect().top < anchor);
        });
    };
    const onScroll = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
}