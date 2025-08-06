// Toggle panel filtros (móvil)
(function () {
  const btn = document.getElementById('btn-filtros');
  const filtros = document.querySelector('.filtros');
  let overlay = document.querySelector('.filtros-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'filtros-overlay';
    document.body.appendChild(overlay);
  }

  function abrir() {
    if (!filtros) return;
    filtros.classList.add('abierto');
    overlay.classList.add('visible');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function cerrar() {
    if (!filtros) return;
    filtros.classList.remove('abierto');
    overlay.classList.remove('visible');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (btn && filtros) {
    btn.addEventListener('click', () => {
      if (filtros.classList.contains('abierto')) cerrar(); else abrir();
    });
    overlay.addEventListener('click', cerrar);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });

    // Si cambia a desktop, cerramos el panel
    const mq = window.matchMedia('(min-width: 769px)');
    mq.addEventListener('change', (ev) => { if (ev.matches) cerrar(); });
  }
})();
