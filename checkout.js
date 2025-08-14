
// Configurar Culqi
Culqi.publicKey = 'pk_test_LM7miS6X1pqLKSl5';
// Cargar datos del usuario logueado
// Autocompletar formulario con datos del usuario
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        document.querySelector('input[name="nombre"]').value = usuario.nombre || "";
        document.querySelector('input[name="celular"]').value = usuario.celular || "";
        document.querySelector('input[name="direccion"]').value = usuario.direccion || "";
        document.querySelector('input[name="distrito"]').value = usuario.distrito || "";
        document.querySelector('input[name="departamento"]').value = usuario.departamento || "";
    }
});


// Capturamos el formulario
const formEnvio = document.getElementById("form-envio");
const mensajeDiv = document.getElementById("mensaje");

// Simulación de datos del carrito
const id_usuario = localStorage.getItem("id_usuario") || 1;
const items = JSON.parse(localStorage.getItem("carrito")) || [];
const monto = items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
// Mostrar productos en el checkout
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalContainer = document.getElementById("cart-total");

function renderCart() {
    cartItemsContainer.innerHTML = ""; // Limpiar

    if (items.length === 0) {
        cartItemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
        cartTotalContainer.textContent = "S/ 0.00";
        return;
    }

    let total = 0;
    items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
            <span>${item.nombre} (x${item.cantidad})</span>
            <span>S/ ${(item.precio * item.cantidad).toFixed(2)}</span>
        `;
        cartItemsContainer.appendChild(itemDiv);

        total += item.precio * item.cantidad;
    });

    cartTotalContainer.textContent = `S/ ${total.toFixed(2)}`;
}

renderCart();


// Evento de envío del formulario
formEnvio.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita recargar la página

    // Datos del formulario
    const formData = new FormData(formEnvio);
    const datosEnvio = Object.fromEntries(formData.entries());

    // Abrir Culqi
    Culqi.settings({
        title: 'Aurora Store',
        currency: 'PEN',
        description: 'Compra en línea',
        amount: monto * 100 // En céntimos
    });

    Culqi.open();
});

// Cuando Culqi devuelve el token
function culqi() {
    if (Culqi.token) {
        const token = Culqi.token.id;
        const email = Culqi.token.email;

        pagar(token, email);
    } else {
        mensajeDiv.innerHTML = `<p style="color:red;">Error con el pago: ${Culqi.error.user_message}</p>`;
    }
}

// Función para enviar datos al backend
async function pagar(token, email) {
    try {
        const res = await fetch("https://aurora-backend-ve7u.onrender.com/api/pagar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                monto,
                email,
                id_usuario,
                items
            })
        });

        const data = await res.json();

        if (data.success) {
            mensajeDiv.innerHTML = `<p style="color:green;">Pago exitoso. Pedido ID: ${data.pedido.id}</p>`;
            localStorage.removeItem("carrito"); // Vaciar carrito
        } else {
            mensajeDiv.innerHTML = `<p style="color:red;">Error: ${data.error.user_message || "No se pudo procesar el pago."}</p>`;
        }
    } catch (error) {
        console.error("Error en el pago:", error);
        mensajeDiv.innerHTML = `<p style="color:red;">Error de conexión con el servidor.</p>`;
    }
}