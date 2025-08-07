document.getElementById('form-login').addEventListener('submit', async function (e) {
  e.preventDefault();

  const correo = document.getElementById('correo').value.trim();
  const contrasena = document.getElementById('contrasena').value;

  try {
    const respuesta = await fetch('https://aurora-backend-ve7u.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await respuesta.json();
    
    if (respuesta.ok) {
      // Guardar al usuario en localStorage (sin la contraseña)
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redirigir según el rol
      if (data.usuario.rol === 'admin') {
        window.location.href = 'admin.html'; // Página exclusiva admin
      } else {
        window.location.href = 'perfil.html'; // Página normal para cliente
      }
    } else {
      document.getElementById('mensaje-login').textContent = data.mensaje || 'Error al iniciar sesión';
    }

  } catch (error) {
    console.error('Error al enviar datos:', error);
    document.getElementById('mensaje-login').textContent = 'Error del servidor o conexión';
  }


});
