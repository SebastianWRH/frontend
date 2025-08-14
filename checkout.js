document.addEventListener('DOMContentLoaded', () => {
    const btnConfirmar = document.getElementById('btn-confirmar');
    const formEnvio = document.getElementById('form-envio'); // 🔹 Nuevo

    // 🔹 Evitar que el formulario recargue la página
    if (formEnvio) {
        formEnvio.addEventListener('submit', (e) => {
            e.preventDefault(); // 🚫 evita el submit por defecto
        });
    }

    const resumenCarrito = document.getElementById('resumen-carrito');
    const totalSpan = document.getElementById('checkout-total');

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

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
            let precioNum = typeof item.precio === 'number'
                ? item.precio
                : Number(String(item.precio).replace(/[^\d.-]+/g, '')) || 0;

            const subtotal = precioNum * item.cantidad;
            total += subtotal;

            resumenCarrito.innerHTML += `
                <div class="checkout-item">
                    <img src="${item.imagen}" alt="${item.nombre}" class="checkout-item-img" />
                    <p><strong>${item.nombre}</strong></p>
                    <p><strong>Cantidad:</strong> x${item.cantidad} </p>
                    <p><strong>Color:</strong> ${item.color}</p>
                    <p>S/ ${subtotal.toFixed(2)}</p>
                </div>
            `;
        });

        totalSpan.textContent = `${total.toFixed(2)}`;
    }

    mostrarResumenCarrito();

    if (!btnConfirmar) return;

    btnConfirmar.addEventListener('click', () => {
        if (!usuario || !usuario.id) {
            alert('Debes iniciar sesión para confirmar la compra.');
            window.location.href = 'login.html';
            return;
        }

        if (carrito.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        const total = carrito.reduce((s, it) => {
            let precioNum = typeof it.precio === 'number'
                ? it.precio
                : Number(String(it.precio).replace(/[^\d.-]+/g, '')) || 0;
            return s + (precioNum * it.cantidad);
        }, 0);

        configurarCulqi(total); // Configurar monto
        Culqi.open(); // Abrir formulario de pago
    });

    rellenarDatosEnvio();
});
