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
