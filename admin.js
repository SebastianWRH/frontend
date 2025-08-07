document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || usuario.rol !== 'admin') {
    alert('Acceso no autorizado');
    window.location.href = 'index.html';
    return;
  }

  try {
    const res = await fetch('https://aurora-backend-ve7u.onrender.com/usuarios');
    const data = await res.json();

    const tbody = document.getElementById('tabla-usuarios');
    data.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input value="${user.nombre}" data-id="${user.id}" data-campo="nombre" /></td>
        <td><input value="${user.correo}" data-id="${user.id}" data-campo="correo" /></td>
        <td>
          <select data-id="${user.id}" data-campo="rol">
            <option value="cliente" ${user.rol === 'cliente' ? 'selected' : ''}>Cliente</option>
            <option value="admin" ${user.rol === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
        <td>
          <button onclick="guardar(${user.id})">Guardar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
  }
});

async function guardar(id) {
  const inputs = document.querySelectorAll(`[data-id="${id}"]`);
  const datos = {};

  inputs.forEach(input => {
    datos[input.dataset.campo] = input.value;
  });

  try {
    const res = await fetch(`https://aurora-backend-ve7u.onrender.com/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const resultado = await res.json();
    alert(resultado.mensaje || 'Actualizado');
  } catch (err) {
    console.error('Error al guardar:', err);
  }
}
