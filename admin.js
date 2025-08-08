document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.menu-btn');
  const titulo = document.getElementById('titulo-seccion');
  const contenido = document.getElementById('contenido-dinamico');

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      botones.forEach(b => b.classList.remove('active'));
      boton.classList.add('active');

      const seccion = boton.dataset.section;
      titulo.textContent = seccion.charAt(0).toUpperCase() + seccion.slice(1);

      // Aquí puedes cambiar por tus funciones reales de cargar datos
      if (seccion === 'clientes') {
        cargarUsuarios();
      } else if (seccion === 'productos') {
        contenido.innerHTML = `<p>Lista de productos cargada aquí.</p>`;
      } else if (seccion === 'pedidos') {
        contenido.innerHTML = `<p>Lista de pedidos cargada aquí.</p>`;
      }
    });
  });

  // Botón cerrar sesión
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
  });
});




  // Cargar USUARIOS
async function cargarUsuarios() {
  try {
    const res = await fetch('https://aurora-backend-ve7u.onrender.com/usuarios');
    const usuarios = await res.json();

    console.log("Respuesta recibida:", data); // 👀

    if (!Array.isArray(data)) throw new Error('Respuesta inesperada del servidor');

    const tablaHTML = `
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${usuarios.map(usuario => `
            <tr>
              <td>${usuario.id}</td>
              <td>${usuario.nombre}</td>
              <td>${usuario.correo}</td>
              <td>${usuario.rol}</td>
              <td>
                <button class="editar-btn" data-id="${usuario.id}">Editar</button>
                <button class="eliminar-btn" data-id="${usuario.id}">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    document.getElementById('contenido-dinamico').innerHTML = tablaHTML;

  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    document.getElementById('contenido-dinamico').innerHTML = `<p>Error al cargar usuarios.</p>`;
  }
}
