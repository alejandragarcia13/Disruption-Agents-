// =============================================================
// templates.js — Textos de la app y mensajes de los agentes
// =============================================================
// Idiomas: español (es), portugués (pt) e inglés (en).
// Las plantillas SOLO dan formato. Los importes los calcula rules.js.
// Se puede usar **negrita** dentro de los mensajes.
// TODO_LEGAL: revisar todos los textos legales.

const eur = (n, lang) => `${Number(n).toLocaleString(lang === 'en' ? 'en-GB' : lang === 'pt' ? 'pt-PT' : 'es-ES', { maximumFractionDigits: 2 })} €`;
const num = (n, lang) => Number(n).toLocaleString(lang === 'en' ? 'en-GB' : lang === 'pt' ? 'pt-PT' : 'es-ES', { maximumFractionDigits: 2 });

// -------------------------------------------------------------
// 1) TEXTOS DE LA INTERFAZ
// -------------------------------------------------------------
const UI = {
  es: {
    subtitle: 'Tu vuelo falló. Tu dinero, no.',
    tagline: 'Cuando tu viaje se rompe, nuestros agentes se encargan del papeleo y te pagan en minutos, en tu moneda, estés donde estés.',
    steps: ['Tu país', 'Tu viaje', '¿Qué ha pasado?', 'Tus derechos', 'Cobra'],
    stepHints: [
      'Empecemos por ti: así sabremos en qué idioma hablarte y en qué moneda pagarte.',
      'El Agente ANTES revisa tu ruta y los documentos que necesitas.',
      'El Agente DURANTE registra la incidencia y protege tus pruebas en Stellar.',
      'El Agente DESPUÉS calcula tu indemnización según la normativa europea.',
      'Cobra al instante en tu monedero Stellar, en tu moneda.',
    ],
    country: 'País de residencia', countrySearch: 'Busca tu país…', name: 'Tu nombre completo', namePh: 'Ej.: Ana Souza',
    language: 'Idioma', payoutIn: 'Cobrarás en', noResults: 'Sin resultados',
    origin: 'Aeropuerto de origen', dest: 'Aeropuerto de destino', airportSearch: 'Ciudad o código (LIS, MAD…)',
    flight: 'Número de vuelo', flightPh: 'Ej.: TP 1234', date: 'Fecha del vuelo',
    airlineEU: '¿La aerolínea es europea?', yes: 'Sí', no: 'No', unknown: 'No lo sé',
    distance: 'Distancia', checklist: 'Documentos para tu viaje',
    incident: 'Tipo de incidencia', delay: 'Retraso', cancel: 'Cancelación', denied: 'Denegación de embarque',
    delayHours: 'Horas de retraso al llegar a tu destino final', noticeDays: '¿Con cuántos días de antelación te avisaron?',
    cause: 'Causa que dio la aerolínea',
    causes: { technical: 'Problema técnico', crew: 'Falta de tripulación', weather: 'Meteorología', atc_strike: 'Huelga de controladores', other: 'Otra', unknown: 'No lo sé' },
    hours: 'h', days: 'días',
    confirmIncident: 'Confirmar y proteger pruebas',
    covered: 'Cubierto por EU261', yesCovered: 'Sí', noCovered: 'No', doubtful: 'Dudoso',
    compensation: 'Indemnización', advance: 'Cobro inmediato (80 %)', youReceive: 'Recibirás',
    noAdvanceTitle: 'Sin cobro inmediato', claimTitle: 'Tu reclamación, lista para enviar',
    download: 'Descargar reclamación', copy: 'Copiar', copied: '¡Copiado!',
    goPayout: 'Quiero cobrar ahora', restartCase: 'Nuevo caso',
    creatingWallet: 'Creando tu monedero Stellar…', walletReady: 'Tu monedero Stellar está listo',
    cessionTitle: 'Cesión del derecho de cobro',
    cessionText: (a) => `Cedes a Disruption Agents tu derecho a reclamar ${a.comp} a la aerolínea. A cambio, recibes ahora ${a.adv} (el 80 %). Nosotros asumimos el riesgo y el papeleo. Si la aerolínea no paga, no nos debes nada.`,
    cessionCheck: 'He leído y acepto la cesión del derecho de cobro',
    sign: 'Firmar y cobrar', paying: 'Enviando el pago por Stellar…',
    paid: 'Pagado', balance: 'Saldo del monedero', viewTx: 'Ver transacción',
    wallet: 'Monedero',
    activeAgent: 'Agente activo', log: 'Registro de los agentes', txs: 'Transacciones en Stellar', noTx: 'Aún no hay transacciones',
    typing: 'está escribiendo…',
    next: 'Continuar', back: 'Atrás',
    demoBar: 'Demo', fill: 'Rellenar con un ejemplo', retry: 'Intentar cobrar otra vez', restart: 'Empezar de nuevo',
    disclaimer: 'Reglas simplificadas para la demo. No es asesoramiento jurídico. Stellar testnet: monedas y tipos de cambio de prueba.',
    stellarNotReady: 'Stellar no está configurado. Cierra el servidor y ejecuta "npm run setup".',
    required: 'Completa los campos marcados',
    agents: {
      before: { name: 'Agente ANTES', role: 'Valida tu viaje y tus documentos' },
      during: { name: 'Agente DURANTE', role: 'Registra la incidencia y protege tus pruebas' },
      after: { name: 'Agente DESPUÉS', role: 'Calcula, paga y reclama por ti' },
    },
    txKinds: { anchor: 'Anclaje de pruebas (memo hash)', trust: 'Monedero + trustline', pay: 'Pago', path: 'Path payment vía DEX' },
  },
  pt: {
    subtitle: 'O seu voo falhou. O seu dinheiro, não.',
    tagline: 'Quando a sua viagem corre mal, os nossos agentes tratam da papelada e pagam-lhe em minutos, na sua moeda, esteja onde estiver.',
    steps: ['O seu país', 'A sua viagem', 'O que aconteceu?', 'Os seus direitos', 'Receba'],
    stepHints: [
      'Comecemos por si: assim sabemos em que língua falar consigo e em que moeda pagar.',
      'O Agente ANTES verifica a sua rota e os documentos de que precisa.',
      'O Agente DURANTE regista o incidente e protege as suas provas na Stellar.',
      'O Agente DEPOIS calcula a sua indemnização segundo a regulamentação europeia.',
      'Receba na hora na sua carteira Stellar, na sua moeda.',
    ],
    country: 'País de residência', countrySearch: 'Procure o seu país…', name: 'O seu nome completo', namePh: 'Ex.: Ana Souza',
    language: 'Idioma', payoutIn: 'Vai receber em', noResults: 'Sem resultados',
    origin: 'Aeroporto de origem', dest: 'Aeroporto de destino', airportSearch: 'Cidade ou código (LIS, MAD…)',
    flight: 'Número do voo', flightPh: 'Ex.: TP 1234', date: 'Data do voo',
    airlineEU: 'A companhia aérea é europeia?', yes: 'Sim', no: 'Não', unknown: 'Não sei',
    distance: 'Distância', checklist: 'Documentos para a sua viagem',
    incident: 'Tipo de incidente', delay: 'Atraso', cancel: 'Cancelamento', denied: 'Recusa de embarque',
    delayHours: 'Horas de atraso na chegada ao destino final', noticeDays: 'Com quantos dias de antecedência foi avisado?',
    cause: 'Causa indicada pela companhia',
    causes: { technical: 'Problema técnico', crew: 'Falta de tripulação', weather: 'Meteorologia', atc_strike: 'Greve de controladores', other: 'Outra', unknown: 'Não sei' },
    hours: 'h', days: 'dias',
    confirmIncident: 'Confirmar e proteger provas',
    covered: 'Coberto pelo EU261', yesCovered: 'Sim', noCovered: 'Não', doubtful: 'Duvidoso',
    compensation: 'Indemnização', advance: 'Pagamento imediato (80 %)', youReceive: 'Vai receber',
    noAdvanceTitle: 'Sem pagamento imediato', claimTitle: 'A sua reclamação, pronta a enviar',
    download: 'Descarregar reclamação', copy: 'Copiar', copied: 'Copiado!',
    goPayout: 'Quero receber agora', restartCase: 'Novo caso',
    creatingWallet: 'A criar a sua carteira Stellar…', walletReady: 'A sua carteira Stellar está pronta',
    cessionTitle: 'Cessão do direito de crédito',
    cessionText: (a) => `Cede à Disruption Agents o seu direito de reclamar ${a.comp} à companhia aérea. Em troca, recebe agora ${a.adv} (80 %). Nós assumimos o risco e a papelada. Se a companhia não pagar, não nos deve nada.`,
    cessionCheck: 'Li e aceito a cessão do direito de crédito',
    sign: 'Assinar e receber', paying: 'A enviar o pagamento pela Stellar…',
    paid: 'Pago', balance: 'Saldo da carteira', viewTx: 'Ver transação',
    wallet: 'Carteira',
    activeAgent: 'Agente ativo', log: 'Registo dos agentes', txs: 'Transações na Stellar', noTx: 'Ainda não há transações',
    typing: 'está a escrever…',
    next: 'Continuar', back: 'Voltar',
    demoBar: 'Demo', fill: 'Preencher com um exemplo', retry: 'Tentar receber outra vez', restart: 'Recomeçar',
    disclaimer: 'Regras simplificadas para a demo. Não é aconselhamento jurídico. Stellar testnet: moedas e câmbios de teste.',
    stellarNotReady: 'A Stellar não está configurada. Feche o servidor e execute "npm run setup".',
    required: 'Preencha os campos assinalados',
    agents: {
      before: { name: 'Agente ANTES', role: 'Valida a sua viagem e os documentos' },
      during: { name: 'Agente DURANTE', role: 'Regista o incidente e protege as provas' },
      after: { name: 'Agente DEPOIS', role: 'Calcula, paga e reclama por si' },
    },
    txKinds: { anchor: 'Ancoragem de provas (memo hash)', trust: 'Carteira + trustline', pay: 'Pagamento', path: 'Path payment via DEX' },
  },
  en: {
    subtitle: 'Your flight failed. Your money won’t.',
    tagline: 'When your trip breaks, our agents handle the paperwork and pay you in minutes, in your currency, wherever you are.',
    steps: ['Your country', 'Your trip', 'What happened?', 'Your rights', 'Get paid'],
    stepHints: [
      'Let’s start with you, so we know which language to speak and which currency to pay you in.',
      'The BEFORE Agent checks your route and the documents you need.',
      'The DURING Agent logs the incident and secures your evidence on Stellar.',
      'The AFTER Agent calculates your compensation under EU rules.',
      'Get paid instantly to your Stellar wallet, in your currency.',
    ],
    country: 'Country of residence', countrySearch: 'Search your country…', name: 'Your full name', namePh: 'e.g. Ana Souza',
    language: 'Language', payoutIn: 'You’ll be paid in', noResults: 'No results',
    origin: 'Departure airport', dest: 'Arrival airport', airportSearch: 'City or code (LIS, MAD…)',
    flight: 'Flight number', flightPh: 'e.g. TP 1234', date: 'Flight date',
    airlineEU: 'Is the airline European?', yes: 'Yes', no: 'No', unknown: 'I don’t know',
    distance: 'Distance', checklist: 'Documents for your trip',
    incident: 'Type of disruption', delay: 'Delay', cancel: 'Cancellation', denied: 'Denied boarding',
    delayHours: 'Hours of delay arriving at your final destination', noticeDays: 'How many days’ notice did you get?',
    cause: 'Reason given by the airline',
    causes: { technical: 'Technical problem', crew: 'Crew shortage', weather: 'Weather', atc_strike: 'Air traffic control strike', other: 'Other', unknown: 'I don’t know' },
    hours: 'h', days: 'days',
    confirmIncident: 'Confirm and secure evidence',
    covered: 'Covered by EU261', yesCovered: 'Yes', noCovered: 'No', doubtful: 'Unclear',
    compensation: 'Compensation', advance: 'Instant payout (80%)', youReceive: 'You receive',
    noAdvanceTitle: 'No instant payout', claimTitle: 'Your claim, ready to send',
    download: 'Download claim', copy: 'Copy', copied: 'Copied!',
    goPayout: 'Get paid now', restartCase: 'New case',
    creatingWallet: 'Creating your Stellar wallet…', walletReady: 'Your Stellar wallet is ready',
    cessionTitle: 'Assignment of your claim',
    cessionText: (a) => `You assign to Disruption Agents your right to claim ${a.comp} from the airline. In exchange, you receive ${a.adv} now (80%). We take on the risk and the paperwork. If the airline doesn’t pay, you owe us nothing.`,
    cessionCheck: 'I have read and accept the assignment of my claim',
    sign: 'Sign and get paid', paying: 'Sending payment over Stellar…',
    paid: 'Paid', balance: 'Wallet balance', viewTx: 'View transaction',
    wallet: 'Wallet',
    activeAgent: 'Active agent', log: 'Agent activity', txs: 'Stellar transactions', noTx: 'No transactions yet',
    typing: 'is typing…',
    next: 'Continue', back: 'Back',
    demoBar: 'Demo', fill: 'Fill with an example', retry: 'Try to get paid again', restart: 'Start over',
    disclaimer: 'Simplified rules for demo purposes. Not legal advice. Stellar testnet: test assets and exchange rates.',
    stellarNotReady: 'Stellar is not set up. Stop the server and run "npm run setup".',
    required: 'Please complete the highlighted fields',
    agents: {
      before: { name: 'BEFORE Agent', role: 'Checks your trip and documents' },
      during: { name: 'DURING Agent', role: 'Logs the incident and secures evidence' },
      after: { name: 'AFTER Agent', role: 'Calculates, pays and claims for you' },
    },
    txKinds: { anchor: 'Evidence anchor (memo hash)', trust: 'Wallet + trustline', pay: 'Payment', path: 'Path payment via DEX' },
  },
};

// -------------------------------------------------------------
// 2) MENSAJES DE LOS AGENTES
// -------------------------------------------------------------
// Cada función recibe datos ya calculados y devuelve texto.
const MSG = {
  es: {
    before: {
      hello: (d) => `¡Hola, ${d.firstName}! Soy el **Agente ANTES**. Voy a revisar tu viaje de **${d.origin}** a **${d.dest}**.`,
      distance: (d) => `Vuelo **${d.flight}** del ${d.date}. Distancia calculada: **${num(d.km, 'es')} km**.`,
      checklist: 'Te dejo el checklist de documentos para este viaje. Comprueba los requisitos en la web oficial del país de destino.',
      handoff: 'Todo en orden. Paso el relevo al **Agente DURANTE**.',
      invalid: 'Hay datos del viaje que no cuadran. Revisa los campos marcados.',
    },
    checklist: {
      passport: 'Pasaporte en vigor',
      id_or_passport: 'DNI o pasaporte en vigor (viaje dentro del espacio UE)',
      visa: 'Visado o autorización electrónica, según tu nacionalidad',
      insurance: 'Seguro de viaje (recomendado)',
      booking: 'Reserva y tarjeta de embarque (guárdalas: son prueba)',
      check_official: 'Comprueba los requisitos en la web oficial del país de destino.',
    },
    during: {
      hello: '**Agente DURANTE** al habla. Registro lo que ha pasado.',
      summary: (d) => `Incidencia: **${d.incident}**${d.detail}. Causa indicada: **${d.cause}**.`,
      rightsIntro: 'Mientras esperas, la aerolínea te debe esto:',
      hashing: 'Estoy empaquetando tus pruebas y calculando su huella SHA-256…',
      anchored: (d) => `Pruebas protegidas. Huella **${d.short}** anclada en Stellar (memo hash). Sin datos personales en la blockchain.`,
      anchorFailed: 'No he podido anclar las pruebas en Stellar ahora mismo, pero las he guardado. Seguimos.',
      handoff: 'Paso el relevo al **Agente DESPUÉS** para calcular lo que te corresponde.',
    },
    rights: {
      meals: 'Comida y bebida suficientes según la espera',
      communication: 'Dos llamadas, correos o mensajes gratis',
      hotel: 'Hotel y traslado si tienes que pasar la noche',
      refund: 'Si el retraso es de 5 h o más, puedes pedir el reembolso del billete',
      reroute: 'Elegir entre reembolso o un vuelo alternativo lo antes posible',
      wait: 'Con este retraso aún no hay derecho de atención, pero guarda todo por si aumenta',
      keep_receipts: 'Guarda todos los tiques y facturas: te los tienen que devolver',
    },
    after: {
      hello: '**Agente DESPUÉS** aquí. Ya tengo todo para decidir.',
      advance: (d) => `Tienes derecho a **${eur(d.comp, 'es')}** según el Reglamento EU261 (${num(d.km, 'es')} km). Te ofrezco cobrar **ahora** el 80 %: **${eur(d.adv, 'es')}** → **${num(d.local, 'es')} ${d.asset}**. Nosotros reclamamos el 100 % a la aerolínea.`,
      claimOnly: (d) => `Podrías tener derecho a **${eur(d.comp, 'es')}**, pero ${d.why} Por eso no te ofrezco adelanto: te preparo la reclamación para que la envíes tú.`,
      noRight: (d) => `Con estos datos no hay derecho a indemnización: ${d.why} Aun así, te dejo la reclamación por si quieres intentarlo.`,
      claimReady: 'Tu reclamación está redactada, con la base legal y la huella de tus pruebas.',
      creatingWallet: 'Creando tu monedero Stellar en la testnet (Friendbot + trustline)…',
      walletReady: (d) => `Monedero listo y preparado para recibir **${d.asset}**.`,
      waitingSign: 'Lee la cesión y pulsa **Firmar y cobrar** cuando quieras.',
      signed: 'Cesión firmada. Enviando el pago…',
      paidEURC: (d) => `**Pagado: ${num(d.sent, 'es')} EURC** directamente en tu monedero.`,
      paidPath: (d) => `**Pagado: ${num(d.sent, 'es')} EURC → ${num(d.received, 'es')} ${d.asset}** vía DEX de Stellar.`,
      rejected: (d) => `${d.error}`,
      bye: 'Ahora nosotros nos encargamos de la aerolínea. ¡Buen viaje!',
    },
    why: {
      outside_eu: 'el vuelo ni sale ni llega a la UE.',
      arrives_eu_non_eu_airline: 'el vuelo llega a la UE desde fuera con una aerolínea no europea.',
      arrives_eu_unknown_airline: 'no sabemos si la aerolínea es europea, y eso decide si se aplica EU261.',
      delay_short: 'el retraso en la llegada es inferior a 3 horas.',
      cancel_early: 'te avisaron con 14 días o más de antelación.',
      extraordinary: 'la causa podría ser una circunstancia extraordinaria, y la aerolínea podría no tener que pagar.',
      unknown_cause: 'no conocemos la causa, y la aerolínea podría alegar circunstancias extraordinarias.',
    },
  },
  pt: {
    before: {
      hello: (d) => `Olá, ${d.firstName}! Sou o **Agente ANTES**. Vou verificar a sua viagem de **${d.origin}** para **${d.dest}**.`,
      distance: (d) => `Voo **${d.flight}** de ${d.date}. Distância calculada: **${num(d.km, 'pt')} km**.`,
      checklist: 'Deixo-lhe a checklist de documentos para esta viagem. Confirme os requisitos no site oficial do país de destino.',
      handoff: 'Tudo em ordem. Passo o testemunho ao **Agente DURANTE**.',
      invalid: 'Há dados da viagem que não batem certo. Reveja os campos assinalados.',
    },
    checklist: {
      passport: 'Passaporte válido',
      id_or_passport: 'Cartão de cidadão ou passaporte válido (viagem dentro do espaço UE)',
      visa: 'Visto ou autorização eletrónica, conforme a sua nacionalidade',
      insurance: 'Seguro de viagem (recomendado)',
      booking: 'Reserva e cartão de embarque (guarde-os: são prova)',
      check_official: 'Confirme os requisitos no site oficial do país de destino.',
    },
    during: {
      hello: '**Agente DURANTE** a falar. Vou registar o que aconteceu.',
      summary: (d) => `Incidente: **${d.incident}**${d.detail}. Causa indicada: **${d.cause}**.`,
      rightsIntro: 'Enquanto espera, a companhia aérea deve-lhe isto:',
      hashing: 'Estou a empacotar as suas provas e a calcular a impressão digital SHA-256…',
      anchored: (d) => `Provas protegidas. Impressão **${d.short}** ancorada na Stellar (memo hash). Sem dados pessoais na blockchain.`,
      anchorFailed: 'Não consegui ancorar as provas na Stellar agora, mas guardei-as. Vamos continuar.',
      handoff: 'Passo o testemunho ao **Agente DEPOIS** para calcular o que lhe cabe.',
    },
    rights: {
      meals: 'Refeições e bebidas suficientes conforme a espera',
      communication: 'Duas chamadas, e-mails ou mensagens grátis',
      hotel: 'Hotel e transporte se tiver de passar a noite',
      refund: 'Com 5 h ou mais de atraso, pode pedir o reembolso do bilhete',
      reroute: 'Escolher entre reembolso ou um voo alternativo o mais cedo possível',
      wait: 'Com este atraso ainda não há direito a assistência, mas guarde tudo caso aumente',
      keep_receipts: 'Guarde todos os talões e faturas: têm de lhos devolver',
    },
    after: {
      hello: '**Agente DEPOIS** aqui. Já tenho tudo para decidir.',
      advance: (d) => `Tem direito a **${eur(d.comp, 'pt')}** segundo o Regulamento EU261 (${num(d.km, 'pt')} km). Ofereço-lhe receber **já** 80 %: **${eur(d.adv, 'pt')}** → **${num(d.local, 'pt')} ${d.asset}**. Nós reclamamos 100 % à companhia aérea.`,
      claimOnly: (d) => `Poderá ter direito a **${eur(d.comp, 'pt')}**, mas ${d.why} Por isso não ofereço adiantamento: preparo-lhe a reclamação para enviar.`,
      noRight: (d) => `Com estes dados não há direito a indemnização: ${d.why} Mesmo assim, deixo-lhe a reclamação caso queira tentar.`,
      claimReady: 'A sua reclamação está redigida, com a base legal e a impressão digital das provas.',
      creatingWallet: 'A criar a sua carteira Stellar na testnet (Friendbot + trustline)…',
      walletReady: (d) => `Carteira pronta para receber **${d.asset}**.`,
      waitingSign: 'Leia a cessão e carregue em **Assinar e receber** quando quiser.',
      signed: 'Cessão assinada. A enviar o pagamento…',
      paidEURC: (d) => `**Pago: ${num(d.sent, 'pt')} EURC** diretamente na sua carteira.`,
      paidPath: (d) => `**Pago: ${num(d.sent, 'pt')} EURC → ${num(d.received, 'pt')} ${d.asset}** via DEX da Stellar.`,
      rejected: (d) => `${d.error}`,
      bye: 'Agora tratamos nós da companhia aérea. Boa viagem!',
    },
    why: {
      outside_eu: 'o voo nem parte nem chega à UE.',
      arrives_eu_non_eu_airline: 'o voo chega à UE vindo de fora com uma companhia não europeia.',
      arrives_eu_unknown_airline: 'não sabemos se a companhia é europeia, e isso decide se o EU261 se aplica.',
      delay_short: 'o atraso na chegada é inferior a 3 horas.',
      cancel_early: 'foi avisado com 14 dias ou mais de antecedência.',
      extraordinary: 'a causa pode ser uma circunstância extraordinária, e a companhia pode não ter de pagar.',
      unknown_cause: 'não sabemos a causa, e a companhia pode alegar circunstâncias extraordinárias.',
    },
  },
  en: {
    before: {
      hello: (d) => `Hi ${d.firstName}! I’m the **BEFORE Agent**. Let me check your trip from **${d.origin}** to **${d.dest}**.`,
      distance: (d) => `Flight **${d.flight}** on ${d.date}. Calculated distance: **${num(d.km, 'en')} km**.`,
      checklist: 'Here’s your document checklist for this trip. Check the requirements on the official website of the destination country.',
      handoff: 'All good. Handing over to the **DURING Agent**.',
      invalid: 'Some trip details don’t add up. Please check the highlighted fields.',
    },
    checklist: {
      passport: 'Valid passport',
      id_or_passport: 'National ID card or valid passport (travel within the EU area)',
      visa: 'Visa or electronic travel authorisation, depending on your nationality',
      insurance: 'Travel insurance (recommended)',
      booking: 'Booking and boarding pass (keep them: they’re evidence)',
      check_official: 'Check the requirements on the official website of the destination country.',
    },
    during: {
      hello: '**DURING Agent** here. I’m logging what happened.',
      summary: (d) => `Disruption: **${d.incident}**${d.detail}. Reason given: **${d.cause}**.`,
      rightsIntro: 'While you wait, the airline owes you this:',
      hashing: 'Packaging your evidence and computing its SHA-256 fingerprint…',
      anchored: (d) => `Evidence secured. Fingerprint **${d.short}** anchored on Stellar (memo hash). No personal data on the blockchain.`,
      anchorFailed: 'I couldn’t anchor the evidence on Stellar right now, but it’s saved. Let’s continue.',
      handoff: 'Handing over to the **AFTER Agent** to work out what you’re owed.',
    },
    rights: {
      meals: 'Meals and refreshments in reasonable relation to the wait',
      communication: 'Two free phone calls, emails or messages',
      hotel: 'Hotel and transfer if you need to stay overnight',
      refund: 'With a delay of 5 h or more, you can ask for a ticket refund',
      reroute: 'Choose between a refund or the earliest alternative flight',
      wait: 'No right to care yet with this delay, but keep everything in case it grows',
      keep_receipts: 'Keep every receipt: the airline must reimburse them',
    },
    after: {
      hello: '**AFTER Agent** here. I have everything I need to decide.',
      advance: (d) => `You’re entitled to **${eur(d.comp, 'en')}** under EU261 (${num(d.km, 'en')} km). I can pay you 80% **right now**: **${eur(d.adv, 'en')}** → **${num(d.local, 'en')} ${d.asset}**. We’ll claim the full 100% from the airline.`,
      claimOnly: (d) => `You might be entitled to **${eur(d.comp, 'en')}**, but ${d.why} So I can’t offer an advance: I’ve drafted the claim for you to send.`,
      noRight: (d) => `Based on these details there’s no right to compensation: ${d.why} I’ve still drafted the claim in case you want to try.`,
      claimReady: 'Your claim is drafted, with the legal basis and your evidence fingerprint.',
      creatingWallet: 'Creating your Stellar testnet wallet (Friendbot + trustline)…',
      walletReady: (d) => `Wallet ready to receive **${d.asset}**.`,
      waitingSign: 'Read the assignment and press **Sign and get paid** when ready.',
      signed: 'Assignment signed. Sending your payment…',
      paidEURC: (d) => `**Paid: ${num(d.sent, 'en')} EURC** straight to your wallet.`,
      paidPath: (d) => `**Paid: ${num(d.sent, 'en')} EURC → ${num(d.received, 'en')} ${d.asset}** via the Stellar DEX.`,
      rejected: (d) => `${d.error}`,
      bye: 'We’ll take it from here with the airline. Safe travels!',
    },
    why: {
      outside_eu: 'the flight neither departs from nor arrives in the EU.',
      arrives_eu_non_eu_airline: 'the flight arrives in the EU from outside on a non-European airline.',
      arrives_eu_unknown_airline: 'we don’t know if the airline is European, which decides whether EU261 applies.',
      delay_short: 'the arrival delay is under 3 hours.',
      cancel_early: 'you were notified 14 days or more in advance.',
      extraordinary: 'the cause may be an extraordinary circumstance, so the airline might not have to pay.',
      unknown_cause: 'the cause is unknown, and the airline could claim extraordinary circumstances.',
    },
  },
};

// Mensajes de rechazo del pago (las barreras de seguridad) traducidos
const REJECT = {
  es: { already: 'Pago rechazado: esta reclamación ya se pagó.', unsigned: 'Pago rechazado: falta la firma de la cesión.', noAdvance: 'Pago rechazado: este caso no tiene cobro inmediato.', max: 'Pago rechazado: supera el máximo de 600 € por pago.', invalid: 'Pago rechazado: importe no válido.', generic: 'El pago no se ha podido completar' },
  pt: { already: 'Pagamento recusado: esta reclamação já foi paga.', unsigned: 'Pagamento recusado: falta a assinatura da cessão.', noAdvance: 'Pagamento recusado: este caso não tem pagamento imediato.', max: 'Pagamento recusado: excede o máximo de 600 € por pagamento.', invalid: 'Pagamento recusado: montante inválido.', generic: 'Não foi possível concluir o pagamento' },
  en: { already: 'Payment rejected: this claim has already been paid.', unsigned: 'Payment rejected: the assignment has not been signed.', noAdvance: 'Payment rejected: this case has no instant payout.', max: 'Payment rejected: exceeds the 600 € per-payment limit.', invalid: 'Payment rejected: invalid amount.', generic: 'The payment could not be completed' },
};

// -------------------------------------------------------------
// 3) CARTA DE RECLAMACIÓN A LA AEROLÍNEA
// -------------------------------------------------------------
// TODO_LEGAL: revisar redacción y base legal.
function claimLetter(lang, d) {
  const L = {
    es: () => `RECLAMACIÓN DE INDEMNIZACIÓN — Reglamento (CE) n.º 261/2004

A la atención del departamento de atención al cliente de la aerolínea:

Pasajero/a: ${d.name}
Vuelo: ${d.flight} · Fecha: ${d.date}
Ruta: ${d.origin} → ${d.dest} (${num(d.km, 'es')} km)
Incidencia: ${d.incident}${d.detail}
Causa comunicada: ${d.cause}

Base legal: artículos 4 (denegación de embarque), 5 (cancelación), 6 (retraso) y 7 (compensación) del Reglamento (CE) n.º 261/2004, y la jurisprudencia del TJUE (asuntos C-402/07 Sturgeon y C-549/07 Wallentin-Hermann).

Solicito el pago de ${eur(d.comp, 'es')} en concepto de compensación, además del reembolso de los gastos de atención acreditados.
${d.assigned ? '\nEl derecho de cobro de esta reclamación ha sido cedido a Disruption Agents, a quien deberá realizarse el pago.\n' : ''}
Huella SHA-256 del paquete de pruebas: ${d.hash}
${d.anchorLink ? `Anclada en la red Stellar: ${d.anchorLink}\n` : ''}
Quedo a la espera de su respuesta en el plazo legal.

${d.name}
${new Date().toLocaleDateString('es-ES')}`,
    pt: () => `RECLAMAÇÃO DE INDEMNIZAÇÃO — Regulamento (CE) n.º 261/2004

Ao cuidado do serviço de apoio ao cliente da companhia aérea:

Passageiro/a: ${d.name}
Voo: ${d.flight} · Data: ${d.date}
Rota: ${d.origin} → ${d.dest} (${num(d.km, 'pt')} km)
Incidente: ${d.incident}${d.detail}
Causa comunicada: ${d.cause}

Base legal: artigos 4.º (recusa de embarque), 5.º (cancelamento), 6.º (atraso) e 7.º (indemnização) do Regulamento (CE) n.º 261/2004, e jurisprudência do TJUE (processos C-402/07 Sturgeon e C-549/07 Wallentin-Hermann).

Solicito o pagamento de ${eur(d.comp, 'pt')} a título de indemnização, bem como o reembolso das despesas de assistência comprovadas.
${d.assigned ? '\nO direito de crédito desta reclamação foi cedido à Disruption Agents, a quem deverá ser feito o pagamento.\n' : ''}
Impressão digital SHA-256 do pacote de provas: ${d.hash}
${d.anchorLink ? `Ancorada na rede Stellar: ${d.anchorLink}\n` : ''}
Aguardo a vossa resposta no prazo legal.

${d.name}
${new Date().toLocaleDateString('pt-PT')}`,
    en: () => `COMPENSATION CLAIM — Regulation (EC) No 261/2004

To the airline's customer relations department:

Passenger: ${d.name}
Flight: ${d.flight} · Date: ${d.date}
Route: ${d.origin} → ${d.dest} (${num(d.km, 'en')} km)
Disruption: ${d.incident}${d.detail}
Reason given: ${d.cause}

Legal basis: Articles 4 (denied boarding), 5 (cancellation), 6 (delay) and 7 (compensation) of Regulation (EC) No 261/2004, and CJEU case law (C-402/07 Sturgeon and C-549/07 Wallentin-Hermann).

I request payment of ${eur(d.comp, 'en')} in compensation, plus reimbursement of documented care expenses.
${d.assigned ? '\nThe right to payment under this claim has been assigned to Disruption Agents, to whom payment should be made.\n' : ''}
SHA-256 fingerprint of the evidence package: ${d.hash}
${d.anchorLink ? `Anchored on the Stellar network: ${d.anchorLink}\n` : ''}
I look forward to your reply within the legal deadline.

${d.name}
${new Date().toLocaleDateString('en-GB')}`,
  };
  return (L[lang] || L.en)();
}

module.exports = { UI, MSG, REJECT, claimLetter, eur, num };
