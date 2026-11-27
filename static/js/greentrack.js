// Greentrack Martial Arts - Lightweight Vanilla JS Interactions
document.addEventListener('DOMContentLoaded', () => {
  // Lightbox Modal for Gallery & Achievement Certificates
  const lightboxModalEl = document.getElementById('gtLightboxModal');
  if (lightboxModalEl && typeof bootstrap !== 'undefined') {
    const lightboxModal = new bootstrap.Modal(lightboxModalEl);
    const lbTitle = document.getElementById('gtLightboxTitle');
    const lbCaption = document.getElementById('gtLightboxCaption');
    const lbMediaContainer = document.getElementById('gtLightboxMedia');

    document.querySelectorAll('[data-lightbox-trigger]').forEach((el) => {
      const openLightbox = () => {
        const title = el.getAttribute('data-title') || 'Academy Media';
        const caption = el.getAttribute('data-caption') || '';
        const type = el.getAttribute('data-media-type') || 'photo';
        const src = el.getAttribute('data-src') || '';
        const videoUrl = el.getAttribute('data-video-url') || '';

        lbTitle.textContent = title;
        lbCaption.textContent = caption;
        lbMediaContainer.innerHTML = '';

        if (type === 'video' && videoUrl) {
          const wrapper = document.createElement('div');
          wrapper.className = 'ratio ratio-16x9';
          const iframe = document.createElement('iframe');
          iframe.src = videoUrl;
          iframe.title = title;
          iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          wrapper.appendChild(iframe);
          lbMediaContainer.appendChild(wrapper);
        } else if (src) {
          const img = document.createElement('img');
          img.src = src;
          img.alt = title;
          img.className = 'img-fluid rounded-3 w-100';
          img.style.maxHeight = '72vh';
          img.style.objectFit = 'contain';
          lbMediaContainer.appendChild(img);
        }

        lightboxModal.show();
      };

      el.addEventListener('click', openLightbox);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox();
        }
      });
    });

    // Clear iframe on close so videos stop playing
    lightboxModalEl.addEventListener('hidden.bs.modal', () => {
      lbMediaContainer.innerHTML = '';
    });
  }
});
