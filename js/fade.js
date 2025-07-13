const sections = document.querySelectorAll("section");
const reveal = () => {
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    const winHeight = window.innerHeight;
    if (top < winHeight - 100) sec.classList.add("visible");
  });
};
window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);

document.querySelectorAll('.glass-card').forEach(card => {
  const bubble = card.querySelector('.glow-bubble');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    bubble.style.opacity = 1;
  });

  card.addEventListener('mouseleave', () => {
    bubble.style.opacity = 0;
  });
});
