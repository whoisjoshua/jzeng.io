/*
 * Motion + media modal for the hobby pages (/music, /art). No dependencies.
 *
 * Hooks (data attributes / classes in the page markup):
 *   [data-split]       split text into letters that rise in on load
 *   [data-hero]        sets --p (0→1) as the hero scrolls away
 *   [data-marquee]     endless marquee that speeds up + skews with scroll velocity
 *   [data-hscroll]     pins the section and scrolls its .h-pin__track sideways (≥768px)
 *   [data-speed]       parallax: translateY relative to its parent's position (e.g. 0.1, -0.08)
 *   .clip-reveal       clip-path wipe when scrolled into view
 *   [data-preview]     list whose rows ([data-thumb]) show a cursor-following thumbnail
 *
 * Page scripts render their content first, then this file wires everything on DOMContentLoaded.
 * Exposes window.HobbyModal.open(items, index, openerEl) where each item is
 *   { type: "video", youtube, title, meta }  or  { type: "image", src, alt, title, meta }.
 */
(function () {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const lerp = (a, b, t) => a + (b - a) * t;
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    /* ---------------- Media modal ---------------- */
    const HobbyModal = (() => {
        let dialog, frame, title, meta, prev, next, items = [], index = 0, opener = null, closing = false;

        const build = () => {
            dialog = document.createElement("dialog");
            dialog.className = "media-modal";
            dialog.innerHTML = `
                <div class="media-modal__panel">
                    <div class="media-modal__frame"></div>
                    <div class="media-modal__bar">
                        <div><p class="media-modal__title"></p><div class="media-modal__meta"></div></div>
                        <div class="media-modal__actions">
                            <button type="button" data-dir="-1" aria-label="Previous"><i class="fas fa-arrow-left"></i></button>
                            <button type="button" data-dir="1" aria-label="Next"><i class="fas fa-arrow-right"></i></button>
                            <button type="button" data-close aria-label="Close"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(dialog);
            frame = dialog.querySelector(".media-modal__frame");
            title = dialog.querySelector(".media-modal__title");
            meta = dialog.querySelector(".media-modal__meta");
            prev = dialog.querySelector("[data-dir='-1']");
            next = dialog.querySelector("[data-dir='1']");

            dialog.addEventListener("click", (e) => {
                if (e.target === dialog || e.target.closest("[data-close]")) return close();
                const nav = e.target.closest("[data-dir]");
                if (nav && !nav.disabled) show(index + Number(nav.dataset.dir));
            });
            dialog.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
            dialog.addEventListener("keydown", (e) => {
                if (e.key === "ArrowLeft") show(index - 1);
                if (e.key === "ArrowRight") show(index + 1);
            });
        };

        const show = (i) => {
            if (i < 0 || i >= items.length) return;
            index = i;
            const it = items[i];
            if (it.type === "video") {
                frame.className = "media-modal__frame";
                frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(it.youtube)}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
                    title="${esc(it.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            } else {
                frame.className = "media-modal__frame media-modal__frame--image";
                frame.innerHTML = it.src
                    ? `<img src="${esc(it.src)}" alt="${esc(it.alt || it.title)}" />`
                    : `<div class="art-tile__placeholder" style="width:min(70vw,600px);aspect-ratio:${it.ratio || "4/5"};background:${it.bg};border-radius:10px">Artwork coming soon</div>`;
            }
            title.textContent = it.title || "";
            meta.textContent = it.meta || "";
            prev.disabled = i === 0;
            next.disabled = i === items.length - 1;
            dialog.setAttribute("aria-label", it.title || "Media");
        };

        const open = (list, i, from) => {
            if (!dialog) build();
            if (typeof dialog.showModal !== "function") return false;
            items = list;
            opener = from || null;
            closing = false;
            show(i);
            dialog.showModal();
            requestAnimationFrame(() => dialog.classList.add("is-open"));
            return true;
        };

        const close = () => {
            if (!dialog.open || closing) return;
            closing = true;
            dialog.classList.remove("is-open");
            setTimeout(() => {
                dialog.close();
                frame.innerHTML = ""; // stops video playback
                closing = false;
                if (opener) opener.focus({ preventScroll: true });
            }, reduce ? 0 : 280);
        };

        return { open };
    })();
    window.HobbyModal = HobbyModal;

    /* ---------------- Split text ---------------- */
    const initSplit = () => {
        document.querySelectorAll("[data-split]").forEach((el) => {
            const text = el.textContent.trim();
            el.setAttribute("aria-label", text);
            el.innerHTML = [...text].map((ch, i) =>
                `<span class="split-char" aria-hidden="true" style="--i:${i}"><span>${ch === " " ? "&nbsp;" : esc(ch)}</span></span>`
            ).join("");
        });
        // Two frames so the initial (hidden) state paints before transitioning.
        requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("is-ready")));
    };

    /* ---------------- Scroll-in reveals ---------------- */
    const initReveal = () => {
        const els = document.querySelectorAll(".clip-reveal, .reveal");
        if (reduce || !("IntersectionObserver" in window)) {
            els.forEach((el) => el.classList.add("is-in", "is-visible"));
            return;
        }
        // A fully clipped element never intersects, so .clip-reveal is observed through its parent.
        const targets = new Map();
        els.forEach((el) => {
            const watch = el.classList.contains("clip-reveal") ? el.parentElement : el;
            if (!targets.has(watch)) targets.set(watch, []);
            targets.get(watch).push(el);
        });
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                targets.get(e.target).forEach((el) => el.classList.add("is-in", "is-visible"));
                io.unobserve(e.target);
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
        targets.forEach((_, watch) => io.observe(watch));
    };

    /* ---------------- Cursor-follow preview ---------------- */
    const initPreview = () => {
        const list = document.querySelector("[data-preview]");
        if (!list || reduce || !window.matchMedia("(hover: hover)").matches) return null;
        const box = document.createElement("div");
        box.className = "cursor-preview";
        box.innerHTML = `<img alt="" />`;
        document.body.appendChild(box);
        const img = box.querySelector("img");
        const state = { x: 0, y: 0, tx: 0, ty: 0, r: 0, on: false };

        list.addEventListener("pointermove", (e) => {
            state.tx = e.clientX;
            state.ty = e.clientY;
            const row = e.target.closest("[data-thumb]");
            if (row && img.getAttribute("src") !== row.dataset.thumb) img.src = row.dataset.thumb;
            if (!state.on) {
                state.on = true;
                state.x = state.tx;
                state.y = state.ty;
                box.classList.add("is-on");
            }
        });
        list.addEventListener("pointerleave", () => {
            state.on = false;
            box.classList.remove("is-on");
        });
        return () => {
            const dx = state.tx - state.x;
            state.x = lerp(state.x, state.tx, 0.14);
            state.y = lerp(state.y, state.ty, 0.14);
            state.r = lerp(state.r, clamp(dx * 0.08, -10, 10), 0.1);
            box.style.setProperty("--x", `${state.x.toFixed(1)}px`);
            box.style.setProperty("--y", `${state.y.toFixed(1)}px`);
            box.style.setProperty("--r", `${state.r.toFixed(2)}deg`);
        };
    };

    /* ---------------- Scroll-driven bits, one rAF loop ---------------- */
    const initScroll = () => {
        const bar = document.querySelector(".h-bar");
        const hero = document.querySelector("[data-hero]");
        const marquee = document.querySelector("[data-marquee]");
        const pin = document.querySelector("[data-hscroll]");
        const previewTick = initPreview();

        // Marquee: duplicate content so it can wrap seamlessly.
        let mTrack = null, mX = 0, mSkew = 0, mHalf = 0;
        if (marquee) {
            mTrack = marquee.querySelector(".marquee__track");
            mTrack.innerHTML += mTrack.innerHTML;
            mTrack.querySelectorAll("span").forEach((s, i) => i >= mTrack.children.length / 2 && s.setAttribute("aria-hidden", "true"));
        }

        // Horizontal pin
        const pinMq = window.matchMedia("(min-width: 768px)");
        let pinTrack = null, pinSticky = null, pinDist = 0, pinX = 0, pinOn = false, pinCards = [];
        if (pin) {
            pinTrack = pin.querySelector(".h-pin__track");
            pinSticky = pin.querySelector(".h-pin__sticky");
            pinCards = [...pinTrack.querySelectorAll(".v-card__media img")];
        }

        const layout = () => {
            if (mTrack) mHalf = mTrack.scrollWidth / 2;
            if (pin) {
                pinOn = pinMq.matches && !reduce;
                pin.classList.toggle("is-pinned", pinOn);
                if (pinOn) {
                    pinSticky.scrollLeft = 0;
                    const cs = getComputedStyle(pinSticky);
                    const inner = pinSticky.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
                    pinDist = Math.max(0, pinTrack.scrollWidth - inner);
                    pin.style.height = `${window.innerHeight + pinDist}px`;
                } else {
                    pin.style.height = "";
                    pinTrack.style.transform = "";
                }
            }
        };
        layout();
        window.addEventListener("resize", layout);
        window.addEventListener("load", layout); // images can change track width

        let lastY = window.scrollY, vel = 0, lastT = performance.now();

        const frame = (t) => {
            const dt = Math.min((t - lastT) / 16.67, 3);
            lastT = t;
            const y = window.scrollY;
            vel = lerp(vel, y - lastY, 0.2);
            lastY = y;
            const vh = window.innerHeight;

            if (bar) bar.classList.toggle("is-scrolled", y > 10);

            if (hero && !reduce) {
                const p = clamp(y / hero.offsetHeight, 0, 1);
                hero.style.setProperty("--p", p.toFixed(4));
            }

            if (mTrack && !reduce) {
                mX -= (1 + Math.abs(vel) * 0.35) * dt * (vel < -0.5 ? -1 : 1);
                if (mHalf) {
                    if (mX <= -mHalf) mX += mHalf;
                    if (mX > 0) mX -= mHalf;
                }
                mSkew = lerp(mSkew, clamp(vel * -0.25, -10, 10), 0.12);
                mTrack.style.transform = `translate3d(${mX.toFixed(2)}px,0,0) skewX(${mSkew.toFixed(2)}deg)`;
            }

            if (pinOn) {
                const r = pin.getBoundingClientRect();
                const p = pinDist ? clamp(-r.top / pinDist, 0, 1) : 0;
                pinX = lerp(pinX, -p * pinDist, 0.12);
                pinTrack.style.transform = `translate3d(${pinX.toFixed(2)}px,0,0)`;
                pin.style.setProperty("--hp", p.toFixed(4));
                const vw = window.innerWidth;
                pinCards.forEach((img) => {
                    const b = img.parentElement.getBoundingClientRect();
                    const shift = clamp(((b.left + b.width / 2) - vw / 2) / vw, -1, 1) * -6;
                    img.style.setProperty("--shift", shift.toFixed(2));
                });
            }

            if (!reduce) {
                document.querySelectorAll("[data-speed]").forEach((el) => {
                    const ref = el.parentElement.getBoundingClientRect();
                    if (ref.bottom < -vh || ref.top > vh * 2) return;
                    const off = (ref.top + ref.height / 2 - vh / 2) * parseFloat(el.dataset.speed);
                    el.style.transform = window.innerWidth >= 640 ? `translate3d(0,${off.toFixed(1)}px,0)` : "";
                });
            }

            if (previewTick) previewTick();
            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    };

    document.addEventListener("DOMContentLoaded", () => {
        initSplit();
        initReveal();
        initScroll();
    });
})();
