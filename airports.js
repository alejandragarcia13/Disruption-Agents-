// =============================================================
// airports.js — Aeropuertos principales
// =============================================================
// [código IATA, ciudad, código de país, latitud, longitud, ¿cuenta como "UE" para EU261?]
// TODO_LEGAL: EU261 también se aplica en Islandia, Noruega y Suiza (por acuerdos con la UE),
// por eso los marcamos como "UE". El Reino Unido tiene su propia norma (UK261) desde el Brexit:
// aquí lo tratamos como NO UE.

const LISTA = [
  // --- Unión Europea / EEE / Suiza ---
  ['LIS', 'Lisboa', 'PT', 38.7742, -9.1342, true],
  ['OPO', 'Porto', 'PT', 41.2481, -8.6814, true],
  ['FAO', 'Faro', 'PT', 37.0144, -7.9659, true],
  ['MAD', 'Madrid', 'ES', 40.4719, -3.5626, true],
  ['BCN', 'Barcelona', 'ES', 41.2971, 2.0785, true],
  ['AGP', 'Málaga', 'ES', 36.6749, -4.4991, true],
  ['PMI', 'Palma de Mallorca', 'ES', 39.5517, 2.7388, true],
  ['CDG', 'París', 'FR', 49.0097, 2.5479, true],
  ['NCE', 'Niza', 'FR', 43.6584, 7.2159, true],
  ['FRA', 'Fráncfort', 'DE', 50.0379, 8.5622, true],
  ['MUC', 'Múnich', 'DE', 48.3538, 11.7861, true],
  ['BER', 'Berlín', 'DE', 52.3667, 13.5033, true],
  ['AMS', 'Ámsterdam', 'NL', 52.3105, 4.7683, true],
  ['BRU', 'Bruselas', 'BE', 50.9010, 4.4844, true],
  ['FCO', 'Roma', 'IT', 41.8003, 12.2389, true],
  ['MXP', 'Milán', 'IT', 45.6306, 8.7281, true],
  ['VIE', 'Viena', 'AT', 48.1103, 16.5697, true],
  ['ZRH', 'Zúrich', 'CH', 47.4582, 8.5555, true],
  ['GVA', 'Ginebra', 'CH', 46.2381, 6.1090, true],
  ['CPH', 'Copenhague', 'DK', 55.6180, 12.6508, true],
  ['ARN', 'Estocolmo', 'SE', 59.6498, 17.9238, true],
  ['HEL', 'Helsinki', 'FI', 60.3172, 24.9633, true],
  ['OSL', 'Oslo', 'NO', 60.1976, 11.1004, true],
  ['DUB', 'Dublín', 'IE', 53.4264, -6.2499, true],
  ['ATH', 'Atenas', 'GR', 37.9364, 23.9445, true],
  ['WAW', 'Varsovia', 'PL', 52.1657, 20.9671, true],
  ['PRG', 'Praga', 'CZ', 50.1008, 14.2600, true],
  ['BUD', 'Budapest', 'HU', 47.4369, 19.2556, true],
  // --- Fuera de la UE ---
  ['LHR', 'Londres', 'GB', 51.4700, -0.4543, false],
  ['IST', 'Estambul', 'TR', 41.2753, 28.7519, false],
  ['CMN', 'Casablanca', 'MA', 33.3675, -7.5898, false],
  ['JFK', 'Nueva York', 'US', 40.6413, -73.7781, false],
  ['MIA', 'Miami', 'US', 25.7959, -80.2870, false],
  ['ORD', 'Chicago', 'US', 41.9742, -87.9073, false],
  ['LAX', 'Los Ángeles', 'US', 33.9416, -118.4085, false],
  ['YYZ', 'Toronto', 'CA', 43.6777, -79.6248, false],
  ['YUL', 'Montreal', 'CA', 45.4706, -73.7408, false],
  ['MEX', 'Ciudad de México', 'MX', 19.4361, -99.0719, false],
  ['CUN', 'Cancún', 'MX', 21.0365, -86.8771, false],
  ['PTY', 'Ciudad de Panamá', 'PA', 9.0714, -79.3835, false],
  ['BOG', 'Bogotá', 'CO', 4.7016, -74.1469, false],
  ['MDE', 'Medellín', 'CO', 6.1645, -75.4231, false],
  ['UIO', 'Quito', 'EC', -0.1292, -78.3575, false],
  ['LIM', 'Lima', 'PE', -12.0219, -77.1143, false],
  ['SCL', 'Santiago de Chile', 'CL', -33.3930, -70.7858, false],
  ['EZE', 'Buenos Aires', 'AR', -34.8222, -58.5358, false],
  ['MVD', 'Montevideo', 'UY', -34.8384, -56.0308, false],
  ['GRU', 'São Paulo', 'BR', -23.4356, -46.4731, false],
  ['GIG', 'Río de Janeiro', 'BR', -22.8090, -43.2506, false],
  ['LAD', 'Luanda', 'AO', -8.8584, 13.2312, false],
  ['JNB', 'Johannesburgo', 'ZA', -26.1392, 28.2460, false],
  ['DXB', 'Dubái', 'AE', 25.2532, 55.3657, false],
  ['DOH', 'Doha', 'QA', 25.2731, 51.6081, false],
  ['DEL', 'Delhi', 'IN', 28.5562, 77.1000, false],
  ['BOM', 'Bombay', 'IN', 19.0896, 72.8656, false],
  ['PEK', 'Pekín', 'CN', 40.0799, 116.6031, false],
  ['PVG', 'Shanghái', 'CN', 31.1443, 121.8083, false],
  ['HND', 'Tokio', 'JP', 35.5494, 139.7798, false],
  ['ICN', 'Seúl', 'KR', 37.4602, 126.4407, false],
  ['SYD', 'Sídney', 'AU', -33.9399, 151.1753, false],
];

const AIRPORTS = LISTA.map(([iata, city, country, lat, lon, eu]) => ({ iata, city, country, lat, lon, eu }));

function getAirport(iata) {
  return AIRPORTS.find((a) => a.iata === iata);
}

module.exports = { AIRPORTS, getAirport };
