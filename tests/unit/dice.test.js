import { describe, it, expect } from 'vitest';
import { evaluateAttackRolls, evaluateDefenseRolls, rollDicePool } from '../../src/rules/dice.js';

describe('evaluateAttackRolls (COMBAT.S1-UNIT-001)', () => {
  it('classifies 6 as crit, >=bs as normal, <bs as miss', () => {
    const r = evaluateAttackRolls([6, 5, 3, 2, 1], 3);
    expect(r.criticals).toBe(1);
    expect(r.normals).toBe(2);
    expect(r.misses).toBe(2);
  });

  it('counts 5 as normal when bs=3', () => {
    expect(evaluateAttackRolls([5], 3).normals).toBe(1);
  });

  // Defect D12 (RED — known divergence from rules):
  // merged_kt_lite_rules_zh.md: "每个结果为1的掷骰总是失败".
  // evaluateAttackRolls treats 1 as a hit when bs <= 1. Oracle = rules, not code.
  it('natural 1 auto-fails even when bs <= 1 (D12)', () => {
    const r = evaluateAttackRolls([1], 1);
    expect(r.misses).toBe(1);
    expect(r.normals).toBe(0);
  });

  it('counts a 6 as crit (not also normal) — boundary guard', () => {
    expect(evaluateAttackRolls([6], 3).normals).toBe(0);
  });
});

describe('evaluateDefenseRolls (COMBAT.S1-UNIT-002)', () => {
  it('classifies 6 as crit save, >=sv as normal save, <sv as fail', () => {
    const r = evaluateDefenseRolls([6, 4, 3, 2], 3);
    expect(r.criticals).toBe(1);
    expect(r.normals).toBe(2); // 4 and 3 are >= sv(3)
    expect(r.fails).toBe(1);   // 2
  });

  it('natural 1 auto-fails defense even when sv <= 1 (rule: 1 总是失败)', () => {
    const r = evaluateDefenseRolls([1], 1);
    expect(r.fails).toBe(1);
    expect(r.normals).toBe(0);
  });
});

describe('rollDicePool (COMBAT.S1-UNIT-003)', () => {
  it('returns `count` dice, each in [1,6]', () => {
    const pool = rollDicePool(10);
    expect(pool).toHaveLength(10);
    expect(pool.every((v) => v >= 1 && v <= 6)).toBe(true);
  });

  it('empty pool when count is 0', () => {
    expect(rollDicePool(0)).toEqual([]);
  });
});
