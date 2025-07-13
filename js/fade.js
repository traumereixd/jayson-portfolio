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

// JavaScript for Intersection Observer (animate on scroll)
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optionally, stop observing once it's visible to prevent re-triggering
                // observer.unobserve(entry.target);
            } else {
                // Optional: remove class when not visible to allow re-animation on scroll up
                entry.target.classList.remove('is-visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
});

// JavaScript for Contact Form (frontend only - requires backend for email)
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            formStatus.textContent = 'Sending...';
            formStatus.style.color = '#fff';

            // In a real application, you'd send this data to a backend server
            // using fetch() or XMLHttpRequest.
            // For now, this is a simulated success/failure.
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simulate API call
            try {
                // Replace this with your actual backend endpoint (e.g., using Formspree, Netlify Forms, or your own serverless function)
                const response = await fetch('YOUR_FORM_SUBMISSION_ENDPOINT', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.style.color = '#00eaff'; // Green for success
                    contactForm.reset(); // Clear the form
                } else {
                    const errorData = await response.json();
                    formStatus.textContent = `Failed to send message: ${errorData.message || 'Server error'}`;
                    formStatus.style.color = '#ff4d4d'; // Red for error
                }
            } catch (error) {
                formStatus.textContent = `An error occurred: ${error.message}`;
                formStatus.style.color = '#ff4d4d';
            }
        });
    }
});