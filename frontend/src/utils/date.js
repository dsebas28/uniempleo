// El backend (SQLite datetime('now')) guarda fechas como "YYYY-MM-DD HH:MM:SS" en UTC,
// sin sufijo de zona horaria. `new Date(...)` interpreta ese formato como hora LOCAL,
// no UTC, así que sin este ajuste los tiempos relativos quedan desfasados
// (a veces incluso "en el futuro") según la zona horaria del navegador.
export function parseUTC(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr.includes('T') ? dateStr : `${dateStr.replace(' ', 'T')}Z`);
}

export function timeAgo(dateStr) {
  const date = parseUTC(dateStr);
  if (!date) return '';
  const diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diff < 60) return 'Ahora';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} días`;
  return date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
}
