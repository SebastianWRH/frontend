// carrito-slide.js (versión con "Confirmar compra" integrada)
document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito();

  fetch('carrito-slide.html')
    .then(res => {
      if (!res.ok) throw new Error('No se pudo cargar carrito-slide.html');
      return res.text();
    })
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);

      const iconCart = document.querySelector('.icon-cart');
      const carritoSlide = document.getElementById('carrito-slide');
      const cerrarCarrito = document.getElementById('cerrar-carrito');
      const contenidoCarrito = document.getElementById('contenido-carrito');
      const btnConfirmar = document.getElementById('btn-confirmar'); // <-- botón dentro del slide

      if (!carritoSlide) {
        console.warn('El slide del carrito no se encontró.');
        return;
      }

      if (iconCart) {
        iconCart.addEventListener('click', () => {
          carritoSlide.classList.add('visible');
          renderizarCarritoEnSlide();
        });
      }

      if (cerrarCarrito) {
        cerrarCarrito.addEventListener('click', () => {
          carritoSlide.classList.remove('visible');
        });
      }

      if (contenidoCarrito) {
        contenidoCarrito.addEventListener('click', e => {
          const btn = e.target.closest('.eliminar-btn');
          if (!btn) return;
          const index = Number(btn.dataset.index);
          if (!Number.isFinite(index)) return;
          eliminarProductoDelCarrito(index);
        });
      }

      // Setup del botón confirmar (si existe)
      if (btnConfirmar) setupConfirmarCompra(btnConfirmar, carritoSlide);

      // Render inicial
      renderizarCarritoEnSlide();
    })
    .catch(err => console.error('Error al cargar carrito-slide.html:', err));
});

// ---------------- funciones ya conocidas ----------------
function renderizarCarritoEnSlide() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const contenedor = document.getElementById('contenido-carrito');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p>El carrito está vacío</p>';
    actualizarContadorCarrito();
    return;
  }

  carrito.forEach((producto, index) => {
    const div = document.createElement('div');
    div.className = 'item-carrito';
    div.innerHTML = `
      <img src="${producto.imagen || ''}" width="60" alt="${escapeHtml(producto.nombre || '')}">
      <div class="info-item">
        <h4>${escapeHtml(producto.nombre || '')}</h4>
        <p>Cantidad: ${Number(producto.cantidad)}</p>
        <p>Color: ${(producto.color)}</p>
        <p>Precio: ${escapeHtml(String(producto.precio || ''))}</p>
        <button class="eliminar-btn" data-index="${index}">🗑️ Eliminar</button>
      </div>
    `;
    contenedor.appendChild(div);
  });

  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalProductos = carrito.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);
  const contador = document.getElementById('contador-productos');
  if (contador) contador.textContent = totalProductos;
}

function eliminarProductoDelCarrito(index) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (index < 0 || index >= carrito.length) return;
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderizarCarritoEnSlide();
  actualizarContadorCarrito();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
//---------------- confirmar compra ----------------
function setupConfirmarCompra(button, carritoSlide) {
  button.addEventListener('click', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.id) {
      alert('Debes iniciar sesión para continuar con la compra.');
      window.location.href = 'login.html';
      return;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    // Cerrar slide del carrito
    carritoSlide.classList.remove('visible');

    // Redirigir a la página de checkout
    window.location.href = 'checkout.html';
  });
}
