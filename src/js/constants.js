import { Weapon } from './models.js';

// ==========================================
//       官方 Starter Set 7个特工的原始数据库
// ==========================================

const SM_TEMPLATES = [
  { id: 'sm_1', name: 'Angels Captain (船长)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: true, defaultAvatar: './assets/images/operatives/sm/sm_captain.png',
    weapons: [new Weapon('等离子手枪 (Plasma Pistol)', 4, 2, 5, 6, true), new Weapon('动力剑 (Power Sword)', 5, 2, 4, 6, false)] },
  { id: 'sm_2', name: 'Intercessor Sergeant (军士)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: true, defaultAvatar: './assets/images/operatives/sm/sm_sergeant.png',
    weapons: [new Weapon('自动爆弹枪 (Bolt Rifle)', 4, 2, 3, 4, true), new Weapon('链锯剑 (Chainsword)', 5, 3, 4, 5, false)] },
  { id: 'sm_3', name: 'Eliminator Sniper (狙击手)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/sm/sm_sniper.png',
    weapons: [new Weapon('战术狙击枪 (Stalker Bolt Carbine)', 4, 2, 3, 3, true), new Weapon('战斗短刀 (Combat Blade)', 4, 3, 3, 4, false)] },
  { id: 'sm_4', name: 'Heavy Gunner (重武器手)', wounds: 16, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/sm/sm_heavy_gunner.png',
    weapons: [new Weapon('重型爆弹步枪 (Heavy Bolt Rifle)', 5, 3, 4, 5, true), new Weapon('军用铁拳 (Fists)', 4, 3, 3, 4, false)] },
  { id: 'sm_5', name: 'Assault Warrior (突击战士)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/sm/sm_assault.png',
    weapons: [new Weapon('重型爆弹手枪 (Heavy Bolt Pistol)', 4, 3, 3, 4, true), new Weapon('链锯剑 (Chainsword)', 5, 3, 4, 5, false)] },
  { id: 'sm_6', name: 'Intercessor Warrior A (战士A)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/sm/sm_warrior_a.png',
    weapons: [new Weapon('自动爆弹步枪 (Auto Bolt Rifle)', 4, 3, 3, 4, true), new Weapon('军用重拳 (Fists)', 4, 3, 3, 4, false)] },
  { id: 'sm_7', name: 'Intercessor Warrior B (战士B)', wounds: 14, apl: 3, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/sm/sm_warrior_b.png',
    weapons: [new Weapon('标准爆弹步枪 (Bolt Rifle)', 4, 3, 3, 4, true), new Weapon('军用重拳 (Fists)', 4, 3, 3, 4, false)] }
];

const PM_TEMPLATES = [
  { id: 'pm_1', name: 'Plague Champion (冠军队长)', wounds: 13, apl: 2, df: 3, sv: 3, isLeader: true, defaultAvatar: './assets/images/operatives/pm/pm_champion.png',
    weapons: [new Weapon('等离子手枪 (Plasma Pistol)', 4, 3, 5, 6, true), new Weapon('瘟疫利刃 (Plague Knife)', 5, 3, 4, 6, false)] },
  { id: 'pm_2', name: 'Malignant Plaguecaster (施法者)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/pm/pm_caster.png',
    weapons: [new Weapon('奥术瘟疫风暴 (Plague Wind)', 4, 3, 3, 4, true), new Weapon('腐化法杖 (Corrupted Staff)', 4, 3, 4, 5, false)] },
  { id: 'pm_3', name: 'Plague Icon Bearer (圣像手)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/pm/pm_icon.png',
    weapons: [new Weapon('瘟疫爆弹步枪 (Plague Boltgun)', 4, 3, 3, 4, true), new Weapon('瘟疫重拳 (Fists)', 3, 3, 3, 4, false)] },
  { id: 'pm_4', name: 'Plague Fighter (搏击斗士)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/pm/pm_fighter.png',
    weapons: [new Weapon('爆弹手枪 (Bolt Pistol)', 4, 3, 3, 4, true), new Weapon('瘟疫巨镰 (Plague Cleaver)', 5, 3, 4, 6, false)] },
  { id: 'pm_5', name: 'Plague Heavy Gunner (重炮手)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/pm/pm_heavy.png',
    weapons: [new Weapon('枯萎发射器 (Blight Launcher)', 4, 3, 4, 6, true), new Weapon('瘟疫重拳 (Fists)', 3, 3, 3, 4, false)] },
  { id: 'pm_6', name: 'Plague Gunner (特种枪手)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/pm/pm_gunner.png',
    weapons: [new Weapon('热熔突击枪 (Meltagun)', 4, 3, 6, 3, true), new Weapon('瘟疫重拳 (Fists)', 3, 3, 3, 4, false)] },
  { id: 'pm_7', name: 'Plague Warrior (普通战士)', wounds: 12, apl: 2, df: 3, sv: 3, isLeader: false, defaultAvatar: './assets/images/operatives/pm/pm_warrior.png',
    weapons: [new Weapon('瘟疫爆弹步枪 (Plague Boltgun)', 4, 3, 3, 4, true), new Weapon('瘟疫重拳 (Fists)', 3, 3, 3, 4, false)] }
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
  }
};

export { SM_TEMPLATES, PM_TEMPLATES, RULE_TEXTS };
