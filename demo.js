import { Agent } from './src/models/agent.js';
import { Weapon } from './src/models/weapon.js';
import { resolveShooting } from './src/rules/shootResolver.js';

// 1. 初始化特工与武器
const spaceMarine = new Agent({
  id: 'sm_1',
  name: '星际战士仲裁者 (Intercessor)',
  faction: 'Space Marine',
  wounds: 14,
  apl: 3,
  df: 3,
  sv: 3,
});

const boltgun = new Weapon({
  name: '爆弹步枪 (Boltgun)',
  attacks: 4,
  bs: 3,
  normalDamage: 3,
  criticalDamage: 4
});

const plagueMarine = new Agent({
  id: 'pm_1',
  name: '瘟疫战士战士 (Plague Marine Warrior)',
  faction: 'Plague Marine',
  wounds: 12,
  apl: 2,
  df: 3,
  sv: 3,
});

function runDemo() {
  console.log('================================================================');
  console.log('          战锤 40K：杀戮小队 (Kill Team) 核心战斗引擎演示');
  console.log('================================================================');

  // ==========================================
  // 场景 1: 开阔地带射击 (随机骰子模式)
  // ==========================================
  console.log('\n--- [场景 1] 开阔地射击（模式 B：数字掷骰） ---');
  spaceMarine.reset();
  plagueMarine.reset();
  
  resolveShooting({
    attacker: spaceMarine,
    defender: plagueMarine,
    weapon: boltgun,
    inRangeAndVisible: true,
    inCoverConcealed: false,
    inCover: false,
    mode: 'random'
  });

  // ==========================================
  // 场景 2: 防呆拦截 - 目标隐蔽且在重掩体中
  // ==========================================
  console.log('\n--- [场景 2] 目标隐蔽在重掩体后 (APL/Q&A 拦截) ---');
  spaceMarine.reset();
  plagueMarine.reset();
  
  resolveShooting({
    attacker: spaceMarine,
    defender: plagueMarine,
    weapon: boltgun,
    inRangeAndVisible: true,
    inCoverConcealed: true, // Q&A 判定：目标被隐蔽且在重掩体中
    inCover: true,
    mode: 'random'
  });

  // ==========================================
  // 场景 3: 掩体射击 - 目标在掩体中但非隐蔽 (触发掩体自动保留 Normal Save)
  // ==========================================
  console.log('\n--- [场景 3] 目标在掩体中但处于交火状态 (触发掩体成功保留) ---');
  spaceMarine.reset();
  plagueMarine.reset();
  
  resolveShooting({
    attacker: spaceMarine,
    defender: plagueMarine,
    weapon: boltgun,
    inRangeAndVisible: true,
    inCoverConcealed: false,
    inCover: true, // 处于掩体
    mode: 'random'
  });

  // ==========================================
  // 场景 4: 物理骰录入模式 (模式 A - 模拟精确骰值)
  // ==========================================
  console.log('\n--- [场景 4] 物理掷骰数据录入（模式 A：物理掷骰与防守对消） ---');
  spaceMarine.reset();
  plagueMarine.reset();

  // 模拟设定骰子值：
  // 攻击方投出: [6, 4, 3, 2] -> 1 暴击 (6), 2 普通 (4, 3), 1 未命中 (2)
  // 防守方投出: [5, 2] （因为无掩体投 3 颗，这里我们传入 3 颗的结果，比如 [5, 5, 2]）
  //            [5, 5, 2] -> 2 普通防守 (5, 5), 1 失败防守 (2)
  // 对消规则:
  // - 1 暴击命中 vs 0 暴击防守, 2 普通命中 vs 2 普通防守
  // - 防御方决定用 2 个普通防守对消 1 个暴击命中（因为暴击伤害是 4，普通伤害是 3；对消暴击更划算，剩下 2 个普通命中总共 6 点伤害）。
  // - 剩下 2 个普通命中未被对消，造成 6 点伤害。
  // - 瘟疫战士受 6 点伤害触发 Disgustingly Resilient 6 次投骰。
  //   录入 DR 投骰: [6, 2, 5, 3, 4, 1] -> 6, 5 成功免除 2 点伤害，扣除 4 点生命值。
  resolveShooting({
    attacker: spaceMarine,
    defender: plagueMarine,
    weapon: boltgun,
    inRangeAndVisible: true,
    inCoverConcealed: false,
    inCover: false,
    mode: 'manual',
    manualAttack: [6, 4, 3, 2],
    manualDefense: [5, 5, 2],
    manualDrRolls: [6, 2, 5, 3, 4, 1]
  });

  console.log('\n================================================================');
  console.log('                        演示完成！');
  console.log('================================================================');
}

runDemo();
