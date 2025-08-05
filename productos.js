document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const idProducto = params.get('id');

  if (!idProducto) {
    document.getElementById('detalle-producto').textContent = 'Producto no encontrado.';
    return;
  }

  fetch(`https://aurora-backend-ve7u.onrender.com/producto/${idProducto}`)
    .then(response => response.json())
    .then(producto => {
      mostrarProducto(producto);
    })
    .catch(error => {
      console.error('Error al cargar producto:', error);
      document.getElementById('detalle-producto').textContent = 'Error al cargar el producto.';
    });
});

function mostrarProducto(producto) {
  const contenedor = document.getElementById('detalle-producto');

  contenedor.innerHTML = `
    <div class="producto-detalle">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h2>${producto.nombre}</h2>
      <p>${producto.descripcion}</p>
      <p><strong>Precio:</strong> S/ ${producto.precio}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
    </div>
  `;
}
