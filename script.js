// --- PEEKING CHARACTERS ANIMATION ---
function initPeekingCharacters() {
  const left = document.querySelector(".peek-left");
  const right = document.querySelector(".peek-right");
  const bottom = document.querySelector(".peek-bottom");
  const all = [left, right, bottom];

  // Helper: random int in [min, max]
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Helper: random float in [min, max]
  function randFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Helper: pick random subset (15% chance for 2-3, else 1)
  function pickCharacters() {
    if (Math.random() < 0.15) {
      // 2 or 3 characters
      const count = randInt(2, 3);
      const shuffled = all.slice().sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    } else {
      // Only one
      return [all[randInt(0, 2)]];
    }
  }

  function peek() {
    // Don't run on small screens
    if (window.innerWidth < 700 || window.innerHeight < 500) return;
    const chars = pickCharacters();
    chars.forEach((el) => {
      if (el) el.classList.add("peeking");
    });
    setTimeout(() => {
      chars.forEach((el) => {
        if (el) el.classList.remove("peeking");
      });
    }, 1500);
  }

  function scheduleNext() {
    const delay = randFloat(8, 16) * 1000;
    setTimeout(() => {
      peek();
      scheduleNext();
    }, delay);
  }

  // Hide all on resize if small
  function handleResize() {
    if (window.innerWidth < 700 || window.innerHeight < 500) {
      all.forEach((el) => {
        if (el) el.style.display = "none";
      });
    } else {
      all.forEach((el) => {
        if (el) el.style.display = "";
      });
    }
  }
  window.addEventListener("resize", handleResize);
  handleResize();

  scheduleNext();
}

// Initialize peeking characters on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initPeekingCharacters();
});
// --- CONFIGURATION (loaded from config.js) ---
// const ANNIVERSARY_DATE and PASSWORD are now in config.js

// --- 1. SMOOTH SCROLL (LENIS) ---
if (typeof Lenis !== "undefined") {
  window.__lenis = new Lenis({
    duration: 1.5, // Slower, smoother scroll for 'heavy' feel
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  function raf(time) {
    window.__lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// --- 2. GSAP SETUP ---
if (typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- EPISTOLARY ARCHIVES (Letters) ---
function initLetters() {
  const envelopes = document.querySelectorAll(".envelope");
  const backdrop = document.getElementById("letter-backdrop");
  const letters = document.querySelectorAll(".letter");
  const closeButtons = document.querySelectorAll(".close-letter");
  // Scroll-lock: stop Lenis + lock body overflow
  function disableBackgroundScroll() {
    document.body.classList.add("modal-open");
    if (window.__lenis) window.__lenis.stop();
  }

  function enableBackgroundScroll() {
    document.body.classList.remove("modal-open");
    if (window.__lenis) window.__lenis.start();
  }

  function closeAllLetters() {
    envelopes.forEach((e) => e.classList.remove("open"));
    letters.forEach((l) => l.classList.remove("active"));
    if (backdrop) backdrop.classList.remove("active");
    // Re-enable page scrolling when all letters are closed
    enableBackgroundScroll();
  }

  envelopes.forEach((envelope) => {
    envelope.addEventListener("click", (e) => {
      const letterId = envelope.getAttribute("data-letter");
      const letter = document.getElementById("letter-" + letterId);

      const isOpen = envelope.classList.contains("open");

      // Close all first
      closeAllLetters();

      // Open this one if it wasn't already open
      if (!isOpen && letter) {
        envelope.classList.add("open");
        letter.classList.add("active");
        if (backdrop) backdrop.classList.add("active");
        // Prevent background scrolling while a letter modal is open
        disableBackgroundScroll();
      }
    });
  });

  // Close buttons
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllLetters();
    });
  });

  // Backdrop click closes
  if (backdrop) {
    backdrop.addEventListener("click", closeAllLetters);
  }

  // ESC key closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllLetters();
    }
  });
}

// --- LIVING LIBRARY (Books) ---
function initLibrary() {
  const books = document.querySelectorAll(".book");
  const backdrop = document.getElementById("book-backdrop");
  const modals = document.querySelectorAll(".book-modal");
  const closeButtons = document.querySelectorAll(".close-book");

  function closeAllBooks() {
    modals.forEach((m) => m.classList.remove("active"));
    if (backdrop) backdrop.classList.remove("active");
  }

  books.forEach((book) => {
    book.addEventListener("click", () => {
      const bookId = book.getAttribute("data-book");
      const modal = document.getElementById("book-modal-" + bookId);

      closeAllBooks();

      if (modal) {
        modal.classList.add("active");
        if (backdrop) backdrop.classList.add("active");
      }
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllBooks();
    });
  });

  if (backdrop) {
    backdrop.addEventListener("click", closeAllBooks);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllBooks();
    }
  });
}

// --- MEMORY MATCH GAME ---
function initMemoryGame() {
  const memoryData = [
    { id: 1, type: "image", content: "Images/Memory/1.png" },
    { id: 1, type: "image", content: "Images/Memory/1.png" },
    { id: 2, type: "image", content: "Images/Memory/2.png" },
    { id: 2, type: "image", content: "Images/Memory/2.png" },
    { id: 3, type: "image", content: "Images/Memory/3.png" },
    { id: 3, type: "image", content: "Images/Memory/3.png" },
    { id: 4, type: "image", content: "Images/Memory/4.png" },
    { id: 4, type: "image", content: "Images/Memory/4.png" },
    { id: 5, type: "image", content: "Images/Memory/5.png" },
    { id: 5, type: "image", content: "Images/Memory/5.png" },
    { id: 6, type: "image", content: "Images/Memory/6.png" },
    { id: 6, type: "image", content: "Images/Memory/6.png" },
    { id: 7, type: "image", content: "Images/Memory/7.png" },
    { id: 7, type: "image", content: "Images/Memory/7.png" },
    { id: 8, type: "image", content: "Images/Memory/8.png" },
    { id: 8, type: "image", content: "Images/Memory/8.png" },
  ];

  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let isLocked = false;

  const grid = document.getElementById("memory-grid");
  const moveCounter = document.getElementById("move-count");
  const matchCounter = document.getElementById("match-count");
  const completeModal = document.getElementById("memory-complete");
  const replayBtn = document.getElementById("memory-replay");

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createCard(data, index) {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.id = data.id;
    card.dataset.index = index;

    const front = document.createElement("div");
    front.className = "card-front";

    if (data.type === "image") {
      const img = document.createElement("img");
      img.src = data.content;
      img.alt = "Memory";
      front.appendChild(img);
    } else {
      const text = document.createElement("div");
      text.className = "card-text";
      text.textContent = data.content;
      front.appendChild(text);
    }

    const back = document.createElement("div");
    back.className = "card-back";

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener("click", () => flipCard(card));
    return card;
  }

  function flipCard(card) {
    if (
      isLocked ||
      card.classList.contains("flipped") ||
      card.classList.contains("matched")
    ) {
      return;
    }

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      moves++;
      moveCounter.textContent = moves;
      checkMatch();
    }
  }

  function checkMatch() {
    isLocked = true;
    const [card1, card2] = flippedCards;
    const match =
      card1.dataset.id === card2.dataset.id &&
      card1.dataset.index !== card2.dataset.index;

    if (match) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchedPairs++;
      matchCounter.textContent = matchedPairs;
      flippedCards = [];
      isLocked = false;

      if (matchedPairs === 8) {
        setTimeout(showComplete, 600);
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
        isLocked = false;
      }, 1000);
    }
  }

  function showComplete() {
    completeModal.classList.add("active");
    if (typeof confetti !== "undefined") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }

  function initGame() {
    grid.innerHTML = "";
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    isLocked = false;
    moveCounter.textContent = "0";

    matchCounter.textContent = "0";
    completeModal.classList.remove("active");

    const shuffledData = shuffle([...memoryData]);
    shuffledData.forEach((data, index) => {
      const card = createCard(data, index);
      cards.push(card);
      grid.appendChild(card);
    });
  }

  replayBtn.addEventListener("click", initGame);
  initGame();
}

// --- TRIVIA QUIZ GAME ---
function initTriviaGame() {
  const questions = [
    {
      question: "Where did we have our first date?",
      options: [
        "City Centre",
        "Megamall Sharjah",
        "Dubai Mall",
        "Sahara Centre",
      ],
      correct: 2,
    },
    {
      question: "When Did We Get Our First Adivayitile Poombatta😅",
      options: [
        "October 22, 2023",
        "April 30, 2023",
        "Jan 27, 2024",
        "March 25, 2025",
      ],
      correct: 3,
    },
    {
      question: "Nammak 2 Perkum Orey Pole Ishtam Ulladh ?",
      options: ["Apple", "Kunji Pillers", "Ella Theram Songs", "Uppumaav"],
      correct: 2,
    },
    {
      question: "Sahara Centreil Poyappo Kazhichadh What What What ?",
      options: ["Al Baik", "Pizza Hut", "KFC", "Hardees"],
      correct: 4,
    },
    {
      question: "2 perum kandatt orey pole ishtaaya padam",
      options: ["Vaazha 1", "Aadu 3", "Varshangalk Shesham", "Bramayugam"],
      correct: 3,
    },
  ];

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  const container = document.getElementById("trivia-container");
  const progressDiv = document.getElementById("trivia-progress");
  const questionNumber = document.getElementById("question-number");
  const questionText = document.getElementById("question-text");
  const optionsDiv = document.getElementById("trivia-options");
  const card = document.getElementById("trivia-card");

  function createProgress() {
    progressDiv.innerHTML = "";
    questions.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.className = "progress-dot";
      if (index === currentQuestion) dot.classList.add("active");
      progressDiv.appendChild(dot);
    });
  }

  function loadQuestion() {
    answered = false;
    const q = questions[currentQuestion];
    questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    questionText.textContent = q.question;

    optionsDiv.innerHTML = "";
    q.options.forEach((option, index) => {
      const btn = document.createElement("button");
      btn.className = "trivia-option";
      btn.textContent = option;
      btn.addEventListener("click", () => selectAnswer(index));
      optionsDiv.appendChild(btn);
    });

    createProgress();
  }

  function selectAnswer(index) {
    if (answered) return;
    answered = true;

    const q = questions[currentQuestion];
    // Support questions where `correct` may be 1-based (1..4) or 0-based (0..3).
    // Normalize to a zero-based index for comparisons.
    const correctIndex =
      Number.isInteger(q.correct) &&
      q.correct >= 1 &&
      q.correct <= q.options.length
        ? q.correct - 1
        : q.correct;
    const buttons = optionsDiv.querySelectorAll(".trivia-option");
    const dots = progressDiv.querySelectorAll(".progress-dot");

    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIndex) {
        btn.classList.add("correct");
      } else if (i === index && index !== q.correct) {
        btn.classList.add("wrong");
      }
    });

    if (index === correctIndex) {
      score++;
      dots[currentQuestion].classList.add("correct");
    } else {
      dots[currentQuestion].classList.add("wrong");
    }

    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < questions.length) {
        loadQuestion();
      } else {
        showResults();
      }
    }, 1500);
  }

  function showResults() {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "";

    if (percentage === 100) {
      message = "Perfect! You know our story by heart. 💕";
    } else if (percentage >= 60) {
      message = "Great job! Our memories are safe with you.";
    } else {
      message = "Time to make more memories together!";
    }

    card.innerHTML = `
      <div class="trivia-result">
        <h3>Quiz Complete!</h3>
        <div class="trivia-score">${score}/${questions.length}</div>
        <p>${message}</p>
        <button class="game-btn" id="trivia-replay">Play Again</button>
      </div>
    `;

    document.getElementById("trivia-replay").addEventListener("click", () => {
      currentQuestion = 0;
      score = 0;
      card.innerHTML = `
        <div class="question-number" id="question-number">Question 1 of 5</div>
        <div class="question-text" id="question-text">Loading...</div>
        <div class="trivia-options" id="trivia-options"></div>
      `;
      loadQuestion();
    });

    if (percentage === 100) {
      if (typeof confetti !== "undefined") {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      }
      // Reveal the surprise music player
      setTimeout(() => {
        revealSurprisePlayer();
      }, 2000);
    }
  }

  loadQuestion();
}

// --- 3. CUSTOM CURSOR ---
const cursor = document.getElementById("cursor");
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

const interactiveElements = document.querySelectorAll(
  "a, button, .cake-stage, .date-card, input",
);
interactiveElements.forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
});

// --- 4. LOGIN LOGIC ---
const loginScreen = document.getElementById("login-screen");
const passwordInput = document.getElementById("password-input");
const errorMsg = document.getElementById("error-msg");
const mainContent = document.getElementById("main-content");

// --- 2b. CLIENT-SIDE DEVTOOLS / INSPECT DETERRENTS (not secure) ---
// These are mild deterrents only. For real protection, serve images/resources
// from an authenticated server endpoint and restrict access server-side.
(function addDevtoolsDeterrents() {
  // Disable right-click context menu
  document.addEventListener("contextmenu", (e) => {
    if (document.body.classList.contains("authenticated")) return;
    e.preventDefault();
  });

  // Block common devtools key combos (F12, Ctrl+Shift+I/J/C, Ctrl+U)
  document.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("authenticated")) return;
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && /I|J|C/.test(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toLowerCase() === "u")
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // Slightly obfuscate image URLs until authenticated: hide images with data-src
  // Move actual `src` into `data-src` in HTML is ideal; here we hide until auth by
  // setting `visibility: hidden` and restoring after login.
  function hideImages() {
    document.querySelectorAll("img").forEach((img) => {
      if (!img.dataset.protected) {
        img.dataset.protected = "1";
        img.style.visibility = "hidden";
      }
    });
  }
  function revealImages() {
    document.querySelectorAll("img").forEach((img) => {
      if (img.dataset.protected) {
        img.style.visibility = "";
      }
    });
  }

  hideImages();

  // Expose helper for when authentication completes
  window._revealProtectedAssets = revealImages;
})();

if (passwordInput) {
  passwordInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      // POST password to serverless login API (SITE_PASSWORD stored in env)
      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.value }),
      })
        .then(async (r) => {
          const data = await r.json().catch(() => ({}));
          return { ok: r.ok && data && data.ok, data };
        })
        .then((data) => {
          if (data && data.ok) {
            triggerConfetti();
            gsap.to(loginScreen, {
              opacity: 0,
              duration: 1.5,
              ease: "power2.inOut",
              onComplete: () => {
                if (loginScreen) loginScreen.style.display = "none";
                if (mainContent) {
                  mainContent.style.visibility = "visible";
                  mainContent.style.opacity = 1;
                }

                // Mark authenticated and reveal protected assets
                document.body.classList.add("authenticated");
                if (typeof window._revealProtectedAssets === "function")
                  window._revealProtectedAssets();

                // Ensure hero entrance animation runs when content becomes visible
                const hero = document.querySelector(".hero-text");
                if (hero) {
                  hero.classList.remove("show");
                  // small delay so the class addition occurs after paint
                  setTimeout(() => hero.classList.add("show"), 120);
                }

                initScrollAnimations();
                initLetters();
                initLibrary();
                initMemoryGame();
                initTriviaGame();
                initCake();
                if (typeof initTimelineAnimations === "function")
                  initTimelineAnimations();
              },
            });
          } else {
            if (errorMsg && data && data.data && data.data.error) {
              errorMsg.textContent = data.data.error;
            } else if (errorMsg) {
              errorMsg.textContent = "Access Denied";
            }
            gsap.fromTo(
              errorMsg,
              { x: -10, opacity: 1 },
              { x: 10, duration: 0.1, yoyo: true, repeat: 3 },
            );
            passwordInput.value = "";
          }
        })
        .catch(() => {
          gsap.fromTo(
            errorMsg,
            { x: -10, opacity: 1 },
            { x: 10, duration: 0.1, yoyo: true, repeat: 3 },
          );
          passwordInput.value = "";
        });
    }
  });
}

function triggerConfetti() {
  if (typeof confetti === "undefined") return;
  var duration = 3 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    var particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ["#c9a66b", "#e8e0d5", "#ffffff"],
      }),
    );
  }, 250);
}

// --- 5. TIMER LOGIC ---
function updateTimer() {
  const start = new Date(config.ANNIVERSARY_DATE);
  const now = new Date();
  const diff = now - start;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const timerEl = document.getElementById("timer");
  if (timerEl) {
    timerEl.innerText = `${days}d : ${hours}h : ${minutes}m`;
  }
}
setInterval(updateTimer, 1000);

// --- 6. SCROLL ANIMATIONS ---
function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;

  let panels = gsap.utils.toArray(".panel");
  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: "#memory-lane-wrapper",
      pin: true,
      scrub: 1,
      snap: 1 / (panels.length - 1),
      end: () =>
        "+=" + document.querySelector("#memory-lane-wrapper").offsetWidth,
    },
  });

  // Darkroom: Develop photos as panels come into view
  panels.forEach((panel, i) => {
    const imgBox = panel.querySelector(".date-img-box");
    if (imgBox) {
      // First panel with image (index 1) develops immediately when section is reached
      if (i === 1) {
        ScrollTrigger.create({
          trigger: "#memory-lane-wrapper",
          start: "top 80%",
          onEnter: () => imgBox.classList.add("developed"),
        });
      } else if (i > 1) {
        ScrollTrigger.create({
          trigger: "#memory-lane-wrapper",
          start: "top top",
          end: () =>
            "+=" + document.querySelector("#memory-lane-wrapper").offsetWidth,
          onUpdate: (self) => {
            // Calculate which panel is currently in view
            const panelProgress = self.progress * (panels.length - 1);
            const currentPanel = Math.round(panelProgress);

            // Develop photos as they come into focus
            if (currentPanel >= i) {
              imgBox.classList.add("developed");
            }
          },
        });
      }
    }
  });

  // Cake Section Reveal
  gsap.from("#cake-section", {
    scale: 0.9,
    opacity: 0,
    scrollTrigger: {
      trigger: "#cake-section",
      start: "top center",
      end: "center center",
      scrub: true,
    },
  });
}

function initTimelineAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;

  // Animate the vertical timeline line growing downwards
  gsap.from(".timeline-line", {
    scaleY: 0,
    transformOrigin: "top center",
    ease: "none",
    scrollTrigger: {
      trigger: "#timeline-gifts-section",
      start: "top 80%",
      end: "bottom 80%",
      scrub: 1,
    },
  });

  // Fade in each timeline item individually
  const timelineItems = gsap.utils.toArray(".timeline-item");
  timelineItems.forEach((item, i) => {
    // Reset initial CSS animation styles since GSAP will handle it
    item.style.animation = "none";
    item.style.opacity = "0";

    const direction = item.classList.contains("left") ? -50 : 50;

    gsap.fromTo(
      item,
      {
        opacity: 0,
        x: direction,
        y: 30,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%", // Trigger when the top of the item hits 85% of viewport height
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}

// --- 7. SPOTLIGHT LOGIC ---
const spotlightSection = document.getElementById("spotlight-section");
const spotlightMask = document.querySelector(".spotlight-mask");
if (spotlightSection && spotlightMask) {
  spotlightSection.addEventListener("mousemove", (e) => {
    const rect = spotlightSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    spotlightMask.style.setProperty("--x", `${x}%`);
    spotlightMask.style.setProperty("--y", `${y}%`);
  });
}

// --- 8. ANNIVERSARY CAKE INTERACTION ---
function initCake() {
  const stage = document.getElementById("cake-stage");
  const blowBtn = document.getElementById("blow-button");
  const message = document.getElementById("cake-message");
  if (!stage || !blowBtn) return;

  blowBtn.addEventListener("click", () => {
    // 1. Extinguish flames
    stage.classList.add("blown");

    // 2. Add smoke puffs to each candle
    const candles = stage.querySelectorAll(".candle");
    candles.forEach((c) => {
      const smoke = document.createElement("div");
      smoke.className = "smoke";
      c.querySelector(".flame-wrap").appendChild(smoke);
    });

    // 3. Hide button
    blowBtn.classList.add("hidden");

    // 4. Show message after a short pause
    setTimeout(() => {
      if (message) message.classList.add("visible");
    }, 800);

    // 5. Confetti celebration
    setTimeout(() => {
      triggerCakeConfetti();
    }, 1000);
  });
}

function triggerCakeConfetti() {
  if (typeof confetti === "undefined") return;

  // Burst 1 — left
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0.15, y: 0.6 },
    colors: ["#c9a66b", "#e8e0d5", "#ff6f91", "#fff4c1"],
  });
  // Burst 2 — right
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 0.85, y: 0.6 },
    colors: ["#c9a66b", "#e8e0d5", "#ff6f91", "#fff4c1"],
  });
  // Burst 3 — center (delayed)
  setTimeout(() => {
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.55 },
      colors: ["#c9a66b", "#e8e0d5", "#ffffff"],
    });
  }, 400);
}

// --- 9. MUSIC PLAYER LOGIC ---
const songs = [
  { title: "Song 1", src: "music/dude.mp3" },
  { title: "Song 2", src: "music/deka.mp3" },
  { title: "Song 3", src: "music/thoseeyes.mp3" },
  { title: "Song 4", src: "music/perfect.mp3" },
];

let currentSongIndex = 0;
let isPlaying = false;

const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const vinylDisc = document.getElementById("vinyl-disc");
const songDisplay = document.getElementById("song-display");
const playerContainer = document.getElementById("vinyl-container");
const playerToggle = document.getElementById("player-toggle");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function syncDurationUI() {
  if (!audio || !durationEl) return;
  durationEl.textContent = formatTime(audio.duration);
}

function syncTimeUI() {
  if (!audio) return;
  if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);

  if (progressBar && Number.isFinite(audio.duration) && audio.duration > 0) {
    const pct = (audio.currentTime / audio.duration) * 100;
    // Avoid NaN / weirdness
    progressBar.value = String(Math.max(0, Math.min(100, pct)));
  }
}

function togglePlay() {
  if (songs.length === 0) return;
  if (!audio.src) audio.src = songs[currentSongIndex].src;

  if (isPlaying) {
    audio.pause();
    vinylDisc.classList.remove("playing");
    if (playerToggle) playerToggle.classList.remove("playing");
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  } else {
    audio
      .play()
      .catch((e) => console.log("Audio file not found or interaction needed."));
    vinylDisc.classList.add("playing");
    if (playerToggle) playerToggle.classList.add("playing");
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    showSongTitle();
  }
  isPlaying = !isPlaying;
}

function changeSong(direction) {
  if (direction === "next") {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  } else {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  }
  audio.src = songs[currentSongIndex].src;
  if (isPlaying) audio.play();
  showSongTitle();
}

function showSongTitle() {
  songDisplay.innerText = songs[currentSongIndex].title;
  songDisplay.classList.add("show");
  setTimeout(() => songDisplay.classList.remove("show"), 450);
  // reset progress display quickly for better perceived responsiveness
  if (progressBar) progressBar.value = "0";
  if (currentTimeEl) currentTimeEl.textContent = "0:00";
  if (durationEl) durationEl.textContent = "0:00";
}

if (audio) {
  audio.addEventListener("loadedmetadata", () => {
    syncDurationUI();
    syncTimeUI();
  });
  audio.addEventListener("timeupdate", syncTimeUI);
  audio.addEventListener("ended", () => changeSong("next"));
}

if (progressBar && audio) {
  progressBar.addEventListener("input", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const pct = Number(progressBar.value) / 100;
    audio.currentTime = pct * audio.duration;
  });
}

if (playBtn) playBtn.addEventListener("click", togglePlay);
if (vinylDisc) vinylDisc.addEventListener("click", togglePlay);

function togglePlayerOpen() {
  if (!playerContainer) return;
  playerContainer.classList.toggle("open");
}

if (playerToggle) playerToggle.addEventListener("click", togglePlayerOpen);
if (document.getElementById("next-btn"))
  document
    .getElementById("next-btn")
    .addEventListener("click", () => changeSong("next"));
if (document.getElementById("prev-btn"))
  document
    .getElementById("prev-btn")
    .addEventListener("click", () => changeSong("prev"));

// Initialize title on load (even before first play)
if (songs.length > 0 && songDisplay) showSongTitle();

// --- AUTOPLAY AFTER LOADING SCREEN ---
function attemptAutoplay() {
  if (!audio || songs.length === 0) return;
  if (!audio.src) audio.src = songs[currentSongIndex].src;

  audio
    .play()
    .then(() => {
      // autoplay succeeded (do not open the full player; keep FAB visible only)
      isPlaying = true;
      vinylDisc.classList.add("playing");
      if (playerToggle) playerToggle.classList.add("playing");
      showSongTitle();
    })
    .catch((err) => {
      // autoplay blocked by browser — open player and show a subtle hint
      console.log("Autoplay blocked or interaction required:", err);
      // keep the full player closed; only show a subtle FAB hint
      if (playerToggle) playerToggle.classList.add("needs-interaction");

      // Next user click anywhere will try to resume playback once
      function resumeOnInteraction() {
        audio
          .play()
          .then(() => {
            isPlaying = true;
            vinylDisc.classList.add("playing");
            if (playerToggle) playerToggle.classList.add("playing");
            if (playerToggle)
              playerToggle.classList.remove("needs-interaction");
            document.removeEventListener("click", resumeOnInteraction);
          })
          .catch(() => {
            // still blocked; keep the hint and wait for explicit toggle
          });
      }

      document.addEventListener("click", resumeOnInteraction, { once: true });
    });
}

// Try autoplay after full load and a brief delay to allow loader animation to finish
window.addEventListener("load", () => {
  setTimeout(attemptAutoplay, 600);
});

// Trigger hero animation when page is ready
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-text");
  if (hero) {
    // small delay so this plays after any loader or initial paint
    setTimeout(() => hero.classList.add("show"), 300);
  }
});

// --- EDITORIAL GALLERY ANIMATIONS ---
function initEditorialAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;

  const cards = gsap.utils.toArray(".editorial-card");

  cards.forEach((card) => {
    // Note: We use a timeline for each card so we can sequence the inner elements
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // 1. Base card entrance
    tl.from(card, {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // 2. Specific inner animations based on card type
    if (card.classList.contains("card-blossom")) {
      const bgText = card.querySelector(".blossom-bg-text");
      const img = card.querySelector(".blossom-image-container img");
      const texts = card.querySelectorAll(
        ".blossom-text-left, .blossom-text-right, .blossom-footer",
      );

      if (bgText)
        tl.from(
          bgText,
          { scale: 1.15, opacity: 0, duration: 1.5, ease: "power2.out" },
          "-=0.8",
        );
      if (img)
        tl.from(
          img,
          {
            scale: 1.1,
            filter: "grayscale(100%)",
            duration: 1.5,
            ease: "power2.out",
          },
          "-=1.2",
        );
      if (texts.length)
        tl.from(
          texts,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=1",
        );
    } else if (card.classList.contains("card-tokyo")) {
      const header = card.querySelector(".tokyo-header");
      const img = card.querySelector(".tokyo-image-container img");
      const subtitles = card.querySelectorAll(
        ".tokyo-subtitle-left, .tokyo-subtitle-right",
      );
      const footer = card.querySelector(".tokyo-footer-text");

      if (header)
        tl.from(
          header,
          { y: -40, opacity: 0, duration: 1.2, ease: "power3.out" },
          "-=0.8",
        );
      if (img)
        tl.from(
          img,
          {
            scale: 1.1,
            filter: "grayscale(100%)",
            duration: 1.5,
            ease: "power2.out",
          },
          "-=1",
        );
      if (subtitles.length)
        tl.from(
          subtitles,
          {
            x: (i) => (i === 0 ? -30 : 30),
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.5)",
          },
          "-=0.8",
        );
      if (footer)
        tl.from(footer, { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");
    } else if (card.classList.contains("card-busan")) {
      const title = card.querySelector(".busan-vertical-title");
      const img = card.querySelector(".busan-image-wrapper img");
      const badge = card.querySelector(".busan-badge");
      const texts = card.querySelectorAll(
        ".busan-header-top, .busan-footer-bottom, .busan-meta, .busan-side-text",
      );

      if (title)
        tl.from(
          title,
          { x: 40, opacity: 0, duration: 1.2, ease: "power3.out" },
          "-=0.8",
        );
      if (img)
        tl.from(
          img,
          { scale: 0.9, opacity: 0, duration: 1.2, ease: "power2.out" },
          "-=1",
        );
      if (badge)
        tl.from(
          badge,
          { scale: 0, rotation: -90, duration: 0.6, ease: "back.out(2)" },
          "-=0.4",
        );
      if (texts.length)
        tl.from(texts, { opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6");
    }
  });
}

// --- SURPRISE MUSIC PLAYER ---
const surpriseLyrics = [
  {
    time: 4.36,
    text: "Dear God, we thank You for Your blessings and Your grace,",
    direction: false,
  },
  {
    time: 9.94,
    text: "For the quiet way You lead us in this lonely place.",
    direction: false,
  },
  {
    time: 14.78,
    text: "You know our hearts, the deepest desires we hold,",
    direction: false,
  },
  {
    time: 20.22,
    text: "The struggles and the challenges yet to be told.",
    direction: false,
  },
  {
    time: 24.86,
    text: "We pray for Your help to speak with a heart that's clear,",
    direction: false,
  },
  {
    time: 30.18,
    text: "To listen with empathy, and cast away the fear.",
    direction: false,
  },
  {
    time: 35.05,
    text: "To love one another unconditionally and true,",
    direction: false,
  },
  {
    time: 40.7,
    text: "Keeping our focus, Lord, entirely on You.",
    direction: false,
  },
  {
    time: 48.64,
    text: "So I'm not taking this hand for a moment's thrill,",
    direction: false,
  },
  {
    time: 57.58,
    text: "Or just to follow a restless, human will.",
    direction: false,
  },
  {
    time: 64.54,
    text: "It's not for the body, or a fire that will fade,",
    direction: false,
  },
  {
    time: 72.14,
    text: "But for a sacred promise that You might have made.",
    direction: false,
  },
  {
    time: 78.1,
    text: "Like the prayer in the night from the ages ago,",
    direction: false,
  },
  {
    time: 85.7,
    text: "Let Your mercy be the only rhythm we know.",
    direction: false,
  },
  {
    time: 92.46,
    text: "We come with sincerity, through the fear and the dust,",
    direction: false,
  },
  {
    time: 100.24,
    text: "Looking for Jesus in the middle of us.",
    direction: false,
  },
  {
    time: 110.18,
    text: "We look at the road and it's steeper than we thought,",
    direction: false,
  },
  {
    time: 115.46,
    text: "Facing the battles that we never sought.",
    direction: false,
  },
  {
    time: 119.94,
    text: "We know the journey ahead is only getting tougher,",
    direction: false,
  },
  {
    time: 125.22,
    text: "And we're scared of the ways we might have to suffer.",
    direction: false,
  },
  {
    time: 130.24,
    text: "The issues are rising like a tide at our feet,",
    direction: false,
  },
  {
    time: 135.34,
    text: "And the world says a love like this is bittersweet.",
    direction: false,
  },
  {
    time: 140.18,
    text: "But if this is Your choice, then give us the power,",
    direction: false,
  },
  {
    time: 145.64,
    text: "To stand side by side in the darkest hour.",
    direction: false,
  },
  {
    time: 150.48,
    text: "Don't let us walk it alone, Lord, give us the strength,",
    direction: false,
  },
  {
    time: 157.08,
    text: "To go every mile, to go to any length.",
    direction: false,
  },
  {
    time: 165.8,
    text: "You said it wasn't good for the man to be alone,",
    direction: false,
  },
  {
    time: 172.24,
    text: "So make our devotion a foundation of stone.",
    direction: false,
  },
  {
    time: 178.88,
    text: "Give us the strength to make the right choices today,",
    direction: false,
  },
  {
    time: 186.26,
    text: "To honor our bond and to walk in Your way.",
    direction: false,
  },
  {
    time: 194.1,
    text: "Families and distances, the mountains we face,",
    direction: false,
  },
  {
    time: 201.4,
    text: "We lay them all down in the light of Your grace.",
    direction: false,
  },
  {
    time: 207.38,
    text: "We'll remember the promise that stays through the crime:",
    direction: false,
  },
  {
    time: 214.74,
    text: "That You make all things beautiful in Your perfect time.",
    direction: false,
  },
  {
    time: 223.84,
    text: "No, I'm not taking this hand for a moment's thrill,",
    direction: false,
  },
  {
    time: 231.26,
    text: "Or just to follow a restless, human will.",
    direction: false,
  },
  {
    time: 238.16,
    text: "It's not for the body, or a fire that will fade,",
    direction: false,
  },
  {
    time: 245.76,
    text: "But for a sacred promise that You might have made.",
    direction: false,
  },
  {
    time: 251.76,
    text: "Like the prayer in the night from the ages ago,",
    direction: false,
  },
  {
    time: 259.3,
    text: "Let Your mercy be the only rhythm we know.",
    direction: false,
  },
  {
    time: 266.1,
    text: "We come with sincerity, through the fear and the dust,",
    direction: false,
  },
  {
    time: 273.9,
    text: "Looking for Jesus in the middle of us.",
    direction: false,
  },
  { time: 285.28, text: "Grant us mercy...", direction: false },
  { time: 289.32, text: "That we may grow old together.", direction: false },
  { time: 295.5, text: "Give us the strength, Lord.", direction: false },
  { time: 298.96, text: "In Jesus's name,", direction: false },
  { time: 304.5, text: "Amen.", direction: false },
  { time: 309.48, text: "Amen.", direction: false },
];

let spIsPlaying = false;

function stopMainMusicPlayer() {
  // Stop the main vinyl player if it's playing
  if (typeof audio !== "undefined" && audio && !audio.paused) {
    audio.pause();
    if (typeof isPlaying !== "undefined") isPlaying = false;
    const vinylD = document.getElementById("vinyl-disc");
    const pToggle = document.getElementById("player-toggle");
    const pBtn = document.getElementById("play-btn");
    if (vinylD) vinylD.classList.remove("playing");
    if (pToggle) pToggle.classList.remove("playing");
    if (pBtn) pBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
}

function revealSurprisePlayer() {
  const section = document.getElementById("surprise-player-section");
  if (!section) return;

  section.style.display = "flex";
  section.classList.add("revealed");

  // Scroll to it smoothly
  setTimeout(() => {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 300);

  // GSAP entrance animation
  if (typeof gsap !== "undefined") {
    gsap.from(section, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
    });
    gsap.from(".surprise-header", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.3,
      ease: "power2.out",
    });
    gsap.from(".surprise-player-card", {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 1,
      delay: 0.6,
      ease: "power3.out",
    });
  }

  initSurprisePlayer();
}

function initSurprisePlayer() {
  const spAudio = document.getElementById("sp-audio");
  const spPlayBtn = document.getElementById("sp-play-btn");
  const spProgressBar = document.getElementById("sp-progress-bar");
  const spCurrentTime = document.getElementById("sp-current-time");
  const spDuration = document.getElementById("sp-duration");
  const lyricsScroll = document.getElementById("sp-lyrics-scroll");

  if (!spAudio || !spPlayBtn || !lyricsScroll) return;

  // Populate lyrics
  lyricsScroll.innerHTML = "";
  surpriseLyrics.forEach((line, i) => {
    const div = document.createElement("div");
    div.className = "sp-lyric-line" + (line.direction ? " direction" : "");
    div.textContent = line.text || "\u00A0"; // non-breaking space for empty lines
    div.dataset.index = i;
    lyricsScroll.appendChild(div);
  });

  function fmtTime(s) {
    if (!Number.isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  spAudio.addEventListener("loadedmetadata", () => {
    if (spDuration) spDuration.textContent = fmtTime(spAudio.duration);
  });

  spAudio.addEventListener("timeupdate", () => {
    if (spCurrentTime) spCurrentTime.textContent = fmtTime(spAudio.currentTime);
    if (
      spProgressBar &&
      Number.isFinite(spAudio.duration) &&
      spAudio.duration > 0
    ) {
      spProgressBar.value = String(
        (spAudio.currentTime / spAudio.duration) * 100,
      );
    }
    // Highlight active lyric
    highlightLyric(spAudio.currentTime);
  });

  spAudio.addEventListener("ended", () => {
    spIsPlaying = false;
    spPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  });

  if (spProgressBar) {
    spProgressBar.addEventListener("input", () => {
      if (!Number.isFinite(spAudio.duration) || spAudio.duration <= 0) return;
      spAudio.currentTime =
        (Number(spProgressBar.value) / 100) * spAudio.duration;
    });
  }

  spPlayBtn.addEventListener("click", () => {
    if (spIsPlaying) {
      spAudio.pause();
      spPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
      // Stop the main player first
      stopMainMusicPlayer();
      spAudio.play().catch((e) => console.log("Surprise player blocked:", e));
      spPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
    spIsPlaying = !spIsPlaying;
  });

  function highlightLyric(currentTime) {
    const lines = lyricsScroll.querySelectorAll(".sp-lyric-line");
    let activeIndex = -1;

    for (let i = surpriseLyrics.length - 1; i >= 0; i--) {
      if (currentTime >= surpriseLyrics[i].time) {
        activeIndex = i;
        break;
      }
    }

    lines.forEach((line, i) => {
      line.classList.remove("active", "past");
      if (i === activeIndex) {
        line.classList.add("active");
      } else if (i < activeIndex) {
        line.classList.add("past");
      }
    });

    // Auto-scroll to keep active line visible
    if (activeIndex >= 0 && lines[activeIndex]) {
      const activeLine = lines[activeIndex];
      const container = lyricsScroll;
      const lineTop = activeLine.offsetTop - container.offsetTop;
      const scrollTarget = lineTop - container.clientHeight / 3;
      container.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  }
}

// Also stop the surprise player if the main player is activated
(function hookMainPlayerToStopSurprise() {
  const mainPlayBtn = document.getElementById("play-btn");
  const mainVinyl = document.getElementById("vinyl-disc");
  function stopSurprise() {
    const spAudio = document.getElementById("sp-audio");
    const spBtn = document.getElementById("sp-play-btn");
    if (spAudio && !spAudio.paused) {
      spAudio.pause();
      spIsPlaying = false;
      if (spBtn) spBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  }
  if (mainPlayBtn) mainPlayBtn.addEventListener("click", stopSurprise);
  if (mainVinyl) mainVinyl.addEventListener("click", stopSurprise);
})();

// If the login screen is removed/commented during development, auto-initialize the site
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("login-screen")) {
    if (mainContent) {
      mainContent.style.visibility = "visible";
      mainContent.style.opacity = 1;
    }
    // Run initializers (guarded inside each function)
    if (typeof initScrollAnimations === "function") initScrollAnimations();
    if (typeof initLetters === "function") initLetters();
    if (typeof initLibrary === "function") initLibrary();
    if (typeof initMemoryGame === "function") initMemoryGame();
    if (typeof initTriviaGame === "function") initTriviaGame();
    if (typeof initCake === "function") initCake();
    if (typeof initEditorialAnimations === "function")
      initEditorialAnimations();
  }
});
