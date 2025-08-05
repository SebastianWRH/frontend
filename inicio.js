document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const span = document.getElementById('nombre-usuario');

  if (usuario && usuario.nombre) {
    span.textContent = usuario.nombre;
  } else {
    span.textContent = 'Invitado';
  }
});
