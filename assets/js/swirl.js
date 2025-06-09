(() => {
  const canvas = document.getElementById('canvas');
  const ctx    = canvas.getContext('2d');
  let w, h;

  // keep it full-screen
  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // setup noise + particles
  const noise = new SimplexNoise();
  const particles = [];
  const count = 400;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h
    });
  }

  // animation loop
  function animate() {
    // draw a translucent background to create trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#fff';
    particles.forEach(p => {
      // get an angle from noise
      const angle = noise.noise2D(p.x * 0.002, p.y * 0.002) * Math.PI * 2;
      p.x += Math.cos(angle);
      p.y += Math.sin(angle);

      // wrap
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.fillRect(p.x, p.y, 1, 1);
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
