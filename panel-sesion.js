document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const span = document.getElementById('nombre-usuario');
    const menu = document.getElementById('menu-desplegable');
    const toggle = document.getElementById('toggle-menu');
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    const contenedorUsuario = document.getElementById('usuario-menu');

    if (usuario && usuario.nombre) {
      span.textContent = usuario.nombre;

      // Mostrar/ocultar el menú
      toggle.addEventListener('click', (e) => {
        e.stopPropagation(); // No permite que el clic se propague al document
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
      });

      // Cerrar el menú al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (!contenedorUsuario.contains(e.target)) {
          menu.style.display = 'none';
        }
      });

      // Cerrar sesión
    cerrarSesionBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('usuario');
    window.location.href = 'login.html'; // Redirige al login después de cerrar sesión
    });

    } else {
      // Redirige al login si no hay usuario
      contenedorUsuario.addEventListener('click', () => {
        window.location.href = 'login.html';
      });
    }
  });