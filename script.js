
// ==================================
// BERNHARDT & PARTNER
// Website Animations
// ==================================

// =========================================
// BERNHARDT & PARTNER — RESOURCE OPTIMIZATION
// =========================================

document.querySelectorAll("img").forEach((image, index) => {
    if (!image.hasAttribute("loading")) {
        image.loading = index < 2 ? "eager" : "lazy";
    }

    if (!image.hasAttribute("decoding")) {
        image.decoding = "async";
    }

    if (index >= 2 && !image.hasAttribute("fetchpriority")) {
        image.fetchPriority = "low";
    }
});

const heroVideos = document.querySelectorAll(".hero video, .service-hero video");

if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const video = entry.target;

                if (entry.isIntersecting) {
                    const playPromise = video.play();
                    if (playPromise) {
                        playPromise.catch(() => {});
                    }
                } else {
                    video.pause();
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "100px"
        }
    );

    heroVideos.forEach((video) => {
        video.preload = "metadata";
        videoObserver.observe(video);
    });
}

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
        let closeTimer;
        const menu = dropdown.querySelector(".mega-menu");

        dropdown.addEventListener("mouseenter", () => {
            window.clearTimeout(closeTimer);
            dropdown.open = true;
        });

        dropdown.addEventListener("mouseleave", () => {
            closeTimer = window.setTimeout(() => {
                dropdown.open = false;
            }, 300);
        });

        dropdown.addEventListener("toggle", () => {
            if (!dropdown.open && dropdown.matches(":hover")) {
                dropdown.open = true;
            }
        });

        if (menu) {
            menu.addEventListener("mouseenter", () => {
                window.clearTimeout(closeTimer);
            });
        }
    });
}

const animatedElements = document.querySelectorAll(
    ".intro, .why-us, .projects, .request, .moving-services, .moving-process, .faq-section"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);

animatedElements.forEach((element) => {

    element.classList.add("reveal");

    observer.observe(element);

});

// =========================================
// BERNHARDT & PARTNER — TEXT REVEAL
// =========================================

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const textRevealElements = document.querySelectorAll(
        "h1, h2, h3, .eyebrow"
    );

    const textRevealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("text-reveal-visible");
                    textRevealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    function wrapTextWords(node) {
        [...node.childNodes].forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                const fragment = document.createDocumentFragment();
                const words = child.textContent.split(/(\s+)/);

                words.forEach((word) => {
                    if (/^\s+$/.test(word)) {
                        fragment.appendChild(document.createTextNode(word));
                    } else if (word) {
                        const span = document.createElement("span");
                        span.className = "text-reveal-word";
                        span.textContent = word;
                        fragment.appendChild(span);
                    }
                });

                child.replaceWith(fragment);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                wrapTextWords(child);
            }
        });
    }

    textRevealElements.forEach((element, index) => {
        wrapTextWords(element);
        element.classList.add("text-reveal");
        element.style.setProperty("--text-reveal-delay", `${Math.min(index * 18, 180)}ms`);

        [...element.querySelectorAll(".text-reveal-word")].forEach((word, wordIndex) => {
            word.style.transitionDelay =
                `${Math.min(index * 18 + wordIndex * 38, 420)}ms`;
        });

        textRevealObserver.observe(element);
    });
}
// Beim Neuladen der Seite immer zum Anfang springen
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', function () {
    setTimeout(function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 100);
});
// =========================================
// kushch STYLE TIMELINE — SCROLL ANIMATION
// =========================================

document.querySelectorAll(".kushch-process").forEach((section) => {

    const timeline = section.querySelector(".kushch-process-timeline");
    const line = section.querySelector(".kushch-line");
    const progress = section.querySelector(".kushch-line-progress");
    const dot = section.querySelector(".kushch-line-dot");
    const steps = [...section.querySelectorAll(".kushch-process-step")];

    if (!timeline || !line || !progress || !dot || !steps.length) return;

    let ticking = false;

    function updateTimeline() {
        const rect = timeline.getBoundingClientRect();

        const referencePoint = window.innerHeight * 0.5;

        let percentage =
            (referencePoint - rect.top) / rect.height;

        percentage = Math.max(0, Math.min(1, percentage));

        const value = percentage * 100;

        progress.style.height = `${value}%`;
        dot.style.top = `${value}%`;

        ticking = false;
    }

    function requestUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateTimeline);
            ticking = true;
        }
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    // AKTIVE SCHRITTE

    steps.forEach((step) => {

        step.setAttribute("tabindex", "0");

        function activateStep() {
            steps.forEach((item) => {
                item.classList.remove("is-active");
            });

            step.classList.add("is-active");
        }

        step.addEventListener("click", activateStep);

        step.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activateStep();
            }
        });

    });

    updateTimeline();

});
// STARTSEITE — ANIMIERTE SERVICE-TIMELINE

document.querySelectorAll(".services-fullbleed").forEach((section) => {

    const line = section.querySelector(".kushch-line");
    const progress = section.querySelector(".kushch-line-progress");
    const dot = section.querySelector(".kushch-line-dot");
    const markers = [...section.querySelectorAll(".kushch-marker")];

    if (!line || !progress || !dot || !markers.length) return;

    let ticking = false;

    function updateServicesTimeline() {

        const rect = line.getBoundingClientRect();
        const referencePoint = window.innerHeight * 0.5;

        let percentage =
            (referencePoint - rect.top) / rect.height;

        percentage = Math.max(0, Math.min(1, percentage));

        const value = percentage * 100;

        // BEWEGLICHER LICHTPUNKT
        progress.style.height = `${value}%`;
        dot.style.top = `${value}%`;

        // SIEBEN AKTIVE MARKER
        markers.forEach((marker) => {

            const markerPosition = parseFloat(marker.style.top);

            if (value >= markerPosition) {
                marker.classList.add("is-active");
            } else {
                marker.classList.remove("is-active");
            }

        });

        ticking = false;
    }

    function requestServicesUpdate() {

        if (!ticking) {
            window.requestAnimationFrame(updateServicesTimeline);
            ticking = true;
        }

    }

    window.addEventListener("scroll", requestServicesUpdate, { passive: true });
    window.addEventListener("resize", requestServicesUpdate);

    updateServicesTimeline();

});
/* =========================================
   UMZÜGE — ANIMIERTE TIMELINE
========================================= */

document.querySelectorAll(".moving-process-grid").forEach((grid) => {

    const line = grid.querySelector(".kushch-line");
    const progress = grid.querySelector(".kushch-line-progress");
    const dot = grid.querySelector(".kushch-line-dot");
    if (!line || !progress || !dot) return;
    let ticking = false;

    function updateTimeline() {

        const rect = line.getBoundingClientRect();
        const referencePoint = window.innerHeight * 0.5;

        let percentage =
            (referencePoint - rect.top) / rect.height;

        percentage = Math.max(0, Math.min(1, percentage));

        const value = percentage * 100;

        progress.style.height = `${value}%`;
        dot.style.top = `${value}%`;

        dot.classList.toggle(
            "is-moving",
            value > 0 && value < 100
        );

        ticking = false;
    }

    function requestUpdate() {

        if (!ticking) {
            window.requestAnimationFrame(updateTimeline);
            ticking = true;
        }

    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    updateTimeline();

});
// =========================================
// BERNHARDT & PARTNER — MULTI STEP FORM
// =========================================

const wizard = document.querySelector(".request-wizard");

if (wizard) {

    const steps = [...wizard.querySelectorAll(".wizard-step")];
    const options = wizard.querySelectorAll(".wizard-option");

    const prevButton = wizard.querySelector("#prevStep");
    const hint = wizard.querySelector("#nextStepHint");
    const submitButton = wizard.querySelector("#submitForm");

    const progressFill = wizard.querySelector("#progressFill");
    const stepCounter = wizard.querySelector("#stepCounter");
    const wizardProgress = wizard.querySelector(".wizard-progress");
    const wizardHeader = wizard.querySelector(".wizard-header");

   let currentStep = 0;
let advanceTimer = null;

const answers = {};
const projectForm = wizard.querySelector("#projectForm");
const successName = wizard.querySelector("#successName");
const successScreen = wizard.querySelector("#wizardSuccess");

if (
    !projectForm ||
    !prevButton ||
    !hint ||
    !submitButton ||
    !progressFill ||
    !stepCounter ||
    !wizardProgress ||
    !wizardHeader ||
    !successName ||
    !successScreen ||
    steps.length === 0
) {
    console.error("Formularfehler: Ein benötigtes Element fehlt.");
} else {

projectForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (submitButton.disabled) return;

    const formData = new FormData(projectForm);

    formData.append("customerType", answers.step1 || "");
    formData.append("service", answers.step2 || "");
    formData.append("projectSize", answers.step3 || "");
    formData.append("timeframe", answers.step4 || "");
    formData.append(
        "_subject",
        "Neue Projektanfrage — Bernhardt & Partner"
    );

    const firstname = formData.get("firstname");
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Wird gesendet...";

    try {
        const response = await fetch(
            "https://formspree.io/f/xaeolqop",
            {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Die Anfrage konnte nicht gesendet werden."
            );
        }

        projectForm.hidden = true;
        wizardProgress.hidden = true;
        wizardHeader.hidden = true;

        successName.textContent = firstname;
        successScreen.hidden = false;

        console.log("Projektanfrage erfolgreich gesendet:", result);
    } catch (error) {
        console.error("Fehler beim Senden:", error);
        alert(
            "Die Anfrage konnte leider nicht gesendet werden. Bitte versuchen Sie es erneut."
        );

        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

    function showStep(index) {

        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index);
        });

        currentStep = index;

        progressFill.style.width =
            `${((index + 1) / steps.length) * 100}%`;

        stepCounter.textContent =
            `Schritt ${index + 1} von ${steps.length}`;

        prevButton.disabled = index === 0;

        hint.hidden = index === steps.length - 1;
        submitButton.hidden = index !== steps.length - 1;

        hint.textContent = "Zum Fortfahren auswählen";
    }

    options.forEach(option => {

        option.addEventListener("click", () => {

            const step = option.closest(".wizard-step");
            const stepNumber = Number(step.dataset.step);

            step.querySelectorAll(".wizard-option").forEach(item => {
                item.classList.remove("selected");
            });

            option.classList.add("selected");

            answers[`step${stepNumber}`] = option.dataset.value;

            // AUTOMATISCH ZUM NÄCHSTEN SCHRITT
          clearTimeout(advanceTimer);

advanceTimer = setTimeout(() => {
    advanceTimer = null;

    if (currentStep < steps.length - 1) {
        showStep(currentStep + 1);
    }
}, 300);

        });

    });

prevButton.addEventListener("click", () => {
    clearTimeout(advanceTimer);
    advanceTimer = null;

    if (currentStep > 0) {
        showStep(currentStep - 1);
    }
});

    showStep(0);

}
}
// =========================================
// B&P — PIXEL REQUEST BACKGROUND
// =========================================

document.querySelectorAll(".request").forEach((section) => {

    const background = document.createElement("div");

    background.className = "pixel-background";
    background.setAttribute("aria-hidden", "true");

    section.prepend(background);

    const pixelSize = 42;

    let columns = 0;
    let rows = 0;
    let pixels = [];

    // Создание пиксельной сетки
    function createPixelGrid() {

        background.innerHTML = "";
        pixels = [];

        columns = Math.ceil(section.clientWidth / pixelSize);
        rows = Math.ceil(section.clientHeight / pixelSize);

        background.style.display = "grid";
        background.style.gridTemplateColumns =
            `repeat(${columns}, ${pixelSize}px)`;

        background.style.gridTemplateRows =
            `repeat(${rows}, ${pixelSize}px)`;

        for (let i = 0; i < columns * rows; i++) {

            const pixel = document.createElement("div");

            const isOrange = Math.random() < 0.23;

            const baseColor = isOrange
                ? "rgba(255, 112, 24, 0.62)"
                : "rgba(255, 255, 255, 0.025)";

            pixel.dataset.baseColor = baseColor;

            pixel.style.background = baseColor;
            pixel.style.border = "1px solid #080808";
            pixel.style.boxSizing = "border-box";

            pixel.style.transition =
                "background 0.25s ease, transform 0.25s ease";

            background.appendChild(pixel);
            pixels.push(pixel);
        }
    }

    createPixelGrid();

    // Реакция на движение мыши
    section.addEventListener("mousemove", (event) => {

        const rect = section.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const column = Math.floor(x / pixelSize);
        const row = Math.floor(y / pixelSize);

        for (let dy = -2; dy <= 2; dy++) {

            for (let dx = -2; dx <= 2; dx++) {

                const cx = column + dx;
                const cy = row + dy;

                if (
                    cx < 0 || cy < 0 ||
                    cx >= columns || cy >= rows
                ) continue;

                const pixel = pixels[cy * columns + cx];

                if (!pixel) continue;

                const distance = Math.sqrt(dx * dx + dy * dy);

                pixel.style.background =
                    distance < 1.5
                        ? "rgba(255, 115, 35, 0.9)"
                        : "rgba(255, 115, 35, 0.5)";

                pixel.style.transform =
                    distance < 1.5 ? "scale(0.9)" : "scale(1)";

                clearTimeout(pixel.resetTimer);

                pixel.resetTimer = setTimeout(() => {

                    pixel.style.background = pixel.dataset.baseColor;
                    pixel.style.transform = "scale(1)";

                }, 500);
            }
        }
    });

    // Перестроение при изменении размера окна
    let resizeTimer;

    window.addEventListener("resize", () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(createPixelGrid, 200);

    });
});

// =========================================
// BERNHARDT & PARTNER — MAGNETIC BUTTONS
// =========================================

if (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
    const magneticElements = document.querySelectorAll(
        "button, .button, .header-button, .text-link"
    );

    magneticElements.forEach((element) => {
        element.classList.add("magnetic-button");

        element.addEventListener("mousemove", (event) => {
            const rect = element.getBoundingClientRect();
            const offsetX = event.clientX - (rect.left + rect.width / 2);
            const offsetY = event.clientY - (rect.top + rect.height / 2);

            const moveX = Math.max(-10, Math.min(10, offsetX * 0.14));
            const moveY = Math.max(-8, Math.min(8, offsetY * 0.14));

            element.style.setProperty("--magnetic-x", `${moveX}px`);
            element.style.setProperty("--magnetic-y", `${moveY}px`);
        });

        element.addEventListener("mouseleave", () => {
            element.style.setProperty("--magnetic-x", "0px");
            element.style.setProperty("--magnetic-y", "0px");
        });
    });
}

// =========================================
// BERNHARDT & PARTNER — PARALLAX
// =========================================

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const parallaxElements = document.querySelectorAll(
        ".service-hero-background, .service-hero-background video"
    );

    let parallaxFrame = null;

    function updateParallax() {
        parallaxFrame = null;
        const viewportCenter = window.innerHeight / 2;

        parallaxElements.forEach((element) => {
            const rect = element.parentElement
                ? element.parentElement.getBoundingClientRect()
                : element.getBoundingClientRect();

            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const elementCenter = rect.top + rect.height / 2;
            const offset = (elementCenter - viewportCenter) * -0.08;
            const limitedOffset = Math.max(-28, Math.min(28, offset));

            element.style.setProperty("--parallax-y", `${limitedOffset}px`);
        });
    }

    function requestParallaxUpdate() {
        if (parallaxFrame === null) {
            parallaxFrame = window.requestAnimationFrame(updateParallax);
        }
    }

    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
    updateParallax();
}

// =========================================
// BERNHARDT & PARTNER — PRELOADER
// =========================================

const existingPreloader = document.querySelector(".page-preloader");

if (!existingPreloader) {
    const preloader = document.createElement("div");
    preloader.className = "page-preloader";
    preloader.setAttribute("aria-hidden", "true");
    preloader.innerHTML = `
        <div class="preloader-brand">
            <span>BERNHARDT</span>
            <strong>&amp; PARTNER</strong>
        </div>
        <div class="preloader-line"><span></span></div>
    `;
    document.body.prepend(preloader);

    const hidePreloader = () => {
        window.setTimeout(() => {
            preloader.classList.add("is-hidden");
            window.setTimeout(() => preloader.remove(), 450);
        }, 120);
    };

    if (document.readyState === "complete") {
        hidePreloader();
    } else {
        window.addEventListener("load", hidePreloader, { once: true });
    }
}

