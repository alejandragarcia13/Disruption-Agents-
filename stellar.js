// =============================================================
// stellar.js — Todo lo que habla con Stellar (TESTNET)
// =============================================================
// - Crear monederos de viajero (Friendbot + trustline)
// - Anclar el hash de las pruebas (memo hash)
// - Pagar: pago directo en EURC o "path payment" a la moneda local por el DEX
// - Barreras de seguridad: máximo 600 €, un pago por reclamación, siempre con firma

const fs = require('fs');
const path = require('path');
const { Horizon, Keypair, Asset, Operation, TransactionBuilder, Networks, Memo } = require('@stellar/stellar-sdk');
const { DEMO_RATES } = require('./countries');
const { MAX_PAGO_EUR } = require('./rules');

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const FRIENDBOT_URL = 'https://friendbot.stellar.org';
const ACCOUNTS_FILE = path.join(__dirname, 'stellar-accounts.json');
const server = new Horizon.Server(HORIZON_URL);

// Enlace público para ver una transacción
const txLink = (hash) => `https://stellar.expert/explorer/testnet/tx/${hash}`;

// Lee las cuentas creadas por "npm run setup"
function loadAccounts() {
  if (!fs.existsSync(ACCOUNTS_FILE)) return null;
  return JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8'));
}

// Activo de demo (EURC, BRL...) emitido por nuestra cuenta emisora
function asset(code, issuerPublic) {
  return new Asset(code, issuerPublic || loadAccounts().issuer.public);
}

// Pide XLM de prueba a Friendbot para crear una cuenta nueva
async function friendbot(publicKey) {
  const res = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`);
  if (!res.ok) throw new Error(`Friendbot falló (${res.status})`);
}

// Las transacciones de una misma cuenta van en fila para no chocar con el número de secuencia
const colas = {};
function enCola(clave, tarea) {
  const anterior = colas[clave] || Promise.resolve();
  const siguiente = anterior.catch(() => {}).then(tarea);
  colas[clave] = siguiente;
  return siguiente;
}

// Construye, firma y envía una transacción con una o varias operaciones
function submit(secret, operaciones, memo) {
  const kp = Keypair.fromSecret(secret);
  return enCola(kp.publicKey(), async () => {
    const cuenta = await server.loadAccount(kp.publicKey());
    const builder = new TransactionBuilder(cuenta, { fee: '10000', networkPassphrase: Networks.TESTNET });
    operaciones.forEach((op) => builder.addOperation(op));
    if (memo) builder.addMemo(memo);
    const tx = builder.setTimeout(120).build();
    tx.sign(kp);
    try {
      const res = await server.submitTransaction(tx);
      return res.hash;
    } catch (e) {
      // Mostramos el código de error de Stellar, que es lo útil para depurar
      const codes = e?.response?.data?.extras?.result_codes;
      throw new Error(`Stellar rechazó la transacción: ${codes ? JSON.stringify(codes) : e.message}`);
    }
  });
}

// ¿Está la configuración de Stellar lista y viva? (la testnet se reinicia de vez en cuando)
async function isReady() {
  const acc = loadAccounts();
  if (!acc) return false;
  try {
    await server.loadAccount(acc.pool.public);
    return true;
  } catch {
    return false;
  }
}

// Saldos de una cuenta (solo activos, sin XLM para no confundir)
async function balances(publicKey) {
  const cuenta = await server.loadAccount(publicKey);
  return cuenta.balances
    .filter((b) => b.asset_type !== 'native')
    .map((b) => ({ code: b.asset_code, amount: Number(b.balance) }));
}

// 1) Monedero del viajero: cuenta nueva + trustline a su moneda
async function createTravellerWallet(assetCode) {
  const kp = Keypair.random();
  await friendbot(kp.publicKey());
  const hash = await submit(kp.secret(), [Operation.changeTrust({ asset: asset(assetCode) })]);
  return { public: kp.publicKey(), secret: kp.secret(), asset: assetCode, trustTx: hash };
}

// 2) Anclaje de pruebas: transacción sin efecto con memo hash = SHA-256 de las pruebas.
// Nunca se suben datos personales, solo el hash.
async function anchorEvidence(hashHex) {
  const acc = loadAccounts();
  const op = Operation.bumpSequence({ bumpTo: '0' }); // operación "vacía": no mueve dinero
  return submit(acc.pool.secret, [op], Memo.hash(hashHex));
}

// 3) Cobro. Las reclamaciones pagadas se guardan en memoria (se reinician al reiniciar el servidor).
const reclamacionesPagadas = new Set();

// Error con un código, para poder traducir el motivo del rechazo
function rechazo(code, mensaje) {
  const e = new Error(mensaje);
  e.code = code;
  return e;
}

async function payClaim({ claimKey, signed, amountEUR, destination, assetCode }) {
  // --- Barreras de seguridad ---
  if (!signed) throw rechazo('unsigned', 'Pago rechazado: falta la firma de la cesión ("Firmar y cobrar").');
  if (!(amountEUR > 0)) throw rechazo('invalid', 'Pago rechazado: importe no válido.');
  if (amountEUR > MAX_PAGO_EUR) throw rechazo('max', `Pago rechazado: supera el máximo de ${MAX_PAGO_EUR} € por pago.`);
  if (reclamacionesPagadas.has(claimKey)) throw rechazo('already', 'Pago rechazado: esta reclamación ya se pagó.');
  reclamacionesPagadas.add(claimKey); // la marcamos antes de pagar para evitar dobles clics

  try {
    const acc = loadAccounts();
    const eurc = asset('EURC');
    const importe = amountEUR.toFixed(2);
    let op;
    if (assetCode === 'EURC') {
      // Pago directo en EURC desde el pool
      op = Operation.payment({ destination, asset: eurc, amount: importe });
    } else {
      // Path payment: sale EURC del pool y el viajero recibe su moneda, convertida en el DEX de Stellar
      const esperado = amountEUR * DEMO_RATES[assetCode];
      op = Operation.pathPaymentStrictSend({
        sendAsset: eurc,
        sendAmount: importe,
        destination,
        destAsset: asset(assetCode),
        destMin: (esperado * 0.98).toFixed(2), // margen del 2 % por si el DEX se mueve
        path: [],
      });
    }
    const hash = await submit(acc.pool.secret, [op]);
    const saldo = await balances(destination);
    const recibido = saldo.find((b) => b.code === assetCode)?.amount || 0;
    return { hash, link: txLink(hash), sentEUR: amountEUR, received: recibido, assetCode, balances: saldo };
  } catch (e) {
    reclamacionesPagadas.delete(claimKey); // si falla, se puede volver a intentar
    throw e;
  }
}

module.exports = {
  server, txLink, loadAccounts, asset, friendbot, submit, isReady, balances,
  createTravellerWallet, anchorEvidence, payClaim, ACCOUNTS_FILE,
};
