#!/usr/bin/env node
// combat-checker.js — 射击/近战结算测试器（oracle = 规则文档）
//
// 用途：把实测场景的骰子/选择输入进来，回放结算，打印每一步与最终结果，
//      用来核对桌面实际打出的结果是否与规则一致。
//
// 规则口径：docs/rules/merged/merged_kt_lite_rules_zh.md
//
// 用法：
//   node tools/combat-checker.js <scenario.json>
//   node tools/combat-checker.js examples/shoot-example.json
//
// 场景 JSON 结构见文末 EXAMPLES，或 tools/examples/*.json。

import { readFileSync } from 'node:fs';
import { evaluateAttackRolls, evaluateDefenseRolls } from '../src/rules/dice.js';

// ─── 工具 ────────────────────────────────────────────────────────────────
const log = (...a) => console.log(...a);
const hr = () => log('\n──────────────────────────────────────────');

function classify(val, bs) {
  // 规则：1 总失败；6 暴击；其余 >=bs 为普通命中
  if (val === 1) return 'miss';
  if (val === 6) return 'crit';
  return val >= bs ? 'norm' : 'miss';
}

// ─── 不屈不挠（死亡天使战略计谋，作用于攻击骰）────────────────────────────
// 规则：对死亡天使特工射击时，若掷出 ≥2 个失败，可舍弃一个，另一个失败作为普通成功保留。
function applyIndomitable(attackDice, bs, active) {
  if (!active) return { dice: attackDice, applied: false };
  const fails = attackDice.filter((v) => classify(v, bs) === 'miss');
  if (fails.length < 2) return { dice: attackDice, applied: false };
  // 舍弃第一个失败，把第二个失败改成 "刚好命中"（bs 值）作为普通成功
  const dice = [...attackDice];
  let dropped = false;
  let promoted = false;
  for (let i = 0; i < dice.length; i++) {
    if (classify(dice[i], bs) === 'miss') {
      if (!dropped) { dice[i] = null; dropped = true; }       // 舍弃
      else if (!promoted) { dice[i] = bs; promoted = true; }  // 升为普通成功
      else break;
    }
  }
  return { dice: dice.filter((v) => v !== null), applied: true };
}

// ─── 射击结算（独立参考实现；oracle = 规则文档）──────────────────────────
// 自行掌握逐颗攻击骰伤害，便于 恼人韧性(DR) / 不屈 逐颗结算。
function runShoot(s) {
  hr();
  log(`【射击结算】${s.attacker.name} → ${s.defender.name}  武器: ${s.weapon.name}`);
  hr();

  const bs = s.weapon.bs;
  const sv = s.defender.sv;

  // 0. 守卫（隐匿+重掩体 / 不可见）—— 直接判定
  if (s.inRangeAndVisible === false) { log('❌ 目标不可见/超射程，中止。'); return final(s, 0, 'NOT_VISIBLE'); }
  if (s.inCoverConcealed === true) { log('❌ 目标重掩体下隐蔽，不可射击，中止。'); return final(s, 0, 'CONCEALED'); }

  // 1. 攻击骰（规则：6 暴击，1 失败，>=bs 普通）
  let attackDice = [...s.attackDice];
  // 不屈不挠（死亡天使战略计谋，作用于攻击骰）
  const indo = applyIndomitable(attackDice, bs, s.defender.indomitable === true);
  if (indo.applied) { log(`🎖️ 不屈不挠：舍弃 1 失败、1 失败升为普通成功 → 攻击骰 ${indo.dice.join(',')}`); attackDice = indo.dice; }
  const a = evaluateAttackRolls(attackDice, bs);
  log(`攻击骰 ${attackDice.join(',')} @bs${bs}+ → 暴击 ${a.criticals} 普通 ${a.normals} 失败 ${a.misses}`);
  if (a.criticals + a.normals === 0) { log('全部未命中，0 伤害。'); return final(s, 0); }

  // 2. 防御骰（规则：6 暴击防守，1 失败，>=sv 普通防守；掩体额外 +1 普通，不减投骰池）
  let dCrit = 0, dNorm = 0;
  if (s.defenseDice) {
    const d = evaluateDefenseRolls(s.defenseDice, sv);
    dCrit = d.criticals; dNorm = d.normals;
    log(`防御骰 ${s.defenseDice.join(',')} @sv${sv}+ → 暴击防守 ${dCrit} 普通防守 ${dNorm} 失败 ${d.fails}`);
  }
  if (s.inCover) { dNorm += 1; log(`🛡️ 掩体：额外 +1 普通防守（投骰池不变）→ 普通防守 ${dNorm}`); }

  // 3. 对消级联（规则：暴击防↔暴击命中1:1；2普通防→1暴击命中；普通↔普通1:1；暴击防→普通1:1）
  let rCrit = a.criticals, rNorm = a.normals, rsCrit = dCrit, rsNorm = dNorm;
  const c1 = Math.min(rCrit, rsCrit); rCrit -= c1; rsCrit -= c1;
  if (rCrit > 0 && rsNorm >= 2) { const m = Math.min(rCrit, Math.floor(rsNorm / 2)); rCrit -= m; rsNorm -= m * 2; }
  const c3 = Math.min(rNorm, rsNorm); rNorm -= c3; rsNorm -= c3;
  if (rNorm > 0 && rsCrit > 0) { const m = Math.min(rNorm, rsCrit); rNorm -= m; rsCrit -= m; }
  log(`对消后未抵消 → 暴击命中 ${rCrit} 普通命中 ${rNorm}`);

  // 4. 逐颗伤害（暴击=criticalDamage，普通=normalDamage）
  const perAttack = [
    ...Array(rCrit).fill(s.weapon.criticalDamage),
    ...Array(rNorm).fill(s.weapon.normalDamage),
  ];
  log(`逐颗伤害: [${perAttack.join(',')}]`);

  // 5. 恼人韧性（瘟疫阵营）：每颗 ≥3 伤害的攻击骰，掷 D6，4+ 减 1
  let drUsed = 0;
  const drRolls = s.drRolls || [];
  const finalDmg = perAttack.map((dmg) => {
    if (s.defender.disgustinglyResilient && dmg >= 3) {
      const roll = drUsed < drRolls.length ? drRolls[drUsed++] : null;
      if (roll === null) { log(`⚠️ 恼人韧性：${dmg} 伤害未提供 DR 骰，按全额结算（补 drRolls）`); return dmg; }
      const reduced = roll >= 4 ? dmg - 1 : dmg;
      log(`🛡️ 恼人韧性：${dmg} 伤害 DR[${roll}] ${roll >= 4 ? '成功 -1' : '失败'} → ${reduced}`);
      return reduced;
    }
    return dmg;
  });
  const total = finalDmg.reduce((x, y) => x + y, 0);

  const wounds0 = s.defender.wounds;
  const wounds = Math.max(0, wounds0 - total);
  log(`伤害合计 ${total} → ${s.defender.name} 耐伤 ${wounds0} → ${wounds}`);
  if (s.defender.disgustinglyResilient && drUsed < drRolls.length) log(`⚠️ 提供了 ${drRolls.length} 个 DR 骰，仅用 ${drUsed} 个`);

  final(s, total, null, wounds);
}

function final(s, total, reason = null, wounds = null) {
  hr(); log('【最终结果】');
  log(JSON.stringify({
    reason,
    incomingDamage: total,
    damageDealt: total,
    defenderWoundsRemaining: wounds ?? Math.max(0, s.defender.wounds - total),
    defenderWoundsStart: s.defender.wounds,
  }, null, 2));
}

// ─── 近战结算（参考实现，按 lite 规则）──────────────────────────────────
// 规则要点：
//  - 双方各按武器攻击数掷攻击骰，>=命中保留；6=暴击；1=失败。
//  - 从攻击方开始轮流结算"未格挡的成功"；每颗选择 出击(strike) 或 格挡(parry)。
//    · 出击：对敌方造成伤害（普通=普通伤害，暴击=暴击伤害）。
//    · 格挡：抵消敌方一颗未结算的成功（普通抵普通；暴击抵普通或暴击）。
//  - 若对方已无剩余成功，则把己方所有剩余成功全部出击。
// 输入：attacker/defender 各 dice + actions('strike'|'parry') 序列；不足默认 strike。
function runMelee(s) {
  hr();
  log(`【近战结算】${s.attacker.name} (攻) vs ${s.defender.name} (反)`);
  log(`  攻方武器: ${s.attackerWeapon.name}   反方武器: ${s.defenderWeapon.name}`);
  hr();

  const aEval = evaluateAttackRolls(s.attackerDice, s.attackerWeapon.bs);
  const dEval = evaluateAttackRolls(s.defenderDice, s.defenderWeapon.bs);
  // 每颗成功标记类型，crit 优先消费（造成更高伤害 / 更强格挡）
  let aPool = [...Array(aEval.criticals).fill('crit'), ...Array(aEval.normals).fill('norm')];
  let dPool = [...Array(dEval.criticals).fill('crit'), ...Array(dEval.normals).fill('norm')];

  log(`攻方保留: 暴击 ${aEval.criticals} 普通 ${aEval.normals}`);
  log(`反方保留: 暴击 ${dEval.criticals} 普通 ${dEval.normals}`);

  let aWounds = s.defender.wounds;     // 攻方出击 → 扣反方
  let dWounds = s.attacker.wounds;     // 反方出击 → 扣攻方
  const aStart = s.defender.wounds, dStart = s.attacker.wounds;

  let turn = 'attacker'; // 攻方先手
  let ai = 0, di = 0;    // actions 序列游标
  const aAct = s.attackerActions || [], dAct = s.defenderActions || [];
  let step = 0;

  const take = (side) => {
    // 从己方池取一颗（crit 优先）
    const pool = side === 'attacker' ? aPool : dPool;
    if (!pool.length) return null;
    const idx = pool.indexOf('crit');
    const i = idx >= 0 ? idx : 0;
    const [t] = pool.splice(i, 1);
    return t;
  };
  const otherPool = (side) => side === 'attacker' ? dPool : aPool;
  const parry = (side, type) => {
    const op = otherPool(side);
    // 普通只能抵普通；暴击抵普通或暴击（优先抵对方暴击）
    if (type === 'crit') {
      const ci = op.indexOf('crit');
      if (ci >= 0) return op.splice(ci, 1)[0];
      return op.length ? op.shift() : null;
    }
    const ni = op.indexOf('norm');
    if (ni >= 0) return op.splice(ni, 1)[0];
    return null;
  };

  while (aPool.length || dPool.length) {
    const side = turn;
    const pool = side === 'attacker' ? aPool : dPool;
    if (!pool.length) { turn = (turn === 'attacker' ? 'defender' : 'attacker'); continue; }
    step++;
    const type = take(side);
    const act = side === 'attacker'
      ? (aAct[ai++] || 'strike')
      : (dAct[di++] || 'strike');
    const sideName = side === 'attacker' ? s.attacker.name : s.defender.name;

    // 对方无剩余成功 → 必须出击
    const opHas = otherPool(side).length > 0;
    const finalAct = opHas ? act : 'strike';

    if (finalAct === 'parry') {
      const blocked = parry(side, type);
      log(`#${step} ${sideName} 格挡(${type}) → ${blocked ? `抵消对方一颗 ${blocked}` : '无目标可抵（浪费）'}`);
    } else {
      const w = type === 'crit'
        ? (side === 'attacker' ? s.attackerWeapon.criticalDamage : s.defenderWeapon.criticalDamage)
        : (side === 'attacker' ? s.attackerWeapon.normalDamage : s.defenderWeapon.normalDamage);
      if (side === 'attacker') { aWounds = Math.max(0, aWounds - w); log(`#${step} ${sideName} 出击(${type}) → 对 ${s.defender.name} 造成 ${w}（剩 ${aWounds}）`); }
      else { dWounds = Math.max(0, dWounds - w); log(`#${step} ${sideName} 出击(${type}) → 对 ${s.attacker.name} 造成 ${w}（剩 ${dWounds}）`); }
    }
    turn = (turn === 'attacker' ? 'defender' : 'attacker');
  }

  hr();
  log('【最终结果】');
  log(`攻方 ${s.attacker.name} 剩余耐伤: ${dWounds}/${dStart}`);
  log(`反方 ${s.defender.name} 剩余耐伤: ${aWounds}/${aStart}`);
  log(JSON.stringify({
    attackerWoundsRemaining: dWounds,
    defenderWoundsRemaining: aWounds,
    attackerDamageTaken: dStart - dWounds,
    defenderDamageTaken: aStart - aWounds,
  }, null, 2));
}

// ─── CLI ──────────────────────────────────────────────────────────────────
const file = process.argv[2];
if (!file) {
  console.error('用法: node tools/combat-checker.js <scenario.json>');
  console.error('示例见 tools/examples/*.json');
  process.exit(1);
}
const scenario = JSON.parse(readFileSync(file, 'utf8'));
// 输入回显
console.log('╔════════════ 输入场景 ════════════╗');
console.log(JSON.stringify(scenario, null, 2));
console.log('╚══════════════════════════════════╝');
if (scenario.type === 'shoot') runShoot(scenario);
else if (scenario.type === 'melee') runMelee(scenario);
else { console.error(`未知 scenario.type: ${scenario.type}（需 'shoot' 或 'melee'）`); process.exit(1); }

/* ───────────────────────────────────────── EXAMPLES ─────────────────────────
# 射击（含不屈 + 瘟疫 DR）
{
  "type": "shoot",
  "attacker": {"name":"Legionary","faction":"legionaries","apl":2},
  "defender": {
    "name":"Plague Marine","faction":"plague_marines","df":3,"sv":3,"wounds":8,
    "indomitable": false,
    "disgustinglyResilient": true
  },
  "weapon": {"name":"Boltgun","attacks":4,"bs":3,"normalDamage":1,"criticalDamage":2},
  "attackDice": [6,5,4,1],
  "defenseDice": [5,2,1],
  "inCover": true,
  "drRolls": [4,6],
  "perAttackDamage": [2,2]   // 可选：拆成逐颗攻击骰伤害，便于 DR 逐颗结算
}

# 近战（出击/格挡序列）
{
  "type": "melee",
  "attacker": {"name":"Assault","faction":"angels_of_death","wounds":8},
  "defender": {"name":"Cultist","faction":"legionaries","wounds":6},
  "attackerWeapon": {"name":"Chainsword","bs":3,"normalDamage":3,"criticalDamage":4},
  "defenderWeapon": {"name":"Knife","bs":4,"normalDamage":1,"criticalDamage":2},
  "attackerDice": [6,4,2],
  "defenderDice": [5,3],
  "attackerActions": ["strike","strike"],
  "defenderActions": ["parry"]
}
└─────────────────────────────────────────────────────────────────────────── */
