/*
 * Music page data + rendering.
 *
 * VIDEOS is newest first, pulled from youtube.com/@ThatVibrato. To add a cover, add a row:
 *   [ youtubeId, "Title as on YouTube | Descriptor", featured? ]
 * The part after " | " becomes the tag, and the instrument filter is inferred from the title
 * (mentions of cello and/or guitar). Featured rows appear in the horizontal gallery.
 */
const VIDEOS = [
    ["TWGm4JkTrkA", "I Surrender All"],
    ["Aro_sBRFGpY", "Illenium - Fractures | Fingerstyle Cover", true],
    ["EQZc4qvAiSk", "たかやん (Takayan) - 勝たんしか症候群 (Love You Syndrome) | Fingerstyle Cover", true],
    ["Nw8Obdb_S18", "Your Grace is Sufficient | Fingerstyle Guitar Cover"],
    ["GWCL2WvwMEE", "God Rest Ye Merry Gentlemen | Cello Cover", true],
    ["O4bpL-Bjjco", "Eric Clapton - Wonderful Tonight | Fingerstyle Harmonics", true],
    ["Nd7pMc_gHIc", "Yorushika (ヨルシカ) - Bomber (爆弾魔) | Guitar Cover"],
    ["8bY2qq_8BvM", "Vineyard - Your Beloved | Guitar Cello Cover"],
    ["gbLvezFuuHw", "Blessed Be Your Name | Guitar Cello Cover"],
    ["IzxZ16AECHw", "Ariana Grande - Positions (Arr. Tim Henson) | Electric Guitar Cover", true],
    ["RNJ0W692Yyg", "Ed Sheeran - Shivers | Cello Cover"],
    ["zwy5TLp_86I", "Tower of Flower (Hana no Tou 花の塔) | Guitar Cover"],
    ["-eZ6iptxaXg", "ヨルシカ - 老人と海 | Cello & Guitar Cover", true],
    ["Abm-jWyvgTY", "Suzume OST すずめの戸締まり | Guitar & Cello Cover", true],
    ["M3VDz18FtH8", "Vicetone - Nevada | Electric Cello + Guitar Cover", true],
    ["2H67gQ2_S5M", "IVE 아이브 - After Like | Electric Cello Cover"],
    ["gcWgV2h6v7E", "Hailee Steinfeld - Let Me Go | Electric Cello Cover"],
    ["nfGP5ZKarSg", "Unprocessed - Real (Tim Henson) | Electric Guitar Cover"],
    ["TGpL6lnsSA0", "Porter Robinson - Sad Machine | Guitar Fingerstyle Freestyle"],
    ["L1Vn9vnLeq8", "Illenium - In My Mind | Guitar Fingerstyle Freestyle"],
    ["zmuVhB76lC8", "Maroon 5 - Beautiful Mistakes | Guitar Fingerstyle Cover"],
    ["mmt8m2k5_D0", "Lost Umbrella | Overdrive Electric Guitar Cover"],
    ["CkbR6gp8wdE", "IU - Celebrity | Guitar Fingerstyle Freestyle"],
    ["i8GLdHQxcik", "Only My Railgun (Short Cover) | Electric Guitar"],
    ["1uhpKkbuh4o", "Zen Zen Zense | Electric Guitar Cover"],
    ["iQzYqu0CmDw", "24kGoldn - Mood | Electric Guitar Cover"],
    ["KDWwNL1vCl0", "Porter Robinson & Madeon - Shelter | Fingerstyle Guitar Cover"],
];

(function () {
    const esc = escHtml;
    const kindOf = (title) => {
        const c = /cello/i.test(title), g = /guitar|fingerstyle/i.test(title);
        return c && g ? "Cello + Guitar" : c ? "Cello" : g ? "Guitar" : "Other";
    };
    const items = VIDEOS.map(([id, full, featured]) => {
        const [name, desc] = full.split(" | ");
        return { id, name, desc: desc || "Cover", kind: kindOf(full), featured: !!featured };
    });
    const thumb = (id, size) => `https://i.ytimg.com/vi/${id}/${size}.jpg`;
    // maxresdefault doesn't exist for every video. YouTube then serves a 120px grey placeholder
    // (sometimes with an error status), so fall back to the always-present hq version either way.
    const fallback = (id) => {
        const hq = thumb(id, "hqdefault");
        return `onload="if(this.naturalWidth<=120)this.src='${hq}'" onerror="this.onerror=null;this.src='${hq}'"`;
    };
    const pad = (n) => String(n).padStart(2, "0");
    const modalItems = (list) => list.map((v) => ({ type: "video", youtube: v.id, title: v.name, meta: `${v.kind} · ${v.desc}` }));

    // ---- Counts in the hero ----
    const countEl = document.getElementById("music-count");
    if (countEl) countEl.textContent = `${items.length} covers`;

    // ---- Featured horizontal gallery ----
    const featured = items.filter((v) => v.featured);
    const track = document.getElementById("featured-track");
    if (track) {
        track.innerHTML = featured.map((v, i) => `
            <button class="v-card" type="button" data-i="${i}" aria-label="Play ${esc(v.name)}">
                <div class="v-card__media clip-reveal">
                    <img src="${thumb(v.id, "maxresdefault")}" ${fallback(v.id)} alt="" loading="lazy" />
                    <div class="v-card__play"><span>Play</span></div>
                </div>
                <div class="v-card__info">
                    <span class="v-card__num">${pad(i + 1)}</span>
                    <h3 class="v-card__title">${esc(v.name)}</h3>
                    <span class="v-card__tag">${esc(v.kind)} · ${esc(v.desc)}</span>
                </div>
            </button>`).join("");
        const fItems = modalItems(featured);
        track.addEventListener("click", (e) => {
            const card = e.target.closest(".v-card");
            if (card) HobbyModal.open(fItems, Number(card.dataset.i), card);
        });
    }

    // ---- Archive list + filters ----
    const list = document.getElementById("archive");
    const filters = document.getElementById("filters");
    if (!list) return;
    list.innerHTML = items.map((v, i) => `
        <li data-kind="${esc(v.kind)}">
            <button type="button" data-i="${i}" data-thumb="${thumb(v.id, "mqdefault")}">
                <span class="archive__num">${pad(i + 1)}</span>
                <span class="archive__title">${esc(v.name)}</span>
                <span class="archive__tag">${esc(v.kind)}</span>
            </button>
        </li>`).join("");

    let visible = items;
    list.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-i]");
        if (!btn) return;
        const v = items[Number(btn.dataset.i)];
        HobbyModal.open(modalItems(visible), visible.indexOf(v), btn);
    });

    if (filters) {
        const kinds = ["All", "Cello", "Guitar", "Cello + Guitar"];
        filters.innerHTML = kinds.map((k) => {
            const n = k === "All" ? items.length : items.filter((v) => v.kind === k).length;
            return `<button type="button" data-kind="${k}" aria-pressed="${k === "All"}">${k} <span aria-hidden="true">${n}</span></button>`;
        }).join("");
        filters.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-kind]");
            if (!btn) return;
            const k = btn.dataset.kind;
            filters.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
            visible = k === "All" ? items : items.filter((v) => v.kind === k);
            list.querySelectorAll("li").forEach((li) => { li.hidden = k !== "All" && li.dataset.kind !== k; });
        });
    }
})();
