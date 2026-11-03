/*
 * Career timeline data + rendering.
 *
 * To add or edit experience, change the CAREER array below. Fields:
 *   company     string   (required)
 *   title       string   role shown on the card
 *   dates       string   shown on the card under the title
 *   when        string   short range shown beside the timeline node
 *   logo        string   optional path to logo image (falls back to the company's initial)
 *   logoWide    boolean  optional; use a wider tile for very wide logos
 *   meta        string   optional line shown in the popup (e.g. "via Manpower")
 *   summary     string   one-liner revealed on hover and shown in the popup
 *   highlights  [string] bullet points (first two preview on hover, all in the popup)
 *   stack       [string] tech tags (popup)
 *   links       [{ label, url }]  optional links in the popup (demos, articles, repos…)
 */
const CAREER = [
    {
        company: "Northrop Grumman",
        title: "Principal Software Engineer",
        dates: "Oct 2019 – Present",
        when: "2019 — Present",
        logo: "res/img/career/ng-logo.png",
        summary: "DevOps, CI/CD, and internal tool development that keep multiple engineering teams shipping.",
        highlights: [
            "Accelerate product readiness and reduce integration risk for 5 teams with CI/CD/CT pipelines and security scans in Jenkins, TeamCity, and Bamboo, using IaC (Ansible, Terraform, Packer) and Jenkins SaaS cloud agents.",
            "Lead operations and customer liaison for critical internal tooling and software suites, keeping them automated and serviceable for multiple engineering teams (Atlassian administration, artifact repositories, custom CI/CD).",
            "Lead developer of the Nexus migration, authoring the Python scripts and libraries that moved all images and artifacts and tracked migration status across Artifactory and Nexus (including npm).",
            "Created capacity-monitoring and health-check tools (C#, Selenium, Jaspersoft) that flag Atlassian instances nearing limits and deviations from naming, workflow, and administration standards.",
            "Maintain internal automation tooling in Python and Flask, with C#/.NET installers and Docker deployment; deliver WPF/WinForms apps for skip-level leaders and managers.",
            "Headed automated Jira reporting that compiles story points, summaries, labels, and other issue data into a Word document of each project's scope and completed work.",
            "Developed automated contract code-count reports with Grafana and AWS-loaded Postgres entity-relationship models.",
            "Spearheaded modernization of a legacy automated pilot-training test suite to current SIL testing standards, integrating it with a closed-loop aircraft simulator.",
        ],
        stack: ["Jenkins", "TeamCity", "Bamboo", "Ansible", "Terraform", "Packer", "Python", "Flask", "C#", ".NET", "WPF", "Winforms", "Docker", "Selenium", "Nexus", "Artifactory", "Grafana", "PostgreSQL", "AWS", "Jaspersoft", "Tableau"],
    },
    {
        company: "Drivven.ai",
        title: "Senior Software Engineer",
        dates: "Jan – Mar 2026",
        when: "2026",
        summary: "Full-stack features for an ad customer platform.",
        highlights: [
            "Implemented full-stack features for an ad customer platform displaying margin and financial report metrics with Django.",
        ],
        stack: ["Full-stack", "Django", "Python"],
    },
    {
        company: "BAE Systems",
        title: "Software Engineer",
        dates: "Aug 2018 – Oct 2019",
        when: "2018 — 2019",
        logo: "res/img/career/bae-logo.png",
        logoWide: true,
        summary: "Networked systems and security software in C++ and C#.",
        highlights: [
            "Co-led the architectural migration of an iSCSI server from C# to C++ using multithreading and networking.",
            "Developed a Windows packet-comparison utility (C#/.NET) and a C++ port-security app with PnP drivers.",
            "Designed the front-end UI/UX for the hardware and digital circuit design of an armament tester, per armament specifications.",
        ],
        stack: ["C++", "C#", ".NET", "iSCSI", "Multithreading", "Networking", "PnP drivers", "Digital Circuit Design"],
    },
    {
        company: "Qualcomm",
        title: "Software Engineer",
        dates: "Mar – Aug 2018",
        when: "2018",
        logo: "res/img/career/qualcomm-logo.png",
        meta: "via Manpower",
        summary: "Camera autofocus and exposure tuning software for hardware calibration teams.",
        highlights: [
            "Engineered a C#/.NET desktop suite for camera Auto Focus and Auto Exposure Control tuning, pairing a backend that organizes tuning data with reports and visualizations for hardware calibration teams.",
            "Developed a lens-movement convergence simulation that maps tuning metrics and charts targets against raw data, with an integrated XML editor for faster tuning cycles.",
        ],
        stack: ["C#", ".NET", "XML", "Data visualization", "3A Camera", "WinForms", "WPF"],
    },
    {
        company: "Google",
        title: "Camera Test Engineer",
        dates: "Summers 2016 & 2017",
        when: "2016 — 2017",
        logo: "res/img/career/google-logo.png",
        meta: "via Adecco",
        summary: "Camera color-accuracy tooling and image-quality testing.",
        highlights: [
            "Created a Python color-metric analysis app (OpenCV, wxPython) that auto-detects Macbeth charts for camera color accuracy.",
            "Wrote a color-metric tuning parser in C with an interface to directly adjust tuning parameters the codebase lacked.",
            "Conducted 3A KPI image-quality, LED, video (EIS), and power tests, using simulation and tuning software to identify camera bugs, including hard-artifact scenes.",
        ],
        stack: ["Python", "OpenCV", "wxPython", "C" ,"3A Camerea Testing"],
    },
];

(function () {
    const list = document.getElementById("career-list");
    if (!list) return;
    const esc = escHtml;

    const logo = (job) => job.logo
        ? `<div class="logo-tile${job.logoWide ? " logo-tile--wide" : ""}"><img src="${esc(job.logo)}" alt="${esc(job.company)} logo" loading="lazy" /></div>`
        : `<div class="logo-tile logo-tile--text" aria-hidden="true">${esc(job.company.charAt(0))}</div>`;

    const head = (job, withMeta) => `
        <div class="exp-head">
            ${logo(job)}
            <div>
                <h3>${esc(job.company)}</h3>
                <div class="role">${esc(job.title)}${withMeta && job.meta ? ` · ${esc(job.meta)}` : ""}</div>
                <div class="dates">${esc(job.dates)}</div>
            </div>
        </div>`;

    // ---- Timeline cards: company, title, dates; details revealed on hover ----
    list.innerHTML = CAREER.map((job, i) => `
        <li class="tl-item reveal">
            <span class="tl-node" aria-hidden="true"></span>
            <div class="tl-when">${esc(job.when)}</div>
            <article class="exp-card" tabindex="0" role="button" data-index="${i}"
                     aria-haspopup="dialog" aria-label="${esc(job.company)}, ${esc(job.title)}: view details">
                <i class="fas fa-arrow-right exp-arrow" aria-hidden="true"></i>
                ${head(job, false)}
                <div class="exp-more"><div><div class="exp-more__inner">
                    <p class="exp-summary">${esc(job.summary)}</p>
                    <ul>${job.highlights.slice(0, 2).map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
                </div></div></div>
            </article>
        </li>`).join("");

    // ---- Detail dialog ----
    const dlg = createDetailDialog({
        dialog: document.getElementById("exp-dialog"),
        count: CAREER.length,
        label: (i) => CAREER[i].company,
        render: (i) => {
            const job = CAREER[i];
            return `
            <div class="dlg-hero">${head(job, true)}<p class="exp-summary">${esc(job.summary)}</p></div>
            <div class="dlg-body">
                <section>
                    <h4>Highlights</h4>
                    <ul class="dlg-highlights">${job.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
                </section>
                ${job.stack && job.stack.length ? `
                <section>
                    <h4>Stack</h4>
                    <div class="tags">${job.stack.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
                </section>` : ""}
                ${job.links && job.links.length ? `
                <section>
                    <h4>Links</h4>
                    <div class="dlg-links">${job.links.map((l) =>
                        `<a class="text-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} <i class="fas fa-external-link-alt"></i></a>`
                    ).join("")}</div>
                </section>` : ""}
            </div>`;
        },
    });
    if (!dlg) return;

    list.addEventListener("click", (e) => {
        const card = e.target.closest(".exp-card");
        if (card) dlg.open(Number(card.dataset.index), card);
    });
    list.addEventListener("keydown", (e) => {
        const card = e.target.closest(".exp-card");
        if (card && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            dlg.open(Number(card.dataset.index), card);
        }
    });
})();
