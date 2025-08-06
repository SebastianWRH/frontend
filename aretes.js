// Toggle panel de filtros (solo móvil)
(function() {
  const btn = document.getElementById('btn-filtros');
  const filtros = document.querySelector('.filtros');
  let overlay = document.querySelector('.filtros-overlay');

  // crear overlay si no existe
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'filtros-overlay';
    document.body.appendChild(overlay);
  }

  function abrirFiltros() {
    filtros.classList.add('abierto');
    overlay.classList.add('visible');
    btn.setAttribute('aria-expanded', 'true');
    // bloquear scroll del body
    document.body.style.overflow = 'hidden';
  }

  function cerrarFiltros() {
    filtros.classList.remove('abierto');
    overlay.classList.remove('visible');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (btn && filtros) {
    btn.addEventListener('click', () => {
      if (filtros.classList.contains('abierto')) cerrarFiltros();
      else abrirFiltros();
    });
    overlay.addEventListener('click', cerrarFiltros);

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrarFiltros();
    });

    // Si el viewport cambia a desktop mientras está abierto, cerramos
    const mq = window.matchMedia('(min-width: 769px)');
    mq.addEventListener('change', (ev) => {
      if (ev.matches) cerrarFiltros();
    });
  }
})();
