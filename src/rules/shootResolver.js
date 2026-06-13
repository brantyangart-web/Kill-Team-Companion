import { rollDicePool, evaluateAttackRolls, evaluateDefenseRolls } from './dice.js';

/**
 * Resolves a shooting action step-by-step.
 * 
 * @param {Object} params
 * @param {Agent} params.attacker - Operative initiating the shoot.
 * @param {Agent} params.defender - Operative being targeted.
 * @param {Weapon} params.weapon - Weapon profile being used.
 * @param {boolean} [params.inRangeAndVisible=true] - Q&A: Is the target in range and visible?
 * @param {boolean} [params.inCoverConcealed=false] - Q&A: Is the target concealed behind heavy cover?
 * @param {boolean} [params.inCover=false] - Is the target in cover? (Triggers cover save retention)
 * @param {string} [params.mode='random'] - 'random' (Auto rolls) or 'manual' (Manual inputs)
 * @param {number[]|{criticals: number, normals: number}} [params.manualAttack] - Manual attack dice rolls or counts
 * @param {number[]|{criticals: number, normals: number}} [params.manualDefense] - Manual defense dice rolls or counts
 * @param {number[]} [params.manualDrRolls] - Manual Disgustingly Resilient rolls
 * @param {function} [params.log=console.log] - Logging function
 * @returns {Object} Resolution report summary
 */
export function resolveShooting({
  attacker,
  defender,
  weapon,
  inRangeAndVisible = true,
  inCoverConcealed = false,
  inCover = false,
  mode = 'random',
  manualAttack = null,
  manualDefense = null,
  manualDrRolls = null,
  log = console.log
}) {
  log(`\n========================================`);
  log(`【射击阶段开始】`);
  log(`攻击方: ${attacker.name} (${attacker.faction}) 使用 [${weapon.name}]`);
  log(`防守方: ${defender.name} (${defender.faction})`);
  log(`========================================`);

  // 1. APL 校验与防呆
  log(`[步骤 1] 校验行动点 APL...`);
  if (attacker.apl < 1) {
    log(`❌ 结算中止：${attacker.name} 剩余 APL (${attacker.apl}) 不足以执行射击（需要 1 APL）。`);
    return { success: false, reason: 'INSUFFICIENT_APL' };
  }
  log(`  - 拥有足够 APL. 当前 APL: ${attacker.apl}`);

  // 2. Q&A 判定树
  log(`[步骤 2] 判定目标有效性 (Q&A)...`);
  if (!inRangeAndVisible) {
    log(`❌ 结算中止：目标不在有效视线或射程内。`);
    return { success: false, reason: 'NOT_VISIBLE_OR_OUT_OF_RANGE' };
  }
  log(`  - 确认目标在视线与射程内 [是]`);

  if (inCoverConcealed) {
    log(`❌ 结算中止：目标处于【隐蔽】状态且紧贴重掩体，无法被选为射击目标。`);
    return { success: false, reason: 'TARGET_CONCEALED_IN_COVER' };
  }
  log(`  - 确认目标非重掩体下隐蔽状态 [否]`);

  // 扣除 1 APL
  attacker.apl -= 1;
  log(`[APL扣除] ${attacker.name} 扣除 1 APL，剩余 APL: ${attacker.apl}`);

  // 3. 攻击投骰
  log(`[步骤 3] 攻击投骰结算 (攻击次数 A = ${weapon.attacks}, 命中要求 BS = ${weapon.bs}+)...`);
  let attackCrit = 0;
  let attackNorm = 0;
  let attackMiss = 0;
  let attackRolls = [];

  if (mode === 'manual' && manualAttack) {
    if (Array.isArray(manualAttack)) {
      // 传入了具体的骰子数组
      attackRolls = [...manualAttack];
      const evalResult = evaluateAttackRolls(attackRolls, weapon.bs);
      attackCrit = evalResult.criticals;
      attackNorm = evalResult.normals;
      attackMiss = evalResult.misses;
    } else {
      // 传入了直接的命中统计 { criticals, normals }
      attackCrit = manualAttack.criticals || 0;
      attackNorm = manualAttack.normals || 0;
      attackMiss = Math.max(0, weapon.attacks - (attackCrit + attackNorm));
    }
  } else {
    // 随机掷骰模式
    attackRolls = rollDicePool(weapon.attacks);
    const evalResult = evaluateAttackRolls(attackRolls, weapon.bs);
    attackCrit = evalResult.criticals;
    attackNorm = evalResult.normals;
    attackMiss = evalResult.misses;
  }

  log(`  - 攻击骰子结果: ${attackRolls.length ? `[${attackRolls.join(', ')}]` : '(快速录入模式)'}`);
  log(`  - 命中统计 -> 暴击 (Critical Hits): ${attackCrit}, 普通命中 (Normal Hits): ${attackNorm}, 未命中 (Misses): ${attackMiss}`);

  if (attackCrit + attackNorm === 0) {
    log(`[战斗结束] 没有任何攻击命中，射击流转结束。`);
    return {
      success: true,
      attackerAplRemaining: attacker.apl,
      damageDealt: 0,
      rolls: { attackRolls }
    };
  }

  // 4. 防御骰与掩体结算
  log(`[步骤 4] 防御投骰结算 (防守方 DF = ${defender.df}, 保护要求 SV = ${defender.sv}+)...`);
  let defCrit = 0;
  let defNorm = 0;
  let defFail = 0;
  let defenseRolls = [];
  let dfPoolSize = defender.df;

  if (inCover) {
    log(`  - 🛡️ 防守方处于掩体中！触发【掩体保护机制】：`);
    log(`    1. 自动保留一个普通成功 (Normal Save +1)`);
    log(`    2. 投骰池减少 1 个骰子 (DFPool = ${dfPoolSize} -> ${dfPoolSize - 1})`);
    defNorm += 1;
    dfPoolSize = Math.max(0, dfPoolSize - 1);
  }

  if (mode === 'manual' && manualDefense) {
    if (Array.isArray(manualDefense)) {
      defenseRolls = [...manualDefense];
      const evalResult = evaluateDefenseRolls(defenseRolls, defender.sv);
      defCrit += evalResult.criticals;
      defNorm += evalResult.normals;
      defFail += evalResult.fails;
    } else {
      defCrit += manualDefense.criticals || 0;
      defNorm += manualDefense.normals || 0;
      defFail += Math.max(0, dfPoolSize - (manualDefense.criticals + manualDefense.normals));
    }
  } else {
    if (dfPoolSize > 0) {
      defenseRolls = rollDicePool(dfPoolSize);
      const evalResult = evaluateDefenseRolls(defenseRolls, defender.sv);
      defCrit += evalResult.criticals;
      defNorm += evalResult.normals;
      defFail += evalResult.fails;
    }
  }

  log(`  - 防御骰子结果: ${defenseRolls.length ? `[${defenseRolls.join(', ')}]` : '(快速录入或全额掩体保留)'}`);
  log(`  - 成功防守统计 -> 暴击防守 (Critical Saves): ${defCrit}, 普通防守 (Normal Saves): ${defNorm} (含掩体), 失败防守 (Fails): ${defFail}`);

  // 5. 命中与防守对消逻辑 (Dice Matching)
  log(`[步骤 5] 骰子对消匹配...`);
  let remainingCrits = attackCrit;
  let remainingNorms = attackNorm;
  let remainingCritSaves = defCrit;
  let remainingNormSaves = defNorm;

  log(`  - 对消前: 攻击(暴击:${remainingCrits}, 普通:${remainingNorms}) vs 防御(暴击:${remainingCritSaves}, 普通:${remainingNormSaves})`);

  // 优先级 1: 暴击防守 抵消 暴击命中 (1:1)
  const critWithCrit = Math.min(remainingCrits, remainingCritSaves);
  remainingCrits -= critWithCrit;
  remainingCritSaves -= critWithCrit;
  if (critWithCrit > 0) {
    log(`    -> 用 ${critWithCrit} 个暴击防守抵消了 ${critWithCrit} 个暴击命中。`);
  }

  // 优先级 2: 2个普通防守 抵消 1个暴击命中 (2:1)
  if (remainingCrits > 0 && remainingNormSaves >= 2) {
    const critWithNormPair = Math.min(remainingCrits, Math.floor(remainingNormSaves / 2));
    remainingCrits -= critWithNormPair;
    remainingNormSaves -= critWithNormPair * 2;
    if (critWithNormPair > 0) {
      log(`    -> 用 ${critWithNormPair * 2} 个普通防守抵消了 ${critWithNormPair} 个暴击命中 (2:1)。`);
    }
  }

  // 优先级 3: 普通防守 抵消 普通命中 (1:1)
  const normWithNorm = Math.min(remainingNorms, remainingNormSaves);
  remainingNorms -= normWithNorm;
  remainingNormSaves -= normWithNorm;
  if (normWithNorm > 0) {
    log(`    -> 用 ${normWithNorm} 个普通防守抵消了 ${normWithNorm} 个普通命中。`);
  }

  // 优先级 4: 剩余暴击防守 抵消 普通命中 (1:1)
  if (remainingNorms > 0 && remainingCritSaves > 0) {
    const normWithCrit = Math.min(remainingNorms, remainingCritSaves);
    remainingNorms -= normWithCrit;
    remainingCritSaves -= normWithCrit;
    if (normWithCrit > 0) {
      log(`    -> 用 ${normWithCrit} 个暴击防守抵消了 ${normWithCrit} 个普通命中。`);
    }
  }

  log(`  - 对消后未抵消命中 -> 暴击命中: ${remainingCrits}, 普通命中: ${remainingNorms}`);

  // 6. 伤害计算
  log(`[步骤 6] 结算分配伤害...`);
  const damageFromCrits = remainingCrits * weapon.criticalDamage;
  const damageFromNorms = remainingNorms * weapon.normalDamage;
  const totalIncomingDamage = damageFromCrits + damageFromNorms;

  log(`  - 暴击伤害: ${remainingCrits} * ${weapon.criticalDamage} = ${damageFromCrits}`);
  log(`  - 普通伤害: ${remainingNorms} * ${weapon.normalDamage} = ${damageFromNorms}`);
  log(`  - 即将造成的伤害总计: ${totalIncomingDamage}`);

  // 扣减 defender 生命值
  const actualDamageDealt = defender.applyDamage(totalIncomingDamage, log, manualDrRolls);

  return {
    success: true,
    attackerAplRemaining: attacker.apl,
    incomingDamage: totalIncomingDamage,
    damageDealt: actualDamageDealt,
    defenderWoundsRemaining: defender.wounds,
    rolls: {
      attackRolls,
      defenseRolls
    }
  };
}
