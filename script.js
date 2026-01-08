// ================== ELEMENTS ==================
const heartBtn = document.getElementById("heartBtn");
const arrow = document.getElementById("arrow");
const flash = document.getElementById("flash");
const introVideo = document.getElementById("introVideo");
const pages = document.querySelector(".pages");
const music = document.getElementById("bgMusic");
const heartsContainer = document.getElementById("hearts");

// Page 2
const memorySlider = document.getElementById("memorySlider");
const memorySlides = memorySlider
  ? memorySlider.querySelectorAll(".slide")
  : [];
const memoryVideos = document.querySelectorAll(".memoryVideo");

// ================== MUSIC (FIRST TOUCH) ==================
document.body.addEventListener(
  "touchstart",
  () => {
    if (music) music.play().catch(() => {});
  },
  { once: true }
);

// ================== INTRO HEART SEQUENCE ==================
if (heartBtn) {
  heartBtn.addEventListener("click", () => {
    arrow.style.opacity = "1";
    arrow.classList.add("shoot");

    setTimeout(() => {
      heartBtn.classList.add("hit");
    }, 600);

    setTimeout(() => {
      flash.classList.add("flash-on");
    }, 1200);

    setTimeout(() => {
      heartBtn.style.display = "none";
      arrow.style.display = "none";
      introVideo.style.display = "block";
      introVideo.play();
    }, 1600);
  });
}

// ================== AUTO SCROLL AFTER INTRO VIDEO ==================
if (introVideo) {
  introVideo.addEventListener("ended", () => {
    pages.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  });
}

// ================== BACKGROUND FLOATING HEARTS ==================
function createFloatingHeart() {
  if (!heartsContainer) return;

  const heart = document.createElement("span");
  heart.innerHTML = "❤️";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = Math.random() * 8 + 10 + "px";
  heart.style.animationDuration = Math.random() * 3 + 4 + "s";

  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 7000);
}

setInterval(createFloatingHeart, 400);

// ================== PAGE 2 SMART SLIDER ==================
let memoryIndex = 0;
let autoSlideInterval = null;
let touchStartY = 0;
let touchEndY = 0;

// GO TO SLIDE
function goToMemorySlide(index) {
  if (!memorySlider) return;

  memorySlider.scrollTo({
    left: index * memorySlider.clientWidth,
    behavior: "smooth",
  });

  [...memorySlides].forEach((slide) => {
    slide.classList.remove("active");
    const v = slide.querySelector("video");
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  });

  const activeSlide = memorySlides[index];
  if (!activeSlide) return;

  activeSlide.classList.add("active");

  const activeVideo = activeSlide.querySelector("video");

  // 🎥 VIDEO SLIDE → WAIT TILL END
  if (activeVideo) {
    stopAutoSlide();
    activeVideo.play().catch(() => {});

    activeVideo.onended = () => {
      memoryIndex = (memoryIndex + 1) % memorySlides.length;
      goToMemorySlide(memoryIndex);
    };
  } 
  // 🖼 IMAGE SLIDE → AUTO SLIDE
  else {
    startAutoSlide();
  }
}

// AUTO SLIDE (IMAGES ONLY)
function startAutoSlide() {
  stopAutoSlide();
  autoSlideInterval = setInterval(() => {
    memoryIndex = (memoryIndex + 1) % memorySlides.length;
    goToMemorySlide(memoryIndex);
  }, 6000);
}

function stopAutoSlide() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
}

// INIT
if (memorySlider && memorySlides.length > 0) {
  goToMemorySlide(0);

  memorySlider.addEventListener("touchstart", stopAutoSlide);
  memorySlider.addEventListener("touchend", startAutoSlide);
}

// ================== SWIPE DOWN → NEXT PAGE ==================
if (memorySlider) {
  memorySlider.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
  });

  memorySlider.addEventListener("touchend", (e) => {
    touchEndY = e.changedTouches[0].clientY;

    if (touchStartY - touchEndY > 80) {
      pages.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  });
}

