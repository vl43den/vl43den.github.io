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
  
  // Modern color palette - subtle blues and purples
  const colors = [
    'rgba(120, 150, 255, 0.7)', // Light blue
    'rgba(150, 120, 255, 0.7)', // Light purple
    'rgba(180, 180, 255, 0.7)', // Very light blue
    'rgba(255, 255, 255, 0.9)'  // White (brighter)
  ];
  
  // Create more particles with varied sizes for a more dynamic effect
  const particles = Array.from({ length: 300 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 2.5 + 0.5, // Varied sizes
    color: colors[Math.floor(Math.random() * colors.length)], // Random color
    speed: 0.3 + Math.random() * 0.8 // Varied speeds
  }));
  
  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, w, h);
    // Using a much lower alpha value to reduce flashing
    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.fillRect(0, 0, w, h);
    
    time += 0.005;

    particles.forEach(p => {
      // More complex movement pattern with time factor
      const angle = noise.noise3D(p.x * 0.001, p.y * 0.001, time) * Math.PI * 2;
      
      p.x += Math.cos(angle) * p.speed;
      p.y += Math.sin(angle) * p.speed;
      
      // Wrap around edges
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      
      // Draw with glow effect
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = p.color;
      
      // Draw circle instead of rectangle for smoother particles
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
