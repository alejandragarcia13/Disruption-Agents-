// =============================================================
// setup-stellar.js — Prepara la TESTNET de Stellar (npm run setup)
// =============================================================
// Crea 3 cuentas (emisor, pool y creador de mercado), emite las monedas
// de demo y publica ofertas en el DEX con tipos de cambio FICTICIOS.
// Se puede ejecutar varias veces: si todo ya está listo, no hace nada.
// Para empezar de cero: npm run setup -- --force

const fs = require('fs');
const { Keypair, Operation } = require('@stellar/stellar-sdk');
const { DEMO_RATES } = require('./countries');
const stellar = require('./stellar');
const { server } = stellar;

const MONEDAS = Object.keys(DEMO_RATES); // EURC, USDC, BRL, MXN, COP, ARS, GBP
const FONDO_POOL_EURC = 1000000;   // tesorería del pool en EURC
const LIQUIDEZ_EUR = 500000;       // liquidez del creador de mercado (equivalente en €) por moneda

// ¿Ya está todo configurado y vivo en la testnet?
async function yaConfigurado() {
  const acc = stellar.loadAccounts();
  if (!acc) return false;
  try {
    const pool = await server.loadAccount(acc.pool.public);
    const eurc = pool.balances.find((b) => b.asset_code === 'EURC');
    const ofertas = await server.offers().forAccount(acc.market.public).limit(50).call();
    return eurc && Number(eurc.balance) > 10000 && ofertas.records.length >= MONEDAS.length - 1;
  } catch {
    return false; // la testnet se ha reiniciado o las cuentas no existen
  }
}

async function main() {
  const force = process.argv.includes('--force');
  if (!force && (await yaConfigurado())) {
    console.log('[OK] Stellar testnet ya estaba configurada. No hay nada que hacer.');
    console.log('     (usa "npm run setup -- --force" para crear cuentas nuevas)');
    return;
  }

  console.log('1/5  Creando cuentas con Friendbot (emisor, pool, creador de mercado)...');
  const issuer = Keypair.random();
  const pool = Keypair.random();
  const market = Keypair.random();
  await Promise.all([issuer, pool, market].map((kp) => stellar.friendbot(kp.publicKey())));

  const A = (code) => stellar.asset(code, issuer.publicKey());

  console.log('2/5  Creando trustlines...');
  await stellar.submit(pool.secret(), [Operation.changeTrust({ asset: A('EURC') })]);
  await stellar.submit(market.secret(), MONEDAS.map((c) => Operation.changeTrust({ asset: A(c) })));

  console.log(`3/5  Emitiendo monedas de demo: ${MONEDAS.join(', ')}...`);
  const pagos = [Operation.payment({ destination: pool.publicKey(), asset: A('EURC'), amount: String(FONDO_POOL_EURC) })];
  MONEDAS.filter((c) => c !== 'EURC').forEach((c) => {
    pagos.push(Operation.payment({ destination: market.publicKey(), asset: A(c), amount: String(Math.round(DEMO_RATES[c] * LIQUIDEZ_EUR)) }));
  });
  await stellar.submit(issuer.secret(), pagos);

  console.log('4/5  Publicando ofertas en el DEX de Stellar (tipos de cambio de DEMO)...');
  // El creador de mercado VENDE cada moneda a cambio de EURC.
  // Precio = cuántos EURC pide por 1 unidad = 1 / tipo de cambio (en forma de fracción n/d)
  const ofertas = MONEDAS.filter((c) => c !== 'EURC').map((c) =>
    Operation.manageSellOffer({
      selling: A(c),
      buying: A('EURC'),
      amount: String(Math.round(DEMO_RATES[c] * LIQUIDEZ_EUR * 0.9)),
      price: { n: 100, d: Math.round(DEMO_RATES[c] * 100) },
    }));
  await stellar.submit(market.secret(), ofertas);

  console.log('5/5  Guardando claves en stellar-accounts.json (NO subir a GitHub)...');
  const datos = {
    network: 'testnet',
    createdAt: new Date().toISOString(),
    issuer: { public: issuer.publicKey(), secret: issuer.secret() },
    pool: { public: pool.publicKey(), secret: pool.secret() },
    market: { public: market.publicKey(), secret: market.secret() },
  };
  fs.writeFileSync(stellar.ACCOUNTS_FILE, JSON.stringify(datos, null, 2));

  console.log('\n[OK] Stellar testnet lista.');
  console.log(`     Emisor: https://stellar.expert/explorer/testnet/account/${issuer.publicKey()}`);
  console.log(`     Pool:   https://stellar.expert/explorer/testnet/account/${pool.publicKey()}`);
}

module.exports = { main, yaConfigurado };

// Solo se ejecuta si se llama directamente (npm run setup)
if (require.main === module) {
  main().catch((e) => {
    console.error('\n[ERROR] El setup falló:', e.message);
    console.error('        Comprueba tu conexión a internet y vuelve a ejecutar: npm run setup');
    process.exit(1);
  });
}
