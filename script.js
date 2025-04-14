/* Particle animation */
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init(); // Reinitialize particles on resize
});

class Particle {
  constructor() {
    this.reset();
  }
  maxOpacity = 0.5;
  Speed = 0.25;
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1 + 1;
    this.speedX = (Math.random() - 0.5) * this.Speed;
    this.speedY = (Math.random() - 0.5) * this.Speed;
    this.maxOpacity = 0.2;
    this.opacity = Math.random() * this.maxOpacity;
    this.opacityChange = Math.random() * 0.005;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity += this.opacityChange;

    if (this.opacity <= 0 || this.opacity >= this.maxOpacity) {
      this.opacityChange *= -1;
    }

    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}

let particlesArray = [];
function init() {
  particlesArray = [];
  const numberOfParticles = 50; // Adjust particle count
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let particle of particlesArray) {
    particle.update();
    particle.draw();
  }
  requestAnimationFrame(animate);
}

init();
animate();

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// --- Scroll Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const moonKnightImage = document.getElementById('moon-knight-image');
    const mrKnightImage = document.getElementById('mr-knight-image');
    const heroImages = [moonKnightImage, mrKnightImage];
    const introductionSection = document.querySelector('.introduction-section');
    const detailsSection = document.querySelector('.details-section');
    const videoQuoteSection = document.getElementById('video-quote-section');
    const videoElement = videoQuoteSection.querySelector('video');
    const titleSpans = document.querySelectorAll('.hero-title .title-text');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    const calculateScrollPoints = () => {
        const viewportHeight = window.innerHeight;
        const introTop = introductionSection.offsetTop;
        const detailsTop = detailsSection.offsetTop;

        // Trigger point for moving images aside
        const asideTriggerPoint = introTop;

        // Scroll range for image clip transition
        const transitionStartScrollY = detailsTop - viewportHeight / 2;
        const transitionDuration = 400; // Pixels over which transition occurs
        const transitionEndScrollY = transitionStartScrollY + transitionDuration;

        return { asideTriggerPoint, transitionStartScrollY, transitionEndScrollY, transitionDuration }; // Added duration
    };

    const handleScroll = () => {
        // Recalculate points in case of resize or dynamic content changes
        const { asideTriggerPoint, transitionStartScrollY, transitionEndScrollY, transitionDuration } = calculateScrollPoints();
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // Title/Subtitle Animation
        const titleTranslateY = Math.min(scrollY * 0.8, 150); // Adjust speed (0.8) and max offset (150)
        if (titleSpans.length > 1 && (-100 - titleTranslateY) >= -200) { // Check condition if needed
            titleSpans[1].style.transform = `translate(60%, ${0 - titleTranslateY}%)`;
        }
        // Add transforms for titleSpans[0] and heroSubtitle if desired

        // Move images aside
        if (scrollY > asideTriggerPoint) {
            heroImages.forEach(el => el.classList.add('aside'));
        } else {
            heroImages.forEach(el => el.classList.remove('aside'));
        }

        // Image reveal clip-path
        let topClipBottomPercent = 0;
        let bottomClipTopPercent = 100;
        let mrKnightOpacity = 0;
        let mrKnightVisibility = 'hidden';

        if (scrollY < transitionStartScrollY) {
            topClipBottomPercent = 0;
            bottomClipTopPercent = 100;
            mrKnightOpacity = 0;
            mrKnightVisibility = 'hidden';
        } else if (scrollY > transitionEndScrollY) {
            topClipBottomPercent = 100;
            bottomClipTopPercent = 0;
            mrKnightOpacity = 1;
            mrKnightVisibility = 'visible';
        } else {
            // During transition
            const progress = (scrollY - transitionStartScrollY) / transitionDuration;
            topClipBottomPercent = clamp(progress * 100, 0, 100);
            bottomClipTopPercent = 100 - topClipBottomPercent;
            mrKnightOpacity = 1;
            mrKnightVisibility = 'visible';
        }

        moonKnightImage.style.clipPath = `inset(0 0 ${topClipBottomPercent}% 0)`;
        mrKnightImage.style.visibility = mrKnightVisibility;
        mrKnightImage.style.opacity = mrKnightOpacity;
        mrKnightImage.style.clipPath = `inset(${bottomClipTopPercent}% 0 0 0)`;

        // Video Parallax Effect
        const sectionTop = videoQuoteSection.offsetTop;
        const sectionHeight = videoQuoteSection.offsetHeight;

        if (scrollY + viewportHeight >= sectionTop && scrollY <= sectionTop + sectionHeight) {
            const relativeScroll = scrollY - sectionTop;
            const parallaxFactor = 0.3; // Adjust video scroll speed (0.1 - 0.7)
            const translateY = relativeScroll * parallaxFactor;
            videoElement.style.transform = `translateY(${translateY}px)`;
        }
        // Optional: Reset transform when out of view
        // else { videoElement.style.transform = `translateY(0px)`; }
    };

    handleScroll(); // Initial call
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
        handleScroll(); // Recalculate on resize
    });
});
