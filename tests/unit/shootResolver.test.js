import { describe, it, expect } from 'vitest';
import { resolveShooting } from '../../src/rules/shootResolver.js';
import { makeAttacker, makeDefender, makeWeapon } from '../support/fixtures/combat.js';

const noop = () => {};

describe('resolveShooting — guards (COMBAT.S2-UNIT-101/102)', () => {
  it('aborts with INSUFFICIENT_APL when apl < 1 and deals 0 damage', () => {
    const attacker = makeAttacker({ apl: 0 });
    const defender = makeDefender();
    const res = resolveShooting({
      attacker, defender, weapon: makeWeapon(), log: noop,
    });
    expect(res.success).toBe(false);
    expect(res.reason).toBe('INSUFFICIENT_APL');
    expect(defender.wounds).toBe(defender.maxWounds);
  });

  it('aborts when target not visible/in range', () => {
    const res = resolveShooting({
      attacker: makeAttacker(),
      defender: makeDefender(),
      weapon: makeWeapon(),
      inRangeAndVisible: false,
      log: noop,
    });
    expect(res.success).toBe(false);
    expect(res.reason).toBe('NOT_VISIBLE_OR_OUT_OF_RANGE');
  });

  it('aborts when target concealed in heavy cover', () => {
    const res = resolveShooting({
      attacker: makeAttacker(),
      defender: makeDefender(),
      weapon: makeWeapon(),
      inCoverConcealed: true,
      log: noop,
    });
    expect(res.success).toBe(false);
    expect(res.reason).toBe('TARGET_CONCEALED_IN_COVER');
  });
});

describe('resolveShooting — APL & miss (COMBAT.S2-UNIT-103/104)', () => {
  it('deducts 1 APL on a valid shot (rules: 射击 1AP)', () => {
    const attacker = makeAttacker({ apl: 2 });
    resolveShooting({
      attacker,
      defender: makeDefender(),
      weapon: makeWeapon(),
      mode: 'manual',
      manualAttack: { criticals: 0, normals: 0 }, // all miss
      log: noop,
    });
    expect(attacker.apl).toBe(1);
  });

  it('returns 0 damage and ends early when all attacks miss', () => {
    const defender = makeDefender();
    const res = resolveShooting({
      attacker: makeAttacker({ apl: 2 }),
      defender,
      weapon: makeWeapon(),
      mode: 'manual',
      manualAttack: { criticals: 0, normals: 0 },
      log: noop,
    });
    expect(res.success).toBe(true);
    expect(res.damageDealt).toBe(0);
    expect(defender.wounds).toBe(defender.maxWounds);
  });
});

describe('resolveShooting — matching cascade & damage (COMBAT.S2-UNIT-105/106)', () => {
  it('crit save cancels crit hit 1:1, leftover crit deals criticalDamage', () => {
    // 2 crit hits, 1 crit save -> 1 crit through -> criticalDamage (2)
    const defender = makeDefender({ wounds: 10, maxWounds: 10 });
    const res = resolveShooting({
      attacker: makeAttacker(),
      defender,
      weapon: makeWeapon({ normalDamage: 1, criticalDamage: 2 }),
      mode: 'manual',
      manualAttack: { criticals: 2, normals: 0 },
      manualDefense: { criticals: 1, normals: 0 },
      log: noop,
    });
    expect(res.incomingDamage).toBe(2);
  });

  it('two normal saves cancel one crit hit (2:1)', () => {
    const defender = makeDefender({ wounds: 10, maxWounds: 10 });
    const res = resolveShooting({
      attacker: makeAttacker(),
      defender,
      weapon: makeWeapon({ normalDamage: 1, criticalDamage: 2 }),
      mode: 'manual',
      manualAttack: { criticals: 1, normals: 0 },
      manualDefense: { criticals: 0, normals: 2 },
      log: noop,
    });
    expect(res.incomingDamage).toBe(0);
  });

  it('normal hit vs no defense deals normalDamage', () => {
    const defender = makeDefender({ wounds: 10, maxWounds: 10 });
    const res = resolveShooting({
      attacker: makeAttacker(),
      defender,
      weapon: makeWeapon({ normalDamage: 3, criticalDamage: 4 }),
      mode: 'manual',
      manualAttack: { criticals: 0, normals: 2 },
      manualDefense: { criticals: 0, normals: 0 },
      log: noop,
    });
    expect(res.incomingDamage).toBe(6);
  });
});

describe('resolveShooting — crit threshold (COMBAT.S2-UNIT-108)', () => {
  // Rules: "每个结果为6的掷骰属于关键成功". A natural 6 is the only crit (base).
  it('a natural 6 is a crit and deals criticalDamage (no defense)', () => {
    const defender = makeDefender({ wounds: 10, maxWounds: 10 });
    const res = resolveShooting({
      attacker: makeAttacker(),
      defender,
      weapon: makeWeapon({ attacks: 1, bs: 3, normalDamage: 1, criticalDamage: 4 }),
      mode: 'manual',
      manualAttack: [6], // die array: only a 6 is a crit
      manualDefense: { criticals: 0, normals: 0 },
      log: noop,
    });
    expect(res.incomingDamage).toBe(4); // 1 crit × criticalDamage
  });

  // Defect D12 (RED — known divergence, same root as dice.test D12):
  // Rules: "每个结果为1的掷骰总是失败". With bs=1 a rolled 1 should still miss,
  // but evaluateAttackRolls counts it as a normal hit.
  it('natural 1 always fails even when bs <= 1 (D12)', () => {
    const defender = makeDefender({ wounds: 10, maxWounds: 10 });
    const res = resolveShooting({
      attacker: makeAttacker(),
      defender,
      weapon: makeWeapon({ attacks: 1, bs: 1, normalDamage: 2, criticalDamage: 3 }),
      mode: 'manual',
      manualAttack: [1],
      manualDefense: { criticals: 0, normals: 0 },
      log: noop,
    });
    expect(res.damageDealt).toBe(0); // rule: 1 auto-misses → 0 damage
  });
});

// Defect D1 (RED — known divergence from rules):
// Rules (merged_kt_lite_rules_zh.md 掩体/防御): cover lets the defender retain
// one defense die as a normal save "在不进行掷骰的情况下" — i.e. an EXTRA free save;
// the defender still rolls the full DF pool. shootResolver.js:116-122 instead
// REDUCES the rolled pool by 1 (dfPool = df-1) then adds the save, yielding one
// fewer rolled die. Oracle = rules; assert the rolled DF count stays at `df`.
describe('resolveShooting — cover save (D1, COMBAT.S2-UNIT-107)', () => {
  it('cover does not reduce the rolled DF pool (defender still rolls `df` dice)', () => {
    const res = resolveShooting({
      attacker: makeAttacker(),
      defender: makeDefender({ df: 3, sv: 3 }),
      weapon: makeWeapon({ attacks: 4, bs: 3 }),
      mode: 'random', // exercise the real roll path
      inCover: true,
      log: noop,
    });
    // Rules: 3 DF dice rolled + 1 free normal save. Code rolls df-1 = 2.
    expect(res.rolls.defenseRolls).toHaveLength(3);
  });
});
