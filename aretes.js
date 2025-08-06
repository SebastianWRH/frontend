document.addEventListener('DOMContentLoaded', () => {
  const btnFiltros = document.getElementById('btn-filtros');
  const filtros = document.getElementById('filtros');
  const backdrop = createBackdrop();
  const cerrarBtn = document.getElementById('cerrar-filtros');

  // Estado inicial: si pantalla desktop, mostramos aside; en mobile lo cerramos
  function inicializarEstado() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      filtros.classList.remove('open');
      btnFiltros.setAttribute('aria-expanded', 'false');
      filtros.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('visible');
    } else {
      filtros.classList.remove('closed');
      filtros.removeAttribute('aria-hidden');
      backdrop.classList.remove('visible');
    }
  }

  // Crear y añadir backdrop al DOM
  function createBackdrop() {
    const b = document.createElement('div');
    b.className = 'filtros-backdrop';
    document.body.appendChild(b);
    b.addEventListener('click', cerrarFiltros);
    return b;
  }

  function abrirFiltros() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      filtros.classList.add('open');
      filtros.classList.remove('closed');
      filtros.setAttribute('aria-hidden', 'false');
      btnFiltros.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('visible');
      // focus primera entrada util para accesibilidad
      const firstInput = filtros.querySelector('input, button, select, a');
      if (firstInput) firstInput.focus();
    } else {
      // desktop: simplemente alternar visibilidad dentro del layout
      filtros.classList.remove('closed');
      filtros.setAttribute('aria-hidden', 'false');
      btnFiltros.setAttribute('aria-expanded', 'true');
    }
  }

  function cerrarFiltros() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      filtros.classList.remove('open');
      filtros.setAttribute('aria-hidden', 'true');
      btnFiltros.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('visible');
    } else {
      filtros.classList.add('closed');
      filtros.setAttribute('aria-hidden', 'true');
      btnFiltros.setAttribute('aria-expanded', 'false');
    }
  }

  btnFiltros.addEventListener('click', () => {
    const isOpen = btnFiltros.getAttribute('aria-expanded') === 'true';
    if (isOpen) cerrarFiltros();
    else abrirFiltros();
  });

  if (cerrarBtn) cerrarBtn.addEventListener('click', cerrarFiltros);

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cerrarFiltros();
    }
  });

  // Al cambiar tamaño de ventana, reinicializamos (evita que quede abierto al pasar de mobile a desktop)
  window.addEventListener('resize', () => {
    // pequeño debounce
    clearTimeout(window._resizeFiltrosTimer);
    window._resizeFiltrosTimer = setTimeout(inicializarEstado, 120);
  });

  inicializarEstado();
});
