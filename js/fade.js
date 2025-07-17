// This script handles the glow-bubble effect, Formspree submission, Typewriter effect, and Welcome Pop-up.

document.addEventListener('DOMContentLoaded', () => {
    // === Music and Pop-up Logic ===
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggleButton = document.getElementById('musicToggleButton');
    const welcomePopupOverlay = document.getElementById('welcome-popup-overlay');
    const popupPlayButton = document.getElementById('popupPlayButton');
    const volumeSlider = document.getElementById('volumeSlider');
    let isPlaying = false; // To track music state

    // Initialize volume slider and music volume
    if (backgroundMusic && volumeSlider) {
        // Load saved volume on page load for the slider's position
        const savedVolume = localStorage.getItem('musicVolume');
        if (savedVolume !== null) {
            backgroundMusic.volume = parseFloat(savedVolume);
            volumeSlider.value = parseFloat(savedVolume);
        } else {
            backgroundMusic.volume = volumeSlider.value; // Set music volume to initial slider value (0.5 by default)
        }
    }

    // Save music state before unloading the page
    window.addEventListener('beforeunload', () => {
        if (backgroundMusic) {
            localStorage.setItem('musicPlaybackTime', backgroundMusic.currentTime);
            localStorage.setItem('isMusicPlaying', !backgroundMusic.paused); // Save true if playing, false if paused
            localStorage.setItem('musicVolume', backgroundMusic.volume); // Save current volume
        }
    });

    // Show the welcome pop-up immediately on load
    if (welcomePopupOverlay) {
        setTimeout(() => {
            welcomePopupOverlay.classList.add('show');
        }, 100);
    }

    // Function to start music playback and update UI
    const startMusic = () => {
        if (backgroundMusic) {
            const savedTime = localStorage.getItem('musicPlaybackTime');
            if (savedTime) {
                backgroundMusic.currentTime = parseFloat(savedTime);
            }

            backgroundMusic.play().then(() => {
                isPlaying = true;
                if (musicToggleButton) {
                    musicToggleButton.innerHTML = '&#10074;&#10074;'; // Set to pause icon
                }
                localStorage.setItem('isMusicPlaying', true);
            }).catch(e => {
                console.log("Music playback prevented (likely no user gesture):", e.name);
                isPlaying = false;
                if (musicToggleButton) {
                    musicToggleButton.innerHTML = '&#9658;'; // Keep play icon
                }
                localStorage.setItem('isMusicPlaying', false);
            });
        }
    };

    // Handle click on the pop-up's 'Enter' button
    if (popupPlayButton) {
        popupPlayButton.addEventListener('click', () => {
            startMusic(); // Attempt to play music
            // Hide the pop-up after playing (or attempting to play)
            if (welcomePopupOverlay) {
                welcomePopupOverlay.classList.remove('show');
                welcomePopupOverlay.addEventListener('transitionend', function handler() {
                    welcomePopupOverlay.removeEventListener('transitionend', handler);
                    welcomePopupOverlay.style.display = 'none'; // Completely hide
                    // Trigger typewriter effect ONLY after popup is gone
                    startTypewriter();
                });
            }
        });
    }

    // Music Toggle Button Logic (bottom-right)
    if (musicToggleButton) {
        musicToggleButton.addEventListener('click', () => {
            if (backgroundMusic) {
                if (isPlaying) {
                    backgroundMusic.pause();
                    musicToggleButton.innerHTML = '&#9658;'; // Play icon
                    localStorage.setItem('isMusicPlaying', false); // Save paused state
                } else {
                    startMusic(); // Re-use startMusic function
                }
                isPlaying = !isPlaying;
            }
        });

        // Update button icon if playback state changes (e.g., user pauses via browser controls)
        if (backgroundMusic) {
            backgroundMusic.addEventListener('play', () => {
                isPlaying = true;
                musicToggleButton.innerHTML = '&#10074;&#10074;';
                localStorage.setItem('isMusicPlaying', true);
            });
            backgroundMusic.addEventListener('pause', () => {
                isPlaying = false;
                musicToggleButton.innerHTML = '&#9658;';
                localStorage.setItem('isMusicPlaying', false);
            });
        }
    }

    // Volume Slider Logic
    if (volumeSlider && backgroundMusic) {
        volumeSlider.addEventListener('input', () => {
            backgroundMusic.volume = volumeSlider.value;
            localStorage.setItem('musicVolume', backgroundMusic.volume); // Save volume
        });
    }

    // === Glow Bubble Logic - OPTIMIZED to use transform for better performance ===
    document.querySelectorAll('.glass-card').forEach(card => {
        let bubble = card.querySelector('.glow-bubble');
        if (!bubble) {
            bubble = document.createElement('div');
            bubble.classList.add('glow-bubble');
            card.appendChild(bubble);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate position relative to the card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Use transform for smoother, GPU-accelerated movement
            bubble.style.transform = `translate(${x - bubble.offsetWidth / 2}px, ${y - bubble.offsetHeight / 2}px) scale(1)`;
            bubble.style.opacity = 1;
        });

        card.addEventListener('mouseleave', () => {
            bubble.style.opacity = 0;
            // Reset transform or let transition handle it
            bubble.style.transform = `translate(-50%, -50%) scale(0.8)`; // Reset to initial state
        });
    });

    // === Formspree Submission Logic ===
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            formStatus.textContent = 'Sending...';
            formStatus.style.color = '#38bdf8';

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                const response = await fetch('https://formspree.io/f/mnnzarqj', { // <-- VERIFY/UPDATE THIS!
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.style.color = '#00eaff';
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    formStatus.textContent = `Failed to send message: ${errorData.message || 'Server error'}`;
                    formStatus.style.color = '#ff4d4d';
                }
            } catch (error) {
                formStatus.textContent = `An error occurred: ${error.message}`;
                formStatus.style.color = '#ff4d4d';
            }
        });
    }

    // === Typewriter Effect Logic ===
    const typewriterTextElement = document.getElementById('typewriter-text');
    const textToType = "Aspiring Millionaire | SHS Student";
    let charIndex = 0;
    const typingSpeed = 70;
    const delayBeforeStart = 500; // Initial delay before typing starts after popup dismissal

    function typeWriter() {
        if (typewriterTextElement && charIndex < textToType.length) {
            typewriterTextElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        }
    }

    // Function to start the typewriter effect
    function startTypewriter() {
        if (typewriterTextElement) {
            typewriterTextElement.textContent = ''; // Clear existing text
            charIndex = 0; // Reset index
            setTimeout(typeWriter, delayBeforeStart);
        }
    }

    // Initial check for music state on page load (if popup is skipped or directly accessed)
    // This handles cases where user might refresh and music was previously playing.
    const savedMusicPlaying = localStorage.getItem('isMusicPlaying');
    if (savedMusicPlaying === 'true' && backgroundMusic) {
        const savedTime = localStorage.getItem('musicPlaybackTime');
        if (savedTime) {
            backgroundMusic.currentTime = parseFloat(savedTime);
        }
        backgroundMusic.play().then(() => {
            isPlaying = true;
            if (musicToggleButton) {
                musicToggleButton.innerHTML = '&#10074;&#10074;';
            }
            startTypewriter(); // Start typewriter if music auto-plays
        }).catch(e => {
            console.log("Auto-play prevented on load:", e.name);
            startTypewriter(); // Still start typewriter even if auto-play fails
        });
    } else {
        // If music was not playing or no saved state, just start typewriter after a small delay
        // This ensures typewriter starts if the popup is not shown (e.g., direct navigation)
        setTimeout(startTypewriter, delayBeforeStart + 500); // Small additional delay for non-popup start
    }
});
