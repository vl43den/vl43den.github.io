(() => {
  const canvas = document.getElementById('canvas');
  const ctx    = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const noise = new SimplexNoise();
  const particles = Array.from({ length: 400 }, () => ({ x: Math.random() * w, y: Math.random() * h }));

  function animate() {
    // Darken slightly each frame so the trails cover the whole screen
    ctx.fillStyle = 'rgba(0,0,0,0.03)'; // slower fading for longer trails
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#fff';
    particles.forEach(p => {
      const angle = noise.noise2D(p.x * 0.002, p.y * 0.002) * Math.PI * 2;
      p.x += Math.cos(angle);
      p.y += Math.sin(angle);
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
