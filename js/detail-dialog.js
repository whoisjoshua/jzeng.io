/*
 * Shared detail popup used by Career and Projects.
 *
 *   const dlg = createDetailDialog({
 *       dialog,                  // <dialog class="exp-dialog"> with .exp-dialog__panel, .dlg-content, .dlg-nav
 *       count,                   // number of items
 *       render: (i) => html,     // markup for item i
 *       label:  (i) => string,   // accessible name + prev/next button text
 *   });
 *   dlg.open(index, openerElement);
 *
 * Content is cleared after the dialog closes, so embedded videos stop playing.
 */
function createDetailDialog({ dialog, count, render, label }) {
    if (!dialog || typeof dialog.showModal !== "function") return null;

    const panel = dialog.querySelector(".exp-dialog__panel");
    const content = dialog.querySelector(".dlg-content");
    const prevBtn = dialog.querySelector("[data-dir='-1']");
    const nextBtn = dialog.querySelector("[data-dir='1']");
    const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = 0;
    let opener = null;
    let closing = false;
    let swapTimer = null;

    const navText = (btn, i, fallback) => {
        if (!btn) return;
        const ok = i >= 0 && i < count;
        btn.disabled = !ok;
        btn.querySelector("span").textContent = ok ? label(i) : fallback;
    };

    const fill = (i) => {
        current = i;
        content.innerHTML = render(i);
        navText(prevBtn, i - 1, prevBtn ? prevBtn.dataset.fallback || "Previous" : "");
        navText(nextBtn, i + 1, nextBtn ? nextBtn.dataset.fallback || "Next" : "");
        dialog.setAttribute("aria-label", label(i));
    };

    const open = (i, from) => {
        opener = from || null;
        closing = false;
        fill(i);
        dialog.showModal();
        panel.scrollTop = 0;
        requestAnimationFrame(() => dialog.classList.add("is-open"));
    };

    const close = () => {
        if (!dialog.open || closing) return;
        closing = true;
        clearTimeout(swapTimer);
        dialog.classList.remove("is-open");
        setTimeout(() => {
            dialog.close();
            content.innerHTML = "";
            content.classList.remove("is-swapping");
            closing = false;
            if (opener) opener.focus({ preventScroll: true });
        }, reduce() ? 0 : 260);
    };

    const step = (dir) => {
        const target = current + dir;
        if (target < 0 || target >= count || closing) return;
        content.classList.add("is-swapping");
        clearTimeout(swapTimer);
        swapTimer = setTimeout(() => {
            fill(target);
            panel.scrollTop = 0;
            content.classList.remove("is-swapping");
        }, 180);
    };

    // One delegated handler survives Font Awesome swapping <i> icons for <svg>.
    dialog.addEventListener("click", (e) => {
        if (e.target === dialog || e.target.closest(".dlg-close")) {
            close();
            return;
        }
        const nav = e.target.closest(".dlg-nav button");
        if (nav && !nav.disabled) step(Number(nav.dataset.dir));
    });
    dialog.addEventListener("cancel", (e) => {
        e.preventDefault(); // animate instead of closing instantly on Esc
        close();
    });
    dialog.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
    });

    return { open, close };
}

/* HTML-escape helper shared by the renderers. */
function escHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
