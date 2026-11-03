/*
 * Projects list + detail popup with an embedded video.
 *
 * To add or edit a project, change the PROJECTS array below. Fields:
 *   title       string   (required)
 *   year        string
 *   context     string   optional line under the title in the popup (course, team size…)
 *   thumb       string   path to the thumbnail image
 *   youtube     string   YouTube video id (the part after watch?v=); embedded in the popup
 *   summary     string   one/two sentence description shown in the list and popup
 *   highlights  [string] bullet points of what you did (popup)
 *   stack       [string] tech tags (first four in the list, all in the popup)
 *   links       [{ label, url }]  optional extra links (repo, paper…)
 */
const PROJECTS = [
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

    // Each row is a real link to YouTube, so it still works without JS or with ctrl/cmd-click.
    list.innerHTML = PROJECTS.map((p, i) => `
        <li class="project reveal">
            <a href="${p.youtube ? watchUrl(p) : "#!"}" target="_blank" rel="noopener" data-index="${i}" aria-haspopup="dialog">
                <span class="project__num">${pad(i + 1)}</span>
                <div class="project__thumb">
                    <img src="${esc(p.thumb)}" alt="${esc(p.title)} demo" loading="lazy" />
                    ${p.youtube ? `<span class="project__play" aria-hidden="true"><i class="fas fa-play"></i></span>` : ""}
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
                ...(p.links || []),
            ];
            return `
            ${p.youtube ? `
            <div class="dlg-video">
                <iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(p.youtube)}?rel=0&modestbranding=1&playsinline=1"
                        title="${esc(p.title)} video" loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
            </div>` : ""}
            <div class="dlg-hero">
                <div class="proj-head">
                    <h3>${esc(p.title)}</h3>
                    <div class="dates">${esc(p.year)}${p.context ? ` · ${esc(p.context)}` : ""}</div>
                </div>
                <p class="exp-summary">${esc(p.summary)}</p>
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
