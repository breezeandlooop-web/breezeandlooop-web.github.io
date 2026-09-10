# Arlette Life Guide

A completely separate single-file Vedic life-guide app for **Arlette / Art Smart** — not Studio Home, not Graha Day Desk, not Breeze apps.

## Open

**iPhone (Files):** do **not** use the Files preview alone. Tap the file → Share → **Open in Safari** (or “Copy to Safari”). Then the daily guide and tabs work.

**Computer:** File → Open in Chrome or Safari (not a chat preview).

JavaScript required for Today’s live weekday engine; portrait sections remain readable if scripts are blocked.

**Live:** https://breezeandlooop-web.github.io/arlette-life-guide/

## Person

- Born **1 July 1977**, Georgetown, Guyana
- Birth time **unknown** (~11:00–15:00 local; Guyana UTC−3 in 1977)
- Vedic **Lahiri** sidereal **day chart**
- **No houses / no Lagna** anywhere in the UI
- Moon degree labeled approximate

## Locked natal (day chart · verified)

| Graha | Sign · degree | Lon |
|-------|----------------|-----|
| Sun | Mithuna 15°30′ | 75.5 |
| Moon | Dhanu ~13°30′ (approx) | 253.5 |
| Mercury | Mithuna 16°42′ | 76.7 |
| Venus | Vrishabha 0°31′ (own) | 30.5167 |
| Mars | Mesha 24°40′ | 24.6667 |
| Jupiter | Vrishabha 26°13′ | 56.2167 |
| Saturn | Karka 21°32′ | 111.5333 |
| Rahu / Ketu | Kanya / Meena 26°45′ (mean) | 176.75 / 356.75 |

## v1.1 features

### 1. Gochara ↔ natal lights + season card
- **Season: Guru on your Shani** — shown in curated Jupiter-in-Cancer windows (Jun 2–Oct 31 2026; return ~Jan 25–Jun 15 2027). Transit Jupiter exalted in Cancer lighting natal Saturn Karka 21°32′; orb cited when computable.
- **Natal lights** — chips when a transit graha shares the same sidereal sign as a natal graha; highlight within 3° orb.
- Slow grahas (♃ ♄ ☊ ♂): embedded weekly Lahiri table 2026-06-01 → 2027-06-30, linear interpolation. UI: “Lahiri table · interpolated” (Jagannath Hora / Drik-style anchors).
- Fast grahas (☉ ☿ ♀ ☾): tropical − ayanamsa ~24.13° (2026), labeled approx Lahiri.
- **Verification (Sep 10 2026):** Jupiter ~21°25′–21°42′ Cancer Ashlesha pada 2 (exalted), nearly exact on natal Saturn; Saturn ~17–19° Pisces retrograde (not on natal Saturn).

### 2. Approval lab history
- Each Save appends/updates `state.lab.history: [{date, answers:{q1..q4}, notes}]`.
- Last 14 days heat strip + this-week question counts.
- Intercept question text unchanged from v1.

### 3. Matter meter + Gemini finish gate
- **Matter meter** (Guru–Shukra Taurus): two dated checkboxes — tangible matter / caught talk-only urge. Persists in `state.matter`.
- **Gemini finish-before-perform gate**: prominent on Sunday/Wednesday; collapsed other days. Checkbox + optional 15-min hold timer. Persists in `state.gate`.

## Sections

1. **Today** — Season card, natal lights, matter meter, Gemini gate, Vāra pack, sky note
2. **Who is Arlette** — Blueprint portrait cards
3. **Life purpose** — Statement + living pillars
4. **Strengths vs soft spots** — Two columns
5. **Approval & people-pleasing lab** — Diagnosis, intercept questions, practice, 14-day history
6. **Week at a glance** — 7 days
7. **Natal frequency map** — Grahas with gift/lesson (no houses)
8. **Journal** — CRUD dated entries
9. **Settings** — Name, birth notes, export/import/reset

## Storage

`localStorage` key: `arletteLifeGuide_v1_1` (migrates `arletteLifeGuide_v1` if present)

## Design

Indigo night + soft gold/cream. Mobile-friendly. Vanilla JS (`'use strict'`, `function`/`var` only). Footer **v1.1**.

## Tone

Warm, plain, contemplative. Second person to Arlette. Soft disclaimer once. Not medical/legal/fate.
