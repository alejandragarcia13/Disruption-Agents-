# ✈️🛡️ Disruption Agents

### *Your flight failed. Your money won't.*

> When your trip breaks, our agents handle the paperwork and pay you in minutes, in your currency, wherever you are.

**HackMeridian 2026 · Lisbon · Track: Stellar Unlocked** (asset issuance, native DEX, path payments, memo hash)

---

## 1. The problem

Every year millions of international travellers suffer **delays, cancellations and denied boarding**. In Europe they are often entitled to **€250–€600** in compensation, but:

- **Most never claim.** They don't know their rights, the process is confusing, and airlines push back.
- **Those who claim wait months.** Claim agencies take a big cut and pay out after the airline does.
- **If you live outside Europe, getting paid is slow and expensive.** A traveller in São Paulo or Mexico City owed €600 by a European airline faces international transfers, FX spreads and bank fees that eat into an already-late payment.

The ongoing reform of EU air passenger rights (Regulation (EU) 2026/2202) puts passenger compensation back in the spotlight and makes it even more important that travellers understand and actually receive what they're owed.

## 2. The solution

Disruption Agents is a 5-step assistant where **any traveller, from any country**, tells us what happened to their flight. Three agents explain their rights, calculate their compensation and **pay them instantly over Stellar, in their own currency**. Then *we* claim from the airline.

| Step | What happens | Agent |
|---|---|---|
| **1 · Your country** | Pick from 70 countries. Language (ES / PT / EN) and payout currency are set automatically. | n/a |
| **2 · Your trip** | Origin, destination, flight, date, EU airline? Distance and document checklist. | 🧭 **BEFORE** |
| **3 · What happened?** | Delay / cancellation / denied boarding + cause. Immediate rights (meals, calls, hotel, rerouting). Evidence is hashed (SHA-256) and **anchored on Stellar**. | ⚡ **DURING** |
| **4 · Your rights** | EU261 coverage, distance, compensation, and an **instant 80% offer** converted to local currency. A ready-to-send claim letter. | ⚖️ **AFTER** |
| **5 · Get paid** | A Stellar wallet is created on the spot, the traveller signs the assignment, and gets paid: e.g. **480 EURC → 2,976 BRL via the Stellar DEX**. | ⚖️ **AFTER** |

**The three agents**

- **BEFORE Agent** validates the trip, computes great-circle distance (haversine) and gives a document checklist.
- **DURING Agent** logs the disruption, explains immediate rights and anchors the evidence hash on-chain.
- **AFTER Agent** decides compensation, makes the offer, handles the signature, pays, and drafts the claim.

A simple orchestrator (`agents.js`) hands over between agents depending on the step. Amounts are **always** computed by the rules engine (`rules.js`), never by message templates.

## 3. How we use Stellar (Stellar Unlocked track)

Everything runs on **Stellar testnet** using `@stellar/stellar-sdk`.

| Stellar feature | How we use it |
|---|---|
| **Account creation** | Every traveller gets a fresh wallet via Friendbot, with a **trustline** to their payout asset. |
| **Asset issuance** | Our issuer account mints demo assets: **EURC, USDC, BRL, MXN, COP, ARS, GBP**. |
| **Native DEX** | A market-maker account posts sell offers for each currency against EURC. |
| **Path payments** | The liquidity pool pays in EURC; with `pathPaymentStrictSend` the traveller **receives their local currency**, converted on the DEX in the same transaction. |
| **Memo hash** | The SHA-256 of the evidence package is anchored on-chain as a `MEMO_HASH`: tamper-evident proof with **zero personal data on the blockchain**. |

**Payout currency by country:** BRL, MXN, COP, ARS, GBP → that currency · euro countries → EURC · everyone else → USDC.

**Safety rails (enforced in code, `stellar.js` + `agents.js`)**
- Max **€600 per payment**.
- **One payment per flight + date + traveller.** A second attempt returns *"Payment rejected: this claim has already been paid."*
- **Never pay without "Sign and get paid".**
- The server **recomputes** the amount; it never trusts the browser.
- **No personal data on-chain**, only hashes.

> ⚠️ All assets are **demo assets issued by us on testnet**, and the exchange rates (`countries.js` → `DEMO_RATES`) are **fictitious, for demo purposes only**.

## 4. Business model

- We **buy the right to claim at a discount**: the traveller gets **80% instantly**, we claim **100%** from the airline.
- The 20% spread covers risk, legal work and operations.
- Instant payouts are funded from a **liquidity pool financed by investors**, who earn a return as claims are recovered.
- **Next step:** tokenize claims on Stellar so investors can fund (and trade) portfolios of airline receivables.

## 5. Architecture

```
                 ┌──────────────────────────────┐
  Traveller ───▶ │  public/index.html  (5 steps) │
                 └──────────────┬───────────────┘
                                │  POST /api/agent/:step
                                ▼
                 ┌──────────────────────────────┐
                 │  server.js  (Express)         │
                 │      └─▶ agents.js orchestrator│
                 │           ├─ BEFORE agent      │
                 │           ├─ DURING agent      │──▶ templates.js (ES/PT/EN messages)
                 │           └─ AFTER agent       │
                 └──────┬───────────────┬────────┘
                        │               │
                        ▼               ▼
               ┌────────────────┐  ┌──────────────────────────────┐
               │ rules.js       │  │ stellar.js                   │
               │ EU261 rules    │  │ wallets · memo hash anchor   │
               │ distances      │  │ payments · path payments     │
               │ checklist      │  │ safety rails                 │
               └────────────────┘  └──────────────┬───────────────┘
                                                  ▼
                                      Stellar testnet (Horizon + DEX)
```

| File | Purpose |
|---|---|
| `server.js` | Express server on http://localhost:3000 |
| `agents.js` | The 3 agents + orchestrator |
| `rules.js` | Simplified EU261 rules, distances, checklist (`TODO_LEGAL` markers) |
| `templates.js` | All UI text and agent messages in Spanish, Portuguese and English |
| `stellar.js` | Wallets, payments, path payments, evidence anchoring, safety rails |
| `setup-stellar.js` | Creates issuer / pool / market maker, issues assets, posts DEX offers |
| `countries.js` | 70 countries, languages, currencies and demo exchange rates |
| `airports.js` | 60 major airports with coordinates and EU flag |
| `test-demo.js` | End-to-end test of 3 scenarios against testnet |
| `public/index.html` | Single-page UI (HTML + CSS + vanilla JS) |

## 6. How to run

**Requirements:** [Node.js](https://nodejs.org) 18 or newer (LTS recommended) and an internet connection (for Stellar testnet). Works on Windows, macOS and Linux.

```bash
npm install        # install dependencies (express, @stellar/stellar-sdk)
npm run setup      # create Stellar testnet accounts, assets and DEX offers (~20 s, only once)
npm start          # start the app
```

Then open **http://localhost:3000**.

Optional: `npm run test-demo` runs 3 full scenarios against testnet and reports ✅/❌.

> Stellar testnet is reset periodically. If the app shows *"Stellar is not set up"*, just run `npm run setup` again. It is safe to run multiple times. Use `npm run setup -- --force` to recreate everything from scratch.

## 7. Demo walkthrough

1. Open http://localhost:3000. (Optional) click **✨ Fill with an example** in the demo bar (bottom right).
2. **Your country:** choose *Brazil* → language switches to Portuguese and payout currency to **BRL**. Enter a name.
3. **Your trip:** Lisbon (LIS) → São Paulo (GRU), flight `TP 87`, any recent date, European airline: *Yes*. The BEFORE agent shows **7,935 km** and the document checklist.
4. **What happened?** Delay, **5 h**, cause *Technical problem* → **Confirm and secure evidence**. The DURING agent lists immediate rights and anchors the evidence hash on Stellar (link in the sidebar).
5. **Your rights:** covered by EU261, **€600** compensation, instant offer **€480 → 2,976 BRL**. Download or copy the claim letter.
6. **Get paid:** a Stellar wallet is created live. Tick the assignment, press **Sign and get paid** → *Paid: 480 EURC → 2,976 BRL via Stellar DEX*. Every transaction opens on stellar.expert.
7. Click **↻ Try to get paid again** → *"Payment rejected: this claim has already been paid."*

Other cases to try: Spain, Lisbon → Madrid, 4 h delay due to **weather** (no advance, claim only) · Mexico, Madrid → Mexico City, **cancelled with 3 days' notice** (€480 → MXN).

## 8. What we built during the hackathon

- A full 5-step, trilingual (ES / PT / EN) assistant with 70 countries and 60 airports.
- Three rule-based agents with an orchestrator and a live activity log.
- A simplified EU261 rules engine (scope, distance bands, delay / cancellation / denied boarding, extraordinary circumstances).
- Real Stellar testnet integration: asset issuance, DEX market making, per-traveller wallets, path payments to local currency, memo-hash evidence anchoring, safety rails.
- Auto-generated claim letter with legal basis and on-chain evidence fingerprint.
- An end-to-end test script.

## 9. What's next

- **Conversational AI agents** on top of the deterministic rules engine.
- **More legal regimes:** UK261, Brazil (ANAC 400), Canada (APPR), US DOT rules…
- **Rail and bus** passenger rights.
- **Real anchors / off-ramps** so travellers can cash out straight to their bank account.
- **Soroban smart contract** enforcing payout limits and one-payment-per-claim on-chain.
- **Tokenization of claims** for investors funding the liquidity pool.

## 10. Legal note

The rules in this demo are **simplified** (see `TODO_LEGAL` markers in `rules.js` and `templates.js`) and are being reviewed by the legal profile of our team. **This is not legal advice.** All assets, balances and exchange rates are test values on Stellar testnet.

## 11. Team

| Name | Role |
|---|---|
| _______________ | _______________ |
| _______________ | _______________ |
| _______________ | _______________ |
| _______________ | Legal |
