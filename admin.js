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

    document.getElementById('contenido-dinamico').innerHTML =tablaHTML;

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
    const botonAgregar = `
      <button id="btn-agregar-producto" style="margin-bottom: 10px;">➕ Agregar producto</button>
    `;
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

    document.getElementById('contenido-dinamico').innerHTML = botonAgregar + tablaHTML;

    // ✅ Asigna evento después de insertar el botón
    const btnAgregar = document.getElementById('btn-agregar-producto');
    if (btnAgregar) {
      btnAgregar.addEventListener('click', () => {
        document.getElementById('formProducto').reset();
        document.getElementById('id').value = '';
        document.getElementById('modalProducto').style.display = 'block';
      });
    }



  } catch (error) {
    console.error('Error al cargar productos:', error);
    document.getElementById('contenido-dinamico').innerHTML = `<p>Error al cargar productos.</p>`;
  }



      // Asignar eventos luego de renderizar la tabla
    document.querySelectorAll('.eliminar-producto').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const confirmar = confirm('¿Estás seguro de que deseas eliminar este producto?');
        if (!confirmar) return;

        try {
          const res = await fetch(`https://aurora-backend-ve7u.onrender.com/productos/${id}`, {
            method: 'DELETE'
          });

          if (!res.ok) throw new Error('Error al eliminar el producto');

          alert('Producto eliminado correctamente');
          cargarProductos(); // recarga la tabla
        } catch (err) {
          console.error('Error eliminando producto:', err);
          alert('Hubo un problema al eliminar el producto');
        }
      });
    });

    document.querySelectorAll('.editar-producto').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;

        try {
          const res = await fetch(`https://aurora-backend-ve7u.onrender.com/productos/${id}`);
          const data = await res.json();
          const producto = data; // porque el backend devuelve el objeto directamente


          // Rellenar formulario
          document.getElementById('id').value = producto.id;
          document.getElementById('nombre').value = producto.nombre;
          document.getElementById('descripcion').value = producto.descripcion;
          document.getElementById('precio').value = producto.precio;
          document.getElementById('categoria').value = producto.categoria;
          document.getElementById('stock').value = producto.stock;
          document.getElementById('miniatura').value = producto.miniatura;
          let imagenesArray = [];
            if (typeof producto.imagenes === 'string') {
              try {
                imagenesArray = JSON.parse(producto.imagenes);
              } catch {
                imagenesArray = [];
              }
            } else if (Array.isArray(producto.imagenes)) {
              imagenesArray = producto.imagenes;
            }
            document.getElementById('imagenes').value = imagenesArray.join(', ');

          document.getElementById('modalProducto').style.display = 'block';
        } catch (err) {
          console.error('Error al obtener producto:', err);
          alert('No se pudo cargar el producto para editar');
        }
      });
    });


    const btnAgregar = document.getElementById('btn-agregar-producto');
    if (btnAgregar) {
      btnAgregar.addEventListener('click', () => {
        // Limpia y muestra el formulario para nuevo producto
        document.getElementById('formProducto').reset();
        document.getElementById('id').value = '';
        document.getElementById('modalProducto').style.display = 'block';
      });
    }
}



document.getElementById('formProducto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const producto = {
    nombre: document.getElementById('nombre').value,
    descripcion: document.getElementById('descripcion').value,
    precio: parseFloat(document.getElementById('precio').value),
    categoria: document.getElementById('categoria').value,
    stock: parseInt(document.getElementById('stock').value),
    miniatura: document.getElementById('miniatura').value,
    imagenes: document.getElementById('imagenes').value
      ? document.getElementById('imagenes').value.split(',').map(url => url.trim())
      : []
  };

  const id = document.getElementById('id').value;

  try {
    let res;
    if (id) {
      // Editar
      res = await fetch(`https://aurora-backend-ve7u.onrender.com/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
    } else {
      // Crear
      res = await fetch(`https://aurora-backend-ve7u.onrender.com/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
    }

    if (!res.ok) throw new Error('Error al guardar producto');

    alert('Producto guardado correctamente');
    document.getElementById('modalProducto').style.display = 'none';
    cargarProductos(); // recargar lista

  } catch (err) {
    console.error('Error guardando producto:', err);
    alert('Error al guardar producto');
  }
});



document.getElementById('btn-cancelar').addEventListener('click', () => {
  document.getElementById('modalProducto').style.display = 'none';
  document.getElementById('formProducto').reset();
  document.getElementById('id').value = '';
});
