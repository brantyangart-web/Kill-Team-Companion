import { Weapon } from './models.js';

// ==========================================
//   Kill Team 2024 官方数据 — Angels of Death
//   数据来源: kt_team_rules_angels_of_death
// ==========================================

const SM_TEMPLATES = [
  // --- LEADER 选项 ---
  { id: 'sm_1', name: 'Space Marine Captain (SM 队长)', wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_captain.png',
    weapons: [
      new Weapon('Master-crafted Bolt Rifle (精铸爆弹步枪)', 4, 3, 4, 5, true, 24, ['Indirect Fire']),
      new Weapon('Relic Blade (遗物利刃)', 5, 3, 5, 6, false, null, ['Severe'])
    ]
  },
  { id: 'sm_2', name: 'Assault Intercessor Sergeant (突击军士)', wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_sergeant.png',
    weapons: [
      new Weapon('Hand Flamer (手持火焰喷射器)', 4, 2, 3, 3, true, 6, ['Saturate', 'Torrent 1"']),
      new Weapon('Chainsword (链锯剑)', 5, 3, 4, 5, false, null, [])
    ]
  },
  { id: 'sm_3', name: 'Intercessor Sergeant (战术军士)', wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_sergeant.png',
    weapons: [
      new Weapon('Bolt Rifle (爆弹步枪)', 4, 3, 3, 4, true, null, ['Piercing Crits 1']),
      new Weapon('Chainsword (链锯剑)', 4, 3, 4, 5, false, null, [])
    ]
  },

  // --- OPERATOR 选项 (5选, 除 Warrior 外不可重复) ---
  { id: 'sm_4', name: 'Eliminator Sniper (Eliminator 狙击手)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_sniper.png',
    weapons: [
      new Weapon('Bolt Sniper Rifle (爆弹狙击步枪)', 4, 2, 3, 4, true, null, ['Heavy (Dash only)', 'Saturate', 'Seek Light', 'Silent']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  },
  { id: 'sm_5', name: 'Heavy Intercessor Gunner (重型火力手)', wounds: 18, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/sm/sm_heavy_gunner.png',
    weapons: [
      new Weapon('Heavy Bolter (重型爆弹枪)', 5, 3, 4, 5, true, null, ['Piercing Crits 1']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  },
  { id: 'sm_8', name: 'Intercessor Gunner (战术火力手)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_warrior_b.png',
    weapons: [
      new Weapon('Auto Bolt Rifle (自动爆弹步枪)', 4, 3, 3, 4, true, null, ['Torrent 1"']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  },
  { id: 'sm_6', name: 'Assault Intercessor Warrior (突击战士)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, isWarrior: true, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_assault.png',
    weapons: [
      new Weapon('Heavy Bolt Pistol (重型爆弹手枪)', 4, 3, 3, 4, true, 8, ['Piercing Crits 1']),
      new Weapon('Chainsword (链锯剑)', 5, 3, 4, 5, false, null, [])
    ]
  },
  { id: 'sm_7', name: 'Intercessor Warrior (战术战士)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, isWarrior: true, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_warrior_a.png',
    weapons: [
      new Weapon('Bolt Rifle (爆弹步枪)', 4, 3, 3, 4, true, null, ['Piercing Crits 1']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  }
];

// ======================================================
//   Kill Team 2024 官方数据 — Plague Marines (瘟疫守卫)
//   数据来源: kt_team_rules_plague_marines
// ======================================================

const PM_TEMPLATES = [
  // --- LEADER ---
  { id: 'pm_1', name: 'Plague Marine Champion (瘟疫冠军)', wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_champion.png',
    weapons: [
      new Weapon('Plague Sword (瘟疫之剑)', 5, 3, 4, 5, false, null, ['Severe', 'Poison', 'Toxic'])
    ]
  },

  // --- OPERATOR 选项 (6选5, Warrior 可复选) ---
  { id: 'pm_2', name: 'Malignant Plaguecaster (恶性瘟疫术士)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_caster.png',
    weapons: [
      new Weapon('Entropy (熵能术)', 4, 3, 3, 7, true, 7, ['PSYCHIC', 'Saturate', 'Severe', 'Poison']),
      new Weapon('Plague Wind (瘟疫之风)', 6, 3, 2, 3, true, null, ['PSYCHIC', 'Saturate', 'Severe', 'Torrent 1"', 'Poison']),
      new Weapon('Corrupted Staff (腐蚀法杖)', 4, 3, 3, 4, false, null, ['PSYCHIC', 'Severe', 'Shock', 'Stun', 'Poison'])
    ]
  },
  { id: 'pm_3', name: 'Plague Marine Bombardier (瘟疫掷弹兵)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_gunner.png',
    weapons: [
      new Weapon('Boltgun (爆弹枪)', 4, 3, 3, 4, true, null, ['Toxic']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  },
  { id: 'pm_4', name: 'Plague Marine Fighter (瘟疫搏击手)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_fighter.png',
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Flail of Corruption (腐化之链枷)', 5, 3, 4, 5, false, null, ['Brutal', 'Severe', 'Shock', 'Poison'])
    ]
  },
  { id: 'pm_5', name: 'Plague Marine Heavy Gunner (瘟疫重炮手)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_heavy.png',
    weapons: [
      new Weapon('Plague Spewer (瘟疫喷射器)', 5, 2, 3, 3, true, 7, ['Saturate', 'Severe', 'Torrent 2"', 'Poison']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  },
  { id: 'pm_6', name: 'Plague Marine Icon Bearer (瘟疫圣像手)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_icon.png',
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Plague Knife (瘟疫匕首)', 5, 3, 3, 4, false, null, ['Severe', 'Poison'])
    ]
  },
  { id: 'pm_7', name: 'Plague Marine Warrior (瘟疫战士)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, isWarrior: true, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_warrior.png',
    weapons: [
      new Weapon('Boltgun (爆弹枪)', 4, 3, 3, 4, true, null, ['Toxic']),
      new Weapon('Plague Knife (瘟疫匕首)', 4, 3, 3, 4, false, null, ['Severe', 'Poison'])
    ]
  }
];

// ==========================================
//           游戏规则文本
// ==========================================

const RULE_TEXTS = {
  move: {
    title: '🏃 移动 (Normal Move) 规则帮助',
    body: `
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>基本移动距离:</b> 3⚪ (即 6 英寸)。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>不能移入任何敌方特工的<b>交战距离</b>（即敌方 1 英寸范围内）。</li>
            <li>如果本回合该特工已经执行过【冲锋 (Charge)】动作，则<b>不能</b>执行移动。</li>
          </ul>
        `
  },
  charge: {
    title: '⚡ 冲锋 (Charge Move) 规则帮助',
    body: `
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>冲锋移动距离:</b> 移动值 + 2" (即 8 英寸)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 当你想要近身与敌方搏斗时使用。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>冲锋移动结束时，该特工<b>必须</b>进入某个敌方特工的交战距离（1 英寸内）。</li>
            <li>如果本回合该特工已经执行过【移动】或【射击】动作，则<b>不能</b>执行冲锋。</li>
            <li>冲锋后<b>不能再射击</b>（已贴脸）。</li>
          </ul>
        `
  },
  shoot: {
    title: '💥 射击 (Shoot Action) 规则帮助',
    body: `
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>基本射击流程:</b></p>
          <ol style="margin-left:16px;">
            <li>选择ranged武器与射击目标。</li>
            <li><b>遮蔽判定:</b> 对方在隐蔽(Conceal)且在掩体(Cover)中时无法被作为射击目标。</li>
            <li><b>顺序掷骰:</b> 攻击方投 attacks 个骰子，BS以上命中，6为暴击。</li>
            <li><b>防守重组:</b> 防守方若是处于掩体中可直接保留1个普通成功，投剩下的DF防御骰。</li>
            <li><b>格挡抵消:</b> Saves 抵消 Hits，未被阻拦的命中转化为普通/暴击伤害扣除。</li>
          </ol>
        `
  },
  fight: {
    title: '⚔️ 近战搏斗 (Fight Action) 规则帮助',
    body: `
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>基本近战流程:</b></p>
          <ul>
            <li>双方必须处于<b>1 英寸交战距离内</b>。</li>
            <li><b>双骰同投:</b> 双方使用近战武器同时投骰。</li>
            <li><b>交替打击/招架:</b> 攻击方先发挑骰：
              <ul>
                <li><b>Strike (打击)</b>: 扣减对方对应伤害，对方立即扣血，触发DR。</li>
                <li><b>Parry (招架)</b>: 招架对方一颗骰子（普通招架普通，暴击招架暴击或普通），令其失效。</li>
              </ul>
            </li>
            <li>之后轮到防守方挑骰，直至分完或一方阵亡。</li>
          </ul>
        `
  },
  advance: {
    title: '🏃💨 前进 (Advance) 规则帮助',
    body: `
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>移动距离:</b> 角色移动值 <b>+3"</b> (即 9 英寸)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 需要快速移动到掩体或有利位置时使用。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>前进后<b>不能再射击或近战</b>。</li>
            <li>如果本回合该特工已经执行过任意移动/冲锋/前进/冲刺/撤退，则<b>不能</b>执行前进。</li>
          </ul>
        `
  },
  dash: {
    title: '💨💨 冲刺 (Dash) 规则帮助',
    body: `
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>移动距离:</b> 固定 <b>3"</b> (lite 规则，且不能攀爬)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 需要快速穿越战场时使用。同时也是唯一能让 <b>Heavy (Dash only)</b> 武器开火的方式。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>冲刺后<b>不能再射击或近战</b>（Heavy (Dash only) 武器例外：Dash 后可以射击）。</li>
            <li>如果本回合该特工已经执行过任意移动/冲锋/前进/冲刺/撤退，则<b>不能</b>执行冲刺。</li>
          </ul>
        `
  },
  fallback: {
    title: '🔙 撤退 (Fall Back) 规则帮助',
    body: `
          <p><b>行动点消耗:</b> 2 APL</p>
          <p style="margin-top:6px;"><b>移动距离:</b> 角色正常移动值 (6 英寸)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 脱离当前交战（敌方 1 英寸范围内），避免被近战缠住。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>撤退移动必须<b>远离所有敌人</b>，结束时不能在任何敌方特工的交战距离内。</li>
            <li>撤退后<b>不能再射击或近战</b>。</li>
            <li>如果本回合该特工已经执行过任意移动/冲锋/前进/冲刺/撤退，则<b>不能</b>执行撤退。</li>
          </ul>
        `
  },
  mission: {
    title: '🎯 任务类型 (Mission Type) 规则帮助',
    body: `
          <p style="margin-top:6px;">KT2024 提供多种任务类型，每种任务对应不同的胜利条件和目标得分点。请在部署前选择本局任务。</p>
          <p style="margin-top:8px;"><b>🏁 夺取阵地 (Seize Ground):</b></p>
          <ul>
            <li>战场上布置 3 个目标点（通常为中心 + 两翼）。</li>
            <li>每回合结束：控制 1 个目标 +1 VP；控制目标多于对手 +1 VP；控制所有目标 +1 VP。</li>
          </ul>
          <p style="margin-top:8px;"><b>📦 物资回收 (Recovery):</b></p>
          <ul>
            <li>战场上散布遗物/情报标记。特工必须处于标记 1" 内才能拾取。</li>
            <li>携带遗物的特工回到己方部署区即完成回收，获得 VP。</li>
            <li>携带遗物的特工阵亡时，遗物掉落于原地。</li>
          </ul>
          <p style="margin-top:8px;"><b>⚔️ 突破防线 (Breakthrough):</b></p>
          <ul>
            <li>每回合结束时，统计位于敌方部署区内的己方特工数量。</li>
            <li>1 名特工进入敌方部署区 +1 VP；2 名以上 +1 VP；控制区内目标 +1 VP。</li>
          </ul>
          <p style="margin-top:8px;"><b>🛠️ 自定义 (Custom):</b> 根据自定规则勾选得分条件。</p>
        `
  },
  brutal: {
    title: '🔥 残暴 (Brutal) 武器规则帮助',
    body: `
          <p><b>规则类型:</b> 近战武器关键字</p>
          <p style="margin-top:6px;"><b>效果:</b> 你的对手<b>只能用暴击骰(6点)</b>进行格挡 (Parry)。</p>
          <p style="margin-top:6px;"><b>适用阶段:</b> 近战搏斗 (Fight) 的骰子分配阶段。</p>
          <p style="margin-top:6px;"><b>规则说明:</b></p>
          <ul>
            <li>当你使用带 Brutal 关键字的武器发起近战时，对方在格挡 (Parry) 你的攻击骰时，必须使用<b>暴击骰(6)</b>。</li>
            <li>如果对方没有剩余的暴击骰，则无法格挡，你的攻击骰将全部造成打击 (Strike) 伤害。</li>
            <li>此规则<b>不影响</b>打击 (Strike) 选择，也不影响远程射击阶段。</li>
            <li>如果双方武器都带 Brutal，效果叠加：双方都只能用暴击骰格挡。</li>
          </ul>
        `
  },
  severe: {
    title: '⚠️ 严重 (Severe) 武器规则帮助',
    body: `
          <p><b>规则类型:</b> 保留阶段关键字</p>
          <p style="margin-top:6px;"><b>效果:</b> 如果你没有保留任何暴击成功，你可以将 1 个普通成功升级为暴击成功。</p>
          <p style="margin-top:6px;"><b>适用阶段:</b> 攻击骰保留阶段（投骰后、防御前）。</p>
          <p style="margin-top:6px;"><b>规则说明:</b></p>
          <ul>
            <li>触发条件：保留的暴击骰数量 = 0 且普通成功骰 ≥ 1。</li>
            <li>升级后：1 个普通成功 → 1 个暴击成功（造成暴击伤害）。</li>
            <li>与 Rending 互斥：Severe 触发后，Punishing 和 Rending 不生效。</li>
            <li>Devastating 和 Piercing Crits 仍然生效。</li>
          </ul>
        `
  },
  saturate: {
    title: '🔥 饱和 (Saturate) 武器规则帮助',
    body: `
          <p><b>规则类型:</b> 防御阶段关键字</p>
          <p style="margin-top:6px;"><b>效果:</b> 防御方<b>不能保留掩体骰</b>。</p>
          <p style="margin-top:6px;"><b>适用阶段:</b> 防御骰计算阶段。</p>
          <p style="margin-top:6px;"><b>规则说明:</b></p>
          <ul>
            <li>掩体提供的加成（+1 DF 骰、1 个自动普通成功）被完全移除。</li>
            <li>防御方只能依赖投出的防御骰（SV 判定）。</li>
            <li>即使目标在掩体中，也不会获得任何掩体保护。</li>
          </ul>
        `
  },
  stun: {
    title: '💫 震慑 (Stun) 武器规则帮助',
    body: `
          <p><b>规则类型:</b> 保留阶段触发关键字</p>
          <p style="margin-top:6px;"><b>效果:</b> 如果你保留了任何暴击成功，目标的 APL -1，直到其下一次激活结束。</p>
          <p style="margin-top:6px;"><b>适用阶段:</b> 攻击骰保留后（射击或近战）。</p>
          <p style="margin-top:6px;"><b>规则说明:</b></p>
          <ul>
            <li>触发条件：保留的暴击骰数量 ≥ 1。</li>
            <li>效果：目标特工的 APL（行动点）-1，持续到其下一次激活结束。</li>
            <li>适用于远程射击和近战。</li>
            <li>每次攻击序列只触发一次。</li>
          </ul>
        `
  },
  shock: {
    title: '⚡ 冲击 (Shock) 武器规则帮助',
    body: `
          <p><b>规则类型:</b> 近战关键字</p>
          <p style="margin-top:6px;"><b>效果:</b> 每次序列中第一次暴击打击时，丢弃对手 1 个未解决的普通成功（或暴击成功，若无普通）。</p>
          <p style="margin-top:6px;"><b>适用阶段:</b> 近战搏斗 (Fight) 的打击 (Strike) 阶段。</p>
          <p style="margin-top:6px;"><b>规则说明:</b></p>
          <ul>
            <li>触发条件：使用暴击骰进行打击 (Strike)，且本序列尚未触发过 Shock。</li>
            <li>效果：丢弃对手 1 个未使用的普通成功骰；若无普通，则丢弃 1 个暴击成功骰。</li>
            <li>每次近战序列只触发一次（第一次暴击打击）。</li>
            <li>仅适用于近战，不适用于远程射击。</li>
          </ul>
        `
  },
  lethal: {
    title: '💀 致命 (Lethal) 武器规则帮助',
    body: `
          <p><b>规则类型:</b> 攻击骰关键字</p>
          <p style="margin-top:6px;"><b>效果:</b> N+ 视为暴击成功（不仅是 6）。</p>
          <p style="margin-top:6px;"><b>适用阶段:</b> 攻击骰结算阶段。</p>
          <p style="margin-top:6px;"><b>规则说明:</b></p>
          <ul>
            <li>Lethal 5+ 表示 5 和 6 都视为暴击成功。</li>
            <li>Lethal 4+ 表示 4、5、6 都视为暴击成功。</li>
            <li>默认暴击阈值仍然是 6（如果没有 Lethal 关键字）。</li>
            <li>与 Piercing Crits 和 Devastating 叠加生效。</li>
          </ul>
        `
  },
  devastating: {
    title: '💥 毁灭 (Devastating) 武器规则帮助',
    body: `
          <p><b>规则类型:</b> 伤害计算关键字</p>
          <p style="margin-top:6px;"><b>效果:</b> 暴击命中立即额外造成 N 点伤害。</p>
          <p style="margin-top:6px;"><b>适用阶段:</b> 伤害计算阶段（匹配对消后）。</p>
          <p style="margin-top:6px;"><b>规则说明:</b></p>
          <ul>
            <li>Devastating 2 表示每个暴击命中额外 +2 伤害。</li>
            <li>额外伤害加在暴击伤害上（例如：暴击伤害 3 + Devastating 2 = 5）。</li>
            <li>可带距离前缀（如 1" Devastating 3），表示 AoE 范围。</li>
            <li>仅对暴击命中的攻击生效，普通命中不享受额外伤害。</li>
          </ul>
        `
  },
  piercing: {
    title: '🔥 穿透 (Piercing) 武器规则帮助',
    body: `
          <p><b>规则类型:</b> 防御阶段关键字</p>
          <p style="margin-top:6px;"><b>效果:</b> 防御骰池减少 N 点。</p>
          <p style="margin-top:6px;"><b>适用阶段:</b> 防御骰计算阶段。</p>
          <p style="margin-top:6px;"><b>规则说明:</b></p>
          <ul>
            <li>Piercing 2 表示防御方的 DF 骰池 -2。</li>
            <li>DF 骰池最低为 0（不会变成负数）。</li>
            <li>与 Piercing Crits 不同：Piercing 对所有命中生效，Piercing Crits 仅对暴击生效。</li>
            <li>多个 Piercing 效果叠加。</li>
          </ul>
        `
  },
  hot: {
    title: '🔥 过热 (Hot) 武器规则帮助',
    body: `
          <p><b>规则类型:</b> 使用后反噬关键字</p>
          <p style="margin-top:6px;"><b>效果:</b> 使用后投 D6，若结果 < 武器的 Hit 值，攻击方受到 结果 × 2 点伤害。</p>
          <p style="margin-top:6px;"><b>适用阶段:</b> 攻击结算完成后。</p>
          <p style="margin-top:6px;"><b>规则说明:</b></p>
          <ul>
            <li>例如：武器 Hit = 4，投出 3 → 3 < 4 → 攻击方受到 3 × 2 = 6 点伤害。</li>
            <li>例如：武器 Hit = 4，投出 5 → 5 ≥ 4 → 安全，无反噬。</li>
            <li>即使武器多次使用（如 Blast），也只投 1 次反噬骰。</li>
            <li>反噬伤害直接作用于攻击方特工。</li>
          </ul>
        `
  }
};

export { SM_TEMPLATES, PM_TEMPLATES, RULE_TEXTS };
