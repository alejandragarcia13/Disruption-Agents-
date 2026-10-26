// =============================================================
// rules.js — Reglas EU261 SIMPLIFICADAS (solo para la demo)
// =============================================================
// ⚠️ No es asesoramiento jurídico. Todo lo marcado con TODO_LEGAL
// debe revisarlo el perfil legal del equipo.
// Aquí se calculan TODOS los importes. Las plantillas nunca calculan nada.

const { getAirport } = require('./airports');

const MAX_PAGO_EUR = 600;      // barrera de seguridad: nunca pagamos más de esto
const PORCENTAJE_ADELANTO = 0.8; // pagamos el 80 % al instante

// Causas que PODRÍAN ser "circunstancias extraordinarias" (la aerolínea podría no pagar)
// TODO_LEGAL: la lista real es más matizada (jurisprudencia del TJUE).
const CAUSAS_EXTRAORDINARIAS = ['weather', 'atc_strike'];

// Distancia en km entre dos puntos (fórmula haversine)
function distanciaKm(a, b) {
  const R = 6371; // radio de la Tierra en km
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

// Importe según la distancia
// TODO_LEGAL: no aplicamos la reducción del 50 % cuando hay reubicación con poco retraso (art. 7.2).
function importePorDistancia(km, dentroDeLaUE) {
  if (km <= 1500) return 250;
  if (km <= 3500) return 400;
  // TODO_LEGAL: vuelos dentro de la UE de más de 3.500 km se quedan en 400 € (art. 7.1.b)
  if (dentroDeLaUE) return 400;
  return 600;
}

// ¿Está el vuelo dentro del ámbito de EU261? → 'yes' | 'no' | 'doubtful'
// TODO_LEGAL: ámbito simplificado (art. 3).
function ambito(origen, destino, aerolineaEU) {
  if (origen.eu) return { covered: 'yes', reason: 'departs_eu' };
  if (destino.eu) {
    if (aerolineaEU === 'yes') return { covered: 'yes', reason: 'arrives_eu_eu_airline' };
    if (aerolineaEU === 'unknown') return { covered: 'doubtful', reason: 'arrives_eu_unknown_airline' };
    return { covered: 'no', reason: 'arrives_eu_non_eu_airline' };
  }
  return { covered: 'no', reason: 'outside_eu' };
}

// ¿La incidencia da derecho a compensación?
function incidenciaCompensable(c) {
  if (c.incident === 'delay') {
    // TODO_LEGAL: 3 h o más de retraso en la llegada al destino final (sentencia Sturgeon)
    return Number(c.delayHours) >= 3 ? 'delay_ok' : 'delay_short';
  }
  if (c.incident === 'cancel') {
    // TODO_LEGAL: simplificado. La norma real tiene más matices (7-14 días con reubicación, etc.)
    return Number(c.noticeDays) < 14 ? 'cancel_late' : 'cancel_early';
  }
  return 'denied'; // denegación de embarque: compensación según los mismos tramos
}

// Validación del viaje (la usa el Agente ANTES)
function validarViaje(trip) {
  const errores = [];
  const origen = getAirport(trip.origin);
  const destino = getAirport(trip.dest);
  if (!origen) errores.push('origin');
  if (!destino) errores.push('dest');
  if (origen && destino && origen.iata === destino.iata) errores.push('same_airport');
  if (!/^[A-Z0-9]{2}\s?\d{1,4}[A-Z]?$/i.test(String(trip.flight || '').trim())) errores.push('flight');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(trip.date || ''))) errores.push('date');
  if (!['yes', 'no', 'unknown'].includes(trip.airlineEU)) errores.push('airlineEU');
  return { ok: errores.length === 0, errores, origen, destino };
}

// Checklist de documentos (genérico). TODO_LEGAL: revisar textos y requisitos.
function checklistDocumentos(origen, destino, paisViajero) {
  const lista = ['passport', 'visa', 'insurance', 'booking'];
  // Si viaja dentro del espacio UE con nacionalidad de la UE, el DNI puede bastar
  if (origen.eu && destino.eu) lista[0] = 'id_or_passport';
  return { items: lista, warning: 'check_official', destCountry: destino.country, travellerCountry: paisViajero };
}

// Derechos inmediatos (derecho de atención, art. 8 y 9). Los usa el Agente DURANTE.
// TODO_LEGAL: umbrales simplificados.
function derechosInmediatos(c, km) {
  const derechos = [];
  const umbral = km <= 1500 ? 2 : km <= 3500 ? 3 : 4;
  if (c.incident === 'delay') {
    if (Number(c.delayHours) >= umbral) derechos.push('meals', 'communication', 'hotel');
    if (Number(c.delayHours) >= 5) derechos.push('refund');
    if (derechos.length === 0) derechos.push('wait');
  } else {
    derechos.push('meals', 'communication', 'hotel', 'reroute');
  }
  derechos.push('keep_receipts');
  return derechos;
}

// Decisión final (la usa el Agente DESPUÉS)
// status: 'advance' (cobro inmediato), 'claim_only' (solo reclamación), 'no_right' (sin derecho)
function evaluar(c) {
  const origen = getAirport(c.origin);
  const destino = getAirport(c.dest);
  const km = distanciaKm(origen, destino);
  const alcance = ambito(origen, destino, c.airlineEU);
  const incidencia = incidenciaCompensable(c);
  const compensable = ['delay_ok', 'cancel_late', 'denied'].includes(incidencia);
  const importe = importePorDistancia(km, origen.eu && destino.eu);

  let status = 'advance';
  let motivo = 'airline_cause';
  if (alcance.covered === 'no') { status = 'no_right'; motivo = alcance.reason; }
  else if (!compensable) { status = 'no_right'; motivo = incidencia; }
  else if (alcance.covered === 'doubtful') { status = 'claim_only'; motivo = alcance.reason; }
  else if (CAUSAS_EXTRAORDINARIAS.includes(c.cause)) { status = 'claim_only'; motivo = 'extraordinary'; }
  else if (c.cause === 'unknown') { status = 'claim_only'; motivo = 'unknown_cause'; }

  const indemnizacion = status === 'no_right' ? 0 : importe;
  // Adelanto del 80 %, nunca por encima del máximo de seguridad
  const adelanto = status === 'advance' ? Math.min(Math.round(importe * PORCENTAJE_ADELANTO * 100) / 100, MAX_PAGO_EUR) : 0;

  return {
    distanceKm: km,
    covered: alcance.covered,
    scopeReason: alcance.reason,
    incidentCheck: incidencia,
    status,
    reason: motivo,
    compensationEUR: indemnizacion,
    potentialEUR: importe, // lo que se reclamaría si la aerolínea reconociera el derecho
    advanceEUR: adelanto,
    origin: origen,
    dest: destino,
  };
}

module.exports = {
  MAX_PAGO_EUR, PORCENTAJE_ADELANTO, distanciaKm, validarViaje, checklistDocumentos,
  derechosInmediatos, evaluar,
};
