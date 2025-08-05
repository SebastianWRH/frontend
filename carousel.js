// Carrusel categorias (móvil) - versión corregida usando scrollIntoView
(function(){
  const track = document.querySelector('.carousel-track');
  const btnPrev = document.querySelector('.carousel-btn.prev');
  const btnNext = document.querySelector('.carousel-btn.next');
  if (!track || !btnPrev || !btnNext) return;

  const items = Array.from(track.querySelectorAll('.contenedor-imagen'));
  let index = 0;

  function updateButtons() {
    btnPrev.disabled = index <= 0;
    btnNext.disabled = index >= items.length - 1;
  }

  // Centrar elemento con scrollIntoView (más fiable)
  function goToIndex(i) {
    index = Math.max(0, Math.min(i, items.length - 1));
    const item = items[index];
    if (!item) return;
    item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    updateButtons();
  }

  btnPrev.addEventListener('click', () => {
    goToIndex(index - 1);
  });

  btnNext.addEventListener('click', () => {
    goToIndex(index + 1);
  });

  // Manejo táctil (swipe) más robusto: calculamos swipe al end
  let startX = 0;
  let startScroll = 0;
  let isTouch = false;

  track.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length === 0) return;
    isTouch = true;
    startX = e.touches[0].clientX;
    startScroll = track.scrollLeft;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isTouch) return;
    isTouch = false;
    // Al terminar el swipe, determinamos el item más cercano al centro
    const center = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = -1;
    let minDist = Infinity;
    items.forEach((it, idx) => {
      const itCenter = it.offsetLeft + it.clientWidth / 2;
      const dist = Math.abs(itCenter - center);
      if (dist < minDist) { minDist = dist; closestIndex = idx; }
    });
    goToIndex(closestIndex);
  }, { passive: true });

  // También suportamos mouse drag para testing en desktop (opcional)
  let isDown = false;
  let mouseStartX = 0;
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    mouseStartX = e.clientX;
    startScroll = track.scrollLeft;
    track.classList.add('dragging');
    e.preventDefault();
  });
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - mouseStartX;
    track.scrollLeft = startScroll - dx;
  });
  document.addEventListener('mouseup', (e) => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('dragging');
    // snap to nearest
    const center = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let minDist = Infinity;
    items.forEach((it, idx) => {
      const itCenter = it.offsetLeft + it.clientWidth / 2;
      const dist = Math.abs(itCenter - center);
      if (dist < minDist) { minDist = dist; closestIndex = idx; }
    });
    goToIndex(closestIndex);
  });

  // Inicializar
  function initIfMobile() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      // forzamos centrar el primer item
      setTimeout(() => goToIndex(0), 60);
    } else {
      // reset
      track.scrollTo({ left: 0, behavior: 'auto' });
      index = 0;
      updateButtons();
    }
  }

  initIfMobile();
  window.matchMedia('(max-width: 768px)').addListener(initIfMobile);
  window.addEventListener('resize', () => { setTimeout(() => goToIndex(index), 80); });
})();
