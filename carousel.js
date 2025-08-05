// Carrusel categorias (móvil)
(function(){
  const track = document.querySelector('.carousel-track');
  const btnPrev = document.querySelector('.carousel-btn.prev');
  const btnNext = document.querySelector('.carousel-btn.next');
  if (!track || !btnPrev || !btnNext) return;

  const items = Array.from(track.querySelectorAll('.contenedor-imagen'));
  let index = 0;

  // Ajusta posición al índice
  function update() {
    const item = items[index];
    const trackRect = track.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    // Calcular desplazamiento centrado
    const offset = item.offsetLeft - (track.clientWidth - item.clientWidth) / 2;
    track.scrollTo({ left: offset, behavior: 'smooth' });

    btnPrev.disabled = index <= 0;
    btnNext.disabled = index >= items.length - 1;
  }

  btnPrev.addEventListener('click', () => {
    if (index > 0) index--;
    update();
  });

  btnNext.addEventListener('click', () => {
    if (index < items.length - 1) index++;
    update();
  });

  // Permitir arrastrar / swipe táctil
  let startX = 0, isDown = false;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDown = true;
  }, {passive:true});

  track.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    // si el swipe es suficiente, cambiar slide
    if (Math.abs(diff) > 40) {
      if (diff > 0 && index < items.length - 1) index++;
      else if (diff < 0 && index > 0) index--;
      isDown = false;
      update();
    }
  }, {passive:true});

  track.addEventListener('touchend', () => { isDown = false; });

  // Resize: recalculamos para centrar el item actual
  window.addEventListener('resize', () => { setTimeout(update, 80); });

  // Inicializa centrando el primer item (solo si estamos en móvil)
  function initIfMobile() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      update();
    } else {
      // si no es móvil, reset scroll
      track.scrollTo({left:0, behavior:'auto'});
      btnPrev.disabled = true;
      btnNext.disabled = items.length <= 1;
    }
  }
  initIfMobile();
  window.matchMedia('(max-width: 768px)').addListener(initIfMobile);
})();
