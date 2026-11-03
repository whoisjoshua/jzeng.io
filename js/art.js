/*
 * Art page data + rendering.
 *
 * Put images in res/img/art/ and add one entry per piece, newest first:
 *   { src: "res/img/art/piece.jpg", title: "Title", year: "2025", medium: "Procreate" }
 * Use ~1600px-wide JPG/WebP. Any aspect ratio works: the gallery is a masonry layout.
 *
 * While ART is empty, the page shows placeholder frames so the layout and motion can be previewed.
 */
const ART = [];

(function () {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;
    const esc = escHtml;

    const placeholders = [
        ["4/5", "135deg, #1d3b38, #7fc8bf"], ["1/1", "160deg, #2a1f3d, #c978ff"], ["3/4", "200deg, #3d2a1f, #ffaa78"],
        ["4/3", "120deg, #1f2a3d, #78a6ff"], ["2/3", "150deg, #1d3b38, #c978ff"], ["1/1", "190deg, #3d1f2a, #ff7894"],
        ["3/4", "140deg, #262b1f, #c8d67f"], ["4/5", "170deg, #1f303d, #7fc8bf"], ["5/4", "210deg, #2a1f3d, #ffaa78"],
    ];
    const pieces = ART.length
        ? ART.map((a) => ({ ...a, meta: [a.medium, a.year].filter(Boolean).join(" · ") }))
        : placeholders.map(([ratio, g], i) => ({ ratio, bg: `linear-gradient(${g})`, title: `Piece ${String(i + 1).padStart(2, "0")}`, meta: "Coming soon" }));

    const modalItems = pieces.map((p) => ({ type: "image", src: p.src, alt: p.title, title: p.title, meta: p.meta, ratio: p.ratio, bg: p.bg }));
    const speeds = [0, 0.14, 0.06]; // column parallax: columns 2 and 3 lag behind the scroll at different rates

    const tile = (p, i) => `
        <button class="art-tile" type="button" data-i="${i}" aria-label="View ${esc(p.title)}">
            <div class="art-tile__media clip-reveal">
                ${p.src
                    ? `<img src="${esc(p.src)}" alt="${esc(p.title)}" loading="lazy" />`
                    : `<div class="art-tile__placeholder" style="aspect-ratio:${p.ratio};background:${p.bg}">Artwork coming soon</div>`}
            </div>
            <div class="art-tile__caption"><span>${esc(p.title)}</span><span>${esc(p.meta)}</span></div>
        </button>`;

    const colsFor = () => (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    let rendered = 0;
    const render = () => {
        const n = colsFor();
        if (n === rendered) return;
        rendered = n;
        const cols = Array.from({ length: n }, () => []);
        pieces.forEach((p, i) => cols[i % n].push(tile(p, i)));
        gallery.innerHTML = cols.map((c, i) =>
            `<div class="gallery__col" data-speed="${n > 1 ? speeds[i] : 0}">${c.join("")}</div>`
        ).join("");
        // Re-rendered tiles need revealing again (hobbies.js observes only the initial ones).
        if (window.__artRendered) gallery.querySelectorAll(".clip-reveal").forEach((el) => el.classList.add("is-in"));
        window.__artRendered = true;
    };
    render();
    window.addEventListener("resize", render);

    gallery.addEventListener("click", (e) => {
        const t = e.target.closest(".art-tile");
        if (t) HobbyModal.open(modalItems, Number(t.dataset.i), t);
    });
})();
