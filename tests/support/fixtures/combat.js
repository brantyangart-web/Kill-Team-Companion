// Plain fixture factories for unit-testing the pure `src/rules/` layer.
//
// IMPORTANT: do NOT use src/js/models.js classes (Operative/Weapon) in unit tests.
// Those are DOM-coupled — they import audio/state and call confirm()/playSound/ui.*
// at runtime. The rules registry (src/rules/shootResolver.js etc.) consumes a
// duck-typed interface, so we provide minimal POJOs matching it.
//
// shootResolver.resolveShooting expects:
//   attacker: { name, faction, apl }
//   defender: { name, faction, df, sv, wounds, applyDamage(dmg, log, drRolls) -> number }
//   weapon:   { name, attacks, bs, normalDamage, criticalDamage, isRanged?, rules? }

export function makeAttacker(overrides = {}) {
  return {
    name: 'Attacker',
    faction: 'legionaries',
    apl: 2,
    actionsPerformed: [],
    ...overrides,
  };
}

// Defender with a deterministic, no-side-effect-beyond-wounds applyDamage.
// Mirrors the duck-typed contract shootResolver calls; ignores DR for the base
// fixture (pass { disgustingResilience: true } + drRolls for DR cases).
export function makeDefender(overrides = {}) {
  const base = {
    name: 'Defender',
    faction: 'angels_of_death',
    df: 3,
    sv: 3,
    wounds: 8,
    maxWounds: 8,
    ...overrides,
  };
  base.applyDamage = (totalIncoming) => {
    const before = base.wounds;
    base.wounds = Math.max(0, base.wounds - totalIncoming);
    return before - base.wounds; // actual damage dealt
  };
  return base;
}

export function makeWeapon(overrides = {}) {
  return {
    name: 'Boltgun',
    attacks: 4,
    bs: 3,
    normalDamage: 1,
    criticalDamage: 2,
    isRanged: true,
    rules: [],
    ...overrides,
  };
}
