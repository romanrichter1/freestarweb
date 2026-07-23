(function () {
    const header = document.querySelector("[data-site-header]");
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector("[data-nav-menu]");

    function syncHeader() {
        if (!header) return;
        const hasImageHero = Boolean(document.querySelector(".hero"));
        header.classList.toggle("is-scrolled", !hasImageHero || window.scrollY > 8);
    }

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.setAttribute("aria-label", isOpen ? "Zavřít menu" : "Otevřít menu");
            document.body.classList.toggle("nav-open", isOpen);
        });

        navMenu.addEventListener("click", (event) => {
            const link = event.target.closest("a");
            if (!link) return;
            navMenu.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Otevřít menu");
            document.body.classList.remove("nav-open");
        });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }

    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    const counters = document.querySelectorAll("[data-count-to]");

    function animateCounter(counter) {
        const target = Number(counter.dataset.countTo || 0);
        const suffix = counter.dataset.countSuffix || "";
        const duration = 2000;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            counter.textContent = `${Math.round(target * eased)}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    if (counters.length) {
        if ("IntersectionObserver" in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.45 });

            counters.forEach((counter) => counterObserver.observe(counter));
        } else {
            counters.forEach((counter) => {
                counter.textContent = `${Number(counter.dataset.countTo || 0)}${counter.dataset.countSuffix || ""}`;
            });
        }
    }

    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    if (form && status) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                status.textContent = "Zkontrolujte prosím povinná pole.";
                return;
            }

            const data = new FormData(form);
            const name = String(data.get("name") || "").trim();
            const email = String(data.get("email") || "").trim();
            const phone = String(data.get("phone") || "").trim();
            const message = String(data.get("message") || "").trim();
            const lines = [
                `Jméno: ${name}`,
                `E-mail: ${email}`,
                phone ? `Telefon: ${phone}` : "",
                "",
                message
            ].filter(Boolean);

            const subject = encodeURIComponent(`Dotaz z webu Autocamp Free Star - ${name}`);
            const body = encodeURIComponent(lines.join("\n"));
            status.textContent = "Otevírám e-mailového klienta s připravenou zprávou.";
            window.location.href = `mailto:autocamp@freestar.cz?subject=${subject}&body=${body}`;
        });
    }
})();
