document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const contenedor = document.getElementById('perfil-contenido');

  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

  function mostrarPerfilSoloTexto(usuario) {
    contenedor.innerHTML = `
      <div class="perfil-grid">
        <div><strong>Nombre:</strong> <span>${usuario.nombre}</span></div>
        <div><strong>Correo:</strong> ${usuario.correo}</div>
        <div><strong>Celular:</strong> ${usuario.celular}</div>
        <div><strong>Departamento:</strong> ${usuario.departamento}</div>
        <div><strong>Provincia:</strong> ${usuario.provincia}</div>
        <div><strong>Distrito:</strong> ${usuario.distrito}</div>
        <div><strong>Dirección:</strong> ${usuario.direccion}</div>
        <div><strong>Tipo de documento:</strong> ${usuario.tipo_documento}</div>
        <div><strong>Número de documento:</strong> ${usuario.numero_documento}</div>
      </div>
      <div class="botones-perfil">
        <button id="editar-btn">Editar perfil</button>
      </div>
    `;
    document.getElementById('editar-btn').addEventListener('click', mostrarCamposEditables);
  }

  function mostrarCamposEditables() {
    console.log(usuario);
    contenedor.classList.add('formulario-edicion');
    contenedor.innerHTML = `
      <div class="perfil-grid">
        <label>Nombre: <input type="text" id="edit-nombre" value="${usuario.nombre}" /></label>
        <label>Correo: <input type="email" id="edit-correo" value="${usuario.correo}" /></label>
        <label>Celular: <input type="text" id="edit-celular" value="${usuario.celular}" /></label>
        <label>Departamento: <input type="text" id="edit-departamento" value="${usuario.departamento}" /></label>
        <label>Provincia: <input type="text" id="edit-provincia" value="${usuario.provincia}" /></label>
        <label>Distrito: <input type="text" id="edit-distrito" value="${usuario.distrito}" /></label>
        <label>Dirección: <input type="text" id="edit-direccion" value="${usuario.direccion}" /></label>
        <label>Tipo de documento: <input type="text" id="edit-tipo_documento" value="${usuario.tipo_documento}" /></label>
        <label>Número de documento: <input type="text" id="edit-numero_documento" value="${usuario.numero_documento}" /></label>
      </div>
      <div class="botones-perfil">
        <button id="guardar-btn">Guardar cambios</button>
        <button id="cancelar-btn">Cancelar</button>
      </div>
    `;

    document.getElementById('guardar-btn').addEventListener('click', guardarCambios);
    document.getElementById('cancelar-btn').addEventListener('click', () => {
      contenedor.classList.remove('formulario-edicion');
      mostrarPerfilSoloTexto(usuario);
    });
  }

  function guardarCambios() {
    const nuevosDatos = {
      id: usuario.id,
      nombre: document.getElementById('edit-nombre').value,
      correo: document.getElementById('edit-correo').value,
      celular: document.getElementById('edit-celular').value,
      departamento: document.getElementById('edit-departamento').value,
      provincia: document.getElementById('edit-provincia').value,
      distrito: document.getElementById('edit-distrito').value,
      direccion: document.getElementById('edit-direccion').value,
      tipo_documento: document.getElementById('edit-tipo_documento').value,
      numero_documento: document.getElementById('edit-numero_documento').value
    };

    fetch(`https://aurora-backend-ve7u.onrender.com/usuario/${usuario.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevosDatos)
    })
    .then(res => res.json())
    .then(data => {
      if (data.mensaje === 'Perfil actualizado con éxito') {
        alert('✅ Perfil actualizado');
        const nuevoUsuario = { ...usuario, ...nuevosDatos };
        localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
        contenedor.classList.remove('formulario-edicion');
        mostrarPerfilSoloTexto(nuevoUsuario);
      } else {
        alert('❌ Error al actualizar');
      }
    })
    .catch(err => console.error('Error al guardar:', err));
  }

  mostrarPerfilSoloTexto(usuario);
});



function mostrarTabUsuario(evt, tabId) {
  const contenidos = document.querySelectorAll(".tab-content");
  const botones = document.querySelectorAll(".tab-btn");

  contenidos.forEach(c => c.style.display = "none");
  botones.forEach(b => b.classList.remove("active"));

  document.getElementById(tabId).style.display = "block";
  evt.currentTarget.classList.add("active");
}
