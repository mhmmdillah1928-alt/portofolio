document.querySelector("#year").textContent = new Date().getFullYear();

const toastIcons = { success: "bi-check-circle-fill", info: "bi-info-circle-fill", warning: "bi-exclamation-triangle-fill", danger: "bi-x-circle-fill" };
const showToast = (message, type = "info", delay = 4000) => {
  const toast = document.createElement("div");
  toast.className = `toast app-toast app-toast-${type}`;
  toast.setAttribute("role", type === "danger" ? "alert" : "status");
  const body = document.createElement("div");
  body.className = "d-flex align-items-start gap-2 p-3";
  const icon = document.createElement("i");
  icon.className = `bi ${toastIcons[type] || toastIcons.info} toast-icon`;
  icon.setAttribute("aria-hidden", "true");
  const text = document.createElement("div");
  text.className = "flex-grow-1";
  text.textContent = message;
  const close = document.createElement("button");
  close.type = "button";
  close.className = "btn-close btn-close-white";
  close.setAttribute("aria-label", "Tutup notifikasi");
  close.setAttribute("data-bs-dismiss", "toast");
  body.append(icon, text, close);
  toast.append(body);
  document.querySelector("#toastContainer").append(toast);
  toast.addEventListener("hidden.bs.toast", () => toast.remove());
  bootstrap.Toast.getOrCreateInstance(toast, { delay }).show();
};

window.addEventListener("load", () => {
  setTimeout(() => showToast("Selamat datang di portofolio saya! 👋", "info"), 600);
});

const backToTop = document.querySelector("#backToTop");
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => backToTop.classList.toggle("is-visible", window.scrollY > 400), { passive: true });

const certificateModal = document.querySelector("#certificateModal");
const certificateFrame = certificateModal.querySelector(".certificate-frame");
certificateModal.addEventListener("show.bs.modal", (event) => {
  const trigger = event.relatedTarget;
  certificateModal.querySelector("#certificateModalTitle").textContent = trigger.dataset.certificateTitle;
  certificateFrame.src = trigger.dataset.certificateFile;
  certificateFrame.title = `Pratinjau PDF ${trigger.dataset.certificateTitle}`;
  showToast(`Membuka ${trigger.dataset.certificateTitle}...`, "info", 2500);
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

  if (!whatsappContactForm.checkValidity()) {
    whatsappContactForm.reportValidity();
    showToast("Mohon lengkapi semua kolom dengan benar.", "warning");
    return;
  }

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

  const opened = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  if (opened) {
    showToast("Pesan siap dikirim! WhatsApp dibuka di tab baru.", "success");
    whatsappContactForm.reset();
  } else {
    showToast("Pop-up diblokir browser. Izinkan pop-up lalu coba lagi.", "danger", 6000);
    return;
  }
  document.querySelector("#contactFormStatus").textContent =
    "Pesan sudah disiapkan di WhatsApp. Tinjau lalu tekan Kirim untuk mengirimkannya.";
});
