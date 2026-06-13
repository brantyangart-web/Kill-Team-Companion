import { Weapon } from './models.js';

// ==========================================
//   Kill Team 2024 官方数据 — Angels of Death
//   数据来源: kt_team_rules_angels_of_death
// ==========================================

const SM_TEMPLATES = [
  // --- LEADER 选项 ---
  { id: 'sm_1', name: 'Space Marine Captain (SM 船长)', wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 6,
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
          <p style="margin-top:6px;"><b>冲锋移动距离:</b> 4⚪ (即 8 英寸)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 当你想要近身与敌方搏斗时使用。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>冲锋移动结束时，该特工<b>必须</b>进入某个敌方特工的交战距离（1 英寸内）。</li>
            <li>如果本回合该特工已经执行过【移动】或【射击】动作，则<b>不能</b>执行冲锋。</li>
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
          <p style="margin-top:6px;"><b>移动距离:</b> 角色移动值 <b>×2</b> (即 12 英寸)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 需要最快速度穿越战场时使用。同时也是唯一能让 <b>Heavy (Dash only)</b> 武器开火的方式。</p>
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
          <p><b>行动点消耗:</b> 1 APL</p>
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
  }
};

export { SM_TEMPLATES, PM_TEMPLATES, RULE_TEXTS };
