document.addEventListener("DOMContentLoaded", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("carrito-container");

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>No hay productos en el carrito.</p>";
    return;
  }

  let total = 0;

  carrito.forEach((prod, i) => {
    const subtotal = parseFloat(prod.precio.replace("S/", "").trim()) * prod.cantidad;
    total += subtotal;

    const item = document.createElement("div");
    item.classList.add("item-carrito");
    item.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" width="100">
      <div>
        <h3>${prod.nombre}</h3>
        <p>Color: ${prod.color}</p>
        <p>Precio: ${prod.precio}</p>
        <p>Cantidad: ${prod.cantidad}</p>
        <p>Subtotal: S/ ${subtotal.toFixed(2)}</p>
        <button onclick="eliminarProducto(${i})">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(item);
  });

  document.getElementById("total").textContent = `Total: S/ ${total.toFixed(2)}`;
});

function eliminarProducto(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  location.reload();
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  location.reload();
}


