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
 document.getElementById('usuarios-btn').addEventListener('click', async () => {
  try {
    const res = await fetch("https://aurora-backend-ve7u.onrender.com/usuarios");
    const data = await res.json();

    if (!res.ok) throw new Error(data.mensaje || "Error al obtener usuarios");

    mostrarTablaUsuarios(data.usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    document.getElementById("contenido").innerHTML = "<p>Error al cargar usuarios.</p>";
  }
});


  document.getElementById('productos-btn').addEventListener('click', () => {
    document.getElementById('contenido').innerHTML = `<h2>Productos</h2><p>Contenido de productos.</p>`;
  });

  document.getElementById('pedidos-btn').addEventListener('click', () => {
    document.getElementById('contenido').innerHTML = `<h2>Pedidos</h2><p>Contenido de pedidos.</p>`;
  });
});



function mostrarTablaUsuarios(usuarios) {
  const contenido = document.getElementById("contenido");

  let html = `
    <h2>👥 Lista de Usuarios</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody>
        ${usuarios
          .map(
            (u) => `
          <tr>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td>${u.rol}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  contenido.innerHTML = html;
}
