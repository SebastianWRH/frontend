document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const tbody = document.querySelector("#tabla-pedidos tbody");

  if (!usuario || !usuario.id) {
    // Si no está logueado, lo mandamos a login
    alert("Debes iniciar sesión para ver tus pedidos");
    window.location.href = "login.html";
    return;
  }

  // Mensaje de carga
  tbody.innerHTML = `<tr><td colspan="5">Cargando pedidos...</td></tr>`;

  try {
    const res = await fetch(`https://aurora-backend-ve7u.onrender.com/pedidos/${usuario.id}`);
    if (!res.ok) {
      // intentar leer mensaje de error si existe
      let msg = `HTTP ${res.status}`;
      try { const errJson = await res.json(); if (errJson && errJson.mensaje) msg = errJson.mensaje; } catch(e){}
      throw new Error(msg);
    }

    const pedidos = await res.json();

    if (!Array.isArray(pedidos) || pedidos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No tienes pedidos registrados.</td></tr>`;
      return;
    }

    tbody.innerHTML = ""; // limpiar

    pedidos.forEach(pedido => {
      // Seguridad: si fecha viene null/indef, no rompa
      const fecha = pedido.fecha ? new Date(pedido.fecha) : null;
      const fechaStr = fecha ? fecha.toLocaleString() : "—";

      // Aseguramos que total sea número
      const totalNum = Number(pedido.total) || 0;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="ID Pedido">${pedido.id}</td>
        <td data-label="Fecha">${fechaStr}</td>
        <td data-label="Estado"><span class="estado ${String(pedido.estado).toLowerCase()}">${pedido.estado}</span></td>
        <td data-label="Total">S/ ${totalNum.toFixed(2)}</td>
        <td data-label="Acción"><button class="btn-detalle" data-id="${pedido.id}">Ver detalle</button></td>
      `;
      tbody.appendChild(tr);
    });

    // Delegación de eventos: mejor para filas creadas dinámicamente
    tbody.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-detalle");
      if (!btn) return;
      const id = btn.dataset.id;
      window.location.href = `detalle_pedido.html?id=${id}`;
    });

  } catch (err) {
    console.error("Error al obtener pedidos:", err);
    tbody.innerHTML = `<tr><td colspan="5">Error al cargar pedidos: ${err.message}</td></tr>`;
  }
});
