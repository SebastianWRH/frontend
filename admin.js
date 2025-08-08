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


document.getElementById('productos-btn').addEventListener('click', async () => {
  try {
    const res = await fetch("https://aurora-backend-ve7u.onrender.com/productos");
    const data = await res.json();

    if (!res.ok) throw new Error(data.mensaje || "Error al obtener productos");

    mostrarTablaProductos(data);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    document.getElementById("contenido").innerHTML = "<p>Error al cargar productos.</p>";
  }
});

function mostrarTablaProductos(productos) {
  const contenido = document.getElementById("contenido");

  let html = `
    <h2>🛒 Lista de Productos</h2>
    <button id="agregar-producto-btn">➕ Agregar Producto</button>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Categoría</th>
          <th>Stock</th>
          <th>Miniatura</th>
          <th>Imágenes</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${productos.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.descripcion}</td>
            <td>S/ ${p.precio}</td>
            <td>${p.categoria}</td>
            <td>${p.stock}</td>
            <td><img src="${p.miniatura}" width="50"></td>
            <td>
  ${
    Array.isArray(p.imagenes)
      ? p.imagenes.map(i => `<img src="${i}" width="30">`).join(' ')
      : (() => {
          try {
            const arr = JSON.parse(p.imagenes || '[]');
            return arr.map(i => `<img src="${i}" width="30">`).join(' ');
          } catch {
            return '';
          }
        })()
  }
</td>

            <td>
              <button class="editar-btn" data-id="${p.id}">✏️ Editar</button>
              <button class="eliminar-producto-btn" data-id="${p.id}">🗑️ Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  contenido.innerHTML = html;
}


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





document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("eliminar-producto-btn")) {
    const id = e.target.dataset.id;
    const confirmar = confirm("¿Eliminar este producto?");
    if (confirmar) {
      try {
        const res = await fetch(`https://aurora-backend-ve7u.onrender.com/productos/${id}`, {
          method: "DELETE"
        });

        if (!res.ok) {
          const data = await res.json();
          alert("Error al eliminar: " + (data.error || "desconocido"));
        } else {
          alert("Producto eliminado correctamente");
          document.getElementById('productos-btn').click(); // Recargar productos
        }
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("Error al conectar con el servidor");
      }
    }
  }
});










// Mostrar modal vacío al dar clic en "Agregar producto"
document.getElementById("btnAgregarProducto").addEventListener("click", () => {
  abrirModalProducto();
});

function abrirModalProducto(producto = null) {
  // Si hay producto, es para editar; si no, para agregar
  document.getElementById("formProducto").reset(); // limpia campos
  document.getElementById("formProducto").dataset.id = producto ? producto.id : "";

  // Si hay producto, rellenamos los campos
  if (producto) {
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("categoria").value = producto.categoria;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("miniatura").value = producto.miniatura;
    document.getElementById("imagenes").value = producto.imagenes.join(",");
  }

  document.getElementById("modalProducto").style.display = "block";
}

// Cerrar modal
document.getElementById("cerrarModal").addEventListener("click", () => {
  document.getElementById("modalProducto").style.display = "none";
});

// Enviar formulario (Agregar o Editar)
document.getElementById("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = e.target.dataset.id;
  const producto = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    precio: parseFloat(document.getElementById("precio").value),
    categoria: document.getElementById("categoria").value,
    stock: parseInt(document.getElementById("stock").value),
    miniatura: document.getElementById("miniatura").value,
    imagenes: document.getElementById("imagenes").value.split(",").map(i => i.trim())
  };

  try {
    if (id) {
      // EDITAR producto
      const res = await fetch(`https://aurora-backend-ve7u.onrender.com/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
      });
      if (!res.ok) throw new Error("Error al editar producto");
    } else {
      // AGREGAR producto
      const res = await fetch("https://aurora-backend-ve7u.onrender.com/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
      });
      if (!res.ok) throw new Error("Error al agregar producto");
    }

    alert("Producto guardado correctamente");
    document.getElementById("modalProducto").style.display = "none";
    cargarProductos(); // recarga la tabla
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un error al guardar el producto");
  }
});
