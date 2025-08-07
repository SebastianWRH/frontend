document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || usuario.rol !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('admin-nombre').textContent = `Hola, ${usuario.nombre}`;

  // Cerrar sesión
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
  });

  // Aquí puedes agregar manejadores para botones
  document.getElementById('usuarios-btn').addEventListener('click', () => {
    document.getElementById('contenido').innerHTML = `<h2>Usuarios</h2><p>Contenido de usuarios.</p>`;
  });

  document.getElementById('productos-btn').addEventListener('click', () => {
    document.getElementById('contenido').innerHTML = `<h2>Productos</h2><p>Contenido de productos.</p>`;
  });

  document.getElementById('pedidos-btn').addEventListener('click', () => {
    document.getElementById('contenido').innerHTML = `<h2>Pedidos</h2><p>Contenido de pedidos.</p>`;
  });
});



const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario || usuario.rol !== "admin") {
  window.location.href = "index.html"; // redirige si no es admin
}
