// 1. Theme Management
const docRoot = document.documentElement;
const themeBtn = document.getElementById("themeToggleBtn");
const knobIcon = document.getElementById("themeKnobIcon");

function applySelectedTheme(mode) {
  docRoot.setAttribute("data-theme", mode);
  localStorage.setItem("ac_portfolio_theme", mode);
  knobIcon.className = mode === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
}

const cachedTheme = localStorage.getItem("ac_portfolio_theme");
const sysPrefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

if (cachedTheme) {
  applySelectedTheme(cachedTheme);
} else if (sysPrefersDark) {
  applySelectedTheme("dark");
} else {
  applySelectedTheme("light");
}

themeBtn.addEventListener("click", () => {
  const activeMode = docRoot.getAttribute("data-theme");
  applySelectedTheme(activeMode === "dark" ? "light" : "dark");
});

// 2. High-Performance Scroll, TO TOP Control & Botanical Parallax
const navShell = document.getElementById("mainNavbar");
const navAnchors = document.querySelectorAll(".nav-links-menu a");
const leftNavDots = document.querySelectorAll(".left-nav-dot");
const sectionLabel = document.getElementById("activeSectionLabel");
const navTrackFill = document.getElementById("leftNavTrackFill");
const topProgress = document.getElementById("topProgressBar");
const rightToTopBtn = document.getElementById("rightToTopBtn");
const toTopProgressBar = document.getElementById("toTopProgressBar");
const trackedSections = document.querySelectorAll("section[id]");

// Leaves for light scroll-driven floating movement
const leafB1 = document.getElementById("leafB1");
const leafR1 = document.getElementById("leafR1");
const leafB2 = document.getElementById("leafB2");
const leafR2 = document.getElementById("leafR2");
const leafB3 = document.getElementById("leafB3");

let isTicking = false;

function scrollToTopHero() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!reducedMotion) {
    const label = rightToTopBtn.querySelector(".to-top-label");
    const track = rightToTopBtn.querySelector(".to-top-progress-track");
    const labelRect = label.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const planeSize = 28;
    const planeTop = labelRect.top - planeSize - 6;
    const trackCenter = trackRect.left + trackRect.width / 2;

    const smoke = document.createElement("span");
    smoke.className = "to-top-flight-smoke";
    smoke.setAttribute("aria-hidden", "true");
    smoke.style.left = `${trackCenter - 1.5}px`;
    smoke.style.bottom = `${window.innerHeight - planeTop - planeSize}px`;
    const sparkColors = [
      "#22d3ee",
      "#facc15",
      "#f472b6",
      "#34d399",
      "#818cf8",
      "#fb7185",
      "#a3e635",
      "#38bdf8",
      "#fbbf24",
      "#e879f9",
      "#2dd4bf",
      "#ffffff",
    ];
    sparkColors.forEach((color, index) => {
      const spark = document.createElement("span");
      spark.className = "flight-spark";
      spark.textContent = "✦";
      spark.style.top = `${8 + index * 7.4}%`;
      spark.style.left = index % 2 === 0 ? "-8px" : "1px";
      spark.style.color = color;
      spark.style.animationDelay = `${(index % 4) * 0.16}s`;
      smoke.appendChild(spark);
    });
    document.body.appendChild(smoke);
    smoke.addEventListener("animationend", () => smoke.remove(), {
      once: true,
    });

    const flight = document.createElement("div");
    flight.className = "to-top-flight";
    flight.setAttribute("aria-hidden", "true");
    flight.style.left = `${trackCenter - planeSize / 2}px`;
    flight.style.top = `${planeTop}px`;
    flight.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.25c.78 0 1.42.64 1.42 1.42v5.07l6.05 3.56v1.73l-6.05-1.68v5.17l2.61 1.55v1.28L12 19.08l-4.03 1.27v-1.28l2.61-1.55v-5.17l-6.05 1.68V12.3l6.05-3.56V3.67c0-.78.64-1.42 1.42-1.42z"/></svg>';
    document.body.appendChild(flight);
    flight.addEventListener("animationend", () => flight.remove(), {
      once: true,
    });
    setTimeout(() => flight.remove(), 2800);
  }

  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
}

window.addEventListener(
  "scroll",
  () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const scrollPos = window.scrollY;
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = maxScroll > 0 ? scrollPos / maxScroll : 0;
        const pct = Math.min(100, Math.max(0, scrollFraction * 100));

        // Top Progress Bar
        if (topProgress) {
          topProgress.style.width = pct + "%";
        }

        // Header Shrink
        if (scrollPos > 30) {
          navShell.classList.add("scrolled");
          navShell.closest(".nav-header").classList.add("scrolled");
        } else {
          navShell.classList.remove("scrolled");
          navShell.closest(".nav-header").classList.remove("scrolled");
        }

        // "TO TOP" Vertical Control & Dynamic Height Bar
        if (rightToTopBtn) {
          if (scrollPos > 240) {
            rightToTopBtn.classList.add("visible");
          } else {
            rightToTopBtn.classList.remove("visible");
          }
        }
        if (toTopProgressBar) {
          toTopProgressBar.style.height = pct + "%";
        }

        // Left Rail Indicator Line Fill
        if (navTrackFill) {
          navTrackFill.style.height = pct + "%";
        }

        // Section Spy for Top Nav and Left Navigation Rail
        let currentSectionId = "hero";
        let currentSectionName = "Home";

        trackedSections.forEach((sec) => {
          const top = sec.offsetTop - 190;
          const height = sec.offsetHeight;
          const id = sec.getAttribute("id");

          if (scrollPos >= top && scrollPos < top + height) {
            currentSectionId = id;
            const matchingDot = document.querySelector(
              `.left-nav-dot[data-target="${id}"]`,
            );
            if (matchingDot) {
              currentSectionName =
                matchingDot.getAttribute("data-name") || "Home";
            }
          }
        });

        // Update Top Nav
        navAnchors.forEach((a) => {
          a.classList.toggle(
            "active",
            a.getAttribute("href") === `#${currentSectionId}`,
          );
        });

        // Update Left Rail
        leftNavDots.forEach((dot) => {
          dot.classList.toggle(
            "active",
            dot.getAttribute("data-target") === currentSectionId,
          );
        });

        // Update Left Dynamic Section Label
        if (sectionLabel && sectionLabel.textContent !== currentSectionName) {
          sectionLabel.style.opacity = "0";
          sectionLabel.style.transform = "rotate(180deg) translateY(-6px)";
          setTimeout(() => {
            sectionLabel.textContent = currentSectionName;
            sectionLabel.style.opacity = "1";
            sectionLabel.style.transform = "rotate(180deg) translateY(0)";
          }, 150);
        }

        // Subtle Botanical Parallax Sway on Scroll (Desktop only)
        if (window.innerWidth > 1200) {
          const offsetA = scrollPos * 0.05;
          const offsetB = scrollPos * 0.04;
          if (leafB1)
            leafB1.style.transform = `translate3d(0, ${offsetA}px, 0) rotate(-14deg)`;
          if (leafR1)
            leafR1.style.transform = `translate3d(0, ${-offsetB}px, 0) rotate(145deg)`;
          if (leafB2)
            leafB2.style.transform = `translate3d(0, ${offsetB}px, 0) rotate(16deg)`;
          if (leafR2)
            leafR2.style.transform = `translate3d(0, ${-offsetA}px, 0) rotate(205deg)`;
          if (leafB3)
            leafB3.style.transform = `translate3d(0, ${offsetA * 0.7}px, 0) rotate(-25deg)`;
        }

        isTicking = false;
      });
      isTicking = true;
    }
  },
  { passive: true },
);

// 3. Apple-style Mobile Navigation Drawer
const mobileBtn = document.getElementById("mobileToggleBtn");
const mobileCloseBtn = document.getElementById("mobileCloseBtn");
const mobilePanel = document.getElementById("mobileNavPanel");
const mobileLinks = document.querySelectorAll(".mobile-nav-link");

function toggleMobileMenu(open) {
  if (open) {
    mobilePanel.classList.add("open");
    document.body.style.overflow = "hidden";
  } else {
    mobilePanel.classList.remove("open");
    document.body.style.overflow = "";
  }
}

mobileBtn.addEventListener("click", () => toggleMobileMenu(true));
mobileCloseBtn.addEventListener("click", () => toggleMobileMenu(false));

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => toggleMobileMenu(false));
});

// 4. Technical Skills Category Filter
function filterSkills(category, button) {
  document
    .querySelectorAll(".skill-filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");

  const cards = document.querySelectorAll(".skill-card");
  cards.forEach((card) => {
    const cat = card.getAttribute("data-category") || "";
    if (category === "all" || cat.includes(category)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// 5. "How I Work" Interactive Principles
const principlesData = [
  {
    title: "Requirement Analysis & Clear Planning",
    desc: "Before jumping straight into coding, I review client and stakeholder requirements, clarify edge cases, outline API request/response contracts, and coordinate with the team to prevent scope confusion.",
    checks: [
      "Clear acceptance criteria before feature development",
      "Standardized JSON request/response schema specifications",
      "Early identification of database relationships and constraints",
    ],
  },
  {
    title: "Clean Code & Team Standards",
    desc: "Writing code is not just for computers; it is for teammates who will read it tomorrow. I follow strict naming conventions, modular functions, SOLID architecture, and proper version control etiquette.",
    checks: [
      "Readable, self-documenting code with meaningful variable names",
      "Adherence to PSR-12 (PHP) and PEP 8 (Python) conventions",
      "Small, atomic Git commits with descriptive messages",
    ],
  },
  {
    title: "Database Optimization & Reliability",
    desc: "Data integrity is paramount. Having worked on booking systems and high-throughput LMS portals, I design normalized schemas, write optimized SQL queries, and implement indexing to prevent production bottlenecks.",
    checks: [
      "Optimized composite indexes for high-frequency queries",
      "Transaction locks for critical financial / booking updates",
      "Query analysis with EXPLAIN to eradicate full table scans",
    ],
  },
  {
    title: "Ownership, Testing & Deployment",
    desc: "I believe in owning features through to production. I test endpoints with Postman collections, write unit checks, configure Docker environments, and verify server deployments on live Linux instances.",
    checks: [
      "Automated sanity tests and Postman endpoint verification",
      "Dockerized services ensuring local matches production",
      "Nginx reverse proxy and SSL configuration on Linux",
    ],
  },
  {
    title: "Clear Communication & Fast Adaptation",
    desc: "Software development is collaborative. I provide transparent daily updates, actively communicate blockers before they cause delays, and learn new technologies rapidly as project needs require.",
    checks: [
      "Daily syncs with honest progress reports and blocker alerts",
      "Openness to code review feedback and continuous improvement",
      "Demonstrated capability transitioning quickly across modern stacks",
    ],
  },
];

function switchPrinciple(index, button) {
  document
    .querySelectorAll(".principle-selector-btn")
    .forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");

  const data = principlesData[index];
  document.getElementById("bpTitle").textContent = data.title;
  document.getElementById("bpDesc").textContent = data.desc;

  const checklistContainer = document.getElementById("bpChecklist");
  checklistContainer.innerHTML = "";
  data.checks.forEach((item) => {
    const div = document.createElement("div");
    div.className = "bp-check-item";
    div.innerHTML = `<i class="fa-solid fa-check"></i> ${item}`;
    checklistContainer.appendChild(div);
  });
}

// 6. Responsive Certifications Slider
const certTrack = document.getElementById("certTrack");
const certCards = document.querySelectorAll(".cert-slide-card");
const prevBtn = document.getElementById("sliderPrevBtn");
const nextBtn = document.getElementById("sliderNextBtn");
const dotsCluster = document.getElementById("sliderDotsCluster");

let currentSlide = 0;
const totalCertCount = certCards.length;

function getVisibleCount() {
  const w = window.innerWidth;
  if (w <= 768) return 1;
  if (w <= 1200) return 2;
  return 3;
}

function getMaxIndex() {
  return Math.max(0, totalCertCount - getVisibleCount());
}

function updateDots() {
  dotsCluster.innerHTML = "";
  const maxIdx = getMaxIndex();
  for (let i = 0; i <= maxIdx; i++) {
    const dot = document.createElement("span");
    dot.className = `carousel-indicator-dot ${i === currentSlide ? "active" : ""}`;
    dot.addEventListener("click", () => {
      currentSlide = i;
      repositionSlider();
    });
    dotsCluster.appendChild(dot);
  }
}

function repositionSlider() {
  const maxIdx = getMaxIndex();
  if (currentSlide > maxIdx) currentSlide = maxIdx;
  if (currentSlide < 0) currentSlide = 0;

  const card = certCards[0];
  if (card) {
    const cardWidth = card.getBoundingClientRect().width;
    const offset = currentSlide * (cardWidth + 16);
    certTrack.style.transform = `translate3d(-${offset}px, 0, 0)`;
  }

  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === maxIdx;

  document.querySelectorAll(".carousel-indicator-dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentSlide);
  });
}

nextBtn.addEventListener("click", () => {
  if (currentSlide < getMaxIndex()) {
    currentSlide++;
    repositionSlider();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentSlide > 0) {
    currentSlide--;
    repositionSlider();
  }
});

window.addEventListener("resize", () => {
  updateDots();
  repositionSlider();
});

updateDots();
repositionSlider();

// 7. Modals & Clipboard Utilities
const modalElem = document.getElementById("appleModal");
const modalHeading = document.getElementById("modalHeading");
const modalDescription = document.getElementById("modalDescription");

function openDetailsModal(title, text) {
  modalHeading.textContent = title;
  modalDescription.innerHTML = `
        <p style="margin-bottom: 18px;">${text}</p>
        <div style="padding: 14px 18px; border-radius: 16px; background: rgba(0, 113, 227, 0.08); font-size: 0.88rem; color: var(--color-blue);">
          <i class="fa-solid fa-circle-check"></i> Engineered with unit test coverage, clean API contracts, and scalable continuous deployment.
        </div>
      `;
  modalElem.classList.add("active");
  document.body.style.overflow = "hidden";
}

function dismissModal() {
  modalElem.classList.remove("active");
  document.body.style.overflow = "";
}

function checkModalBackdrop(e) {
  if (e.target === modalElem) dismissModal();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") dismissModal();
});

function showAppleToast(msg) {
  const toast = document.getElementById("toastBox");
  const toastText = document.getElementById("toastMessageText");
  toastText.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => {
    toast.classList.remove("visible");
  }, 3000);
}

function copyContact(content, successMsg) {
  try {
    const input = document.createElement("textarea");
    input.value = content;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    showAppleToast(successMsg);
  } catch (err) {
    showAppleToast("Copied: " + content);
  }
}

// 8. Contact Form Submissions (Email Client & WhatsApp Direct)
function handleSendEmailApp(e) {
  e.preventDefault();
  const name = document.getElementById("senderName").value.trim();
  const email = document.getElementById("senderEmail").value.trim();
  const subject =
    document.getElementById("messageSubject").value.trim() ||
    `Inquiry from ${name}`;
  const message = document.getElementById("messageBody").value.trim();

  const emailBody = `Hi Adarsh,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nBest regards,\n${name}`;
  const mailtoUrl = `mailto:adarshchate.work@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

  showAppleToast("Opening your default email client...");
  window.location.href = mailtoUrl;
}

function handleSendWhatsAppApp() {
  const name = document.getElementById("senderName").value.trim() || "Visitor";
  const email = document.getElementById("senderEmail").value.trim();
  const message = document.getElementById("messageBody").value.trim();

  if (!message) {
    showAppleToast("Please enter a message before sending to WhatsApp.");
    document.getElementById("messageBody").focus();
    return;
  }

  let text = `Hi Adarsh,\nI am ${name}`;
  if (email) text += ` (${email})`;
  text += `.\n\nMessage:\n${message}`;

  const whatsappUrl = `https://wa.me/917097057777?text=${encodeURIComponent(text)}`;
  showAppleToast("Opening WhatsApp...");
  window.open(whatsappUrl, "_blank");
}

// 9. Hardware-Accelerated Intersection Observer
const scrollObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active-revealed");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05, rootMargin: "0px 0px -20px 0px" },
);

document.querySelectorAll(".reveal-scroll").forEach((el) => {
  scrollObserver.observe(el);
});
