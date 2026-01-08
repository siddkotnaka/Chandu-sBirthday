// ================== ELEMENTS ==================
const heartBtn = document.getElementById("heartBtn");
const arrow = document.getElementById("arrow");
const flash = document.getElementById("flash");
const introVideo = document.getElementById("introVideo");
const pages = document.querySelector(".pages");
const music = document.getElementById("bgMusic");
const heartsContainer = document.getElementById("hearts");

// ================== MUSIC ==================
document.body.addEventListener("touchstart", () => {
    if (music) music.play();
}, { once: true });

// ================== LOVE ANIMATION ==================
heartBtn.addEventListener("click", () => {

    // Arrow appears & shoots
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

    // Start video
    setTimeout(() => {
        heartBtn.style.display = "none";
        arrow.style.display = "none";
        introVideo.style.display = "block";
        introVideo.play();
    }, 1600);
});

// ================== AUTO SCROLL AFTER VIDEO ==================
introVideo.addEventListener("ended", () => {
    pages.scrollTo({
        top: window.innerHeight,
        behavior: "smooth"
    });
});

// ================== BACKGROUND FLOATING HEARTS ==================
function createHeart() {
    const heart = document.createElement("span");
    heart.innerHTML = "❤️";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = (Math.random() * 3 + 4) + "s";
    heart.style.fontSize = (Math.random() * 8 + 10) + "px";

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 7000);
}

setInterval(createHeart, 400);

const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const beat = document.getElementById("swipeBeat");

let currentIndex = 0;

/* CREATE FLOATING HEARTS */
function createHeart(container) {
    const heart = document.createElement("span");
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = (3 + Math.random() * 2) + "s";
    container.appendChild(heart);

    setTimeout(() => heart.remove(), 5000);
}

/* ACTIVATE SLIDE */
function activateSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);

        const video = slide.querySelector("video");
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });

    const activeSlide = slides[index];

    /* Auto play video */
    const activeVideo = activeSlide.querySelector("video");
    if (activeVideo) {
        activeVideo.play();
    }

    /* Floating hearts */
    const heartBox = activeSlide.querySelector(".floating-hearts");
    setInterval(() => createHeart(heartBox), 800);

    /* Beat sync */
    beat.currentTime = 0;
    beat.play();
}

/* TOUCH SWIPE */
let startX = 0;

slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

slider.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50 && currentIndex < slides.length - 1) {
        currentIndex++;
        slider.style.transform = `translateX(-${currentIndex * 100}vw)`;
        activateSlide(currentIndex);
    }
});

/* INITIAL SLIDE */
activateSlide(0);

const finalText = `
I know your emotions right now…
I just want you to smile again.

Distance made us apart,
but memories stay forever.

I will always be there for you ❤️
`;

const finalBox = document.getElementById("finalMessage");
const heartBeat = document.getElementById("heartBeat");

let i = 0;

function typeMessage() {
    if (i < finalText.length) {
        finalBox.innerHTML += finalText.charAt(i);
        i++;
        setTimeout(typeMessage, 80);
    }
}

/* Start final animation */
function startFinal() {
    heartBeat.volume = 0.6;
    heartBeat.play();
    typeMessage();

    setTimeout(() => {
        document.body.style.transition = "opacity 4s";
        document.body.style.opacity = "0";
    }, 15000);
}

if (currentIndex === slides.length - 1) {
    startFinal();
}
