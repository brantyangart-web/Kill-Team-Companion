import { Weapon } from './models.js';

// ==========================================
//   Kill Team 2024 官方数据 — Angels of Death
//   数据来源: kt_team_rules_angels_of_death
// ==========================================

const SM_TEMPLATES = [
  // --- LEADER 选项 ---
  { id: 'sm_1', name: 'Space Marine Captain (星际战士连长)', operativeType: 'sm_captain',
    wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_captain.jpg',
    abilities: ['ironHalo', 'heroicLeader'],
    weapons: [
      new Weapon('Plasma Pistol (standard) (等离子手枪 - 标准)', 4, 3, 3, 5, true, 8, ['Piercing 1']),
      new Weapon('Plasma Pistol (supercharge) (等离子手枪 - 超载)', 4, 3, 4, 5, true, 8, ['Hot', 'Lethal 5+', 'Piercing 1']),
      new Weapon('Power Fist (动力拳套)', 5, 3, 5, 7, false, null, ['Brutal'])
    ]
  },
  { id: 'sm_2', name: 'Assault Intercessor Sergeant (突击仲裁者军士)', operativeType: 'sm_assault_sergeant',
    wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_sergeant.jpg',
    weapons: [
      new Weapon('Hand Flamer (手持火焰喷射器)', 4, 2, 3, 3, true, 6, ['Saturate', 'Torrent 1"']),
      new Weapon('Chainsword (链锯剑)', 5, 3, 4, 5, false, null, [])
    ]
  },
  { id: 'sm_3', name: 'Intercessor Sergeant (仲裁者军士)', operativeType: 'sm_intercessor_sergeant',
    wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_sergeant.jpg',
    weapons: [
      new Weapon('Bolt Rifle (爆弹步枪)', 4, 3, 3, 4, true, null, ['Piercing Crits 1']),
      new Weapon('Chainsword (链锯剑)', 4, 3, 4, 5, false, null, [])
    ]
  },

  // --- OPERATOR 选项 (5选, 除 Warrior 外不可重复) ---
  { id: 'sm_4', name: 'Eliminator Sniper (歼灭者狙击手)', operativeType: 'sm_eliminator_sniper',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_sniper.jpg',
    abilities: ['optics', 'camoCloak'],
    weapons: [
      new Weapon('Bolt Sniper Rifle (爆弹狙击步枪)', 4, 2, 3, 4, true, null, ['Heavy (Dash only)', 'Saturate', 'Seek Light', 'Silent']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  },
  { id: 'sm_5', name: 'Heavy Intercessor Gunner (重装仲裁者炮手)', operativeType: 'sm_heavy_gunner',
    wounds: 18, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/sm/sm_heavy_gunner.jpg',
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Heavy Bolter (focused) (重型爆弹枪 - 聚焦)', 5, 3, 4, 5, true, null, ['Piercing Crits 1']),
      new Weapon('Heavy Bolter (sweeping) (重型爆弹枪 - 扫射)', 4, 3, 4, 5, true, null, ['Piercing Crits 1', 'Torrent 1"']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  },
  { id: 'sm_8', name: 'Intercessor Gunner (仲裁者炮手)', operativeType: 'sm_intercessor_gunner',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_warrior_b.jpg',
    weapons: [
      new Weapon('Auto Bolt Rifle (自动爆弹步枪)', 4, 3, 3, 4, true, null, ['Torrent 1"']),
      new Weapon('Auxiliary Grenade Launcher (frag) (破片榴弹发射器)', 4, 3, 2, 4, true, null, ['Blast 2"']),
      new Weapon('Auxiliary Grenade Launcher (krak) (穿甲榴弹发射器)', 4, 3, 4, 5, true, null, ['Piercing 1']),
      new Weapon('Bolt Rifle (爆弹步枪)', 4, 3, 3, 4, true, null, ['Piercing Crits 1']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  },
  { id: 'sm_9', name: 'Assault Intercessor Grenadier (突击掷弹兵)', operativeType: 'sm_assault_grenadier',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_assault.jpg',
    abilities: ['grenadier'],
    weapons: [
      new Weapon('Heavy Bolt Pistol (重型爆弹手枪)', 4, 3, 3, 4, true, 8, ['Piercing Crits 1']),
      new Weapon('Chainsword (链锯剑)', 5, 3, 4, 5, false, null, [])
    ]
  },
  { id: 'sm_6', name: 'Assault Intercessor Warrior (突击仲裁者战士)', operativeType: 'sm_assault_warrior',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, isWarrior: true, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_assault.jpg',
    weapons: [
      new Weapon('Heavy Bolt Pistol (重型爆弹手枪)', 4, 3, 3, 4, true, 8, ['Piercing Crits 1']),
      new Weapon('Chainsword (链锯剑)', 5, 3, 4, 5, false, null, [])
    ]
  },
  { id: 'sm_7', name: 'Intercessor Warrior (仲裁者战士)', operativeType: 'sm_intercessor_warrior',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, isWarrior: true, move: 6,
    defaultAvatar: './assets/images/operatives/sm/sm_warrior_a.jpg',
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
  { id: 'pm_1', name: 'Plague Marine Champion (瘟疫战士勇士)', operativeType: 'pm_champion',
    wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_champion.jpg',
    abilities: ['grandfathersBlessing'],
    weapons: [
      new Weapon('Plasma Pistol (standard) (等离子手枪 - 标准)', 4, 3, 3, 5, true, 8, ['Piercing 1']),
      new Weapon('Plasma Pistol (supercharge) (等离子手枪 - 过载)', 4, 3, 4, 5, true, 8, ['Hot', 'Lethal 5+', 'Piercing 1']),
      new Weapon('Plague Sword (瘟疫之剑)', 5, 3, 4, 5, false, null, ['Severe', 'Poison', 'Toxic'])
    ]
  },

  // --- OPERATOR 选项 (6选5, Warrior 可复选) ---
  { id: 'pm_2', name: 'Malignant Plaguecaster (恶瘟投放者)', operativeType: 'pm_plaguecaster',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_caster.jpg',
    weapons: [
      new Weapon('Entropy (熵能术)', 4, 3, 3, 7, true, 7, ['PSYCHIC', 'Saturate', 'Severe', 'Poison']),
      new Weapon('Plague Wind (瘟疫之风)', 6, 3, 2, 3, true, null, ['PSYCHIC', 'Saturate', 'Severe', 'Torrent 1"', 'Poison']),
      new Weapon('Corrupted Staff (腐蚀法杖)', 4, 3, 3, 4, false, null, ['PSYCHIC', 'Severe', 'Shock', 'Stun', 'Poison'])
    ]
  },
  { id: 'pm_3', name: 'Plague Marine Bombardier (瘟疫战士掷弹兵)', operativeType: 'pm_bombardier',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_gunner.jpg',
    weapons: [
      new Weapon('Boltgun (爆弹枪)', 4, 3, 3, 4, true, null, ['Toxic']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  },
  { id: 'pm_4', name: 'Plague Marine Fighter (瘟疫战士斗士)', operativeType: 'pm_fighter',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_fighter.jpg',
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Flail of Corruption (腐化之链枷)', 5, 3, 4, 5, false, null, ['Brutal', 'Severe', 'Shock', 'Poison'])
    ]
  },
  { id: 'pm_5', name: 'Plague Marine Heavy Gunner (瘟疫战士重炮手)', operativeType: 'pm_heavy_gunner',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_heavy.jpg',
    weapons: [
      new Weapon('Plague Spewer (瘟疫喷射器)', 5, 2, 3, 3, true, 7, ['Saturate', 'Severe', 'Torrent 2"', 'Poison']),
      new Weapon('Fists (铁拳)', 4, 3, 3, 4, false, null, [])
    ]
  },
  { id: 'pm_6', name: 'Plague Marine Icon Bearer (瘟疫战士持徽手)', operativeType: 'pm_icon_bearer',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_icon.jpg',
    abilities: ['iconOfContagion'],
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Plague Knife (瘟疫匕首)', 5, 3, 3, 4, false, null, ['Severe', 'Poison'])
    ]
  },
  { id: 'pm_7', name: 'Plague Marine Warrior (瘟疫战士士兵)', operativeType: 'pm_warrior',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, isWarrior: true, move: 5,
    defaultAvatar: './assets/images/operatives/pm/pm_warrior.jpg',
    abilities: ['repulsiveFortitude'],
    weapons: [
      new Weapon('Boltgun (爆弹枪)', 4, 3, 3, 4, true, null, ['Toxic']),
      new Weapon('Plague Knife (瘟疫匕首)', 4, 3, 3, 4, false, null, ['Severe', 'Poison'])
    ]
  }
];

// ======================================================
//   Kill Team 2024 官方数据 — Legionaries (黑军团)
//   数据来源: kt_legionaries 官方规则文档
//   武器规则: 每个特工列出 2 把默认武器，其他选项见注释
// ======================================================

const LEG_TEMPLATES = [
  // --- LEADER 选项 (2 选 1) ---

  // 官方武器全选项:
  //   Plasma pistol (standard)  4/3+/3/5  Range 8", Piercing 1
  //   Plasma pistol (supercharge) 4/3+/4/5  Range 8", Hot, Lethal 5+, Piercing 1
  //   Tainted bolt pistol  4/3+/3/5  Range 8", Rending
  //   Power fist  5/4+/5/7  Brutal
  //   Power maul  5/3+/4/6  Shock
  //   Power weapon  5/3+/4/6  Lethal 5+
  //   Tainted chainsword  5/3+/4/5  Rending
  // 特殊能力 (TODO): In the Eyes of the Gods — 每次激活击杀敌人后 APL +1 直到该激活结束
  { id: 'leg_1', name: 'Aspiring Champion (军团野心勇士)', operativeType: 'leg_champion',
    wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 6,
    defaultAvatar: './assets/images/operatives/leg/leg_1_champion.jpg',
    abilities: ['eyeOfTheGods'],
    weapons: [
      new Weapon('Plasma Pistol (等离子手枪)', 4, 3, 3, 5, true, 8, ['Piercing 1']),
      new Weapon('Power Fist (动力拳套)', 5, 4, 5, 7, false, null, ['Brutal'])
    ]
  },

  // 官方武器全选项:
  //   Plasma pistol (standard)  4/3+/3/5  Range 8", Piercing 1
  //   Plasma pistol (supercharge) 4/3+/4/5  Range 8", Hot, Lethal 5+, Piercing 1
  //   Tainted bolt pistol  4/3+/3/5  Range 8", Rending
  //   Daemon blade  5/3+/4/7  Lethal 5+
  // 特殊能力 (TODO):
  //   Daemonic Aura — 敌人于控制范围内退却时可掷骰 3+ 阻止
  //   Soul Gorge — 近战击杀后恢复 D3+1 伤口
  { id: 'leg_2', name: 'Chosen (军团神选者)', operativeType: 'leg_chosen',
    wounds: 15, apl: 3, df: 3, sv: 3, isLeader: true, move: 6,
    defaultAvatar: './assets/images/operatives/leg/leg_apostate.jpg',
    weapons: [
      new Weapon('Plasma Pistol (等离子手枪)', 4, 3, 3, 5, true, 8, ['Piercing 1']),
      new Weapon('Daemon Blade (恶魔之刃)', 5, 3, 4, 7, false, null, ['Lethal 5+'])
    ]
  },

  // --- OPERATOR 选项 (8 选 7, Warrior 可复选) ---

  // 官方武器: Bolt Pistol 4/3+/3/4 Range 8", Daemonic Claw 5/3+/4/5 Rending
  // 特殊能力 (TODO): Unleash Daemon — 每战一次，获得减伤 + 武器增强 (Ceaseless, Lethal 5+)
  { id: 'leg_3', name: 'Anointed (军团受选者)', operativeType: 'leg_anointed',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/leg/leg_6_anointed.jpg',
    abilities: ['unleashDaemon'],
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Daemonic Claw (恶魔魔爪)', 5, 3, 4, 5, false, null, ['Rending'])
    ]
  },

  // 官方武器:
  //   Bolt pistol  4/3+/3/4  Range 8"
  //   Fireblast  4/3+/3/4  PSYCHIC, Blast 2", 1" Devastating 1, Saturate
  //   Life siphon  5/3+/3/3  PSYCHIC, Saturate, Siphon Life*
  //   Fell dagger  5/3+/3/4  PSYCHIC, Rending, Siphon Life*
  // 特殊能力 (TODO): Siphon Life* — 武器规则，命中时治疗友军
  { id: 'leg_4', name: 'Balefire Acolyte (军团邪火使徒)', operativeType: 'leg_balefire_acolyte',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/leg/leg_lord.jpg',
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Fell Dagger (堕落匕首)', 5, 3, 3, 4, false, null, ['PSYCHIC', 'Rending'])
    ]
  },

  // 官方武器:
  //   Bolt pistol  4/3+/3/4  Range 8"
  //   Double-handed chainaxe  5/4+/5/7  Brutal
  // 特殊能力 (TODO): Devastating Onslaught —
  //   近战时敌人无法协助；回合末可对 2" 内敌人免费冲锋 (≤2")
  { id: 'leg_5', name: 'Butcher (军团屠夫)', operativeType: 'leg_butcher',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/leg/leg_berserker.jpg',
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Double-handed Chainaxe (双手链锯斧)', 5, 4, 5, 7, false, null, ['Brutal'])
    ]
  },

  // 官方武器全选项:
  //   Bolt pistol  4/3+/3/4  Range 8"
  //   Flamer  4/2+/3/3  Range 8", Saturate, Torrent 2"
  //   Meltagun  4/3+/6/3  Range 6", Devastating 4, Piercing 2
  //   Plasma gun (standard)  4/3+/4/6  Piercing 1
  //   Plasma gun (supercharge)  4/3+/5/6  Hot, Lethal 5+, Piercing 1
  //   Fists  4/3+/3/4
  { id: 'leg_6', name: 'Gunner (军团炮手)', operativeType: 'leg_gunner',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/leg/leg_5_butcher.jpg',
    abilities: ['devastatingOnslaught'],
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Plasma Gun (等离子枪)', 4, 3, 4, 6, true, null, ['Piercing 1'])
    ]
  },

  // 官方武器全选项:
  //   Bolt pistol  4/3+/3/4  Range 8"
  //   Heavy bolter (focused)  5/3+/4/5  Heavy (Reposition only), Piercing Crits 1
  //   Heavy bolter (sweeping)  4/3+/4/5  Heavy (Reposition only), Piercing Crits 1, Torrent 1"
  //   Missile launcher (frag)  4/3+/3/5  Blast 2", Heavy (Reposition only)
  //   Missile launcher (krak)  4/3+/5/7  Heavy (Reposition only), Piercing 1
  //   Reaper chaincannon (focused)  5/3+/3/4  Ceaseless, Heavy (Reposition only), Punishing
  //   Reaper chaincannon (sweeping)  4/3+/3/4  Ceaseless, Heavy (Reposition only), Punishing, Torrent 2"
  //   Fists  4/3+/3/4
  { id: 'leg_7', name: 'Heavy Gunner (军团重炮手)', operativeType: 'leg_heavy_gunner',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/leg/leg_heavy.jpg',
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Reaper Chaincannon (收割机枪)', 5, 3, 3, 4, true, null, ['Ceaseless', 'Heavy (Dash only)', 'Punishing'])
    ]
  },

  // 官方武器:
  //   Bolt pistol  4/3+/3/4  Range 8"
  //   Boltgun  4/3+/3/4
  //   Chainsword  5/3+/4/5
  //   Fists  4/3+/3/4
  // 特殊能力 (TODO):
  //   Icon Bearer — 控制标记时 APL 视为 +1
  //   Favoured of the Dark Gods — 策略阶段控制非污染标记时，污染该标记并获得 1CP
  { id: 'leg_8', name: 'Icon Bearer (军团持徽手)', operativeType: 'leg_icon_bearer',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/leg/leg_2_chosen.jpg',
    abilities: ['soulFeast'],
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Boltgun (爆弹枪)', 4, 3, 3, 4, true, null, [])
    ]
  },

  // 官方武器:
  //   Bolt pistol  4/3+/3/4  Range 8", Rending
  //   Flensing blades  5/3+/3/5  Lethal 5+
  // 特殊能力 (TODO):
  //   Vicious Reflexes — 反击时先手 (防御方先掷骰)
  //   Horrifying Dismemberment — 击杀后 3" 内另一敌人 APL -1 直到其下次激活结束
  //   Grisly Mark (2AP) — 放置标记，3" 内敌人拾取/任务行动 +1AP；控制标记时敌方 APL 视为 -1
  { id: 'leg_9', name: 'Shrivetalon (军团赦罪之爪)', operativeType: 'leg_shrivetalon',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, move: 6,
    defaultAvatar: './assets/images/operatives/leg/leg_4_shrivetalon.jpg',
    abilities: ['horrifyingDismemberment'],
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, ['Rending']),
      new Weapon('Flensing Blades (剥皮双刃)', 5, 3, 3, 5, false, null, ['Lethal 5+'])
    ]
  },

  // 官方武器:
  //   Bolt pistol  4/3+/3/4  Range 8"
  //   Boltgun  4/3+/3/4
  //   Chainsword  5/3+/4/5
  //   Fists  4/3+/3/4
  // 特殊能力 (TODO): Infernal Pact — 每战一次，友军 LEGIONARY 被击杀时获得增益
  { id: 'leg_10', name: 'Warrior (军团战士)', operativeType: 'leg_warrior',
    wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, isWarrior: true, move: 6,
    defaultAvatar: './assets/images/operatives/leg/leg_trooper.jpg',
    weapons: [
      new Weapon('Bolt Pistol (爆弹手枪)', 4, 3, 3, 4, true, 8, []),
      new Weapon('Boltgun (爆弹枪)', 4, 3, 3, 4, true, null, [])
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
          <p style="margin-top:6px;"><b>使用场景:</b> 需要快速穿越战场时使用。冲刺后仍可射击/近战（与转移相同）。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>与转移效果相同，但移动距离固定 3"，且不能攀爬。</li>
            <li>Heavy (仅限冲刺) 武器：执行过非冲刺的移动后不可用；未移动或仅冲刺时可用。</li>
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
  },
  repulsiveFortitude: {
    title: '🦠 可憎韧性 (Repulsive Fortitude)',
    body: '<p><b>被动能力</b></p><p>每当有特工向该特工射击时，防御骰子掷出 <b>5+</b> 即算作暴击成功(Critical Success)。</p>'
  },
  disgustingResilience: {
    title: '🦠 恼人韧性 (Disgustingly Resilient)',
    body: '<p><b>阵营特性</b></p><p>每当一枚攻击骰子对友方【瘟疫战士】造成 3 点或更多伤害时，掷一个D6：如果结果是 4+，将该次造成的伤害减 1。</p>'
  },
  grenadier: {
    title: '💣 掷弹兵 (Grenadier)',
    body: '<p><b>被动能力</b></p><p>该特工可以使用破片手雷(frag)和穿甲手雷(krak)（见通用装备）。如此做不计入你的手雷有限使用次数中（即如果你还为其他特工选择了这些手雷作为装备也不受影响）。当该特工使用手雷时，将其命中(Hit)属性提升 1 点。</p>'
  },
  ironHalo: {
    title: '💫 钢铁光环 (Iron Halo)',
    body: '<p><b>每战一次 (Once per battle)</b></p><p>当一枚攻击骰子对此特工造成普通伤害(Normal Dmg)时，你可以无视该次造成的伤害。</p>'
  },
  heroicLeader: {
    title: '👑 英勇领袖 (Heroic Leader)',
    body: '<p><b>每回合一次 (Once per turning point)</b>，你可以执行以下操作之一：</p><ul><li>如果目标是该【死亡天使】特工，以 0CP 使用一个交火策略(Firefight ploy)（不包括指挥重投）。</li><li>当你激活一名友方【死亡天使】特工时，如果该队长在交战区内且不在敌方控制范围内，使用“战斗学说(Combat Doctrine)”战略策略（正常支付CP）。如果你本回合已使用过该策略则不能如此做。</li><li>如果该队长在交战区内且不在敌方控制范围内，以 0CP 使用“调整学说(Adjust Doctrine)”交火策略。</li></ul>'
  },
  optics: {
    title: '🎯 光学瞄具 (Optics)',
    body: '<p><b>动作 (1 AP)</b></p><p>直到该特工下一次激活开始前，当其进行射击时，敌方特工不能处于遮蔽(Obscured)状态。如果该特工在敌方特工的控制范围内，则不能执行此动作。</p>'
  },
  camoCloak: {
    title: '🍃 迷彩斗篷 (Camo Cloak)',
    body: '<p><b>被动能力</b></p><p>当有特工向该特工射击时，无视饱和(Saturate)武器规则。该特工自动拥有【隐秘(Stealthy)】战团战术。如果你本身就选择了该战团战术，你可以同时执行其两个选项（即保留两个掩体豁免骰——一个普通成功和一个暴击成功）。</p>'
  },
  grandfathersBlessing: {
    title: '🦠 慈父的祝福 (Grandfather\'s Blessing)',
    body: '<p><b>被动能力</b></p><p>每当一名带有你的“中毒(Poison)”标记的敌方特工在该特工 7" 范围内失去一个或多个伤口时，该特工恢复等量已损失的伤口（每回合最多恢复 3 点，且只有在该特工未瘫痪时生效）。</p>'
  },
  iconOfContagion: {
    title: '☠️ 传疫徽记 (Icon of Contagion)',
    body: '<p><b>被动能力</b></p><p>只要该特工位于对手半场区域(opponent\'s territory)内，你使用“传染(Contagion)”战略策略时消耗 0CP。</p>'
  },
  astartesDoubleAction: {
    title: '⚔️ 阿斯塔特 (Astartes)',
    body: '<p><b>阵营特性</b></p><p>在一名特工的激活期间，它可以执行两次射击或两次近战。如果是两次射击，其中至少一次必须使用爆弹手枪、爆弹枪或灵能武器。每次激活不能选择相同的灵能远程武器超过一次。</p>'
  },
  devastatingOnslaught: {
    title: '🩸 毁灭性猛攻 (Devastating Onslaught)',
    body: '<p><b>被动能力</b></p><p>当该特工进行近战或反击时，敌方特工不能协助(assist)。在每个敌方特工激活或反击结束时，你可以选择该特工 2" 内的一名敌方特工，该特工可以免费执行一次“冲锋”动作（可将其命令改为Engage），但移动不能超过 2"，并且必须结束于该选中目标的控制范围内。</p>'
  },
  horrifyingDismemberment: {
    title: '🔪 可怕肢解 (Horrifying Dismemberment)',
    body: '<p><b>被动能力</b></p><p>每当该特工在近战或反击中使一名敌方特工瘫痪时，选择另一名在它或被瘫痪特工 3" 内且可见的敌方特工。将该敌方特工的 APL 减 1，直到其下一次激活结束。</p>'
  },
  unleashDaemon: {
    title: '🔥 释放恶魔 (Unleash Daemon)',
    body: '<p><b>每战一次</b></p><p>激活该特工时使用。直到本场战斗结束：<br>• 该特工无法执行拾取标记或任务动作。如果携带了标记必须立刻以0AP放置。<br>• 4点或以上的普通和暴击伤害对该特工造成的伤害减1（与纳垢印记不可叠加减2）。<br>• 它的恶魔魔爪获得无情(Ceaseless)和致命5+(Lethal 5+)规则。</p>'
  },
  soulFeast: {
    title: '💀 灵魂盛宴 (Soul Feast)',
    body: '<p><b>被动能力</b></p><p>在该特工近战或反击之后，如果它没有瘫痪，但它在序列中使一名敌方特工瘫痪，它恢复 D3+1 点已损失的伤口。</p>'
  },
  eyeOfTheGods: {
    title: '👁️ 诸神的注视 (In the Eyes of the Gods)',
    body: '<p><b>被动能力</b></p><p>在该特工的每次激活中仅限一次，如果它使一名敌方特工瘫痪，将其 APL 属性加 1，直到该次激活结束。</p>'
  }
};

export { SM_TEMPLATES, PM_TEMPLATES, LEG_TEMPLATES, RULE_TEXTS };
