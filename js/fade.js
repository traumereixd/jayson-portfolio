// This section handles the fade-in effect for sections as you scroll.
// However, since AOS is now implemented for "animate-on-scroll",
// this part might be redundant if AOS handles all animations.
// If you want to keep this custom fade, ensure it doesn't conflict with AOS.
// For now, I'm keeping it as you had it previously.
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


// JavaScript for Glass Card Glow Bubble
// This dynamically creates and positions the glow bubble effect on hover.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.glass-card').forEach(card => {
    // Create the glow-bubble element if it doesn't exist
    let bubble = card.querySelector('.glow-bubble');
    if (!bubble) {
      bubble = document.createElement('div');
      bubble.classList.add('glow-bubble');
      card.appendChild(bubble);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      // Calculate mouse position relative to the card
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Position the glow bubble
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;
      bubble.style.opacity = 1; // Make it visible
    });

    card.addEventListener('mouseleave', () => {
      bubble.style.opacity = 0; // Hide it on mouse leave
    });
  });

    // Formspree Submission Logic
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            formStatus.textContent = 'Sending...';
            formStatus.style.color = '#38bdf8'; // Blue for sending status

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                // Replace 'YOUR_FORM_SUBMISSION_ENDPOINT' with your actual Formspree form URL
                // Example: https://formspree.io/f/your_form_hash (from your Formspree dashboard)
                const response = await fetch('https://formspree.io/f/mqkvnwno', { // <-- Make sure this is YOUR Formspree endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.style.color = '#00eaff'; // Neon blue for success
                    contactForm.reset(); // Clear the form
                } else {
                    const errorData = await response.json();
                    formStatus.textContent = `Failed to send message: ${errorData.message || 'Server error'}`;
                    formStatus.style.color = '#ff4d4d'; // Red for error
                }
            } catch (error) {
                formStatus.textContent = `An error occurred: ${error.message}`;
                formStatus.style.color = '#ff4d4d'; // Red for error
            }
        });
    }
});