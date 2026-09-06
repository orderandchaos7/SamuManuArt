// ==========================================
// CONFIGURATION: ADD NEW PAINTINGS HERE
// ==========================================
const artworks = [
    // Just copy a line, paste it, and change the details!
    { src: "images/painting28.jpg", title: "Shiva Parvati", date: "May 2025" },
    { src: "images/painting27.jpg", title: "Sita Ramam 2.0", date: "April 2025" },
    { src: "images/painting19.jpg", title: "The Night Sky", date: "April 2025" },
    { src: "images/painting20.jpg", title: "A Cloudy Evening", date: "April 2025" },
    { src: "images/painting29.jpg", title: "Pichwai Art", date: "2025" },
    { src: "images/painting30.jpg", title: "Morpankh", date: "2025" },
    { src: "images/painting31.jpg", title: "Banana", date: "2025" },
    { src: "images/painting32.jpg", title: "House by Seashore", date: "2025" },
    { src: "images/painting33.jpg", title: "Abstract Parrot", date: "2025" },
    { src: "images/painting34.jpg", title: "Riverside", date: "2025" },
    { src: "images/painting36.jpg", title: "Flower Vase", date: "2025" },
    { src: "images/painting37.jpg", title: "Floral Night Lamp", date: "2025" },
    { src: "images/painting38.jpg", title: "Glass Half Full", date: "2025" },
    { src: "images/painting39.jpg", title: "Riverside 2", date: "2025" },
    { src: "images/painting25.jpg", title: "Coconut Water", date: "September 2024" },
    { src: "images/painting26.jpg", title: "Veermata Jijau", date: "July 2024" },
    { src: "images/painting1.jpg", title: "Sita Ramam", date: "March 2024" },
    { src: "images/painting4.jpg", title: "Happy Holi!", date: "March 2024" },
    { src: "images/painting8.jpg", title: "Devotion", date: "January 2024" },
    { src: "images/painting5.jpg", title: "Ganeshay Namah", date: "December 2023" },
    { src: "images/painting6.jpg", title: "Family Time", date: "November 2023" },
    { src: "images/painting7.jpg", title: "Shiv Parivar", date: "February 2023" },
    { src: "images/painting2.jpg", title: "Jai Shree Krishna", date: "Unknown" },
    { src: "images/painting3.jpg", title: "Warmth and Love", date: "Unknown" },
    { src: "images/painting9.jpg", title: "Shivay", date: "Unknown" },
    { src: "images/painting10.jpg", title: "Radha Krishna", date: "Unknown" },
    { src: "images/painting11.jpg", title: "Tridevi", date: "Unknown" },
    { src: "images/painting12.jpg", title: "Welcome to Dholakpur", date: "Unknown" },
    { src: "images/painting13.jpg", title: "Shri Mann Narayan", date: "Unknown" },
    { src: "images/painting14.jpg", title: "Durga Maa", date: "Unknown" },
    { src: "images/painting15.jpg", title: "Jai Jagannath", date: "Unknown" },
    { src: "images/painting16.jpg", title: "Jaanta Raja", date: "Unknown" },
    { src: "images/painting17.jpg", title: "Bansuriwala", date: "Unknown" },
    { src: "images/painting18.jpg", title: "Ganpati Bappa", date: "Unknown" },
    { src: "images/painting21.jpg", title: "Little Krishna", date: "Unknown" },
    { src: "images/painting22.jpg", title: "Future is Promising", date: "Unknown" },
    { src: "images/painting23.jpg", title: "Natkhat Krishna", date: "Unknown" },
    { src: "images/painting24.jpg", title: "Family Trip", date: "Unknown" },
    { src: "images/painting35.jpg", title: "Untitled", date: "Unknown" }
];

const galleryContainer = document.getElementById('gallery-container');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCap = document.getElementById('modalCaption');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const searchInput = document.getElementById('search-input');
const yearFilters = document.getElementById('year-filters');

// Offline-safe inline SVG placeholder used when an image fails to load.
const FALLBACK_IMG = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='300'%20height='250'%20viewBox='0%200%20300%20250'%3E%3Crect%20width='300'%20height='250'%20fill='%23fdfcf0'/%3E%3Crect%20x='8'%20y='8'%20width='284'%20height='234'%20fill='none'%20stroke='%23ff6b6b'%20stroke-width='3'%20stroke-dasharray='10%208'/%3E%3Ccircle%20cx='150'%20cy='105'%20r='34'%20fill='none'%20stroke='%23ff6b6b'%20stroke-width='3'/%3E%3Ctext%20x='150'%20y='185'%20font-family='sans-serif'%20font-size='18'%20fill='%23ff6b6b'%20text-anchor='middle'%3EArt%20coming%20soon%3C/text%3E%3C/svg%3E";

// Derive a filterable year bucket from a free-form date string.
// Returns "2025"/"2024"/"2023"/... or "Unknown" when no 4-digit year found.
function getYear(dateStr) {
    const match = /(\d{4})/.exec(dateStr || '');
    return match ? match[1] : 'Unknown';
}

// Assign a stable rotation once per artwork so cards do not jump on re-render.
// Range -3deg..3deg for an organic feel (mobile disables it via media query).
artworks.forEach((art, index) => {
    art._rotation = (index % 7) - 3; // deterministic -3..3
    art._year = getYear(art.date);
});

// Current state
let activeYear = 'all';
let searchTerm = '';
let visibleItems = artworks.slice(); // currently rendered (filtered) list
let currentIndex = -1;                // index into visibleItems for the lightbox
let lastFocusedCard = null;           // element to restore focus to on close

// Render Gallery
function renderGallery(items) {
    visibleItems = items;
    galleryContainer.innerHTML = '';

    if (items.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'no-results';
        empty.textContent = 'No artworks match your search.';
        galleryContainer.appendChild(empty);
        return;
    }

    items.forEach((art, index) => {
        const card = document.createElement('div');
        card.className = 'art-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View artwork: ${art.title}, ${art.date}`);

        // Stable rotation per artwork
        card.style.setProperty('--rotation', `${art._rotation}deg`);
        // Animation delay for staggered load
        card.style.animationDelay = `${index * 0.05}s`;

        const img = document.createElement('img');
        img.src = art.src;
        img.alt = art.title;
        img.loading = 'lazy';
        // Guard against infinite onerror loops: unset handler before swapping src.
        img.onerror = function () {
            this.onerror = null;
            this.src = FALLBACK_IMG;
        };

        const info = document.createElement('div');
        info.className = 'card-info';
        const h3 = document.createElement('h3');
        h3.textContent = art.title;
        const p = document.createElement('p');
        p.textContent = art.date;
        info.appendChild(h3);
        info.appendChild(p);

        card.appendChild(img);
        card.appendChild(info);

        const open = () => openModal(index, card);
        card.addEventListener('click', open);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                open();
            }
        });

        galleryContainer.appendChild(card);
    });
}

// Single source of truth: apply year filter + search, then re-render.
function applyFilters() {
    const term = searchTerm.trim().toLowerCase();
    const filtered = artworks.filter((art) => {
        const yearOk = activeYear === 'all' || art._year === activeYear;
        const searchOk = term === '' || art.title.toLowerCase().includes(term);
        return yearOk && searchOk;
    });
    renderGallery(filtered);
}

// ---- Lightbox ----
function showAt(index) {
    if (visibleItems.length === 0) return;
    // Wrap-around across the visible set
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const art = visibleItems[currentIndex];
    modalImg.onerror = function () {
        this.onerror = null;
        this.src = FALLBACK_IMG;
    };
    modalImg.src = art.src;
    modalImg.alt = art.title;
    modalCap.textContent = `${art.title} (${art.date})`;
}

function openModal(index, triggerEl) {
    lastFocusedCard = triggerEl || document.activeElement;
    showAt(index);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    closeBtn.focus();
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentIndex = -1;
    if (lastFocusedCard && typeof lastFocusedCard.focus === 'function') {
        lastFocusedCard.focus();
    }
    lastFocusedCard = null;
}

function showNext() { showAt(currentIndex + 1); }
function showPrev() { showAt(currentIndex - 1); }

// ---- Event wiring ----
closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeModal(); });
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

// Click on the dark backdrop (not the image/buttons/caption) closes the modal.
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNext();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPrev();
    } else if (e.key === 'Tab') {
        // Focus trap: keep Tab / Shift+Tab cycling among the modal's
        // focusable controls so focus can't escape to the backgrounded page.
        const focusable = [closeBtn, prevBtn, nextBtn];
        const active = document.activeElement;
        const idx = focusable.indexOf(active);
        if (e.shiftKey) {
            // Shift+Tab on the first control (or outside the set) wraps to last.
            if (idx <= 0) {
                e.preventDefault();
                focusable[focusable.length - 1].focus();
            }
        } else {
            // Tab on the last control (or outside the set) wraps to first.
            if (idx === -1 || idx === focusable.length - 1) {
                e.preventDefault();
                focusable[0].focus();
            }
        }
    }
});

yearFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeYear = btn.dataset.year;
    yearFilters.querySelectorAll('.filter-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
    });
    applyFilters();
});

searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    applyFilters();
});

// Footer year
const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// Initialize
applyFilters();
