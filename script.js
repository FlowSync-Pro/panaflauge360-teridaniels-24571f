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
    const submitButton = form.querySelector(".submit-button");
    const buttonText = submitButton ? submitButton.querySelector("span") : null;
    const status = form.querySelector("[data-form-status]");
    const defaultButtonText = buttonText ? buttonText.textContent : "";

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

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

      if (status) {
        status.textContent = "";
        status.classList.remove("is-error");
      }
      if (submitButton) submitButton.disabled = true;
      if (buttonText) buttonText.textContent = "Sending request...";

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)).toString()
        });

        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        window.location.href = form.getAttribute("action") || "/thanks.html";
      } catch (error) {
        if (status) {
          status.textContent = "The request could not be sent. Please call 785-810-0077 or email Panaflauge360@gmail.com.";
          status.classList.add("is-error");
        }
        if (submitButton) submitButton.disabled = false;
        if (buttonText) buttonText.textContent = defaultButtonText;
      }
    });
  }
})();
