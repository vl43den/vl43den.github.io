document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('.widget a, section:not(.widgets) a');
  
  links.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
      this.style.transform = 'translateY(-3px)';
      this.style.textShadow = '0 5px 15px rgba(100, 180, 255, 0.4)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.textShadow = 'none';
    });
  });
});
