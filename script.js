(function () {
  const header = document.querySelector("[data-header]");
  const form = document.querySelector("[data-quote-form]");

  function syncHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  if (window.lucide) {
    window.lucide.createIcons();
  } else {
    window.addEventListener("load", function () {
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (form) {
    form.addEventListener("submit", function () {
      const data = new FormData(form);
      const priority = [
        data.get("service_type") ? "Service: " + data.get("service_type") : "",
        data.get("pickup_window") ? "Pickup window: " + data.get("pickup_window") : "",
        data.get("pickup_location") && data.get("delivery_location")
          ? "Route: " + data.get("pickup_location") + " to " + data.get("delivery_location")
          : "",
        data.get("urgent_callback") ? "Urgent callback requested" : ""
      ].filter(Boolean).join(" | ");

      const summary = form.querySelector("[data-priority-summary]");
      if (summary) summary.value = priority;

      const button = form.querySelector(".submit-button span");
      if (button) button.textContent = "Sending request...";
    });
  }
})();
