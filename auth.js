document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const spanNombre = document.getElementById('nombre-usuario');

  if (usuario && spanNombre) {
    spanNombre.textContent = usuario.nombre;
  } else if (spanNombre) {
    spanNombre.textContent = '';
  }
});
