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
