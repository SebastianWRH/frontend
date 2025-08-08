document.addEventListener('DOMContentLoaded', () => {
  const btnConfirmar = document.getElementById('btn-confirmar');
  const resumenCarrito = document.getElementById('resumen-carrito');
  const totalSpan = document.getElementById('checkout-total');

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Mostrar productos en la interfaz
  function mostrarResumenCarrito() {
    resumenCarrito.innerHTML = '';

    if (carrito.length === 0) {
      resumenCarrito.innerHTML = '<p>Tu carrito está vacío.</p>';
      totalSpan.textContent = 'S/ 0.00';
      btnConfirmar.disabled = true;
      return;
    }

    let total = 0;

    carrito.forEach(item => {
      // Normalizar precio
      let precioNum = 0;
      if (typeof item.precio === 'number') precioNum = item.precio;
      else if (typeof item.precio === 'string') {
        precioNum = Number(String(item.precio).replace(/[^\d.-]+/g, '')) || 0;
      }

      const subtotal = precioNum * item.cantidad;
      total += subtotal;

      const itemHTML = `
        <div class="checkout-item">
          <img src="${item.imagen}" alt="${item.nombre}" class="checkout-item-img" />
          <p><strong>${item.nombre}</strong></p>
          <p><strong>Cantidad:</strong> x${item.cantidad} </p>
          <p><strong>Color:</strong>${item.color}</p>
          <p>S/ ${(subtotal).toFixed(2)}</p>
        </div>
      `;
      resumenCarrito.innerHTML += itemHTML;
    });

    totalSpan.textContent = ` ${total.toFixed(2)}`;
  }

  mostrarResumenCarrito();

  // Si no estamos en la página de checkout, salir
  if (!btnConfirmar) return;

  btnConfirmar.addEventListener('click', async () => {
    if (!usuario || !usuario.id) {
      alert('Debes iniciar sesión para confirmar la compra.');
      window.location.href = 'login.html';
      return;
    }

    if (carrito.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const items = carrito.map(it => {
      let precioNum = 0;
      if (typeof it.precio === 'number') precioNum = it.precio;
      else if (typeof it.precio === 'string') {
        precioNum = Number(String(it.precio).replace(/[^\d.-]+/g, '')) || 0;
      }

      return {
        id_producto: it.id,
        cantidad: Number(it.cantidad) || 1,
        precio_unitario: precioNum
      };
    });

    const total = items.reduce((s, it) => s + (it.cantidad * it.precio_unitario), 0);

    if (!confirm(`Confirmar compra por S/ ${total.toFixed(2)} ?`)) return;

    try {
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = 'Procesando...';

      const res = await fetch('https://aurora-backend-ve7u.onrender.com/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuario.id,
          total,
          items
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Respuesta error /pedidos:', data);
        alert(data.mensaje || 'Error al crear el pedido');
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = 'Confirmar compra';
        return;
      }

      alert('Pedido confirmado. ID: ' + data.id_pedido);
      localStorage.removeItem('carrito');
      window.location.href = `detalle_pedido.html?id=${data.id_pedido}`;
    } catch (err) {
      console.error('Error al confirmar pedido:', err);
      alert('No se pudo conectar con el servidor.');
      btnConfirmar.disabled = false;
      btnConfirmar.textContent = 'Confirmar compra';
    }
  });
});
