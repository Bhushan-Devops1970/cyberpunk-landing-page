const cursorGlow = document.querySelector(".cursor-glow");
const particleCanvas = document.getElementById("particles");
const particleContext = particleCanvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const timelineEvents = [
  {
    code: "Event 2081-A",
    title: "The First Red Broadcast",
    copy:
      "Every screen below Sector V ignited with a symbol no analyst could reproduce. The city slept for eleven minutes. The missing woke up under the archive.",
  },
  {
    code: "Event 2094-C",
    title: "The Choir Below",
    copy:
      "Maintenance teams reported hymns rising from sealed transit tunnels. Audio analysis revealed the voices belonged to employees not yet born.",
  },
  {
    code: "Event 2117-R",
    title: "Blacksite Eclipse",
    copy:
      "The moon vanished over the northern megacity for 43 seconds. During the gap, thirteen classified laboratories exchanged locations.",
  },
  {
    code: "Event 2130-X",
    title: "Door Zero Opens",
    copy:
      "A door appeared in every archive mirror at once. Only one operative entered. All surviving cameras now point inward.",
  },
];

function moveCursorGlow(event) {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
}

function setupRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function setupTimeline() {
  const buttons = document.querySelectorAll(".timeline-controls button");
  const code = document.getElementById("event-code");
  const title = document.getElementById("event-title");
  const copy = document.getElementById("event-copy");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const event = timelineEvents[Number(button.dataset.event)];

      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      [code, title, copy].forEach((element) => {
        element.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], {
          duration: 260,
          easing: "ease-out",
        });
      });

      code.textContent = event.code;
      title.textContent = event.title;
      copy.textContent = event.copy;
    });
  });
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.count);
        const duration = reduceMotion ? 1 : 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = Math.round(target * eased).toLocaleString();

          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(element);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupArchiveCards() {
  document.querySelectorAll(".text-link").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".archive-card");
      card.classList.add("visible");
      button.textContent = button.textContent === "Decrypt fragment" ? "Fragment exposed" : "Decrypt fragment";
      card.style.borderColor = "rgba(255, 23, 61, 0.7)";
    });
  });
}

function resizeParticles() {
  const ratio = window.devicePixelRatio || 1;
  particleCanvas.width = Math.floor(particleCanvas.offsetWidth * ratio);
  particleCanvas.height = Math.floor(particleCanvas.offsetHeight * ratio);
  particleContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function runParticles() {
  const particles = Array.from({ length: reduceMotion ? 22 : 74 }, () => ({
    x: Math.random() * particleCanvas.offsetWidth,
    y: Math.random() * particleCanvas.offsetHeight,
    radius: Math.random() * 1.8 + 0.3,
    speed: Math.random() * 0.35 + 0.08,
    alpha: Math.random() * 0.6 + 0.18,
  }));

  function frame() {
    particleContext.clearRect(0, 0, particleCanvas.offsetWidth, particleCanvas.offsetHeight);
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += Math.sin(particle.y * 0.01) * 0.12;

      if (particle.y < -10) {
        particle.y = particleCanvas.offsetHeight + 10;
        particle.x = Math.random() * particleCanvas.offsetWidth;
      }

      particleContext.beginPath();
      particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      particleContext.fillStyle = `rgba(255, 43, 72, ${particle.alpha})`;
      particleContext.fill();
    });

    if (!reduceMotion) requestAnimationFrame(frame);
  }

  frame();
}

window.addEventListener("pointermove", moveCursorGlow);
window.addEventListener("resize", resizeParticles);

resizeParticles();
runParticles();
setupRevealObserver();
setupTimeline();
setupCounters();
setupArchiveCards();
