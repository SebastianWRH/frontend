// Crear overlay dinámicamente
const overlay = document.createElement('div');
overlay.id = 'busqueda-overlay';
overlay.style.cssText = `
  position: fixed;
  top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.6);
  display: none;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  overflow-y: auto;
`;

overlay.innerHTML = `
  <div style="
    background:#fff;
    width:90%; max-width:700px;
    margin-top:50px; padding:20px;
    border-radius:12px;
    box-shadow:0 8px 20px rgba(0,0,0,0.3);
    display:flex; flex-direction:column; align-items:center;
  ">
    <div style="display:flex; align-items:center; width:100%; margin-bottom:10px;">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:24px;height:24px;margin-right:10px;color:#333;">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
      </svg>
      <input type="text" id="input-busqueda" placeholder="Buscar productos..." style="flex:1;padding:10px 15px;font-size:16px;border:1px solid #ccc;border-radius:8px;">
    </div>
    <h3 style="margin:15px 0 5px 0;text-align:center;">Productos</h3>
    <hr style="width:100%; margin-bottom:10px;">
    <div id="resultados-busqueda" style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; width:100%;"></div>
  </div>
`;

document.body.appendChild(overlay);

const inputBusqueda = document.getElementById('input-busqueda');
const resultadosBusqueda = document.getElementById('resultados-busqueda');

// Abrir overlay al hacer clic en lupa
document.querySelector('.icon-search').addEventListener('click', () => {
  overlay.style.display = 'flex';
  inputBusqueda.focus();
});

// Cerrar al hacer clic fuera del contenedor
overlay.addEventListener('click', e => {
  if(e.target === overlay) overlay.style.display = 'none';
});

// Buscar productos mientras escribes
inputBusqueda.addEventListener('input', async () => {
  const query = inputBusqueda.value.trim();
  if(!query) {
    resultadosBusqueda.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(`https://aurora-backend-ve7u.onrender.com/buscar-productos?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const productos = data.productos || data; // según cómo tu backend devuelva

    resultadosBusqueda.innerHTML = productos.map(p => `
    <div 
        style="width:120px; text-align:center; display:flex; flex-direction:column; align-items:center; cursor:pointer;"
        onclick="window.location.href='producto.html?id=${p.id}'"
    >
        <img src="${p.imagenes?.[0] || p.imagen}" alt="${p.nombre}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-bottom:5px;">
        <span>${p.nombre}</span>
        <strong>S/ ${p.precio}</strong>
    </div>
    `).join('');

  } catch(err) {
    console.error('Error al buscar productos:', err);
  }
});


