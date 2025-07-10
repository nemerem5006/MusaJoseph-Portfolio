document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('#mobile-menu a');

    // Toggle mobile menu
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- Swiper Hero Carousel ---
    const swiper = new Swiper('.hero-swiper', {
        // Optional parameters
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // --- Partners Carousel ---
    const partnersSwiper = new Swiper('.partners-swiper', {
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        slidesPerView: 2,
        spaceBetween: 20,
        breakpoints: {
            640: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 40,
            },
            1024: {
                slidesPerView: 5,
                spaceBetween: 50,
            },
        },
    });

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const subject = formData.get('subject').trim();
            const message = formData.get('message').trim();

            if (!name || !email || !subject || !message) {
                formStatus.innerHTML = `<p class="text-red-500">Please fill out all fields.</p>`;
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Sending...`;
            formStatus.innerHTML = ''; // Clear previous status

            // Send data to Formspree
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    formStatus.innerHTML = `<p class="text-green-600">Message sent successfully! We will get back to you shortly.</p>`;
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.innerHTML = `<p class="text-red-500">Oops! There was a problem submitting your form.</p>`;
                        }
                    });
                }
            }).catch(error => {
                formStatus.innerHTML = `<p class="text-red-500">Oops! There was a network error. Please try again.</p>`;
            }).finally(() => {
                // Restore button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
                // Hide status message after 5 seconds
                setTimeout(() => { formStatus.innerHTML = ''; }, 5000);
            });
        });
    }

    // --- Tracking Form Logic ---
    const trackingForm = document.getElementById('tracking-form');
    const trackingInput = document.getElementById('tracking-number');
    const trackingResultsContainer = document.getElementById('tracking-results');

    if (trackingForm) {
        trackingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const trackingNumber = trackingInput.value.trim().toUpperCase();

            // Show loading state
            trackingResultsContainer.innerHTML = `
                <div class="flex justify-center items-center p-4">
                    <i class="fas fa-spinner fa-spin text-accent text-2xl mr-3"></i>
                    <span class="text-gray-600">Searching for your shipment...</span>
                </div>
            `;
            trackingResultsContainer.classList.remove('hidden');

            // Simulate an API call with a delay
            setTimeout(() => {
                displayTrackingResults(trackingNumber);
            }, 1500);
        });
    }

    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    function displayTrackingResults(trackingNumber) {
        // Dummy data for demonstration. In a real app, you'd fetch this from an API.
        const trackingData = {
            'MJ454321879': {
                status: 'In Transit',
                origin: 'New York, USA',
                destination: 'London, UK',
                updates: [
                    { date: '2024-03-15 10:00 AM', location: 'London, UK', status: 'Arrived at destination facility' },
                    { date: '2024-03-14 08:00 PM', location: 'JFK Airport, USA', status: 'Departed from airport' },
                    { date: '2024-03-13 02:30 PM', location: 'New York, USA', status: 'Package received by carrier' }
                ]
            },
            'MJ987654321': {
                status: 'Delivered',
                origin: 'Shanghai, China',
                destination: 'Los Angeles, USA',
                updates: [
                    { date: '2024-03-12 01:15 PM', location: 'Los Angeles, USA', status: 'Delivered to recipient' },
                    { date: '2024-03-12 09:00 AM', location: 'Los Angeles, USA', status: 'Out for delivery' },
                    { date: '2024-03-10 05:45 PM', location: 'LAX Airport, USA', status: 'Customs clearance complete' }
                ]
            }
        };

        const result = trackingData[trackingNumber];
        let html = '';

        if (!trackingNumber) {
            html = '<p class="text-center text-red-500 font-semibold p-4">Please enter a tracking number.</p>';
        } else if (result) {
            const safeTrackingNumber = sanitizeHTML(trackingNumber);
            const statusColor = result.status === 'Delivered' ? 'text-green-600' : 'text-blue-600';
            html = `
                <h3 class="text-xl font-bold text-secondary mb-4">Tracking Details for <span class="text-accent">${safeTrackingNumber}</span></h3>
                <div class="border rounded-lg p-4 bg-gray-50">
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-center sm:text-left">
                        <div><strong class="block text-gray-500 text-sm">Status</strong> <span class="${statusColor} font-bold">${result.status}</span></div>
                        <div><strong class="block text-gray-500 text-sm">From</strong> ${result.origin}</div>
                        <div><strong class="block text-gray-500 text-sm">To</strong> ${result.destination}</div>
                    </div>
                    <div class="border-t pt-4 mt-4">
                        <h4 class="font-semibold text-lg text-secondary mb-3">History</h4>
                        <ul class="space-y-4">
                            ${result.updates.map(update => `
                                <li class="flex items-start">
                                    <div class="w-8 text-center"><i class="fas fa-check-circle text-accent mt-1"></i></div>
                                    <div class="flex-1">
                                        <p class="font-semibold">${update.status}</p>
                                        <p class="text-sm text-gray-500">${update.location} &mdash; ${update.date}</p>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } else {
            const safeTrackingNumber = sanitizeHTML(trackingNumber);
            html = `<p class="text-center text-red-500 font-semibold p-4">Tracking number <span class="font-bold">${safeTrackingNumber}</span> not found. Please try again.</p>`;
        }

        trackingResultsContainer.innerHTML = html;
    }

    // --- Scroll to Top Button Logic ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    if (scrollToTopBtn) {
        // Show or hide the button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                scrollToTopBtn.classList.remove('hidden');
            } else {
                scrollToTopBtn.classList.add('hidden');
            }
        });

        // Scroll to top on click
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Dynamic Copyright Year ---
    const copyrightYearEl = document.getElementById('copyright-year');
    if (copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }
});