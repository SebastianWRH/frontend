// ======================
// 🔹 Configuración Culqi
// ======================
Culqi.publicKey = 'pk_test_LM7miS6X1pqLKSl5'; // tu llave pública

function configurarCulqi(totalCompra) {
    Culqi.settings({
        title: 'Aurora Bisutería',
        currency: 'PEN',
        amount: Math.round(totalCompra * 100) // convertir a céntimos
    });
}

// ======================
// 🔹 Mostrar Carrito y Botón Confirmar
// ======================
document.addEventListener('DOMContentLoaded', () => {
    const btnConfirmar = document.getElementById('btn-confirmar');
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

    btnConfirmar.addEventListener('click', (e) => {
        e.preventDefault();
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

        configurarCulqi(total); // 🔹 Configurar monto
        Culqi.open(); // 🔹 Abre el formulario de pago
    });

    rellenarDatosEnvio();
});

// ======================
// 🔹 Datos de Envío
// ======================
document.addEventListener("DOMContentLoaded", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    try {
        const res = await fetch(`https://aurora-backend-ve7u.onrender.com/usuario/${usuario.id}`);
        const datos = await res.json();

        document.getElementById("direccion").textContent = datos.direccion || "-";
        document.getElementById("departamento").textContent = datos.departamento || "-";
        document.getElementById("provincia").textContent = datos.provincia || "-";
        document.getElementById("distrito").textContent = datos.distrito || "-";
        document.getElementById("celular").textContent = datos.celular || "-";
    } catch (error) {
        console.error("Error al cargar datos de envío:", error);
    }
});

// ======================
// 🔹 Función Culqi Callback
// ======================
function culqi() {
    if (Culqi.token) {
        const token = Culqi.token.id;
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const total = carrito.reduce((s, it) => {
            let precioNum = typeof it.precio === 'number'
                ? it.precio
                : Number(String(it.precio).replace(/[^\d.-]+/g, '')) || 0;
            return s + (precioNum * it.cantidad);
        }, 0);

        // 1️⃣ Enviar token a backend para procesar pago
        fetch('https://aurora-backend-ve7u.onrender.com/pagar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token,
              monto: total,
              email: usuario.email,
              id_usuario: usuario.id,
              items
    })
        })
        .then(res => res.json())
        .then(async data => {
            if (data.success) {
                // 2️⃣ Crear pedido en backend
                const items = carrito.map(it => ({
                    id_producto: it.id,
                    cantidad: Number(it.cantidad) || 1,
                    precio_unitario: typeof it.precio === 'number'
                        ? it.precio
                        : Number(String(it.precio).replace(/[^\d.-]+/g, '')) || 0
                }));

                const pedidoRes = await fetch('https://aurora-backend-ve7u.onrender.com/pedido', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_usuario: usuario.id,
                        total,
                        items
                    })
                });

                const pedidoData = await pedidoRes.json();

                if (pedidoRes.ok) {
                    alert('Pago y pedido confirmados 🎉');
                    localStorage.removeItem('carrito');
                    window.location.href = `detalle_pedido.html?id=${pedidoData.id_pedido}`;
                } else {
                    alert('Pago realizado, pero error al registrar el pedido.');
                }
            } else {
                alert('Error en el pago ❌');
                console.error(data.error);
            }
        })
        .catch(err => {
            console.error('Error al procesar pago:', err);
            alert('Error al procesar pago.');
        });

    } else {
        console.error(Culqi.error);
        alert('Error al procesar el pago.');
    }
}







// Configurar Culqi con tu llave pública
Culqi.publicKey = 'TU_LLAVE_PUBLICA';

document.getElementById('btn-pagar').addEventListener('click', function () {
    Culqi.settings({
        title: 'Mi Tienda',
        currency: 'PEN',
        amount: 5000, // Monto en céntimos (5000 = S/ 50.00)
        description: 'Compra en mi tienda'
    });
    Culqi.open();
});

function culqi() {
    if (Culqi.token) {
        let token = Culqi.token.id;

        // Enviar el token a tu backend para crear el cargo
        fetch('https://tu-backend.com/pagar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
        .then(res => res.json())
        .then(data => console.log('Pago exitoso:', data))
        .catch(err => console.error('Error:', err));
    } else {
        console.log(Culqi.error);
    }
}
