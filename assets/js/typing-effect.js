/**
 * Typing Effect - Cycles through roles in the hero section
 */
(function () {
  const TYPING_SPEED = 80;
  const DELETE_SPEED = 50;
  const PAUSE_DURATION = 2000;

  function init() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const roles = window.typingRoles || [
      "Security Researcher",
      "CTF Player",
      "Developer"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(type, 500);
        } else {
          setTimeout(type, DELETE_SPEED);
        }
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(type, PAUSE_DURATION);
        } else {
          setTimeout(type, TYPING_SPEED);
        }
      }
    }

    // Start after a short delay
    setTimeout(type, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

