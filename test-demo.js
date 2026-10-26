// =============================================================
// test-demo.js — Prueba completa sin interfaz (npm run test-demo)
// =============================================================
// Recorre 3 casos reales contra la testnet de Stellar y dice si todo va bien.

const { orquestador } = require('./agents');
const setup = require('./setup-stellar');

let fallos = 0;
function comprobar(condicion, texto) {
  console.log(`   ${condicion ? '[OK]  ' : '[FALLO]'} ${texto}`);
  if (!condicion) fallos++;
}

// Recorre los pasos 2 → 5 como lo haría la interfaz
async function caso(titulo, data, esperado) {
  console.log(`\n▶ ${titulo}`);
  const sid = `test-${Date.now()}-${Math.random()}`;
  const antes = await orquestador('trip', data, sid);
  comprobar(antes.ok, `Agente ANTES valida el viaje (${antes.km} km)`);

  const durante = await orquestador('incident', data, sid);
  comprobar(durante.evidence && durante.evidence.tx, `Agente DURANTE ancla las pruebas → ${durante.evidence.tx && durante.evidence.tx.link}`);

  const despues = await orquestador('rights', data, sid);
  const ev = despues.evaluation;
  comprobar(ev.status === esperado.status, `Resultado: ${ev.status} (esperado: ${esperado.status})`);
  if (esperado.comp !== undefined) comprobar(ev.compensationEUR === esperado.comp, `Indemnización: ${ev.compensationEUR} € (esperado: ${esperado.comp} €)`);
  if (esperado.adv !== undefined) comprobar(ev.advanceEUR === esperado.adv, `Oferta inmediata: ${ev.advanceEUR} € (esperado: ${esperado.adv} €)`);

  if (esperado.asset) {
    const sinFirma = await orquestador('pay', data, sid, { signed: false });
    comprobar(!sinFirma.ok && sinFirma.code === 'unsigned', 'Sin "Firmar y cobrar" no se paga');

    const w = await orquestador('wallet', data, sid);
    comprobar(w.wallet && w.wallet.asset === esperado.asset, `Monedero creado con trustline a ${w.wallet.asset}`);

    const pago = await orquestador('pay', data, sid, { signed: true });
    comprobar(pago.ok, `Pago: ${pago.ok ? `${pago.payment.sentEUR} EURC → ${pago.payment.received} ${pago.payment.assetCode} · ${pago.payment.tx.link}` : pago.messages[0].text}`);
    if (pago.ok && esperado.asset !== 'EURC') comprobar(pago.payment.tx.kind === 'path' && pago.payment.received > 0, `Convertido en el DEX por path payment a ${esperado.asset}`);

    const otraVez = await orquestador('pay', data, sid, { signed: true });
    comprobar(!otraVez.ok && otraVez.code === 'already', `Segundo pago rechazado: "${otraVez.messages[0].text}"`);
  } else {
    const pago = await orquestador('pay', data, sid, { signed: true });
    comprobar(!pago.ok, 'No se ofrece ni se paga adelanto');
  }
}

async function main() {
  if (!(await setup.yaConfigurado())) {
    console.log('Stellar no estaba configurado: ejecutando el setup primero...\n');
    await setup.main();
  }

  await caso('Brasil · Lisboa → São Paulo · retraso 5 h · causa técnica', {
    lang: 'pt', country: 'BR', name: 'Ana Souza',
    trip: { origin: 'LIS', dest: 'GRU', flight: 'TP 1234', date: '2026-10-20', airlineEU: 'yes' },
    incident: { type: 'delay', delayHours: 5, cause: 'technical' },
  }, { status: 'advance', comp: 600, adv: 480, asset: 'BRL' });

  await caso('España · Lisboa → Madrid · retraso 4 h · meteorología', {
    lang: 'es', country: 'ES', name: 'Lucía García',
    trip: { origin: 'LIS', dest: 'MAD', flight: 'IB 3101', date: '2026-10-21', airlineEU: 'yes' },
    incident: { type: 'delay', delayHours: 4, cause: 'weather' },
  }, { status: 'claim_only', adv: 0 });

  await caso('México · Madrid → Ciudad de México · cancelación avisada con 3 días', {
    lang: 'es', country: 'MX', name: 'Carlos Hernández',
    trip: { origin: 'MAD', dest: 'MEX', flight: 'UX 0091', date: '2026-10-22', airlineEU: 'yes' },
    incident: { type: 'cancel', noticeDays: 3, cause: 'crew' },
  }, { status: 'advance', comp: 600, adv: 480, asset: 'MXN' });

  console.log(fallos === 0 ? '\n✅ TODO CORRECTO: los 3 casos funcionan de principio a fin.\n' : `\n❌ ${fallos} comprobación(es) fallaron.\n`);
  process.exit(fallos === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('\n[ERROR]', e.message);
  process.exit(1);
});
