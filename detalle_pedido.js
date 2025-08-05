document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idPedido = params.get("id");

  if (!idPedido) {
    alert("ID de pedido no especificado");
    return;
  }

  try {
    const res = await fetch(`https://aurora-backend-ve7u.onrender.com/pedido/${idPedido}`);
    if (!res.ok) {
      throw new Error("Error al obtener el pedido");
    }

    const data = await res.json();

    // Llenar datos generales
    document.getElementById("pedido-id").textContent = data.pedido.id;
    document.getElementById("pedido-fecha").textContent = new Date(data.pedido.fecha).toLocaleString();
    document.getElementById("pedido-estado").textContent = data.pedido.estado;
    document.getElementById("pedido-total").textContent = data.pedido.total.toFixed(2);

    // Llenar tabla de productos
    const tbody = document.getElementById("productos-tabla");
    tbody.innerHTML = data.detalles.map(d => `
      <tr>
        <td>${d.nombre}</td>
        <td>${d.cantidad}</td>
        <td>S/. ${d.precio_unitario.toFixed(2)}</td>
        <td>S/. ${(d.cantidad * d.precio_unitario).toFixed(2)}</td>
      </tr>
    `).join("");

  } catch (err) {
    console.error(err);
    alert("No se pudo cargar el detalle del pedido");
  }
});
