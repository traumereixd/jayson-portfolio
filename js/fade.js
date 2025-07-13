// This function handles the mouse glow bubble effect on glass cards
document.querySelectorAll('.glass-card').forEach(card => {
  let bubble = card.querySelector('.glow-bubble');

  // If bubble doesn't exist, create it and append it
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.classList.add('glow-bubble');
    card.appendChild(bubble);
  }

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
    // AOS (Animate On Scroll) is already handled by AOS.init()
    // This Intersection Observer is for 'is-visible' class, complementing AOS if needed
    // You can remove this block if AOS alone provides all desired scroll animations

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Uncomment to animate only once
            } else {
                // entry.target.classList.remove('is-visible'); // Uncomment to re-animate on scroll up
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

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                // !!! IMPORTANT: REPLACE 'YOUR_FORM_SUBMISSION_ENDPOINT' with your actual endpoint !!!
                // Examples: Formspree (https://formspree.io/), Netlify Forms, Vercel Forms, or your own backend.
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