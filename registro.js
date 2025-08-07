document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-registro');
  const mensaje = document.getElementById('mensaje');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const celular = form.celular.value.trim();
    const departamento = form.departamento.value.trim();
    const provincia = form.provincia.value.trim();
    const distrito = form.distrito.value.trim();
    const direccion = form.direccion.value.trim();
    const tipo_documento = form.tipo_documento.value.trim();
    const numero_documento = form.numero_documento.value.trim();
    const contrasena = form.contrasena.value.trim();
    const confirmar = form.confirmar.value.trim();

    if (!nombre || !correo || !celular || !departamento || !provincia || !distrito || !direccion || !tipo_documento || !numero_documento || !contrasena || !confirmar) {
      mensaje.textContent = 'Por favor, completa todos los campos.';
      mensaje.style.color = 'red';
      return;
    }

    if (contrasena !== confirmar) {
      mensaje.textContent = 'Las contraseñas no coinciden.';
      mensaje.style.color = 'red';
      return;
    }

    try {
      const res = await fetch('https://aurora-backend-ve7u.onrender.com/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre,
          correo,
          celular,
          departamento,
          provincia,
          distrito,
          direccion,
          tipo_documento,
          numero_documento,
          contrasena,
          confirmar
        })
      });

      const data = await res.json();

      if (res.ok) {
        mensaje.textContent = 'Usuario registrado con éxito.';
        mensaje.style.color = 'green';
        form.reset();
      } else {
        mensaje.textContent = data.mensaje || 'Error al registrar.';
        mensaje.style.color = 'red';
      }

    } catch (error) {
      console.error('Error al registrar:', error);
      mensaje.textContent = 'Ocurrió un error. Intenta nuevamente.';
      mensaje.style.color = 'red';
    }

  });
});
