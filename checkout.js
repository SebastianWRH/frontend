// checkout.js
document.addEventListener('DOMContentLoaded', () => {
  const btnConfirmar = document.getElementById('btn-confirmar');
  if (!btnConfirmar) return; // no estamos en la página de checkout

  btnConfirmar.addEventListener('click', async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.id) {
      alert('Debes iniciar sesión para confirmar la compra.');
      window.location.href = 'login.html';
      return;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    // Normalizar items: convertir precio a número (quita símbolos si existen)
    const items = carrito.map(it => {
      // intenta obtener precio numérico
      let precioNum = 0;
      if (typeof it.precio === 'number') precioNum = it.precio;
      else if (typeof it.precio === 'string') {
        // elimina cualquier caracter no numérico salvo punto y signo negativo
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
      // Mostrar loading simple
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = 'Procesando...';

      const res = await fetch('https://aurora-backend-ve7u.onrender.com/pedidos', {
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

      // Pedido creado OK
      alert('Pedido confirmado. ID: ' + data.id_pedido);

      // Vaciar carrito y redirect
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
