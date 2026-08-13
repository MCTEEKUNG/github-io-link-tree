(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealItems = document.querySelectorAll(".reveal");
  revealItems.forEach((item) => {
    const delay = Number(item.dataset.delay || 0);
    item.style.setProperty("--delay", `${delay}ms`);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (!reduceMotion) {
    document.querySelectorAll(".spotlight-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = card.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        card.style.setProperty("--spotlight-x", `${x}%`);
        card.style.setProperty("--spotlight-y", `${y}%`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--spotlight-x");
        card.style.removeProperty("--spotlight-y");
      });
    });

    if (!window.matchMedia("(pointer: coarse)").matches) {
      document.querySelectorAll("[data-magnet]").forEach((button) => {
        button.addEventListener("pointermove", (event) => {
          const bounds = button.getBoundingClientRect();
          const x = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
          const y = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
          button.style.transform = `translate(${x * 5}px, ${y * 5 - 2}px)`;
        });

        button.addEventListener("pointerleave", () => {
          button.style.removeProperty("transform");
        });
      });
    }
  }

  document.querySelectorAll("[data-spark]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const bounds = link.getBoundingClientRect();
      const spark = document.createElement("span");
      spark.className = "click-spark-dot";
      spark.style.left = `${event.clientX ? event.clientX - bounds.left : bounds.width / 2}px`;
      spark.style.top = `${event.clientY ? event.clientY - bounds.top : bounds.height / 2}px`;
      link.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove(), { once: true });
    });
  });
})();
