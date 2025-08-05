document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || !usuario.id) {
    alert('Debes iniciar sesión para ver tus favoritos');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(`https://aurora-backend-ve7u.onrender.com/favoritos/${usuario.id}`);
    const favoritos = await res.json();

    const contenedor = document.getElementById('contenedor-favoritos');

    if (favoritos.length === 0) {
      contenedor.innerHTML = '<p>No tienes productos favoritos.</p>';
      return;
    }

    favoritos.forEach(producto => {
      const card = document.createElement('div');
      card.classList.add('producto-card');
      card.dataset.id = producto.id; // Guardamos el ID en el dataset

      card.innerHTML = `
        <img src="${producto.miniatura}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p><strong>S/ ${producto.precio}</strong></p>
        <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
      `;

      contenedor.appendChild(card);
    });

    // Evento para eliminar favorito
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Evita que se active el click en la tarjeta
        const productoId = btn.getAttribute('data-id');

        try {
          await fetch("https://aurora-backend-ve7u.onrender.com/favoritos", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_usuario: usuario.id,
              id_producto: productoId
            })
          });

          // Elimina visualmente la tarjeta
          btn.parentElement.remove();

        } catch (error) {
          console.error('Error al eliminar favorito:', error);
          alert('No se pudo eliminar el favorito.');
        }
      });
    });

    // Evento para redireccionar al producto
    const tarjetas = document.querySelectorAll('.producto-card');
    tarjetas.forEach(card => {
      card.addEventListener('click', (e) => {
        // Si se hizo clic en el botón eliminar, no redireccionamos
        if (e.target.classList.contains('btn-eliminar')) return;

        const id = card.dataset.id;
        window.location.href = `producto.html?id=${id}`;
      });
    });

  } catch (err) {
    console.error('Error al obtener favoritos:', err);
    alert('Hubo un problema al cargar tus favoritos.');
  }
});
