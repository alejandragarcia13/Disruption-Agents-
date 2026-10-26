// =============================================================
// countries.js — Países, idiomas, monedas y tipos de cambio DE DEMO
// =============================================================
// Cada país: [código ISO, bandera, nombre ES, nombre PT, nombre EN, idioma por defecto, moneda local]
// El idioma solo puede ser 'es', 'pt' o 'en'.

const LISTA = [
  // --- Unión Europea (zona euro) ---
  ['PT', '🇵🇹', 'Portugal', 'Portugal', 'Portugal', 'pt', 'EUR'],
  ['ES', '🇪🇸', 'España', 'Espanha', 'Spain', 'es', 'EUR'],
  ['FR', '🇫🇷', 'Francia', 'França', 'France', 'en', 'EUR'],
  ['DE', '🇩🇪', 'Alemania', 'Alemanha', 'Germany', 'en', 'EUR'],
  ['IT', '🇮🇹', 'Italia', 'Itália', 'Italy', 'en', 'EUR'],
  ['NL', '🇳🇱', 'Países Bajos', 'Países Baixos', 'Netherlands', 'en', 'EUR'],
  ['BE', '🇧🇪', 'Bélgica', 'Bélgica', 'Belgium', 'en', 'EUR'],
  ['LU', '🇱🇺', 'Luxemburgo', 'Luxemburgo', 'Luxembourg', 'en', 'EUR'],
  ['IE', '🇮🇪', 'Irlanda', 'Irlanda', 'Ireland', 'en', 'EUR'],
  ['AT', '🇦🇹', 'Austria', 'Áustria', 'Austria', 'en', 'EUR'],
  ['FI', '🇫🇮', 'Finlandia', 'Finlândia', 'Finland', 'en', 'EUR'],
  ['GR', '🇬🇷', 'Grecia', 'Grécia', 'Greece', 'en', 'EUR'],
  ['CY', '🇨🇾', 'Chipre', 'Chipre', 'Cyprus', 'en', 'EUR'],
  ['MT', '🇲🇹', 'Malta', 'Malta', 'Malta', 'en', 'EUR'],
  ['SK', '🇸🇰', 'Eslovaquia', 'Eslováquia', 'Slovakia', 'en', 'EUR'],
  ['SI', '🇸🇮', 'Eslovenia', 'Eslovénia', 'Slovenia', 'en', 'EUR'],
  ['EE', '🇪🇪', 'Estonia', 'Estónia', 'Estonia', 'en', 'EUR'],
  ['LV', '🇱🇻', 'Letonia', 'Letónia', 'Latvia', 'en', 'EUR'],
  ['LT', '🇱🇹', 'Lituania', 'Lituânia', 'Lithuania', 'en', 'EUR'],
  ['HR', '🇭🇷', 'Croacia', 'Croácia', 'Croatia', 'en', 'EUR'],
  ['BG', '🇧🇬', 'Bulgaria', 'Bulgária', 'Bulgaria', 'en', 'EUR'],
  // --- Unión Europea (sin euro) ---
  ['PL', '🇵🇱', 'Polonia', 'Polónia', 'Poland', 'en', 'PLN'],
  ['CZ', '🇨🇿', 'Chequia', 'Chéquia', 'Czechia', 'en', 'CZK'],
  ['HU', '🇭🇺', 'Hungría', 'Hungria', 'Hungary', 'en', 'HUF'],
  ['RO', '🇷🇴', 'Rumanía', 'Roménia', 'Romania', 'en', 'RON'],
  ['SE', '🇸🇪', 'Suecia', 'Suécia', 'Sweden', 'en', 'SEK'],
  ['DK', '🇩🇰', 'Dinamarca', 'Dinamarca', 'Denmark', 'en', 'DKK'],
  // --- Resto de Europa ---
  ['GB', '🇬🇧', 'Reino Unido', 'Reino Unido', 'United Kingdom', 'en', 'GBP'],
  ['CH', '🇨🇭', 'Suiza', 'Suíça', 'Switzerland', 'en', 'CHF'],
  ['NO', '🇳🇴', 'Noruega', 'Noruega', 'Norway', 'en', 'NOK'],
  ['IS', '🇮🇸', 'Islandia', 'Islândia', 'Iceland', 'en', 'ISK'],
  ['UA', '🇺🇦', 'Ucrania', 'Ucrânia', 'Ukraine', 'en', 'UAH'],
  ['TR', '🇹🇷', 'Turquía', 'Turquia', 'Türkiye', 'en', 'TRY'],
  // --- Norteamérica ---
  ['US', '🇺🇸', 'Estados Unidos', 'Estados Unidos', 'United States', 'en', 'USD'],
  ['CA', '🇨🇦', 'Canadá', 'Canadá', 'Canada', 'en', 'CAD'],
  ['MX', '🇲🇽', 'México', 'México', 'Mexico', 'es', 'MXN'],
  // --- Centroamérica y Caribe ---
  ['GT', '🇬🇹', 'Guatemala', 'Guatemala', 'Guatemala', 'es', 'GTQ'],
  ['HN', '🇭🇳', 'Honduras', 'Honduras', 'Honduras', 'es', 'HNL'],
  ['SV', '🇸🇻', 'El Salvador', 'El Salvador', 'El Salvador', 'es', 'USD'],
  ['NI', '🇳🇮', 'Nicaragua', 'Nicarágua', 'Nicaragua', 'es', 'NIO'],
  ['CR', '🇨🇷', 'Costa Rica', 'Costa Rica', 'Costa Rica', 'es', 'CRC'],
  ['PA', '🇵🇦', 'Panamá', 'Panamá', 'Panama', 'es', 'PAB'],
  ['CU', '🇨🇺', 'Cuba', 'Cuba', 'Cuba', 'es', 'CUP'],
  ['DO', '🇩🇴', 'República Dominicana', 'República Dominicana', 'Dominican Republic', 'es', 'DOP'],
  ['PR', '🇵🇷', 'Puerto Rico', 'Porto Rico', 'Puerto Rico', 'es', 'USD'],
  // --- Sudamérica ---
  ['CO', '🇨🇴', 'Colombia', 'Colômbia', 'Colombia', 'es', 'COP'],
  ['VE', '🇻🇪', 'Venezuela', 'Venezuela', 'Venezuela', 'es', 'VES'],
  ['EC', '🇪🇨', 'Ecuador', 'Equador', 'Ecuador', 'es', 'USD'],
  ['PE', '🇵🇪', 'Perú', 'Peru', 'Peru', 'es', 'PEN'],
  ['BO', '🇧🇴', 'Bolivia', 'Bolívia', 'Bolivia', 'es', 'BOB'],
  ['CL', '🇨🇱', 'Chile', 'Chile', 'Chile', 'es', 'CLP'],
  ['AR', '🇦🇷', 'Argentina', 'Argentina', 'Argentina', 'es', 'ARS'],
  ['UY', '🇺🇾', 'Uruguay', 'Uruguai', 'Uruguay', 'es', 'UYU'],
  ['PY', '🇵🇾', 'Paraguay', 'Paraguai', 'Paraguay', 'es', 'PYG'],
  ['BR', '🇧🇷', 'Brasil', 'Brasil', 'Brazil', 'pt', 'BRL'],
  // --- África ---
  ['MA', '🇲🇦', 'Marruecos', 'Marrocos', 'Morocco', 'en', 'MAD'],
  ['EG', '🇪🇬', 'Egipto', 'Egito', 'Egypt', 'en', 'EGP'],
  ['NG', '🇳🇬', 'Nigeria', 'Nigéria', 'Nigeria', 'en', 'NGN'],
  ['ZA', '🇿🇦', 'Sudáfrica', 'África do Sul', 'South Africa', 'en', 'ZAR'],
  ['AO', '🇦🇴', 'Angola', 'Angola', 'Angola', 'pt', 'AOA'],
  ['MZ', '🇲🇿', 'Mozambique', 'Moçambique', 'Mozambique', 'pt', 'MZN'],
  ['CV', '🇨🇻', 'Cabo Verde', 'Cabo Verde', 'Cape Verde', 'pt', 'CVE'],
  // --- Asia y Oceanía ---
  ['CN', '🇨🇳', 'China', 'China', 'China', 'en', 'CNY'],
  ['IN', '🇮🇳', 'India', 'Índia', 'India', 'en', 'INR'],
  ['JP', '🇯🇵', 'Japón', 'Japão', 'Japan', 'en', 'JPY'],
  ['KR', '🇰🇷', 'Corea del Sur', 'Coreia do Sul', 'South Korea', 'en', 'KRW'],
  ['PH', '🇵🇭', 'Filipinas', 'Filipinas', 'Philippines', 'en', 'PHP'],
  ['AE', '🇦🇪', 'Emiratos Árabes Unidos', 'Emirados Árabes Unidos', 'United Arab Emirates', 'en', 'AED'],
  ['AU', '🇦🇺', 'Australia', 'Austrália', 'Australia', 'en', 'AUD'],
  ['NZ', '🇳🇿', 'Nueva Zelanda', 'Nova Zelândia', 'New Zealand', 'en', 'NZD'],
];

// Activos de prueba que emitimos nosotros en la testnet de Stellar.
// ⚠️ TIPOS DE CAMBIO FICTICIOS, SOLO PARA LA DEMO: cuántas unidades de cada
// moneda da 1 EURC. No son precios reales de mercado.
const DEMO_RATES = {
  EURC: 1,
  USDC: 1.08,
  BRL: 6.2,
  MXN: 21.5,
  COP: 4500,
  ARS: 1100,
  GBP: 0.85,
};

// Elige en qué activo cobra cada país:
// moneda con activo de demo → esa moneda; euro → EURC; resto → USDC
function payoutAsset(currency) {
  if (currency === 'EUR') return 'EURC';
  if (DEMO_RATES[currency] && currency !== 'EURC' && currency !== 'USDC') return currency;
  return 'USDC';
}

const COUNTRIES = LISTA.map(([code, flag, es, pt, en, lang, currency]) => ({
  code, flag, names: { es, pt, en }, lang, currency, asset: payoutAsset(currency),
}));

function getCountry(code) {
  return COUNTRIES.find((c) => c.code === code);
}

module.exports = { COUNTRIES, DEMO_RATES, getCountry };
