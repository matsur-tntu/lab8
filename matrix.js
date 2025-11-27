// Neural Network Particle Background Animation
class NeuralNetwork {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'neural-canvas';
    this.ctx = this.canvas.getContext('2d');

    this.matrixBg = document.getElementById('matrix-bg');
    this.matrixBg.appendChild(this.canvas);
    this.matrixBg.style.pointerEvents = 'auto';
    this.canvas.style.pointerEvents = 'auto';

    this.particles = [];
    this.numParticles = 256;
    this.maxDistance = 128;
    this.mouse = { x: null, y: null };

    this.init();
    this.animate();
    this.addEventListeners();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createParticles();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: this.getRandomColor()
      });
    }
  }

  getRandomColor() {
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ff0000', '#00ff00', '#0000ff'];
    // const colors = ['#ff00ff', '#0000ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  addEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update particles
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
    });

    // Draw connections
    this.particles.forEach((p1, i) => {
      this.particles.slice(i + 1).forEach(p2 => {
        const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        if (distance < this.maxDistance) {
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / this.maxDistance})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      });

      // Connect to mouse if close
      if (this.mouse.x !== null) {
        const mouseDistance = Math.sqrt((p1.x - this.mouse.x) ** 2 + (p1.y - this.mouse.y) ** 2);
        if (mouseDistance < this.maxDistance) {
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(255, 255, 0, ${1 - mouseDistance / this.maxDistance})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize neural network when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NeuralNetwork();
});
