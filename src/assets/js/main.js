document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("navbar");
  const menuButton = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const query = new URLSearchParams(window.location.search);
  const subject = query.get("subject");
  const subjectField = document.querySelector(
    '#enquiry-form [name="subject"]'
  );

if (subject === "advertising" && subjectField) {
  subjectField.value = "Advertising Partnership";
}

  const setMenu = (open) => {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.classList.toggle("hidden", !open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  };
  menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });
  document.addEventListener("click", (event) => {
    if (mobileMenu && menuButton && !mobileMenu.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });
  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", updateHeader, { passive: true }); updateHeader();

  const counters = document.querySelectorAll(".counter");
  if (counters.length && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.target || 0); let start = null;
      const tick = (time) => { start ??= time; const progress = Math.min((time - start) / 1400, 1); entry.target.textContent = Math.floor(target * progress).toLocaleString("en-IN"); if (progress < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick); obs.unobserve(entry.target);
    }), { threshold: 0.4 });
    counters.forEach((counter) => observer.observe(counter));
  } else counters.forEach((counter) => { counter.textContent = Number(counter.dataset.target || 0).toLocaleString("en-IN"); });

  const searchInput = document.getElementById("tour-search");
  const cards = [...document.querySelectorAll("#tours-grid .tour-card")];
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const noResults = document.getElementById("no-results");
  if (searchInput && cards.length) {
    let region = new URLSearchParams(location.search).get("region") || "all";
    const apply = () => {
      const query = searchInput.value.trim().toLowerCase(); let visible = 0;
      cards.forEach((card) => { const matchesText = card.textContent.toLowerCase().includes(query); const cardRegion = (card.dataset.region || "").toLowerCase(); const matchesRegion = region === "all" || cardRegion.includes(region.toLowerCase()); const show = matchesText && matchesRegion; card.style.display = show ? "flex" : "none"; if (show) visible++; });
      noResults?.classList.toggle("hidden", visible > 0);
    };
    searchInput.addEventListener("input", apply);
    filterButtons.forEach((button) => button.addEventListener("click", () => { region = button.dataset.region || "all"; filterButtons.forEach((b) => { const active = b === button; b.setAttribute("aria-pressed", String(active)); b.classList.toggle("bg-primary", active); b.classList.toggle("text-white", active); }); apply(); }));
    filterButtons.find((button) => (button.dataset.region || "all").toLowerCase() === region.toLowerCase())?.click(); apply();
  }

  document.querySelectorAll(".inquiry-form, .newsletter-form").forEach((form) => form.addEventListener("submit", async (event) => {
    event.preventDefault(); const button = form.querySelector('button[type="submit"]'); const original = button?.textContent || "Submit"; const status = document.createElement("p"); status.className = "form-status"; status.setAttribute("role", "status"); form.querySelector(".form-status")?.remove(); form.append(status);
    try { if (button) { button.disabled = true; button.textContent = "Sending..."; } const response = await fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) }); if (!response.ok) throw new Error(`HTTP ${response.status}`); status.classList.add("success"); status.textContent = "Thank you. Your request has been sent successfully."; form.reset(); }
    catch (error) { status.classList.add("error"); status.textContent = "We could not send your request. Please try again or contact us on WhatsApp."; }
    finally { if (button) { button.disabled = false; button.textContent = original; } }
  }));

  const lightbox = document.getElementById("lightbox"), lightboxImage = document.getElementById("lightbox-image"), closeButton = document.getElementById("lightbox-close");
  const closeLightbox = () => { lightbox?.classList.add("hidden"); document.body.style.overflow = ""; };
  document.querySelectorAll(".lightbox-trigger").forEach((button) => button.addEventListener("click", () => { if (!lightbox || !lightboxImage) return; lightboxImage.src = button.dataset.src; lightboxImage.alt = button.dataset.alt || "Gallery image"; lightbox.classList.remove("hidden"); document.body.style.overflow = "hidden"; closeButton?.focus(); }));
  closeButton?.addEventListener("click", closeLightbox); lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
});

// Testimonial carousel autoplay
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("testimonial-carousel");

  if (!carousel) {
    return;
  }

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(
    carousel.querySelectorAll(".carousel-slide")
  );
  const dots = Array.from(
    carousel.querySelectorAll(".carousel-dot")
  );
  const previousButton = document.getElementById("carousel-prev");
  const nextButton = document.getElementById("carousel-next");

  if (!track || slides.length === 0) {
    return;
  }

  let currentIndex = 0;
  let autoplayTimer = null;
  const autoplayDelay = 6000;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform =
      "translateX(-" + currentIndex * 100 + "%)";

    dots.forEach(function (dot, dotIndex) {
      const active = dotIndex === currentIndex;

      dot.classList.toggle("active", active);
      dot.classList.toggle("bg-primary", active);
      dot.classList.toggle("bg-gray-300", !active);
      dot.setAttribute(
        "aria-current",
        active ? "true" : "false"
      );
    });
  }

  function showNextSlide() {
    showSlide(currentIndex + 1);
  }

  function showPreviousSlide() {
    showSlide(currentIndex - 1);
  }

  function stopAutoplay() {
    if (autoplayTimer !== null) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();

    if (slides.length > 1 && !document.hidden) {
      autoplayTimer = window.setInterval(
        showNextSlide,
        autoplayDelay
      );
    }
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      showNextSlide();
      startAutoplay();
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", function () {
      showPreviousSlide();
      startAutoplay();
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showSlide(dotIndex);
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  showSlide(0);
  startAutoplay();
});
