/* ========================================
   1. ACTIVE NAVIGATION
======================================== */

const sections = document.querySelectorAll(
  "#intro, #about, #work, #contact"
);

const navLinks = document.querySelectorAll(".main-nav a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  {
    threshold: 0.1
  }
);

sections.forEach((section) => {
  observer.observe(section);
});

/* ========================================
   2. SMOOTH SCROLL FOR INTERNAL LINKS
======================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      event.preventDefault();
      return;
    }

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});


/* ========================================
   3. SELECTED PROJECTS — SCROLL REVEAL
======================================== */

const projectCards = document.querySelectorAll(".project-card");

const projectObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("project-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

projectCards.forEach((card) => {
  card.classList.add("project-reveal");
  projectObserver.observe(card);
});



/* ========================================
   4. CASE STUDY SIDEBAR NAVIGATION
======================================== */

const caseStudyLayout = document.querySelector(".case-study-layout");

if (caseStudyLayout) {
  const tocLinks = caseStudyLayout.querySelectorAll(".toc-link");
  const caseStudySections = Array.from(tocLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const caseStudyObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visibleSections.length > 0) {
        const activeId = visibleSections[0].target.id;

        tocLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${activeId}`
          );
        });
      }
    },
    {
      rootMargin: "-15% 0px -70% 0px",
      threshold: 0
    }
  );

  caseStudySections.forEach((section) => {
    caseStudyObserver.observe(section);
  });
}



/* ========================================
   5. ABOUT SECTION — VOICE PLAYBACK
======================================== */

const aboutVoiceButton = document.querySelector("#about-voice-button");
const aboutDescription = document.querySelector(".about-description");

if (aboutVoiceButton && aboutDescription) {
  const playIcon = aboutVoiceButton.querySelector(".audio-play-icon");

  aboutVoiceButton.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support voice playback.");
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      playIcon.textContent = "▶";
      aboutVoiceButton.setAttribute("aria-label", "Play audio introduction");
      return;
    }

    const speech = new SpeechSynthesisUtterance(
      aboutDescription.innerText
    );

    speech.lang = "en-IN";
    speech.rate = 0.95;

    speech.onend = () => {
      playIcon.textContent = "▶";
      aboutVoiceButton.setAttribute("aria-label", "Play audio introduction");
    };

    speech.onerror = () => {
      playIcon.textContent = "▶";
      aboutVoiceButton.setAttribute("aria-label", "Play audio introduction");
    };

    playIcon.textContent = "Ⅱ";
    aboutVoiceButton.setAttribute("aria-label", "Pause audio introduction");

    window.speechSynthesis.speak(speech);
  });
}




/* AFTER WORK — SCROLL CIRCLE REVEAL */

const afterWorkSection = document.querySelector(".after-work-section");
const afterWorkReveal = document.querySelector(".after-work-reveal");

if (afterWorkSection && afterWorkReveal) {
  let ticking = false;

  const updateAfterWorkReveal = () => {
    const rect = afterWorkSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Open while entering After Work.
    // Close while scrolling past its bottom.
    const enterProgress = Math.max(
      0,
      Math.min(1, (viewportHeight - rect.top) / (viewportHeight * 1.5))
    );

    const exitProgress = Math.max(
      0,
      Math.min(1, rect.bottom / (viewportHeight * 0.7))
    ); 

    const radius = 160 * Math.min(enterProgress, exitProgress);

    afterWorkReveal.style.clipPath =
    `circle(${radius}% at 50% 50%)`;
      console.log("After Work circle radius:", radius);

    ticking = false;
  };

  const requestRevealUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateAfterWorkReveal);
    }
  };

  window.addEventListener("scroll", requestRevealUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestRevealUpdate);
  updateAfterWorkReveal();
}



