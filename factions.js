﻿    window.Weapon = class Weapon {
      constructor(name, attacks, targetSkill, normalDmg, criticalDmg, isRanged = true) {
        this.name = name;
        this.attacks = attacks;
        this.ts = targetSkill; 
        this.normalDamage = normalDmg;
        this.criticalDamage = criticalDmg;
        this.isRanged = isRanged;
      }
    }

    window.Operative = class Operative {
      constructor(id, name, faction, wounds, apl, df, sv, weapons = [], defaultAvatar = '') {
        this.id = id;
        this.name = name;
        this.faction = faction; 
        this.maxWounds = wounds;
        this.wounds = wounds;
        this.maxApl = apl;
        this.apl = apl;
        this.df = df;
        this.sv = sv;
        this.weapons = weapons;
        this.defaultAvatar = defaultAvatar;
        
        this.hasActed = false;
        this.isDead = false;
        this.actionsPerformed = [];
      }

      reset() {
        this.wounds = this.maxWounds;
        this.apl = this.maxApl;
        this.hasActed = false;
        this.isDead = false;
        this.actionsPerformed = [];
      }

      applyWounds(amount, manualDrRolls = null) {
        if (this.isDead) return 0;
        
        let actualDamage = 0;
        addLog(`[伤害] ${this.name} 准备分配 ${amount} 点伤害...`);

        if (this.faction === gameState.factionB) {
          const hasPloyActive = gameState.factionBPloys.includes('contagious_resilience');
          addLog(`[特性] 触发瘟疫守卫专属【恶心作呕 (DR 5+)】 ${hasPloyActive ? '(已开启传染韧性，允许首个失败重投)' : ''}：`);
          
          let drRollIndex = 0;
          let hasRerolled = false;

          for (let i = 0; i < amount; i++) {
            let roll;
            if (manualDrRolls && drRollIndex < manualDrRolls.length) {
              roll = manualDrRolls[drRollIndex++];
              addLog(`  - 伤害点 #${i+1}: 手动录入骰子 [${roll}]`);
            } else {
              roll = Math.floor(Math.random() * 6) + 1;
              addLog(`  - 伤害点 #${i+1}: 投骰 [${roll}]`);
            }

            if (roll < 5 && hasPloyActive && !hasRerolled && !manualDrRolls) {
              hasRerolled = true;
              const oldRoll = roll;
              roll = Math.floor(Math.random() * 6) + 1;
              addLog(`    -> 🛡️ 触发【传染韧性】！自动重投失败骰 [${oldRoll}] -> [${roll}]`);
            }

            if (roll >= 5) {
              addLog(`    -> 免除该点伤害！`);
              playSound('bubble');
            } else {
              addLog(`    -> 减免失败。`);
              actualDamage++;
              playSound('flesh');
            }
          }
        } else {
          actualDamage = amount;
          if (actualDamage > 0) playSound('flesh');
        }

        const prevHp = this.wounds;
        this.wounds = Math.max(0, this.wounds - actualDamage);
        addLog(`[分配] ${this.name} 生命值: ${prevHp} -> ${this.wounds} ${this.wounds === 0 ? '(已阵亡!)' : ''}`);
        
        if (this.wounds === 0) {
          this.isDead = true;
          this.hasActed = true;
          triggerOperativeDeathOverlay(this);
          setTimeout(() => checkGameOver(), 500);
        }
        return actualDamage;
      }
    }

    window.gameState = {
      turningPoint: 1,
      phase: 'Initiative', 
      initiative: '',
      activeTurn: '',
      activeAgent: null,
      
      factionAVp: 0,
      factionACp: 2,
      factionBVp: 0,
      factionBCp: 2,

      factionAPloys: [], 
      factionBPloys: [], 

      operatives: [],

      // 新增状态变量
      gameOver: false,
      customAvatars: {},
      smKillsScored: 0,
      pmKillsScored: 0,
      rollMode: 'manual' // 'manual' = 物理录入, 'random' = 自动动画
    };

    window.toggleRollMode = function() {
      playSound('click');
      if (gameState.rollMode === 'manual') {
        gameState.rollMode = 'random';
        document.getElementById('btn-toggle-rollmode').textContent = '🎲 自动动画模式';
        document.getElementById('btn-toggle-rollmode').style.background = '#3b82f6';
      } else {
        gameState.rollMode = 'manual';
        document.getElementById('btn-toggle-rollmode').textContent = '🎲 物理录入模式';
        document.getElementById('btn-toggle-rollmode').style.background = '#1e293b';
      }
    }

    // ==========================================
    //       官方 Starter Set 7个特工的原始数据库
    // ==========================================
    
    window.SM_TEMPLATES = [
      { id: 'sm_1', name: 'Angels Captain (船长)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: true, defaultAvatar: './sm_captain.png',
        weapons: [new Weapon('等离子手枪 (Plasma Pistol)', 4, 2, 5, 6, true), new Weapon('动力剑 (Power Sword)', 5, 2, 4, 6, false)] },
      { id: 'sm_2', name: 'Intercessor Sergeant (军士)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: true, defaultAvatar: './sm_sergeant.png',
        weapons: [new Weapon('自动爆弹枪 (Bolt Rifle)', 4, 2, 3, 4, true), new Weapon('链锯剑 (Chainsword)', 5, 3, 4, 5, false)] },
      { id: 'sm_3', name: 'Eliminator Sniper (狙击手)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './sm_sniper.png',
        weapons: [new Weapon('战术狙击枪 (Stalker Bolt Carbine)', 4, 2, 3, 3, true), new Weapon('战斗短刀 (Combat Blade)', 4, 3, 3, 4, false)] },
      { id: 'sm_4', name: 'Heavy Gunner (重武器手)', wounds: 16, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './sm_heavy_gunner.png',
        weapons: [new Weapon('重型爆弹步枪 (Heavy Bolt Rifle)', 5, 3, 4, 5, true), new Weapon('军用铁拳 (Fists)', 4, 3, 3, 4, false)] },
      { id: 'sm_5', name: 'Assault Warrior (突击战士)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './sm_assault.png',
        weapons: [new Weapon('重型爆弹手枪 (Heavy Bolt Pistol)', 4, 3, 3, 4, true), new Weapon('链锯剑 (Chainsword)', 5, 3, 4, 5, false)] },
      { id: 'sm_6', name: 'Intercessor Warrior A (战士A)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './sm_warrior_a.png',
        weapons: [new Weapon('自动爆弹步枪 (Auto Bolt Rifle)', 4, 3, 3, 4, true), new Weapon('军用重拳 (Fists)', 4, 3, 3, 4, false)] },
      { id: 'sm_7', name: 'Intercessor Warrior B (战士B)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './sm_warrior_b.png',
        weapons: [new Weapon('标准爆弹步枪 (Bolt Rifle)', 4, 3, 3, 4, true), new Weapon('军用重拳 (Fists)', 4, 3, 3, 4, false)] }
    ];

    window.PM_TEMPLATES = [
      { id: 'pm_1', name: 'Plague Champion (冠军队长)', wounds: 13, apl: 2, df: 3, sv: 3, isLeader: true, defaultAvatar: './pm_champion.png',
        weapons: [new Weapon('等离子手枪 (Plasma Pistol)', 4, 3, 5, 6, true), new Weapon('瘟疫利刃 (Plague Knife)', 5, 3, 4, 6, false)] },
      { id: 'pm_2', name: 'Malignant Plaguecaster (施法者)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './pm_caster.png',
        weapons: [new Weapon('奥术瘟疫风暴 (Plague Wind)', 4, 3, 3, 4, true), new Weapon('腐化法杖 (Corrupted Staff)', 4, 3, 4, 5, false)] },
      { id: 'pm_3', name: 'Plague Icon Bearer (圣像手)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './pm_icon.png',
        weapons: [new Weapon('瘟疫爆弹步枪 (Plague Boltgun)', 4, 3, 3, 4, true), new Weapon('瘟疫重拳 (Fists)', 3, 3, 3, 4, false)] },
      { id: 'pm_4', name: 'Plague Fighter (搏击斗士)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './pm_fighter.png',
        weapons: [new Weapon('爆弹手枪 (Bolt Pistol)', 4, 3, 3, 4, true), new Weapon('瘟疫巨镰 (Plague Cleaver)', 5, 3, 4, 6, false)] },
      { id: 'pm_5', name: 'Plague Heavy Gunner (重炮手)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './pm_heavy.png',
        weapons: [new Weapon('枯萎发射器 (Blight Launcher)', 4, 3, 4, 6, true), new Weapon('瘟疫重拳 (Fists)', 3, 3, 3, 4, false)] },
      { id: 'pm_6', name: 'Plague Gunner (特种枪手)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './pm_gunner.png',
        weapons: [new Weapon('热熔突击枪 (Meltagun)', 4, 3, 6, 3, true), new Weapon('瘟疫重拳 (Fists)', 3, 3, 3, 4, false)] },
      { id: 'pm_7', name: 'Plague Warrior (普通战士)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './pm_warrior.png',
        weapons: [new Weapon('瘟疫爆弹步枪 (Plague Boltgun)', 4, 3, 3, 4, true), new Weapon('瘟疫重拳 (Fists)', 3, 3, 3, 4, false)] }
    ];

    window.LEGIONARY_TEMPLATES = [
      { id: 'leg_1', name: 'Aspiring Champion (铁血冠军)', wounds: 12, apl: 3, df: 3, sv: 3, isLeader: true, defaultAvatar: './leg_1_champion_1781370493441.png',
        weapons: [new Weapon('等离子手枪 (Plasma Pistol)', 4, 2, 5, 6, true), new Weapon('动力拳套 (Power Fist)', 5, 4, 5, 7, false)] },
      { id: 'leg_2', name: 'Chosen (神选者)', wounds: 12, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './leg_2_chosen_1781370505034.png',
        weapons: [new Weapon('爆弹手枪 (Bolt Pistol)', 4, 3, 3, 4, true), new Weapon('恶魔之刃 (Daemon Blade)', 5, 3, 4, 6, false)] },
      { id: 'leg_3', name: 'Balefire Acolyte (炎劫祭司)', wounds: 12, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './leg_3_acolyte_1781370516451.png',
        weapons: [new Weapon('邪火法术 (Malign Strike)', 4, 3, 4, 5, true), new Weapon('堕落匕首 (Fell Daggers)', 4, 3, 4, 5, false)] },
      { id: 'leg_4', name: 'Shrivetalon (剥皮裂爪)', wounds: 12, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './leg_4_shrivetalon_1781370528525.png',
        weapons: [new Weapon('爆弹手枪 (Bolt Pistol)', 4, 3, 3, 4, true), new Weapon('剥皮双刃 (Flensing Blades)', 5, 3, 4, 5, false)] },
      { id: 'leg_5', name: 'Butcher (屠夫)', wounds: 12, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './leg_5_butcher_1781370541587.png',
        weapons: [new Weapon('爆弹手枪 (Bolt Pistol)', 4, 3, 3, 4, true), new Weapon('双手链锯斧 (Double-handed Chainaxe)', 5, 4, 4, 5, false)] },
      { id: 'leg_6', name: 'Anointed (受膏者)', wounds: 12, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './leg_6_anointed_1781370554199.png',
        weapons: [new Weapon('爆弹手枪 (Bolt Pistol)', 4, 3, 3, 4, true), new Weapon('恶魔魔爪 (Daemonic Claw)', 5, 3, 4, 5, false)] },
      { id: 'leg_7', name: 'Heavy Gunner (重机枪手)', wounds: 12, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './leg_7_heavy_1781370564980.png',
        weapons: [new Weapon('收割机枪 (Reaper Chaincannon)', 6, 3, 3, 4, true), new Weapon('拳头 (Fists)', 3, 3, 3, 4, false)] },
      { id: 'leg_8', name: 'Gunner (特种枪手)', wounds: 12, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './leg_8_gunner_1781370577818.png',
        weapons: [new Weapon('等离子枪 (Plasma Gun)', 4, 3, 5, 6, true), new Weapon('拳头 (Fists)', 3, 3, 3, 4, false)] },
      { id: 'leg_9', name: 'Icon Bearer (举旗手)', wounds: 12, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './leg_9_icon_1781370588873.png',
        weapons: [new Weapon('爆弹枪 (Boltgun)', 4, 3, 3, 4, true), new Weapon('拳头 (Fists)', 3, 3, 3, 4, false)] },
      { id: 'leg_10', name: 'Warrior (星际战士)', wounds: 12, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './leg_10_warrior_1781370600644.png',
        weapons: [new Weapon('爆弹枪 (Boltgun)', 4, 3, 3, 4, true), new Weapon('拳头 (Fists)', 3, 3, 3, 4, false)] }
    ];

    window.FACTIONS_DB = {
      "Space Marine": {
        id: "Space Marine",
        name: "死亡天使 (Angels of Death)",
        templates: SM_TEMPLATES,
        themeColor: "#60a5fa",
        diceClass: "sm-dice",
        headerImg: "url('./faction_header_sm_1781315989603.png')",
        ploys: [
          { id: 'shoot_twice', name: '风暴开火 (Bolter Discipline)', type: 'Strategic', cp: 1, desc: '特工在使用爆弹类武器时可进行第二次射击行动。' },
          { name: '震慑突击 (Shock Assault)', type: 'Strategic', cp: 1, desc: '冲锋后近战搏斗时获得额外重投。' },
          { name: '极限减伤 (Transhuman Physiology)', type: 'Firefight', cp: 1, desc: '遭到致命一击时可将 1 个暴击伤害降为普通伤害。' }
        ]
      },
      "Plague Marine": {
        id: "Plague Marine",
        name: "死亡守卫 (Death Guard)",
        templates: PM_TEMPLATES,
        themeColor: "#4ade80",
        diceClass: "pm-dice",
        headerImg: "url('./faction_header_pm_1781316000042.png')",
        ploys: [
          { name: '无尽行军 (Inexorable Advance)', type: 'Strategic', cp: 1, desc: '忽略移动减损惩罚，强行推进。' },
          { id: 'shoot_twice', name: '剧毒喷洒 (Malicious Volleys)', type: 'Strategic', cp: 1, desc: '爆弹武器即使移动过也能双击。' },
          { id: 'contagious_resilience', name: '恶心减伤 (Disgustingly Resilient)', type: 'Firefight', cp: 1, desc: '防守时可以将一枚失败骰改为普通成功。' }
        ]
      },
      "Legionary": {
        id: "Legionary",
        name: "黑军团 (Legionaries)",
        templates: LEGIONARY_TEMPLATES,
        themeColor: "#facc15",
        diceClass: "leg-dice",
        headerImg: "url('./faction_header_leg_1781371239474.png')",
        ploys: [
          { id: 'wrath_of_gods', name: '黑暗诸神之怒 (Wrath of the Gods)', type: 'Strategic', cp: 1, desc: '本回合近战暴击判定+1（5+即算暴击）。' },
          { id: 'shoot_twice', name: '恶意齐射 (Malicious Volleys)', type: 'Strategic', cp: 1, desc: '所有装备爆弹枪的特工可执行两次射击。' },
          { id: 'contagious_resilience', name: '恶魔恩赐 (Daemonic Ward)', type: 'Firefight', cp: 1, desc: '在防守投骰时，可以重投 1 枚防御骰。' }
        ]
      }
    };
