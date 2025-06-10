document.addEventListener('DOMContentLoaded', function() {
  // Find the first h1 on the homepage only
  if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html')) {
    const title = document.querySelector('h1');
    if (!title) return;
    
    // Save the original text and clear it
    const text = title.textContent;
    title.innerHTML = '';
    
    // Create a span with cursor for typing effect
    const typingSpan = document.createElement('span');
    title.appendChild(typingSpan);
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.opacity = '1';
    cursor.style.animation = 'blink 1s infinite';
    cursor.style.marginLeft = '2px';
    title.appendChild(cursor);
    
    // Add blinking cursor style
    if (!document.getElementById('cursor-style')) {
      const style = document.createElement('style');
      style.id = 'cursor-style';
      style.textContent = '@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }';
      document.head.appendChild(style);
    }
    
    // Type out text
    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        typingSpan.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          cursor.remove();
        }, 1500);
      }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriter, 500);
  }
});
