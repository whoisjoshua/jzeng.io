/*
 * Projects list + detail popup with an embedded video.
 *
 * To add or edit a project, change the PROJECTS array below. Fields:
 *   title       string   (required)
 *   year        string
 *   context     string   optional line under the title in the popup (course, team size…)
 *   thumb       string   path to the thumbnail image
 *   youtube     string   YouTube video id (the part after watch?v=); embedded in the popup
 *   site        string   live URL; without a youtube id, the popup shows the thumbnail as a
 *                        clickable preview that opens this URL
 *   summary     string   one/two sentence description shown in the list and popup
 *   highlights  [string] bullet points of what you did (popup)
 *   stack       [string] tech tags (first four in the list, all in the popup)
 *   links       [{ label, url }]  optional extra links (repo, paper…)
 *   assist      string   optional note in the popup about tools that helped build it
 */
const PROJECTS = [
    {
        title: "Culinary Manifesto",
        year: "2026",
        context: "Personal project · static web app",
        thumb: "res/img/projects/culinary-manifesto.jpg",
        site: "https://cook.jzeng.io",
        summary: "My personal cookbook: recipes with tap-to-check ingredients and steps, a scaler and unit converter, kitchen timers, and a list of dishes I'm manifesting next.",
        highlights: [
            "Built a fully static site (plain HTML, CSS and JavaScript, no build step) with a hash router and page transitions, hosted on GitHub Pages.",
            "Made ingredients and steps tappable checklists that save progress per recipe, with a cook mode that follows the current step and keeps the screen awake.",
            "Wrote a quantity parser that scales amounts as kitchen fractions (¾ cup at ½× becomes 6 tbsp) and converts between metric, US and °F/°C.",
            "Turned times in steps into one-tap kitchen timers with a chime, and added tap-to-translate pinyin and English for Chinese terms and herbs.",
            "Designed light, dark and a warm “night” theme, a phone layout with a bottom tab bar, and offline support as an installable web app.",
        ],
        stack: ["JavaScript", "HTML/CSS", "PWA", "GitHub Pages"],
        assist: "Built with help from Claude (Anthropic) as an AI coding assistant.",
        links: [{ label: "GitHub repo", url: "https://github.com/whoisjoshua/culinary-manifesto" }],
    },
    {
        title: "Ztock",
        year: "2026",
        context: "Personal project · static web app",
        thumb: "res/img/projects/ztock.jpg",
        site: "https://ztock.jzeng.io",
        summary: "A stock dashboard for learning the market that grades 16 technical and machine-learning techniques A–F on real data they never trained on.",
        highlights: [
            "Built a fully static dashboard (plain HTML, CSS and ES modules, no backend or build step) hosted on GitHub Pages.",
            "Implemented 16 techniques from scratch, including SMA/EMA crossovers, RSI, MACD, Bollinger Bands, OBV, logistic regression, k-nearest neighbors, a neural network (MLP), k-means regimes and an ensemble vote.",
            "Backtested every technique on held-out data with hit rate vs. baseline, a z-score luck check, strategy vs. buy & hold, Sharpe ratio and an A–F grade.",
            "Blended 11 factors (valuation, growth, momentum, earnings surprises, analysts, news sentiment and the models that beat their baseline) into a bull/bear confidence score.",
            "Streamed live prices over Finnhub's WebSocket and rate-limited and cached REST calls to stay within free API tiers.",
        ],
        stack: ["JavaScript", "Machine learning", "Chart.js", "Finnhub API", "GitHub Pages"],
        assist: "Built with help from Claude (Anthropic) as an AI coding assistant.",
    },
    {
        title: "Relicwise",
        year: "2026",
        context: "Personal project · static web app",
        thumb: "res/img/projects/relicwise.jpg",
        site: "https://relicwise.jzeng.io",
        summary: "A relic analyzer for Honkai: Star Rail that grades every relic for all 93 characters, predicts upgrade odds and scans relics straight off your screen.",
        highlights: [
            "Built a fully static site (plain HTML, CSS and ES modules, no build step) backed by a small Cloudflare Worker proxy for the Enka.Network and HoYoverse APIs.",
            "Scored relics in max-roll units from their exact substat rolls, then ranked each piece across the whole roster to find its best owner.",
            "Simulated 3,000 drops per main stat for an “X% of drops” percentile, and calculated exact multinomial upgrade odds to give unlevelled relics a Keeper / Level it / Gamble / Fodder verdict.",
            "Wrote an in-browser OCR scanner (Tesseract.js + WebAssembly) that works at any resolution and checks every number against the game's roll table to repair OCR misreads.",
            "Measured warp luck as a percentile against 4,000 simulated accounts, and calculated exact speed breakpoints from action-value math.",
            "Automated a weekly GitHub Action that rebuilds game and build data and opens a pull request for review.",
        ],
        stack: ["JavaScript", "Tesseract.js", "Cloudflare Workers", "Simulation", "GitHub Actions"],
        assist: "Built with help from Claude (Anthropic) as an AI coding assistant.",
        links: [{ label: "GitHub repo", url: "https://github.com/whoisjoshua/relicwise" }],
    },
    {
        title: "ReMemVR",
        year: "2025",
        context: "CS 6795 Cognitive Science · Georgia Tech",
        thumb: "res/img/projects/rememvr.jpg",
        youtube: "6Glv_WfjPRE",
        summary: "A Unity VR memory palace for a study testing whether the method of loci in VR beats memorizing a text list.",
        highlights: [
            "Designed and built ReMemVR, a Unity app that randomly assigns participants to a VR or text condition to memorize the same 11 objects in 60 seconds.",
            "Built the VR condition as an armory where objects sit in spatial locations and are highlighted with glow cues.",
            "Measured recall, precision/recall/F1, NASA-TLX workload, Likert ratings, and participants' recall strategies.",
            "VR participants recalled 8.9 vs 6.3 objects (F1 0.89 vs 0.70) with fewer false recalls, and reported lower mental demand, effort, and frustration.",
            "VR participants naturally used “route” and “story” strategies, while text participants relied on rote rehearsal.",
        ],
        stack: ["Unity", "C#", "VR", "User study", "NASA-TLX", "Data analysis"],
    },
    {
        title: "Bach to Basics",
        year: "2024",
        context: "Team of 3 · two-week prototype",
        thumb: "res/img/projects/bach-to-basics.jpg",
        youtube: "aqDngu3gyLE",
        summary: "A haptic glove that teaches piano by detecting key presses, identifying notes from audio, and checking them against the song.",
        highlights: [
            "Prototyped a haptic piano-teaching glove with two teammates in two weeks.",
            "Wired force sensors on the glove to detect key presses.",
            "Wrote a Python script that identifies the played note from audio.",
            "Connected a web app that plays each note on a virtual piano and checks it against the song.",
        ],
        stack: ["Arduino", "Python", "Audio processing", "Haptics", "Web app"],
        links: [{ label: "GitHub repo", url: "https://github.com/whoisjoshua/bach2basics" }],
    },
    {
        title: "Grocery Express",
        year: "2021",
        thumb: "res/img/projects/grocery-express.jpg",
        youtube: "fUQg1FVqT68",
        summary: "A Java client-server grocery store app with separate customer and admin experiences, backed by DynamoDB.",
        highlights: [
            "Built a Java client-server app with separate user and admin experiences.",
            "Used multithreading on the server to handle concurrent clients.",
            "Implemented full CRUD operations with auditing.",
            "Designed a scalable entity-relationship model on Amazon DynamoDB.",
        ],
        stack: ["Java", "DynamoDB", "Multithreading", "AWS"],
    },
];

(function () {
    const list = document.getElementById("project-list");
    if (!list) return;
    const esc = escHtml;
    const watchUrl = (p) => `https://www.youtube.com/watch?v=${encodeURIComponent(p.youtube)}`;
    const pad = (n) => String(n).padStart(2, "0");

    // Each row is a real link (YouTube or the live site), so it still works without JS or with ctrl/cmd-click.
    list.innerHTML = PROJECTS.map((p, i) => `
        <li class="project reveal">
            <a href="${esc(p.youtube ? watchUrl(p) : p.site || "#!")}" target="_blank" rel="noopener" data-index="${i}" aria-haspopup="dialog">
                <span class="project__num">${pad(i + 1)}</span>
                <div class="project__thumb">
                    <img src="${esc(p.thumb)}" alt="${esc(p.title)} demo" loading="lazy" />
                    ${p.youtube ? `<span class="project__play" aria-hidden="true"><i class="fas fa-play"></i></span>`
                        : p.site ? `<span class="project__play" aria-hidden="true"><i class="fas fa-external-link-alt"></i></span>` : ""}
                </div>
                <h3 class="project__title">${esc(p.title)}</h3>
                <div class="project__meta">${esc(p.year)} <i class="fas fa-arrow-right"></i></div>
                <p class="project__desc">${esc(p.summary)}</p>
                <div class="tags">${p.stack.slice(0, 4).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
            </a>
        </li>`).join("");

    const dlg = createDetailDialog({
        dialog: document.getElementById("proj-dialog"),
        count: PROJECTS.length,
        label: (i) => PROJECTS[i].title,
        render: (i) => {
            const p = PROJECTS[i];
            const links = [
                ...(p.youtube ? [{ label: "Watch on YouTube", url: watchUrl(p) }] : []),
                ...(p.site ? [{ label: "Open live site", url: p.site }] : []),
                ...(p.links || []),
            ];
            return `
            ${p.youtube ? `
            <div class="dlg-video">
                <iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(p.youtube)}?rel=0&modestbranding=1&playsinline=1"
                        title="${esc(p.title)} video" loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
            </div>` : p.site ? `
            <a class="dlg-video dlg-preview" href="${esc(p.site)}" target="_blank" rel="noopener">
                <img src="${esc(p.thumb)}" alt="Screenshot of ${esc(p.title)}" />
                <span class="dlg-preview__cta">Open ${esc(p.site.replace(/^https?:\/\//, ""))} <i class="fas fa-external-link-alt"></i></span>
            </a>` : ""}
            <div class="dlg-hero">
                <div class="proj-head">
                    <h3>${esc(p.title)}</h3>
                    <div class="dates">${esc(p.year)}${p.context ? ` · ${esc(p.context)}` : ""}</div>
                </div>
                <p class="exp-summary">${esc(p.summary)}</p>
                ${p.assist ? `<p class="dlg-assist"><i class="fas fa-robot" aria-hidden="true"></i> ${esc(p.assist)}</p>` : ""}
            </div>
            <div class="dlg-body">
                <section>
                    <h4>What I did</h4>
                    <ul class="dlg-highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
                </section>
                <section>
                    <h4>Stack</h4>
                    <div class="tags">${p.stack.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
                </section>
                ${links.length ? `
                <section>
                    <h4>Links</h4>
                    <div class="dlg-links">${links.map((l) =>
                        `<a class="text-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} <i class="fas fa-external-link-alt"></i></a>`
                    ).join("")}</div>
                </section>` : ""}
            </div>`;
        },
    });
    if (!dlg) return;

    list.addEventListener("click", (e) => {
        const link = e.target.closest("a[data-index]");
        if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        dlg.open(Number(link.dataset.index), link);
    });
})();
