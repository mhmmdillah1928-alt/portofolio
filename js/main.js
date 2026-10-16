document.querySelector("#year").textContent = new Date().getFullYear();

const certificateModal = document.querySelector("#certificateModal");
const certificateFrame = certificateModal.querySelector(".certificate-frame");
certificateModal.addEventListener("show.bs.modal", (event) => {
  const trigger = event.relatedTarget;
  certificateModal.querySelector("#certificateModalTitle").textContent = trigger.dataset.certificateTitle;
  certificateFrame.src = trigger.dataset.certificateFile;
  certificateFrame.title = `Pratinjau PDF ${trigger.dataset.certificateTitle}`;
});
certificateModal.addEventListener("hidden.bs.modal", () => {
  certificateFrame.removeAttribute("src");
});

document.querySelectorAll("#navbarContent .nav-link, #navbarContent .btn").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.querySelector("#navbarContent");
    if (menu.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(
  ".section-space .section-kicker, .section-space .section-title, .section-space .section-copy, .about-card, .stack-card, .project-card, .contact-panel",
);

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  revealTargets.forEach((element) => {
    element.classList.add("reveal-on-scroll");

    const gridItem = element.parentElement;
    const gridItems = gridItem.parentElement.children;
    const itemIndex = Array.prototype.indexOf.call(gridItems, gridItem);
    element.style.setProperty("--reveal-delay", `${Math.min(itemIndex, 3) * 80}ms`);
    revealObserver.observe(element);
  });
}

const navbar = document.querySelector("#mainNavbar");
let scrollUpdatePending = false;

const updateScrollState = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

  navbar.classList.toggle("is-scrolled", window.scrollY > 12);
  navbar.style.setProperty("--scroll-progress", Math.min(Math.max(progress, 0), 1));
  scrollUpdatePending = false;
};

window.addEventListener("scroll", () => {
  if (!scrollUpdatePending) {
    window.requestAnimationFrame(updateScrollState);
    scrollUpdatePending = true;
  }
}, { passive: true });
updateScrollState();

const whatsappContactForm = document.querySelector("#whatsappContactForm");
whatsappContactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(whatsappContactForm);
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const whatsappMessage = [
    "Halo, saya ingin menghubungi Anda melalui website.",
    "",
    `Nama: ${name}`,
    `Email: ${email}`,
    "",
    "Pesan:",
    message,
  ].join("\n");
  const whatsappUrl = `https://wa.me/6283144452466?text=${encodeURIComponent(whatsappMessage)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  document.querySelector("#contactFormStatus").textContent =
    "Pesan sudah disiapkan di WhatsApp. Tinjau lalu tekan Kirim untuk mengirimkannya.";
});
