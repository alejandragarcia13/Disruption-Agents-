// =============================================================
// agents.js — Los 3 agentes y el orquestador
// =============================================================
// Agente ANTES   → valida el viaje, calcula la distancia y da el checklist
// Agente DURANTE → registra la incidencia, explica derechos y ancla pruebas en Stellar
// Agente DESPUÉS → decide la indemnización, hace la oferta, paga y redacta la reclamación
// Los agentes no calculan importes: eso lo hace rules.js.

const crypto = require('crypto');
const rules = require('./rules');
const stellar = require('./stellar');
const { getCountry, DEMO_RATES } = require('./countries');
const { getAirport } = require('./airports');
const { UI, MSG, REJECT, claimLetter } = require('./templates');

const sha256 = (texto) => crypto.createHash('sha256').update(texto).digest('hex');
const idioma = (c) => (['es', 'pt', 'en'].includes(c.lang) ? c.lang : 'en');
const nombreAeropuerto = (iata) => { const a = getAirport(iata); return a ? `${a.city} (${a.iata})` : iata; };
const normalizarVuelo = (f) => String(f || '').toUpperCase().replace(/\s+/g, '');

// Memoria del servidor por sesión (pruebas y monedero del viajero)
const sesiones = {};
const sesion = (id) => (sesiones[id] = sesiones[id] || {});

// Descripción de la incidencia en el idioma del viajero
function describirIncidencia(c, lang) {
  const t = UI[lang];
  const inc = c.incident || {};
  let detail = '';
  if (inc.type === 'delay') detail = ` (${inc.delayHours} ${t.hours})`;
  if (inc.type === 'cancel') detail = ` (${inc.noticeDays} ${t.days})`;
  return { incident: t[inc.type] || inc.type, detail, cause: t.causes[inc.cause] || inc.cause };
}

// Datos "planos" que usan las reglas
function datosReglas(c) {
  return {
    origin: c.trip.origin, dest: c.trip.dest, airlineEU: c.trip.airlineEU,
    incident: c.incident.type, delayHours: c.incident.delayHours, noticeDays: c.incident.noticeDays, cause: c.incident.cause,
  };
}

// -------------------------------------------------------------
// AGENTE ANTES
// -------------------------------------------------------------
const agenteAntes = {
  id: 'before',
  run(c) {
    const lang = idioma(c);
    const m = MSG[lang].before;
    const v = rules.validarViaje(c.trip || {});
    if (!v.ok) return { ok: false, errors: v.errores, messages: [{ agent: 'before', text: m.invalid }] };

    const km = rules.distanciaKm(v.origen, v.destino);
    const lista = rules.checklistDocumentos(v.origen, v.destino, c.country);
    const d = {
      firstName: String(c.name || '').trim().split(/\s+/)[0] || '👋',
      origin: nombreAeropuerto(v.origen.iata), dest: nombreAeropuerto(v.destino.iata),
      flight: normalizarVuelo(c.trip.flight), date: c.trip.date, km,
    };
    return {
      ok: true,
      km,
      checklist: { items: lista.items.map((k) => MSG[lang].checklist[k]), warning: MSG[lang].checklist.check_official },
      messages: [
        { agent: 'before', text: m.hello(d) },
        { agent: 'before', text: m.distance(d) },
        { agent: 'before', text: m.checklist },
        { agent: 'before', text: m.handoff },
      ],
    };
  },
};

// -------------------------------------------------------------
// AGENTE DURANTE
// -------------------------------------------------------------
const agenteDurante = {
  id: 'during',
  async run(c, sessionId) {
    const lang = idioma(c);
    const m = MSG[lang].during;
    const origen = getAirport(c.trip.origin);
    const destino = getAirport(c.trip.dest);
    const km = rules.distanciaKm(origen, destino);
    const derechos = rules.derechosInmediatos(datosReglas(c), km).map((k) => MSG[lang].rights[k]);

    // Paquete de pruebas: el nombre va como hash (nunca datos personales en la blockchain)
    const paquete = {
      app: 'Disruption Agents',
      traveller: sha256(String(c.name || '').trim().toLowerCase()),
      flight: normalizarVuelo(c.trip.flight), date: c.trip.date,
      route: `${origen.iata}-${destino.iata}`, incident: c.incident,
      airlineEU: c.trip.airlineEU, recordedAt: new Date().toISOString(),
    };
    const hash = sha256(JSON.stringify(paquete));

    const messages = [
      { agent: 'during', text: m.hello },
      { agent: 'during', text: m.summary(describirIncidencia(c, lang)) },
      { agent: 'during', text: m.rightsIntro, list: derechos },
      { agent: 'during', text: m.hashing },
    ];

    // Anclamos el hash en Stellar con memo hash
    let tx = null;
    try {
      const txHash = await stellar.anchorEvidence(hash);
      tx = { kind: 'anchor', hash: txHash, link: stellar.txLink(txHash) };
      messages.push({ agent: 'during', text: m.anchored({ short: `${hash.slice(0, 10)}…` }), tx });
    } catch (e) {
      console.error('[DURANTE] Error al anclar:', e.message);
      messages.push({ agent: 'during', text: m.anchorFailed });
    }
    messages.push({ agent: 'during', text: m.handoff });

    sesion(sessionId).evidence = { hash, package: paquete, tx };
    return { ok: true, rights: derechos, evidence: { hash, tx }, messages };
  },
};

// -------------------------------------------------------------
// AGENTE DESPUÉS
// -------------------------------------------------------------
const agenteDespues = {
  id: 'after',

  // Clave única de la reclamación: vuelo + fecha + viajero (en hash)
  claimKey(c) {
    return sha256(`${normalizarVuelo(c.trip.flight)}|${c.trip.date}|${String(c.name || '').trim().toLowerCase()}`);
  },

  // Decide la indemnización y prepara oferta y reclamación
  evaluate(c, sessionId) {
    const lang = idioma(c);
    const m = MSG[lang].after;
    const ev = rules.evaluar(datosReglas(c));
    const pais = getCountry(c.country);
    const activo = pais ? pais.asset : 'USDC';
    const tipo = DEMO_RATES[activo];
    const local = Math.round(ev.advanceEUR * tipo * 100) / 100;
    const why = MSG[lang].why[ev.reason];

    const messages = [{ agent: 'after', text: m.hello }];
    if (ev.status === 'advance') {
      messages.push({ agent: 'after', text: m.advance({ comp: ev.compensationEUR, adv: ev.advanceEUR, local, asset: activo, km: ev.distanceKm }) });
    } else if (ev.status === 'claim_only') {
      messages.push({ agent: 'after', text: m.claimOnly({ comp: ev.potentialEUR, why }) });
    } else {
      messages.push({ agent: 'after', text: m.noRight({ why }) });
    }
    messages.push({ agent: 'after', text: m.claimReady });

    const s = sesion(sessionId);
    const letter = claimLetter(lang, {
      name: String(c.name || '').trim(), flight: normalizarVuelo(c.trip.flight), date: c.trip.date,
      origin: nombreAeropuerto(c.trip.origin), dest: nombreAeropuerto(c.trip.dest), km: ev.distanceKm,
      ...describirIncidencia(c, lang), comp: ev.potentialEUR, assigned: ev.status === 'advance',
      hash: s.evidence ? s.evidence.hash : '—', anchorLink: s.evidence && s.evidence.tx ? s.evidence.tx.link : null,
    });

    return {
      ok: true,
      evaluation: {
        status: ev.status, covered: ev.covered, reason: ev.reason, why, distanceKm: ev.distanceKm,
        compensationEUR: ev.compensationEUR, potentialEUR: ev.potentialEUR, advanceEUR: ev.advanceEUR,
      },
      offer: ev.status === 'advance' ? { advanceEUR: ev.advanceEUR, local, asset: activo, rate: tipo } : null,
      claimLetter: letter,
      messages,
    };
  },

  // Crea el monedero Stellar del viajero (una vez por sesión)
  async createWallet(c, sessionId) {
    const lang = idioma(c);
    const m = MSG[lang].after;
    const s = sesion(sessionId);
    const pais = getCountry(c.country);
    const activo = pais ? pais.asset : 'USDC';
    if (!s.wallet || s.wallet.asset !== activo) {
      s.wallet = await stellar.createTravellerWallet(activo);
    }
    const tx = { kind: 'trust', hash: s.wallet.trustTx, link: stellar.txLink(s.wallet.trustTx) };
    return {
      ok: true,
      wallet: { public: s.wallet.public, asset: activo, link: `https://stellar.expert/explorer/testnet/account/${s.wallet.public}` },
      messages: [{ agent: 'after', text: m.walletReady({ asset: activo }), tx }, { agent: 'after', text: m.waitingSign }],
    };
  },

  // Paga el 80 % tras la firma. Las barreras de seguridad están en stellar.payClaim
  async pay(c, sessionId, signed) {
    const lang = idioma(c);
    const m = MSG[lang].after;
    const s = sesion(sessionId);
    const ev = rules.evaluar(datosReglas(c)); // recalculamos: nunca nos fiamos del importe del navegador
    const rechazar = (code, error) => ({ ok: false, code, messages: [{ agent: 'after', text: REJECT[lang][code] || error, error: true }] });

    if (ev.status !== 'advance') return rechazar('noAdvance');
    if (!s.wallet) await this.createWallet(c, sessionId);

    try {
      const res = await stellar.payClaim({
        claimKey: this.claimKey(c), signed: signed === true, amountEUR: ev.advanceEUR,
        destination: s.wallet.public, assetCode: s.wallet.asset,
      });
      const tx = { kind: res.assetCode === 'EURC' ? 'pay' : 'path', hash: res.hash, link: res.link };
      const texto = res.assetCode === 'EURC'
        ? m.paidEURC({ sent: res.sentEUR })
        : m.paidPath({ sent: res.sentEUR, received: res.received, asset: res.assetCode });
      return {
        ok: true, payment: { ...res, tx },
        messages: [{ agent: 'after', text: m.signed }, { agent: 'after', text: texto, tx, success: true }, { agent: 'after', text: m.bye }],
      };
    } catch (e) {
      console.error('[DESPUÉS] Pago:', e.message);
      return rechazar(e.code || 'generic', e.message);
    }
  },
};

// -------------------------------------------------------------
// ORQUESTADOR: pasa el relevo al agente correcto según el paso
// -------------------------------------------------------------
async function orquestador(paso, c, sessionId, extra = {}) {
  switch (paso) {
    case 'trip': return agenteAntes.run(c);
    case 'incident': return agenteDurante.run(c, sessionId);
    case 'rights': return agenteDespues.evaluate(c, sessionId);
    case 'wallet': return agenteDespues.createWallet(c, sessionId);
    case 'pay': return agenteDespues.pay(c, sessionId, extra.signed);
    default: throw new Error(`Paso desconocido: ${paso}`);
  }
}

module.exports = { orquestador, agenteAntes, agenteDurante, agenteDespues };
