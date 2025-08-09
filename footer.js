const footerHTML = `
<footer class="footer">
  <div class="footer-container">
    <div class="footer-section">
      <h3>Aurora Store</h3>
      <p>Joyas artesanales únicas hechas con pasión.</p>
      <p>© ${new Date().getFullYear()} Aurora Store. Todos los derechos reservados.</p>
    </div>
    <div class="footer-section">
      <h4>Enlaces rápidos</h4>
      <ul>
        <li><a href="/inicio.html">Inicio</a></li>
        <li><a href="/catalogo.html">Catálogo</a></li>
        <li><a href="/contacto.html">Contacto</a></li>
        <li><a href="/politicas.html">Políticas de privacidad</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h4>Síguenos</h4>
      <div class="social-icons">
        <a href="https://facebook.com/aurorastore" target="_blank" aria-label="Facebook" rel="noopener noreferrer">
          <img src="/icons/facebook.svg" alt="Facebook" />
        </a>
        <a href="https://instagram.com/au.rora_pe" target="_blank" aria-label="Instagram" rel="noopener noreferrer">
          <img src="/icons/instagram.svg" alt="Instagram" />
        </a>
        <a href="https://twitter.com/aurorastore" target="_blank" aria-label="Twitter" rel="noopener noreferrer">
          <img src="/icons/twitter.svg" alt="Twitter" />
        </a>
      </div>
    </div>
    <div class="footer-section newsletter">
      <h4>Suscríbete al newsletter</h4>
      <form id="newsletter-form">
        <input type="email" placeholder="Tu correo electrónico" aria-label="Correo electrónico" required />
        <button type="submit">Enviar</button>
      </form>
      <p id="newsletter-msg" class="newsletter-msg"></p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background-color: #222;
    color: #ddd;
    padding: 2rem 1rem;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
  }
  .footer-container {
    max-width: 1200px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1.5rem;
  }
  .footer-section {
    flex: 1 1 200px;
    min-width: 200px;
  }
  .footer-section h3, .footer-section h4 {
    color: #f9c74f;
    margin-bottom: 1rem;
  }
  .footer-section p, .footer-section ul {
    margin: 0 0 1rem 0;
  }
  .footer-section ul {
    list-style: none;
    padding: 0;
  }
  .footer-section ul li {
    margin-bottom: 0.5rem;
  }
  .footer-section ul li a {
    color: #ddd;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  .footer-section ul li a:hover {
    color: #f9c74f;
  }
  .social-icons a {
    display: inline-block;
    margin-right: 10px;
  }
  .social-icons img {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
    transition: filter 0.3s ease;
  }
  .social-icons a:hover img {
    filter: brightness(0) invert(0.6);
  }
  .newsletter form {
    display: flex;
    gap: 0.5rem;
  }
  .newsletter input[type="email"] {
    flex-grow: 1;
    padding: 0.5rem;
    border-radius: 4px;
    border: none;
    font-size: 14px;
  }
  .newsletter button {
    padding: 0.5rem 1rem;
    background-color: #f9c74f;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s ease;
  }
  .newsletter button:hover {
    background-color: #c9a235;
  }
  .newsletter-msg {
    margin-top: 0.5rem;
    font-size: 13px;
    color: #88c070;
  }
  @media (max-width: 600px) {
    .footer-container {
      flex-direction: column;
    }
    .footer-section {
      min-width: auto;
    }
    .newsletter form {
      flex-direction: column;
    }
    .newsletter button {
      width: 100%;
    }
  }
</style>
`;




function insertFooter() {
  const footerDiv = document.createElement('div');
  footerDiv.innerHTML = footerHTML;
  document.body.appendChild(footerDiv);

  // Opcional: manejar el envío del newsletter
  const form = document.getElementById('newsletter-form');
  const msg = document.getElementById('newsletter-msg');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      // Aquí iría lógica para enviar email a tu backend o servicio externo
      msg.textContent = `Gracias por suscribirte, ${email}!`;
      form.reset();
    });
  }
}

// Llamar la función para que agregue el footer
insertFooter();
