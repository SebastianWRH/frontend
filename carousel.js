// Centrar elemento con cálculo de scrollLeft más robusto, con fallback
function goToIndex(i) {
  index = Math.max(0, Math.min(i, items.length - 1));
  const item = items[index];
  if (!item) return;

  // cálculo objetivo: dejar el item centrado en el track
  const trackWidth = track.clientWidth;
  const itemLeft = item.offsetLeft;
  const itemWidth = item.clientWidth;

  let target = Math.round(itemLeft - (trackWidth - itemWidth) / 2);

  // proteger contra valores fuera de rango
  target = Math.max(0, Math.min(target, track.scrollWidth - trackWidth));

  // Si la diferencia es muy pequeña, aún así intentamos forzar scroll
  const delta = Math.abs(track.scrollLeft - target);

  if (delta > 0) {
    // movimiento suave al objetivo calculado
    track.scrollTo({ left: target, behavior: 'smooth' });
  }

  // Fallback adicional si por alguna razón no hubo movimiento visible:
  // (ej. algunos navegadores pueden ignorar scrollTo si ya están muy cerca)
  setTimeout(() => {
    const nowDelta = Math.abs(track.scrollLeft - target);
    if (nowDelta <= 2) {
      // intentamos scrollIntoView por si el cálculo falla por bordes/padding
      item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    updateButtons();
  }, 240); // espera a que termine la animación de scrollTo (aprox)
}
