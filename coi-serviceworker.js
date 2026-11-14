/*! coi-serviceworker v0.1.7 | MIT License | https://github.com */
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
    self.addEventListener("fetch", e => {
        if (e.request.cache === "only-if-cached" && e.request.mode !== "same-origin") return;
        e.respondWith(
            fetch(e.request).then(r => {
                if (r.status === 0) return r;
                const h = new Headers(r.headers);
                h.set("Cross-Origin-Embedder-Policy", "require-corp");
                h.set("Cross-Origin-Opener-Policy", "same-origin");
                return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
            }).catch(e => console.error(e))
        );
    });
} else {
    (() => {
        const s = document.currentScript;
        if (s && s.hasAttribute("data-coi-loaded")) return;
        if (window.crossOriginIsolated !== false) return;
        navigator.serviceWorker.register(window.location.pathname + "coi-serviceworker.js" + window.location.search)
            .then(reg => {
                reg.addEventListener("updatefound", () => {
                    reg.installing.addEventListener("statechange", function () {
                        if (this.state === "installed") window.location.reload();
                    });
                });
                if (reg.active && !navigator.serviceWorker.controller) window.location.reload();
            });
    })();
}
