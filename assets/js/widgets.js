const widgets = document.querySelectorAll('.widget');
widgets.forEach(widget => {
  widget.addEventListener('mousemove', e => {
    const rect = widget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    widget.style.transform = `rotateX(${(-y / 20)}deg) rotateY(${x / 20}deg)`;
  });
  widget.addEventListener('mouseleave', () => {
    widget.style.transform = 'rotateX(0) rotateY(0)';
  });
});
