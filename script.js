/* Particle animation using canvas */

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

    // Reverse opacity change when it hits limits
    if (this.opacity <= 0 || this.opacity >= this.maxOpacity) {
      this.opacityChange *= -1;
    }

    // Reset particle if out of bounds
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
  const numberOfParticles = 50;
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
// Scroll-based text translation for "MOON" and "KNIGHT"
const title = document.getElementsByClassName("title-text");
const image = document.getElementsByClassName("hero-image")[0];
const introSection = document.querySelector(".introduction-section"); // Get the intro section

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const translateY = Math.min(scrollY * 0.8, 100); // Adjust the multiplier and max value as needed
  title[1].style.transform = `translate(60%, ${-100 - translateY}%)`;
  document.getElementsByClassName("hero-subtitle")[0].style.transform = `translate(0%, ${-300 - translateY * 2}%)`;

  // Calculate the trigger point (e.g., when the top of the intro section reaches the middle of the viewport)
  const introSectionTop = introSection.offsetTop;
  const triggerPoint = window.innerHeight + 50; // Adjust trigger sensitivity
  console.log(scrollY +":" + triggerPoint);

  if (scrollY > triggerPoint) {
    image.classList.add("aside");
  } else {
    image.classList.remove("aside");
    // Only apply original scroll effects if the 'aside' class is not present
    image.style.height = clamp(120 - scrollY / 6, 90, 120) + "%";
    image.style.top = clamp(70 - scrollY / 6, 50, 70) + "%";
    // Ensure left and transform are reset if needed (handled by removing .aside class and CSS)
  }
});
