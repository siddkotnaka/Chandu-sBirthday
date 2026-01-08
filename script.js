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
const memorySlides = memorySlider ? memorySlider.children : [];
const memoryVideos = document.querySelectorAll(".memoryVideo");

// ================== MUSIC (FIRST TOUCH) ==================
document.body.addEventListener(
  "touchstart",
  () => {
    if (music) music.play().catch(() => {});
  },
  { once: true }
);

// ================== LOVE INTRO ANIMATION ==================
if (heartBtn) {
  heartBtn.addEventListener("click", () => {
    // Arrow shoots diagonally
    arrow.style.opacity = "1";
    arrow.classList.add("shoot");

    // Heart hit
    setTimeout(() => {
      heartBtn.classList.add("hit");
    }, 600);

    // White flash
    setTimeout(() => {
      flash.classList.add("flash-on");
    }, 1200);

    // Start intro video
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

// ================== PAGE 2 AUTO SLIDER (FIX-4 FINAL) ==================
let memoryIndex = 0;
let autoSlideInterval = null;

// Go to slide
function goToMemorySlide(index) {
  if (!memorySlider) return;

  memorySlider.scrollTo({
    left: index * memorySlider.clientWidth,
    behavior: "smooth",
  });

  // Pause all videos
  memoryVideos.forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });

  // Play active slide video
  const activeSlide = memorySlides[index];
  if (!activeSlide) return;

  const activeVideo = activeSlide.querySelector("video");
  if (activeVideo) {
    activeVideo.play().catch(() => {});
  }
}

// Start auto slide
function startAutoSlide() {
  if (!memorySlider) return;

  autoSlideInterval = setInterval(() => {
    memoryIndex = (memoryIndex + 1) % memorySlides.length;
    goToMemorySlide(memoryIndex);
  }, 7000);
}

// Stop auto slide
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Init
if (memorySlider && memorySlides.length > 0) {
  goToMemorySlide(0);
  startAutoSlide();

  // Pause when user touches (Safari safe)
  memorySlider.addEventListener("touchstart", stopAutoSlide);
  memorySlider.addEventListener("touchend", startAutoSlide);
}
