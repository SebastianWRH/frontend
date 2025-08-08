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
        cargarProductos();
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
    const data = await res.json();

    console.log("Respuesta completa del backend:", data);

    const usuarios = data.usuarios; // 👈 ahora lo hacemos bien

    if (!Array.isArray(usuarios)) throw new Error('Respuesta inesperada del servidor');

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
              <td>${usuario.id || usuario.id || 'sin id'}</td>
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



async function cargarProductos() {
  try {
    const res = await fetch('https://aurora-backend-ve7u.onrender.com/productos');
    const data = await res.json();

    console.log("Respuesta completa del backend (productos):", data);

    const productos = data.productos;

    if (!Array.isArray(productos)) throw new Error('Respuesta inesperada del servidor');

    const tablaHTML = `
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Miniatura</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${productos.map(producto => `
            <tr>
              <td>${producto.id || 'sin id'}</td>
              <td>${producto.nombre}</td>
              <td>${producto.descripcion}</td>
              <td>S/. ${producto.precio}</td>
              <td>${producto.categoria}</td>
              <td>${producto.stock}</td>
              <td><img src="${producto.miniatura}" width="50" height="50" /></td>
              <td>
                <button class="editar-producto" data-id="${producto.id}">Editar</button>
                <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    document.getElementById('contenido-dinamico').innerHTML = tablaHTML;

  } catch (error) {
    console.error('Error al cargar productos:', error);
    document.getElementById('contenido-dinamico').innerHTML = `<p>Error al cargar productos.</p>`;
  }
}

