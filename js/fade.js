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
        backgroundMusic.volume = volumeSlider.value; // Set music volume to initial slider value (0.5 by default)
    }

    // NEW: Save music state before unloading the page
    window.addEventListener('beforeunload', () => {
        if (backgroundMusic) {
            localStorage.setItem('musicPlaybackTime', backgroundMusic.currentTime);
            localStorage.setItem('isMusicPlaying', !backgroundMusic.paused); // Save true if playing, false if paused
        }
    });

    // Show the welcome pop-up immediately on load
    if (welcomePopupOverlay) {
        setTimeout(() => {
            welcomePopupOverlay.classList.add('show');
        }, 100);
    }

    // Handle click on the pop-up's 'Enter' button
    if (popupPlayButton) {
        popupPlayButton.addEventListener('click', () => {
            if (backgroundMusic) {
                // NEW: Attempt to restore playback time if available
                const savedTime = localStorage.getItem('musicPlaybackTime');
                if (savedTime) {
                    backgroundMusic.currentTime = parseFloat(savedTime);
                }

                // Play the music
                backgroundMusic.play().then(() => {
                    isPlaying = true;
                    if (musicToggleButton) {
                        musicToggleButton.innerHTML = '&#10074;&#10074;'; // Set to pause icon
                    }
                    // NEW: Restore volume slider position
                    if (volumeSlider) {
                        const savedVolume = localStorage.getItem('musicVolume');
                        if (savedVolume !== null) {
                            backgroundMusic.volume = parseFloat(savedVolume);
                            volumeSlider.value = parseFloat(savedVolume);
                        } else {
                            // If no saved volume, use current slider value (default 0.5)
                            backgroundMusic.volume = volumeSlider.value;
                        }
                    }
                }).catch(e => {
                    console.log("Music playback prevented (likely no user gesture):", e.name);
                    isPlaying = false;
                    if (musicToggleButton) {
                        musicToggleButton.innerHTML = '&#9658;'; // Keep play icon
                    }
                });
            }

            // Hide the pop-up after playing (or attempting to play)
            if (welcomePopupOverlay) {
                welcomePopupOverlay.classList.remove('show');
                welcomePopupOverlay.addEventListener('transitionend', function handler() {
                    welcomePopupOverlay.removeEventListener('transitionend', handler);
                    welcomePopupOverlay.style.display = 'none'; // Completely hide
                });
            }
        });
    }

    // Existing Music Toggle Button Logic (bottom-right)
    if (musicToggleButton) {
        musicToggleButton.addEventListener('click', () => {
            if (backgroundMusic) {
                if (isPlaying) {
                    backgroundMusic.pause();
                    musicToggleButton.innerHTML = '&#9658;'; // Play icon
                    localStorage.setItem('isMusicPlaying', false); // Save paused state
                } else {
                    backgroundMusic.play().catch(e => {
                        console.log("Manual play prevented:", e.name);
                        musicToggleButton.innerHTML = '&#9658;'; // Keep play icon if failed
                    });
                    musicToggleButton.innerHTML = '&#10074;&#10074;'; // Pause icon
                    localStorage.setItem('isMusicPlaying', true); // Save playing state
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
        // NEW: Load saved volume on page load for the slider's position
        const savedVolume = localStorage.getItem('musicVolume');
        if (savedVolume !== null) {
            volumeSlider.value = parseFloat(savedVolume);
            // Music volume will be set when popupPlayButton is clicked or if music is manually played
        }

        volumeSlider.addEventListener('input', () => {
            backgroundMusic.volume = volumeSlider.value;
            localStorage.setItem('musicVolume', backgroundMusic.volume); // NEW: Save volume
        });
    }

    // Initialize volume slider
    if (backgroundMusic && volumeSlider) {
        backgroundMusic.volume = volumeSlider.value; // Set music volume to initial slider value (0.5 by default)
    }

    // Show the welcome pop-up immediately on load
    if (welcomePopupOverlay) {
        setTimeout(() => {
            welcomePopupOverlay.classList.add('show');
        }, 100);
    }

    // Handle click on the pop-up's 'Enter' button
    if (popupPlayButton) {
        popupPlayButton.addEventListener('click', () => {
            if (backgroundMusic) {
                backgroundMusic.play().then(() => {
                    isPlaying = true;
                    if (musicToggleButton) {
                        musicToggleButton.innerHTML = '&#10074;&#10074;'; // Set to pause icon
                    }
                }).catch(e => {
                    console.log("Music playback prevented (likely no user gesture):", e.name);
                    isPlaying = false;
                    if (musicToggleButton) {
                        musicToggleButton.innerHTML = '&#9658;'; // Keep play icon
                    }
                });
            }

            // Hide the pop-up after playing (or attempting to play)
            if (welcomePopupOverlay) {
                welcomePopupOverlay.classList.remove('show');
                welcomePopupOverlay.addEventListener('transitionend', function handler() {
                    welcomePopupOverlay.removeEventListener('transitionend', handler);
                    welcomePopupOverlay.style.display = 'none'; // Completely hide
                });
            }
        });
    }

    // Existing Music Toggle Button Logic (bottom-right)
    if (musicToggleButton) {
        musicToggleButton.addEventListener('click', () => {
            if (backgroundMusic) {
                if (isPlaying) {
                    backgroundMusic.pause();
                    musicToggleButton.innerHTML = '&#9658;'; // Play icon
                } else {
                    backgroundMusic.play().catch(e => {
                        console.log("Manual play prevented:", e.name);
                        musicToggleButton.innerHTML = '&#9658;'; // Keep play icon if failed
                    });
                    musicToggleButton.innerHTML = '&#10074;&#10074;'; // Pause icon
                }
                isPlaying = !isPlaying;
            }
        });

        // Update button icon if playback state changes (e.g., user pauses via browser controls)
        if (backgroundMusic) {
            backgroundMusic.addEventListener('play', () => {
                isPlaying = true;
                musicToggleButton.innerHTML = '&#10074;&#10074;';
            });
            backgroundMusic.addEventListener('pause', () => {
                isPlaying = false;
                musicToggleButton.innerHTML = '&#9658;';
            });
        }
    }

    // NEW: Volume Slider Logic
    if (volumeSlider && backgroundMusic) {
        volumeSlider.addEventListener('input', () => {
            backgroundMusic.volume = volumeSlider.value;
        });
    }

    // Handle click on the pop-up's 'Enter' button
    if (popupPlayButton) {
        popupPlayButton.addEventListener('click', () => {
            if (backgroundMusic) {
                backgroundMusic.play().then(() => {
                    isPlaying = true;
                    if (musicToggleButton) {
                        musicToggleButton.innerHTML = '&#10074;&#10074;'; // Set to pause icon
                    }
                }).catch(e => {
                    console.log("Music playback prevented (likely no user gesture):", e.name);
                    isPlaying = false;
                    if (musicToggleButton) {
                        musicToggleButton.innerHTML = '&#9658;'; // Keep play icon
                    }
                });
            }

            // Hide the pop-up after playing (or attempting to play)
            if (welcomePopupOverlay) {
                welcomePopupOverlay.classList.remove('show');
                // Optional: Remove the pop-up from DOM after transition for cleanliness
                welcomePopupOverlay.addEventListener('transitionend', function handler() {
                    welcomePopupOverlay.removeEventListener('transitionend', handler);
                    welcomePopupOverlay.style.display = 'none'; // Completely hide
                });
            }
        });
    }

    // Existing Music Toggle Button Logic (bottom-right)
    if (musicToggleButton) {
        musicToggleButton.addEventListener('click', () => {
            if (backgroundMusic) {
                if (isPlaying) {
                    backgroundMusic.pause();
                    musicToggleButton.innerHTML = '&#9658;'; // Play icon
                } else {
                    backgroundMusic.play().catch(e => {
                        console.log("Manual play prevented:", e.name);
                        musicToggleButton.innerHTML = '&#9658;'; // Keep play icon if failed
                    });
                    musicToggleButton.innerHTML = '&#10074;&#10074;'; // Pause icon
                }
                isPlaying = !isPlaying;
            }
        });

        // Update button icon if playback state changes (e.g., user pauses via browser controls)
        if (backgroundMusic) {
            backgroundMusic.addEventListener('play', () => {
                isPlaying = true;
                musicToggleButton.innerHTML = '&#10074;&#10074;';
            });
            backgroundMusic.addEventListener('pause', () => {
                isPlaying = false;
                musicToggleButton.innerHTML = '&#9658;';
            });
        }
    }


    // === Glass Card Glow Bubble Logic ===
    document.querySelectorAll('.glass-card').forEach(card => {
        let bubble = card.querySelector('.glow-bubble');
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
                // IMPORTANT: Replace 'https://formspree.io/f/mqkvnwno' with your actual Formspree form URL
                const response = await fetch('https://formspree.io/f/mqkvnwno', { // <-- VERIFY/UPDATE THIS!
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
    if (typewriterTextElement) {
        const textToType = "Aspiring Millionaire | SHS Student";
        let charIndex = 0;
        const typingSpeed = 70;
        const delayBeforeStart = 500;

        function typeWriter() {
            if (charIndex < textToType.length) {
                typewriterTextElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typingSpeed);
            }
        }

        // Start typing after a short delay, but only after the pop-up is dismissed or page is fully interactive
        // To ensure typewriter doesn't start until pop-up is gone, we can move this, but for simplicity
        // for now, it starts after DOMContentLoaded and will be obscured by popup.
        // A more advanced solution would be to trigger this after popup dismissal.
        // For now, it will start behind the pop-up and become visible later.
        setTimeout(typeWriter, delayBeforeStart);
    }
});

