  document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const span = document.getElementById('nombre-usuario');
    const menu = document.getElementById('menu-desplegable');
    const toggle = document.getElementById('toggle-menu');
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    const contenedorUsuario = document.getElementById('usuario-menu');

    if (usuario && usuario.nombre) {
      span.textContent = usuario.nombre;

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
      });

      document.addEventListener('click', (e) => {
        if (!contenedorUsuario.contains(e.target)) {
          menu.style.display = 'none';
        }
      });

      cerrarSesionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
      });
    } else {
      contenedorUsuario.addEventListener('click', () => {
        window.location.href = 'login.html';
      });
    }
  });