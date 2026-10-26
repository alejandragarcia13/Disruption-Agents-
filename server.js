// =============================================================
// server.js — Servidor web en http://localhost:3000
// =============================================================
const express = require('express');
const path = require('path');
const { orquestador } = require('./agents');
const { COUNTRIES, DEMO_RATES } = require('./countries');
const { AIRPORTS } = require('./airports');
const { UI } = require('./templates');
const stellar = require('./stellar');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Datos para la interfaz: países, aeropuertos, textos y tipos de cambio de demo.
// Las funciones de las plantillas no viajan por JSON, así que enviamos el texto de la cesión aparte.
app.get('/api/config', async (req, res) => {
  const ui = JSON.parse(JSON.stringify(UI));
  res.json({ countries: COUNTRIES, airports: AIRPORTS, ui, rates: DEMO_RATES, stellarReady: await stellar.isReady() });
});

// Un único punto de entrada: el orquestador decide qué agente responde
app.post('/api/agent/:step', async (req, res) => {
  const { sessionId, data, signed } = req.body || {};
  if (!sessionId || !data) return res.status(400).json({ ok: false, error: 'Faltan datos' });
  try {
    const out = await orquestador(req.params.step, data, sessionId, { signed });
    // Texto de la cesión ya traducido a los 3 idiomas (para el paso 5)
    if (req.params.step === 'rights' && out.offer) {
      const importes = { comp: `${out.evaluation.compensationEUR} €`, adv: `${out.offer.advanceEUR} €` };
      out.cessionText = { es: UI.es.cessionText(importes), pt: UI.pt.cessionText(importes), en: UI.en.cessionText(importes) };
    }
    res.json(out);
  } catch (e) {
    console.error(`[${req.params.step}]`, e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`\n  ✈  Disruption Agents → http://localhost:${PORT}\n`);
  if (!(await stellar.isReady())) {
    console.log('  [!] Stellar no está configurado (o la testnet se ha reiniciado). Ejecuta: npm run setup\n');
  }
});
