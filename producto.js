document.addEventListener("DOMContentLoaded", async function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("detalle-producto").innerHTML = `<p>ID no especificado.</p>`;
    return;
  }

  try {
    const res = await fetch(`https://aurora-backend-ve7u.onrender.com/producto/${id}`);
    if (!res.ok) throw new Error("Producto no encontrado");
    const producto = await res.json();

    document.title = `${producto.nombre} - Aurora Store`;
    
    const contenedor = document.getElementById("detalle-producto");

    contenedor.innerHTML = `
      <div class="producto-detalle">
        <div class="columna-imagenes">
          <div class="zoom-container">
            <img src="${producto.imagenes[0]}" alt="${producto.nombre}" class="img-detalle" id="img-principal">
          </div>
          <div class="miniaturas">
            ${producto.imagenes.map(src => `
              <img src="${src}" class="miniatura" onclick="cambiarImagen('${src}')">
            `).join('')}
          </div>
        </div>

        <div class="info-detalle">
          <h2>${producto.nombre}</h2>
          <p class="precio"><strong>${producto.precio}</strong></p>

          <div class="color-producto">
            <label>Color: <span id="color-seleccionado">Ninguno</span></label>
            <div class="color-options">
              <div class="color-box" data-color="Rojo" style="background-color: red;"></div>
              <div class="color-box" data-color="Negro" style="background-color: black;"></div>
              <div class="color-box" data-color="Azul" style="background-color: blue;"></div>
            </div>
          </div>

          <div class="cantidad-producto">
            <p class="cantidad"><strong>Cantidad:</strong></p>
            <input type="number" id="cantidad" value="1" min="1" max="10">
            <p><strong>Stock disponible:</strong> <span id="stock-disponible">${producto.stock}</span></p>
          </div>

          <div class="opcion-compra">
            <button class="btn-agregar">Agregar al carrito</button>
            <div class="icon-fav" id="toggle-menu" data-producto-id="${producto.id}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            </div>
          </div>

          <div class="tabs-producto">
            <div class="tab-buttons">
              <button class="tab-btn active" onclick="mostrarTab(event, 'descripcion')">Descripción</button>
              <button class="tab-btn" onclick="mostrarTab(event, 'envio')">Envío</button>
            </div>

            <div class="tab-content" id="descripcion" style="display:block;">
              <p>${producto.descripcion || "Sin descripción detallada."}</p>
            </div>

            <div class="tab-content" id="envio" style="display: none;">
              <p>Envíos disponibles a todo el país. Tiempo estimado: 3-5 días hábiles.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const btnAgregar = document.querySelector(".btn-agregar");
    if (producto.stock <= 0) {
      btnAgregar.disabled = true;
      btnAgregar.textContent = "Sin stock";
      btnAgregar.style.backgroundColor = "#aaa";
    }

    // --- Zoom
    const img = document.getElementById("img-principal");
    const zoomContainer = document.querySelector(".zoom-container");

    zoomContainer.addEventListener("mousemove", function (e) {
      const rect = zoomContainer.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = "scale(2)";
    });

    zoomContainer.addEventListener("mouseleave", function () {
      img.style.transform = "scale(1)";
      img.style.transformOrigin = "center center";
    });

    // --- Color selección
    let colorSeleccionado = null;
    document.querySelectorAll(".color-box").forEach(box => {
      box.addEventListener("click", () => {
        document.querySelectorAll(".color-box").forEach(b => b.classList.remove("active"));
        box.classList.add("active");
        colorSeleccionado = box.getAttribute("data-color");
        document.getElementById("color-seleccionado").textContent = colorSeleccionado;
      });
    });

    // --- Tabs
    window.mostrarTab = function (event, tabId) {
      document.querySelectorAll('.tab-content').forEach(div => div.style.display = 'none');
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById(tabId).style.display = 'block';
      event.currentTarget.classList.add('active');
    };

    // --- Agregar al carrito (con verificación de sesión)
    document.querySelector(".btn-agregar").addEventListener("click", (e) => {
      const usuarioSesion = JSON.parse(localStorage.getItem('usuario'));
      if (!usuarioSesion) {
        e.preventDefault();
        alert('Debes iniciar sesión para agregar productos al carrito.');
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `login.html?next=${returnUrl}`;
        return;
      }

      const cantidad = parseInt(document.getElementById("cantidad").value);

      if (!colorSeleccionado) {
        alert("Por favor selecciona un color antes de continuar.");
        return;
      }

      if (isNaN(cantidad) || cantidad < 1 || cantidad > 10) {
        alert("Por favor ingresa una cantidad válida (mínimo 1, máximo 10).");
        return;
      }

      const productoParaCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: document.getElementById("img-principal").src,
        cantidad,
        color: colorSeleccionado
      };

      agregarAlCarrito(productoParaCarrito);
      mostrarCarritoEnSlide();
      document.getElementById("carrito-slide").classList.add("abierto");
    });

    function agregarAlCarrito(productoNuevo) {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const index = carrito.findIndex(item => item.id === productoNuevo.id && item.color === productoNuevo.color);

      if (index !== -1) {
        const nuevaCantidad = carrito[index].cantidad + productoNuevo.cantidad;
        if (nuevaCantidad > producto.stock) {
          alert(`Solo quedan ${producto.stock} unidades en stock.`);
          return;
        }
        carrito[index].cantidad = nuevaCantidad;
      } else {
        carrito.push(productoNuevo);
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarContadorCarrito();
    }

    function actualizarContadorCarrito() {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
      const contador = document.getElementById("contador-productos");
      if (contador) contador.textContent = totalCantidad;
    }

    actualizarContadorCarrito();

    // --- Slide del carrito
    const iconCart = document.querySelector(".icon-cart");
    const slideCarrito = document.getElementById("carrito-slide");
    const cerrarBtn = document.getElementById("cerrar-carrito");

    iconCart?.addEventListener("click", () => {
      slideCarrito.classList.add("abierto");
      mostrarCarritoEnSlide();
    });

    cerrarBtn?.addEventListener("click", () => {
      slideCarrito.classList.remove("abierto");
    });

    function mostrarCarritoEnSlide() {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const contenedor = document.getElementById("contenido-carrito");
      contenedor.innerHTML = "";

      if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
        return;
      }

      carrito.forEach(item => {
        contenedor.innerHTML += `
          <div class="item-carrito">
            <img src="${item.imagen}" width="60">
            <div>
              <h4>${item.nombre}</h4>
              <p>Cantidad: ${item.cantidad}</p>
              <p>Precio: ${item.precio}</p>
            </div>
          </div><hr>
        `;
      });
    }

    // Cambiar imagen principal
    window.cambiarImagen = function (nuevaSrc) {
      const imgPrincipal = document.getElementById("img-principal");
      const anteriorSrc = imgPrincipal.src;
      imgPrincipal.src = nuevaSrc;

      const miniaturas = document.querySelectorAll(".miniatura");
      miniaturas.forEach(mini => {
        if (mini.src === nuevaSrc) {
          mini.src = anteriorSrc;
        }
      });
    };

  } catch (error) {
    console.error("Error al cargar producto:", error);
    document.getElementById("detalle-producto").innerHTML = `<p>Error al cargar el producto.</p>`;
  }

  // --- Sistema de favoritos ---
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    document.querySelectorAll('.icon-fav').forEach(btn => {
      btn.addEventListener('click', () => {
        alert("Debes iniciar sesión para agregar a favoritos.");
      });
    });
  } else {
    const userId = usuario.id;

    async function obtenerFavoritos() {
      try {
        const res = await fetch(`https://aurora-backend-ve7u.onrender.com/favoritos/${userId}`);
        if (!res.ok) throw new Error("Error al obtener favoritos");
        return await res.json();
      } catch (e) {
        console.error("Fallo al cargar favoritos:", e);
        return [];
      }
    }

    document.querySelectorAll('.icon-fav').forEach(async (btn) => {
      const productoId = btn.dataset.productoId;
      if (!productoId) return;

      let esFavorito = false;
      let bloqueado = false;

      const favoritos = await obtenerFavoritos();
      esFavorito = favoritos.some(fav => String(fav.id) === String(productoId));
      actualizarIcono();

      function actualizarIcono() {
        btn.classList.toggle("activo", esFavorito);
        btn.style.color = esFavorito ? "black" : "black";
      }

      async function agregarAFavoritos() {
        if (bloqueado) return;
        bloqueado = true;
        try {
          const res = await fetch("https://aurora-backend-ve7u.onrender.com/favoritos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario: userId, id_producto: productoId })
          });

          const data = await res.json();
          if (!res.ok) {
            if (res.status === 400 && data.mensaje && data.mensaje.toLowerCase().includes("ya está")) {
              esFavorito = true;
            } else {
              throw new Error(data.mensaje || "Error al agregar favorito");
            }
          } else {
            esFavorito = true;
          }
          actualizarIcono();
          alert("Producto agregado a favoritos.");
        } catch (e) {
          console.error("Error agregando favorito:", e);
          alert("No se pudo agregar a favoritos.");
        } finally {
          bloqueado = false;
        }
      }

      async function quitarDeFavoritos() {
        if (bloqueado) return;
        bloqueado = true;
        try {
          const res = await fetch("https://aurora-backend-ve7u.onrender.com/favoritos", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario: userId, id_producto: productoId })
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.mensaje || "Error al eliminar favorito");
          }
          esFavorito = false;
          actualizarIcono();
          alert("Producto eliminado de favoritos.");
        } catch (e) {
          console.error("Error quitando favorito:", e);
          alert("No se pudo eliminar de favoritos.");
        } finally {
          bloqueado = false;
        }
      }

      btn.addEventListener("click", () => {
        if (esFavorito) {
          quitarDeFavoritos();
        } else {
          agregarAFavoritos();
        }
      });
    });
  }
});

