(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&l(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const p=new(window.AudioContext||window.webkitAudioContext);function m(e){try{p.state==="suspended"&&p.resume();const t=p.createOscillator(),s=p.createGain();if(t.connect(s),s.connect(p.destination),e==="click")t.frequency.setValueAtTime(600,p.currentTime),s.gain.setValueAtTime(.04,p.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,p.currentTime+.08),t.start(),t.stop(p.currentTime+.08);else if(e==="shoot"){const l=p.currentTime;[0,.08,.16].forEach(o=>{const c=p.sampleRate*.08,r=p.createBuffer(1,c,p.sampleRate),d=r.getChannelData(0);for(let $=0;$<c;$++)d[$]=Math.random()*2-1;const f=p.createBufferSource();f.buffer=r;const g=p.createBiquadFilter();g.type="lowpass",g.frequency.value=1e3;const v=p.createGain();v.gain.setValueAtTime(.12,l+o),v.gain.exponentialRampToValueAtTime(1e-4,l+o+.08),f.connect(g),g.connect(v),v.connect(p.destination),f.start(l+o);const y=p.createOscillator(),x=p.createGain();y.frequency.setValueAtTime(160,l+o),y.frequency.linearRampToValueAtTime(80,l+o+.06),x.gain.setValueAtTime(.15,l+o),x.gain.exponentialRampToValueAtTime(1e-4,l+o+.06),y.connect(x),x.connect(p.destination),y.start(l+o),y.stop(l+o+.06)})}else if(e==="crit")t.type="sawtooth",t.frequency.setValueAtTime(880,p.currentTime),t.frequency.setValueAtTime(1200,p.currentTime+.08),s.gain.setValueAtTime(.06,p.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,p.currentTime+.25),t.start(),t.stop(p.currentTime+.25);else if(e==="save")t.type="sine",t.frequency.setValueAtTime(988,p.currentTime),s.gain.setValueAtTime(.05,p.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,p.currentTime+.12),t.start(),t.stop(p.currentTime+.12);else if(e==="flesh"){const l=p.sampleRate*.15,n=p.createBuffer(1,l,p.sampleRate),o=n.getChannelData(0);for(let f=0;f<l;f++)o[f]=Math.random()*2-1;const c=p.createBufferSource();c.buffer=n;const r=p.createBiquadFilter();r.type="bandpass",r.frequency.value=300;const d=p.createGain();d.gain.setValueAtTime(.08,p.currentTime),d.gain.exponentialRampToValueAtTime(1e-4,p.currentTime+.15),c.connect(r),r.connect(d),d.connect(p.destination),c.start()}else if(e==="bubble")t.type="sine",t.frequency.setValueAtTime(200,p.currentTime),t.frequency.exponentialRampToValueAtTime(1200,p.currentTime+.06),s.gain.setValueAtTime(.05,p.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,p.currentTime+.06),t.start(),t.stop(p.currentTime+.06);else if(e==="alert")t.type="triangle",t.frequency.setValueAtTime(330,p.currentTime),s.gain.setValueAtTime(.08,p.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,p.currentTime+.3),t.start(),t.stop(p.currentTime+.3);else if(e==="epic_win"){const l=[523.25,659.25,783.99,1046.5],n=p.currentTime;l.forEach((o,c)=>{const r=p.createOscillator(),d=p.createGain();r.type="triangle",r.frequency.setValueAtTime(o,n+c*.08),d.gain.setValueAtTime(0,n+c*.08),d.gain.linearRampToValueAtTime(.08,n+c*.08+.02),d.gain.exponentialRampToValueAtTime(1e-4,n+c*.08+.22),r.connect(d),d.connect(p.destination),r.start(n+c*.08),r.stop(n+c*.08+.22)})}else if(e==="epic_fail"){const l=[164.81,155.56,146.83,138.59],n=p.currentTime;l.forEach((o,c)=>{const r=p.createOscillator(),d=p.createGain();r.type="sawtooth";const f=n+c*.2,g=c===3?.65:.18;r.frequency.setValueAtTime(o,f),c===3&&r.frequency.linearRampToValueAtTime(95,f+g),d.gain.setValueAtTime(0,f),d.gain.linearRampToValueAtTime(.08,f+.02),d.gain.exponentialRampToValueAtTime(1e-4,f+g),r.connect(d),d.connect(p.destination),r.start(f),r.stop(f+g)})}else if(e==="funeral"){const l=[261.63,261.63,261.63,207.65],n=[.35,.35,.35,.7],o=[0,.45,.9,1.35],c=p.currentTime;l.forEach((r,d)=>{const f=p.createOscillator(),g=p.createGain();f.type="sine";const v=c+o[d],y=n[d];f.frequency.setValueAtTime(r,v),g.gain.setValueAtTime(0,v),g.gain.linearRampToValueAtTime(.06,v+.05),g.gain.exponentialRampToValueAtTime(1e-4,v+y),f.connect(g),g.connect(p.destination),f.start(v),f.stop(v+y)})}else if(e==="metal_clash"){const l=p.currentTime,n=p.createOscillator(),o=p.createGain();n.type="sine",n.frequency.setValueAtTime(1400,l),n.frequency.linearRampToValueAtTime(900,l+.25),o.gain.setValueAtTime(.06,l),o.gain.exponentialRampToValueAtTime(1e-4,l+.3),n.connect(o),o.connect(p.destination),n.start(),n.stop(l+.3);const c=p.createOscillator(),r=p.createGain();c.type="triangle",c.frequency.setValueAtTime(300,l),c.frequency.linearRampToValueAtTime(120,l+.15),r.gain.setValueAtTime(.1,l),r.gain.exponentialRampToValueAtTime(1e-4,l+.18),c.connect(r),r.connect(p.destination),c.start(),c.stop(l+.18)}else if(e==="heavy_strike"){const l=p.currentTime,n=p.createOscillator(),o=p.createGain();n.type="sawtooth",n.frequency.setValueAtTime(80,l),n.frequency.exponentialRampToValueAtTime(35,l+.2),o.gain.setValueAtTime(.2,l),o.gain.exponentialRampToValueAtTime(1e-4,l+.2),n.connect(o),o.connect(p.destination),n.start(),n.stop(l+.2);const c=p.createOscillator(),r=p.createGain();c.type="sine",c.frequency.setValueAtTime(550,l),r.gain.setValueAtTime(.05,l),r.gain.exponentialRampToValueAtTime(1e-4,l+.12),c.connect(r),r.connect(p.destination),c.start(),c.stop(l+.12);const d=p.sampleRate*.12,f=p.createBuffer(1,d,p.sampleRate),g=f.getChannelData(0);for(let $=0;$<d;$++)g[$]=Math.random()*2-1;const v=p.createBufferSource();v.buffer=f;const y=p.createBiquadFilter();y.type="bandpass",y.frequency.value=220;const x=p.createGain();x.gain.setValueAtTime(.12,l),x.gain.exponentialRampToValueAtTime(1e-4,l+.12),v.connect(y),y.connect(x),x.connect(p.destination),v.start()}}catch{}}const M={};function fe(e){Object.assign(M,e)}const i={turningPoint:1,phase:"Initiative",initiative:"Space Marine",activeTurn:"Space Marine",activeAgent:null,smVp:0,smCp:2,pmVp:0,pmCp:2,smActivePloys:[],pmActivePloys:[],operatives:[],gameOver:!1,customAvatars:{},smKillsScored:0,pmKillsScored:0},ue={actionType:"shoot",step:1,attacker:null,defender:null,weapon:null,inRangeAndVisible:!0,inCoverConcealed:!1,inCover:!1,mode:"random",attackRolls:[],attackCrit:0,attackNorm:0,defenseRolls:[],defCrit:0,defNorm:0,attRerollIndex:-1,defRerollIndex:-1,activeAttackerDice:[],activeDefenderDice:[],meleeTurn:"attacker"};let a={...ue};const Z=["医疗兵默默拿出了骨灰盒，叹气道：『这活我接不了，抬走，下一位！』","他为了信仰流尽了最后一滴血，虽然倒下的姿势实在不够优雅。","战锤世界可没有复活币，老铁一路走好！","这大概就是传说中的『战术性白给』吧……","棋子已变成战场地形/掩体的一部分（大雾）。","纳垢大父叹了口气，表示可以多一碗上好的堆肥了。","帝皇叹了口气，并从垃圾桶里捞了捞他的物理模型。"];function V(e){return i.operatives.some(t=>t.faction===e&&!t.isDead&&!t.hasActed)}function ge(){m("click"),i.turningPoint+=1,i.phase="Initiative",i.smCp+=1,i.pmCp+=1,i.smActivePloys=[],i.pmActivePloys=[],i.operatives.forEach(t=>{t.isDead||(t.hasActed=!1,t.apl=t.maxApl,t.actionsPerformed=[])});const e=document.getElementById("btn-next-phase");e&&(e.style.display="none"),M.addLog(`
========================================`),M.addLog(`>>> Turning Point ${i.turningPoint} 开始！`),M.addLog(">>> 双方各获得 1 CP。"),M.addLog("========================================"),M.startInitiativePhase()}function ve(){const e=i.activeTurn==="Space Marine"?"Plague Marine":"Space Marine",t=V(e),s=V(i.activeTurn);t?(i.activeTurn=e,M.addLog(`>>> 交替轮转：轮到【${e==="Space Marine"?"死亡天使":"瘟疫守卫"}】选择特工激活。`)):s?M.addLog(`>>> 【${e==="Space Marine"?"死亡天使":"瘟疫守卫"}】已无可用特工。继续激活【${i.activeTurn==="Space Marine"?"死亡天使":"瘟疫守卫"}】。`):(M.addLog(">>> 双方全部特工激活完毕。准备开始回合得分结算。"),M.showTurnEndScoringOverlay()),M.renderOperatives(),M.updateActivePanel()}const S={};function be(e){Object.assign(S,e)}class k{constructor(t,s,l,n,o,c=!0){this.name=t,this.attacks=s,this.ts=l,this.normalDamage=n,this.criticalDamage=o,this.isRanged=c}}class ee{constructor(t,s,l,n,o,c,r,d=[],f=""){this.id=t,this.name=s,this.faction=l,this.maxWounds=n,this.wounds=n,this.maxApl=o,this.apl=o,this.df=c,this.sv=r,this.weapons=d,this.defaultAvatar=f,this.hasActed=!1,this.isDead=!1,this.actionsPerformed=[]}reset(){this.wounds=this.maxWounds,this.apl=this.maxApl,this.hasActed=!1,this.isDead=!1,this.actionsPerformed=[]}applyWounds(t,s=null){if(this.isDead)return 0;let l=0;if(S.addLog(`[伤害] ${this.name} 准备分配 ${t} 点伤害...`),this.faction==="Plague Marine"){const o=i.pmActivePloys.includes("contagious_resilience");S.addLog(`[特性] 触发瘟疫守卫专属【恶心作呕 (DR 5+)】 ${o?"(已开启传染韧性，允许首个失败重投)":""}：`);let c=0,r=!1;for(let d=0;d<t;d++){let f;if(s&&c<s.length?(f=s[c++],S.addLog(`  - 伤害点 #${d+1}: 手动录入骰子 [${f}]`)):(f=Math.floor(Math.random()*6)+1,S.addLog(`  - 伤害点 #${d+1}: 投骰 [${f}]`)),f<5&&o&&!r&&!s){r=!0;const g=f;f=Math.floor(Math.random()*6)+1,S.addLog(`    -> 🛡️ 触发【传染韧性】！自动重投失败骰 [${g}] -> [${f}]`)}f>=5?(S.addLog("    -> 免除该点伤害！"),m("bubble")):(S.addLog("    -> 减免失败。"),l++,m("flesh"))}}else l=t,l>0&&m("flesh");const n=this.wounds;return this.wounds=Math.max(0,this.wounds-l),S.addLog(`[分配] ${this.name} 生命值: ${n} -> ${this.wounds} ${this.wounds===0?"(已阵亡!)":""}`),this.wounds===0&&(this.isDead=!0,this.hasActed=!0,S.triggerOperativeDeathOverlay(this)),l}}const R=[{id:"sm_1",name:"Angels Captain (船长)",wounds:14,apl:3,df:3,sv:3,isLeader:!0,defaultAvatar:"./assets/images/operatives/sm/sm_captain.png",weapons:[new k("等离子手枪 (Plasma Pistol)",4,2,5,6,!0),new k("动力剑 (Power Sword)",5,2,4,6,!1)]},{id:"sm_2",name:"Intercessor Sergeant (军士)",wounds:14,apl:3,df:3,sv:3,isLeader:!0,defaultAvatar:"./assets/images/operatives/sm/sm_sergeant.png",weapons:[new k("自动爆弹枪 (Bolt Rifle)",4,2,3,4,!0),new k("链锯剑 (Chainsword)",5,3,4,5,!1)]},{id:"sm_3",name:"Eliminator Sniper (狙击手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/sm/sm_sniper.png",weapons:[new k("战术狙击枪 (Stalker Bolt Carbine)",4,2,3,3,!0),new k("战斗短刀 (Combat Blade)",4,3,3,4,!1)]},{id:"sm_4",name:"Heavy Gunner (重武器手)",wounds:16,apl:3,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/sm/sm_heavy_gunner.png",weapons:[new k("重型爆弹步枪 (Heavy Bolt Rifle)",5,3,4,5,!0),new k("军用铁拳 (Fists)",4,3,3,4,!1)]},{id:"sm_5",name:"Assault Warrior (突击战士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/sm/sm_assault.png",weapons:[new k("重型爆弹手枪 (Heavy Bolt Pistol)",4,3,3,4,!0),new k("链锯剑 (Chainsword)",5,3,4,5,!1)]},{id:"sm_6",name:"Intercessor Warrior A (战士A)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/sm/sm_warrior_a.png",weapons:[new k("自动爆弹步枪 (Auto Bolt Rifle)",4,3,3,4,!0),new k("军用重拳 (Fists)",4,3,3,4,!1)]},{id:"sm_7",name:"Intercessor Warrior B (战士B)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/sm/sm_warrior_b.png",weapons:[new k("标准爆弹步枪 (Bolt Rifle)",4,3,3,4,!0),new k("军用重拳 (Fists)",4,3,3,4,!1)]}],z=[{id:"pm_1",name:"Plague Champion (冠军队长)",wounds:13,apl:2,df:3,sv:3,isLeader:!0,defaultAvatar:"./assets/images/operatives/pm/pm_champion.png",weapons:[new k("等离子手枪 (Plasma Pistol)",4,3,5,6,!0),new k("瘟疫利刃 (Plague Knife)",5,3,4,6,!1)]},{id:"pm_2",name:"Malignant Plaguecaster (施法者)",wounds:12,apl:2,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/pm/pm_caster.png",weapons:[new k("奥术瘟疫风暴 (Plague Wind)",4,3,3,4,!0),new k("腐化法杖 (Corrupted Staff)",4,3,4,5,!1)]},{id:"pm_3",name:"Plague Icon Bearer (圣像手)",wounds:12,apl:2,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/pm/pm_icon.png",weapons:[new k("瘟疫爆弹步枪 (Plague Boltgun)",4,3,3,4,!0),new k("瘟疫重拳 (Fists)",3,3,3,4,!1)]},{id:"pm_4",name:"Plague Fighter (搏击斗士)",wounds:12,apl:2,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/pm/pm_fighter.png",weapons:[new k("爆弹手枪 (Bolt Pistol)",4,3,3,4,!0),new k("瘟疫巨镰 (Plague Cleaver)",5,3,4,6,!1)]},{id:"pm_5",name:"Plague Heavy Gunner (重炮手)",wounds:12,apl:2,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/pm/pm_heavy.png",weapons:[new k("枯萎发射器 (Blight Launcher)",4,3,4,6,!0),new k("瘟疫重拳 (Fists)",3,3,3,4,!1)]},{id:"pm_6",name:"Plague Gunner (特种枪手)",wounds:12,apl:2,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/pm/pm_gunner.png",weapons:[new k("热熔突击枪 (Meltagun)",4,3,6,3,!0),new k("瘟疫重拳 (Fists)",3,3,3,4,!1)]},{id:"pm_7",name:"Plague Warrior (普通战士)",wounds:12,apl:2,df:3,sv:3,isLeader:!1,defaultAvatar:"./assets/images/operatives/pm/pm_warrior.png",weapons:[new k("瘟疫爆弹步枪 (Plague Boltgun)",4,3,3,4,!0),new k("瘟疫重拳 (Fists)",3,3,3,4,!1)]}],he={move:{title:"🏃 移动 (Normal Move) 规则帮助",body:`
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>基本移动距离:</b> 3⚪ (即 6 英寸)。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>不能移入任何敌方特工的<b>交战距离</b>（即敌方 1 英寸范围内）。</li>
            <li>如果本回合该特工已经执行过【冲锋 (Charge)】动作，则<b>不能</b>执行移动。</li>
          </ul>
        `},charge:{title:"⚡ 冲锋 (Charge Move) 规则帮助",body:`
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>冲锋移动距离:</b> 4⚪ (即 8 英寸)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 当你想要近身与敌方搏斗时使用。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>冲锋移动结束时，该特工<b>必须</b>进入某个敌方特工的交战距离（1 英寸内）。</li>
            <li>如果本回合该特工已经执行过【移动】或【射击】动作，则<b>不能</b>执行冲锋。</li>
          </ul>
        `},shoot:{title:"💥 射击 (Shoot Action) 规则帮助",body:`
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>基本射击流程:</b></p>
          <ol style="margin-left:16px;">
            <li>选择ranged武器与射击目标。</li>
            <li><b>遮蔽判定:</b> 对方在隐蔽(Conceal)且在掩体(Cover)中时无法被作为射击目标。</li>
            <li><b>顺序掷骰:</b> 攻击方投 attacks 个骰子，BS以上命中，6为暴击。</li>
            <li><b>防守重组:</b> 防守方若是处于掩体中可直接保留1个普通成功，投剩下的DF防御骰。</li>
            <li><b>格挡抵消:</b> Saves 抵消 Hits，未被阻拦的命中转化为普通/暴击伤害扣除。</li>
          </ol>
        `},fight:{title:"⚔️ 近战搏斗 (Fight Action) 规则帮助",body:`
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
        `}},ye={};function xe(e){Object.assign(ye,e)}function C(e){const t=document.getElementById("battle-log-lines");if(!t)return;const s=document.createElement("div");s.textContent=e,t.appendChild(s),t.scrollTop=t.scrollHeight}function E(){document.getElementById("sm-vp").textContent=i.smVp,document.getElementById("sm-cp").textContent=i.smCp,document.getElementById("pm-vp").textContent=i.pmVp,document.getElementById("pm-cp").textContent=i.pmCp,document.getElementById("dash-tp").textContent=i.turningPoint;let e=i.phase;e==="Initiative"?e="先攻阶段":e==="Strategy"?e="策略阶段":e==="Firefight"&&(e="战斗阶段"),document.getElementById("dash-phase").textContent=e;const t=document.getElementById("sm-ploy-tags");t.innerHTML="",i.smActivePloys.forEach(n=>{const o=document.createElement("span");o.className="ploy-tag sm",o.textContent=n==="bolter_discipline"?"爆弹惩戒":n,t.appendChild(o)});const s=document.getElementById("pm-ploy-tags");s.innerHTML="",i.pmActivePloys.forEach(n=>{const o=document.createElement("span");o.className="ploy-tag pm",o.textContent=n==="contagious_resilience"?"传染韧性":n,s.appendChild(o)});const l=document.getElementById("btn-next-phase");l&&(i.phase==="Firefight"&&!V("Space Marine")&&!V("Plague Marine")?(l.style.display="inline-block",l.textContent="回合得分结算",l.onclick=le):l.style.display="none")}function ke(e,t,s){m("click"),e==="sm"?t==="vp"?i.smVp=Math.max(0,i.smVp+s):i.smCp=Math.max(0,i.smCp+s):t==="vp"?i.pmVp=Math.max(0,i.pmVp+s):i.pmCp=Math.max(0,i.pmCp+s),E()}function we(){confirm("确定要重置当前对局吗？所有进度和选择将被清空。")&&(m("click"),i.turningPoint=1,i.phase="Initiative",i.smVp=0,i.smCp=2,i.pmVp=0,i.pmCp=2,i.smActivePloys=[],i.pmActivePloys=[],i.operatives=[],i.activeAgent=null,i.gameOver=!1,i.smKillsScored=0,i.pmKillsScored=0,document.getElementById("start-screen").style.display="flex",document.getElementById("global-dash").style.display="none",document.getElementById("battle-area").style.display="none",document.getElementById("guidance-banner").style.display="none",document.getElementById("battle-log-lines").innerHTML="",K())}function P(e){document.getElementById("guidance-text").textContent=e}function _(e,t){const s=i.customAvatars[e];let l=t==="Space Marine"?"assets/images/defaults/default_sm_avatar.png":"assets/images/defaults/default_pm_avatar.png";const n=i.operatives.find(c=>c.id===e);if(n&&n.defaultAvatar)l=n.defaultAvatar;else{const c=R.concat(z).find(r=>r.id===e);c&&c.defaultAvatar&&(l=c.defaultAvatar)}return`<div class="op-avatar-slot main-avatar-${e}" onclick="triggerAvatarUpload(event, '${e}')">
            <img src="${s||l}" class="op-avatar-img" />
          </div>`}function K(){const e=document.getElementById("sm-roster-picker-list"),t=document.getElementById("pm-roster-picker-list");e.innerHTML="",t.innerHTML="",R.forEach(s=>{const l=document.createElement("div");l.className="roster-pick-row",l.id=`picker-row-${s.id}`;const n=s.isLeader,o=n?'<span class="role-badge leader">LEADER</span>':'<span class="role-badge">SPECIALIST</span>',c=s.weapons.map(f=>f.name.split(" ")[0]).join(" / "),r=n?"":"checked disabled";n||l.classList.add("selected");const d=_(s.id,"Space Marine");l.innerHTML=`
      <input type="checkbox" class="roster-checkbox" id="check-${s.id}" ${r} onchange="toggleSelectSM('${s.id}')">
      ${d}
      <div class="roster-op-info">
        <div class="roster-op-name">${s.name} ${o}</div>
        <div class="roster-op-weapons">HP: ${s.wounds} | 武器: ${c}</div>
      </div>
    `,n&&(l.onclick=f=>{if(f.target.className!=="roster-checkbox"&&!f.target.closest(".op-avatar-slot")){const g=document.getElementById(`check-${s.id}`);g.checked=!g.checked,ne(s.id)}}),e.appendChild(l)}),z.forEach(s=>{const l=document.createElement("div");l.className="roster-pick-row",l.id=`picker-row-${s.id}`;const n=s.isLeader,o=n?'<span class="role-badge leader" style="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(132,204,22,0.15)">LEADER</span>':'<span class="role-badge">SPECIALIST</span>',c=s.weapons.map(f=>f.name.split(" ")[0]).join(" / "),r=n?"checked disabled":"";n&&l.classList.add("selected");const d=_(s.id,"Plague Marine");l.innerHTML=`
      <input type="checkbox" class="roster-checkbox" id="check-${s.id}" ${r} onchange="toggleSelectPM('${s.id}')">
      ${d}
      <div class="roster-op-info">
        <div class="roster-op-name">${s.name} ${o}</div>
        <div class="roster-op-weapons">HP: ${s.wounds} | 武器: ${c}</div>
      </div>
    `,n||(l.onclick=f=>{if(f.target.className!=="roster-checkbox"&&!f.target.closest(".op-avatar-slot")){const g=document.getElementById(`check-${s.id}`);g.checked=!g.checked,ae(s.id)}}),t.appendChild(l)}),G()}function ne(e){m("click");const t=R.find(n=>n.id===e),s=document.getElementById(`check-${e}`);if(t.isLeader&&s.checked){const n=e==="sm_1"?"sm_2":"sm_1",o=document.getElementById(`check-${n}`);o.checked&&(o.checked=!1,document.getElementById(`picker-row-${n}`).classList.remove("selected"))}const l=document.getElementById(`picker-row-${e}`);s.checked?l.classList.add("selected"):l.classList.remove("selected"),G()}function ae(e){m("click");const t=document.getElementById(`picker-row-${e}`);document.getElementById(`check-${e}`).checked?t.classList.add("selected"):t.classList.remove("selected"),G()}function G(){let e=0;R.forEach(s=>{document.getElementById(`check-${s.id}`).checked&&e++}),document.getElementById("sm-roster-count").textContent=`已选: ${e} / 6 人`;let t=0;z.forEach(s=>{document.getElementById(`check-${s.id}`).checked&&t++}),document.getElementById("pm-roster-count").textContent=`已选: ${t} / 6 人`}function Ce(){m("click");const e=[];let t=0;R.forEach(n=>{document.getElementById(`check-${n.id}`).checked&&(e.push(n.id),n.isLeader&&t++)});const s=[];if(z.forEach(n=>{document.getElementById(`check-${n.id}`).checked&&(s.push(n.id),n.isLeader)}),e.length!==6){m("alert"),alert(`星际战士 (死亡天使) 必须刚好选择 6 人！当前选择了 ${e.length} 人。`);return}if(t!==1){m("alert"),alert("星际战士 必须选择且仅选择 1 名队长（Captain 或 Sergeant 二选一）！");return}if(s.length!==6){m("alert"),alert(`瘟疫守卫 必须刚好选择 6 人！当前选择了 ${s.length} 人。`);return}if(!document.getElementById("check-pm_1").checked){m("alert"),alert("瘟疫守卫 的 冠军队长 (Plague Champion) 是强制出战的 Leader 角色！");return}i.operatives=[],e.forEach(n=>{const o=R.find(c=>c.id===n);i.operatives.push(new ee(o.id,o.name,"Space Marine",o.wounds,o.apl,o.df,o.sv,o.weapons,o.defaultAvatar))}),s.forEach(n=>{const o=z.find(c=>c.id===n);i.operatives.push(new ee(o.id,o.name,"Plague Marine",o.wounds,o.apl,o.df,o.sv,o.weapons,o.defaultAvatar))}),document.getElementById("start-screen").style.display="none",document.getElementById("global-dash").style.display="grid",document.getElementById("battle-area").style.display="grid",document.getElementById("guidance-banner").style.display="flex",C(">>> 战队挑选部署完毕！"),C(`  - Angels of Death (星际战士) 登场: ${i.operatives.filter(n=>n.faction==="Space Marine").map(n=>n.name).join(", ")}`),C(`  - Plague Marines (瘟疫守卫) 登场: ${i.operatives.filter(n=>n.faction==="Plague Marine").map(n=>n.name).join(", ")}`),E(),H(),se()}function H(){const e=document.getElementById("sm-ops-list"),t=document.getElementById("pm-ops-list");e.innerHTML="",t.innerHTML="";let s=0,l=0;i.operatives.forEach(n=>{const o=n.faction==="Space Marine";o&&!n.isDead&&s++,!o&&!n.isDead&&l++;const c=document.createElement("div");let r=`op-card ${o?"sm-theme":"pm-theme"}`;n.isDead?r+=" dead":n.hasActed&&(r+=" activated"),i.activeAgent&&i.activeAgent.id===n.id&&(r+=" active-target"),c.className=r;const d=n.wounds/n.maxWounds*100,f=n.weapons.map(y=>y.name.split(" ")[0]).join(" / ");let g="";o&&i.smActivePloys.includes("bolter_discipline")&&!n.isDead?g='<span class="card-ploy-tag">双重射击</span>':!o&&i.pmActivePloys.includes("contagious_resilience")&&!n.isDead&&(g='<span class="card-ploy-tag" style="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(132,204,22,0.15);">减伤重投</span>');const v=_(n.id,n.faction);c.innerHTML=`
      <div class="op-card-top">
        <div class="op-avatar-row">
          ${v}
          <span class="op-card-title">${n.name} ${g}</span>
        </div>
        <span class="op-card-tag">${n.maxApl} APL</span>
      </div>
      <div class="op-card-hp">
        <span>HP (Wounds):</span>
        <span>${n.wounds} / ${n.maxWounds}</span>
      </div>
      <div class="op-hp-bar-container">
        <div class="op-hp-bar" style="width: ${d}%; background-color: ${d<40?"var(--red)":"var(--green)"}"></div>
      </div>
      <div class="op-card-stats">
        <span>DF: <strong>${n.df}</strong></span>
        <span>SV: <strong>${n.sv}+</strong></span>
        <span style="font-size: 0.65rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">
          ${f}
        </span>
      </div>
    `,!n.isDead&&!n.hasActed&&i.phase==="Firefight"&&i.activeTurn===n.faction&&!i.activeAgent?c.onclick=()=>ie(n.id):c.onclick=null,o?e.appendChild(c):t.appendChild(c)}),document.getElementById("sm-alive-count").textContent=`${s} / 6 存活`,document.getElementById("pm-alive-count").textContent=`${l} / 6 存活`}function ie(e){m("click");const t=i.operatives.find(s=>s.id===e);!t||t.isDead||t.hasActed||(i.activeAgent=t,t.apl=t.maxApl,t.actionsPerformed=[],C(`[激活] ${t.name} 开始激活，获得 ${t.apl} APL！`),H(),B())}function B(){const e=document.getElementById("active-panel-content"),t=document.getElementById("active-panel-empty"),s=document.getElementById("active-panel-status"),l=document.getElementById("active-panel");if(i.activeAgent){e.style.display="flex",t.style.display="none";const n=i.activeAgent;s.textContent="当前激活特工";const o=document.getElementById("active-op-avatar-container");o&&(o.innerHTML=_(n.id,n.faction)),l.className=`active-card ${n.faction==="Space Marine"?"sm-active":"pm-active"}`,document.getElementById("active-op-name").textContent=n.name,document.getElementById("active-op-faction").textContent=n.faction==="Space Marine"?"死亡天使":"瘟疫守卫";const c=document.getElementById("active-apl-dots");c.innerHTML="";for(let b=0;b<n.maxApl;b++){const T=document.createElement("div");T.className="apl-dot"+(b<n.apl?" active":""),c.appendChild(T)}const r=n.actionsPerformed.includes("Move"),d=n.actionsPerformed.includes("Charge"),f=n.actionsPerformed.filter(b=>b==="Shoot").length,g=n.faction==="Space Marine"&&i.smActivePloys.includes("bolter_discipline")?2:1,v=f>=g,y=n.actionsPerformed.includes("Fight");document.getElementById("action-move").disabled=n.apl<1||r||d,document.getElementById("action-charge").disabled=n.apl<1||r||d||y,document.getElementById("action-shoot").disabled=n.apl<1||v||d,document.getElementById("action-fight").disabled=n.apl<1||y;const x=n.faction==="Space Marine"&&i.smActivePloys.includes("bolter_discipline"),$=n.faction==="Plague Marine"&&i.pmActivePloys.includes("contagious_resilience"),u=document.getElementById("active-ploys-display");if(u){const b=[];x&&b.push('<span style="color:gold;">🔥 爆弹惩戒生效中</span>'),$&&b.push('<span style="color:var(--pm-accent);">🛡️ 传染韧性生效中</span>'),u.innerHTML=b.length>0?b.join(" | "):""}const h=document.querySelector("#action-shoot span:first-child");h&&(x?h.innerHTML=`💥 射击 [${f<2?2-f:0}次剩余]`:h.innerHTML="💥 射击 (Shoot)"),P(`【特工行动】${n.name} 剩余 APL: ${n.apl}。可执行移动/冲锋/射击/近战，或点击下方按钮结束。`)}else{e.style.display="none",t.style.display="block",s.textContent="等待特工激活",l.className="active-card";const n=i.activeTurn,o=n==="Space Marine"?"死亡天使":"瘟疫守卫";V(n)?P(`【激活提示】请从${n==="Space Marine"?"左边":"右边"}【${o}】战队卡片列表中选择点击发亮的特工卡片，载入动作。`):V(n==="Space Marine"?"Plague Marine":"Space Marine")?P("【激活换边】因为当前轮次已无可用单位，权能自动转回另一方。请继续点击激活。"):P("【激活结束】双方所有特工已耗尽激活！请点击右上角的回合推进至下一TP。")}}function $e(){const e=i.activeAgent;!e||e.apl<1||(m("click"),e.apl-=1,e.actionsPerformed.push("Move"),C(`  - ${e.name} 执行 [移动 (Move)]，消耗 1 APL。`),B())}function Me(){const e=i.activeAgent;!e||e.apl<1||(m("click"),e.apl-=1,e.actionsPerformed.push("Charge"),C(`  - ${e.name} 执行 [冲锋 (Charge)] 移动近战位，消耗 1 APL。`),B())}function Te(){m("click");const e=i.activeAgent;e&&(e.hasActed=!0,e.apl=0,C(`[结束激活] ${e.name} 结束了本次激活。`),i.activeAgent=null,ve())}function se(){i.phase="Initiative",E(),q();const e=document.getElementById("phase-overlay-content");e.innerHTML=`
    <h3>Turning Point ${i.turningPoint} - 先攻掷骰</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:10px;">
      游戏开始前，双方通过投掷先攻骰 (Initiative Roll-Off) 判定胜负，胜者决定谁拿先攻手牌。
    </p>

    <div class="init-roll-grid" style="margin-bottom:12px;">
      <div class="init-team-col sm">
        <h4 style="color:#60a5fa; font-size:0.9rem;">死亡天使先攻骰</h4>
        <div class="dice-pool-view" id="overlay-init-sm-dice">
          <div class="kt-dice-cube sm-dice">?</div>
        </div>
        <div id="overlay-init-sm-val" style="font-weight:bold; font-size: 0.9rem; color:var(--text-muted);">未投骰</div>
      </div>
      <div class="init-team-col pm">
        <h4 style="color:var(--pm-accent); font-size:0.9rem;">瘟疫守卫先攻骰</h4>
        <div class="dice-pool-view" id="overlay-init-pm-dice">
          <div class="kt-dice-cube pm-dice">?</div>
        </div>
        <div id="overlay-init-pm-val" style="font-weight:bold; font-size: 0.9rem; color:var(--text-muted);">未投骰</div>
      </div>
    </div>

    <button class="btn-large" id="btn-overlay-roll" onclick="rollInitiativeOverlay()" style="padding: 10px 30px; font-size:0.9rem;">开始掷骰判定</button>
  `,P("【先攻阶段】点击按钮开始判定本回合先手优势权。")}function q(){document.getElementById("phase-overlay").style.display="flex"}function U(){document.getElementById("phase-overlay").style.display="none"}function Ae(){const e=document.getElementById("overlay-init-sm-dice"),t=document.getElementById("overlay-init-pm-dice"),s=document.getElementById("btn-overlay-roll");s.disabled=!0,e.innerHTML='<div class="kt-dice-cube sm-dice rolling">?</div>',t.innerHTML='<div class="kt-dice-cube pm-dice rolling">?</div>',m("shoot"),setTimeout(()=>{const l=Math.floor(Math.random()*6)+1;e.innerHTML=`<div class="kt-dice-cube sm-dice ${l===6?"crit-dice":""}">${l}</div>`,m("click"),l===6&&m("crit"),setTimeout(()=>{const n=Math.floor(Math.random()*6)+1;if(t.innerHTML=`<div class="kt-dice-cube pm-dice ${n===6?"crit-dice":""}">${n}</div>`,m("click"),n===6&&m("crit"),l===n)m("alert"),document.getElementById("overlay-init-sm-val").textContent=`平局 [${l}]`,document.getElementById("overlay-init-pm-val").textContent=`平局 [${n}]`,s.disabled=!1,s.textContent="平局！重新投骰",C(`  - 先攻判定平局 [${l}]，准备重投...`);else{const c=(l>n?"Space Marine":"Plague Marine")==="Space Marine"?"死亡天使":"瘟疫守卫";m("crit"),document.getElementById("overlay-init-sm-val").textContent=`点数: ${l}`,document.getElementById("overlay-init-pm-val").textContent=`点数: ${n}`,C(`  - 先攻判定掷骰：死亡天使 [${l}] vs 瘟疫守卫 [${n}]`),C(`  - 【${c}】赢得了投骰，准备选择先攻权归属。`);const r=document.getElementById("phase-overlay-content");r.innerHTML+=`
          <div style="border-top:1px solid var(--panel-border); margin-top:16px; padding-top:16px; width:100%;">
            <p style="color:var(--sm-accent); font-weight:bold; margin-bottom:10px;">👑 【${c}】选择首发玩家：</p>
            <div style="display:flex; gap:10px;">
              <button class="qa-btn" onclick="selectTurnOrder('Space Marine')">死亡天使先攻 (Astartes First)</button>
              <button class="qa-btn" onclick="selectTurnOrder('Plague Marine')">瘟疫守卫先攻 (Death Guard First)</button>
            </div>
          </div>
        `,P(`【选择先后】王座归属：【${c}】玩家获胜，请点击按钮指定本回合先攻。`)}},300)},700)}function Se(e){m("click"),i.initiative=e,i.activeTurn=e,C(`  - 确认：【${e==="Space Marine"?"死亡天使":"瘟疫守卫"}】获得本回合的先攻优势！`),oe()}function oe(){i.phase="Strategy",E(),q();const e=document.getElementById("phase-overlay-content");e.innerHTML=`
    <h3>Turning Point ${i.turningPoint} - 策略阶段</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">
      在此阶段，双方可以使用命令点 (CP) 激活计策 (Strategic Ploys)。
    </p>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">
      <div class="ploy-choice-card ${i.smActivePloys.includes("bolter_discipline")?"selected":""}" onclick="buyPloy('sm')">
        <div class="ploy-title">
          <span>🔥 爆弹惩戒 (1 CP)</span>
          <span style="font-size:0.75rem; color:#60a5fa;">Astartes</span>
        </div>
        <div class="ploy-desc">
          死亡天使特工本回合激活内，可以使用<b>两次</b>射击行动。
        </div>
        <div style="margin-top:6px; font-weight:bold; font-size:0.75rem; color:var(--sm-accent);">
          ${i.smActivePloys.includes("bolter_discipline")?"● 生效中":"点击启用"}
        </div>
      </div>

      <div class="ploy-choice-card ${i.pmActivePloys.includes("contagious_resilience")?"selected":""}" onclick="buyPloy('pm')">
        <div class="ploy-title">
          <span>🛡️ 传染韧性 (1 CP)</span>
          <span style="font-size:0.75rem; color:var(--pm-accent);">Death Guard</span>
        </div>
        <div class="ploy-desc">
          瘟疫守卫在结算【恶心作呕 (DR)】伤害减免时，可<b>重投第一个失败的减伤骰</b>。
        </div>
        <div style="margin-top:6px; font-weight:bold; font-size:0.75rem; color:var(--pm-accent);">
          ${i.pmActivePloys.includes("contagious_resilience")?"● 生效中":"点击启用"}
        </div>
      </div>
    </div>

    <button class="btn-large" onclick="proceedToFirefight()" style="padding: 10px 40px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #065f46); border-color:#059669; box-shadow:none;">
      进入战斗阶段 (Proceed to Firefight)
    </button>
  `,P("【策略阶段】双方轮流消费 1 CP 采购策略 Ploys。按 Proceed 按钮进入实际交火战斗。")}function Pe(e){if(e==="sm")if(i.smActivePloys.includes("bolter_discipline"))m("click"),i.smActivePloys=[],i.smCp+=1;else{if(i.smCp<1){m("alert"),alert("死亡天使 CP 不足！");return}m("crit"),i.smActivePloys.push("bolter_discipline"),i.smCp-=1,C("  - 死亡天使激活策略：【爆弹惩戒】！本回合可双击开火！")}else if(i.pmActivePloys.includes("contagious_resilience"))m("click"),i.pmActivePloys=[],i.pmCp+=1;else{if(i.pmCp<1){m("alert"),alert("瘟疫守卫 CP 不足！");return}m("crit"),i.pmActivePloys.push("contagious_resilience"),i.pmCp-=1,C("  - 瘟疫守卫激活策略：【传染韧性】！DR首发失败可重投！")}oe()}function Ee(){m("click"),U(),i.phase="Firefight",E(),C(`
【战斗阶段开始】Turning Point ${i.turningPoint}`),C(`>>> 首发方【${i.activeTurn==="Space Marine"?"死亡天使":"瘟疫守卫"}】可以激活一名特工。`),H(),B(),P("【特工激活期】在两侧列表中点击未激活的特工（高亮）卡片，载入中央控制板执行动作。")}function De(e){m("click");const t=he[e];t&&(document.getElementById("help-title").textContent=t.title,document.getElementById("help-body").innerHTML=t.body,document.getElementById("help-modal").style.display="flex")}function Le(){m("click"),document.getElementById("help-modal").style.display="none"}function Be(e){m("funeral");const t=document.getElementById("death-overlay"),s=document.getElementById("death-model-name"),l=document.getElementById("death-model-faction"),n=document.getElementById("death-gag-text");if(t){s.textContent=e.name,l.textContent=e.faction==="Space Marine"?"死亡天使 (Angels of Death)":"瘟疫守卫 (Plague Marines)";const o=Math.floor(Math.random()*Z.length);n.textContent=Z[o],t.style.display="flex"}C(`[阵亡提示] 特工 ${e.name} 已阵亡！请在物理沙盘中移除模型。`)}function Ie(){m("click");const e=document.getElementById("death-overlay");e&&(e.style.display="none"),Ve()}function Ve(){if(i.gameOver)return;const e=i.operatives.filter(s=>s.faction==="Space Marine"&&!s.isDead).length,t=i.operatives.filter(s=>s.faction==="Plague Marine"&&!s.isDead).length;e===0&&t===0?(i.gameOver=!0,I("draw","双方均全员阵亡，战斗以同归于尽平局告终！")):e===0?(i.gameOver=!0,I("pm",`死亡天使战队全员阵亡！
瘟疫守卫 (Plague Marines) 成功清剿了残敌，夺取了战场的完全控制权！`)):t===0&&(i.gameOver=!0,I("sm",`瘟疫守卫战队全员阵亡！
死亡天使 (Angels of Death) 肃清了战场，坚守住帝国的光荣防线！`))}function I(e,t){q();const s=document.getElementById("phase-overlay-content");let l="🎉 对局结束 🎉",n="var(--text-main)";e==="sm"?(l="🏆 死亡天使 (Angels of Death) 荣获胜利！ 🏆",n="#60a5fa"):e==="pm"?(l="🏆 瘟疫守卫 (Plague Marines) 荣获胜利！ 🏆",n="var(--pm-accent)"):e==="draw"&&(l="🤝 双方同归于尽 (Match Draw) 🤝",n="var(--sm-accent)"),s.innerHTML=`
    <h3 style="color: ${n}; font-size: 1.4rem; margin-bottom: 12px;">${l}</h3>
    <div class="qa-card" style="margin-bottom: 20px; font-size: 0.95rem; text-align: center; line-height: 1.6; border-color: rgba(255,255,255,0.1);">
      <p style="white-space: pre-line; color: var(--text-main);">${t}</p>
    </div>
    <button class="btn-large" onclick="confirmReset()" style="padding: 10px 30px; font-size:0.9rem; background: var(--red); border-color: #f43f5e; width: 100%;">
      返回主菜单并重置对局
    </button>
  `}function le(){i.phase="TurnEndScoring",E(),q();const e=i.operatives.filter(n=>n.faction==="Plague Marine"&&n.isDead).length,t=i.operatives.filter(n=>n.faction==="Space Marine"&&n.isDead).length,s=e-i.smKillsScored,l=t-i.pmKillsScored;i.tempSmChecklist=[!1,!1,!1,!1,!1],i.tempPmChecklist=[!1,!1,!1,!1,!1],i.tempSmObjManualOffset=0,i.tempPmObjManualOffset=0,i.tempSmObjVp=0,i.tempPmObjVp=0,i.tempSmKillVp=s,i.tempPmKillVp=l,i.tempSmKills=e,i.tempPmKills=t,Q(),P("【回合结算】引导计算 VP：请输入双方本回合完成任务的 VP，并确认得分结算。")}function Q(){const e=document.getElementById("phase-overlay-content"),t=i.tempSmKillVp+i.tempSmObjVp,s=i.tempPmKillVp+i.tempPmObjVp,l=i.turningPoint>=5,n=l?"确认结算并完成对局":"确认结算并推进回合",o=l?"declareScoreVictory()":"confirmTurnEndScoring()";e.innerHTML=`
    <h3 style="font-size:1.3rem; margin-bottom: 8px;">Turning Point ${i.turningPoint} - 得分结算</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:15px; text-align:center;">
      每回合结束时，引导玩家计算任务得分，并由系统自动根据击杀数累加击杀 VP（1 击杀 = 1 VP）。
    </p>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">

      <!-- SM 结算 -->
      <div class="init-team-col sm" style="align-items:stretch; background: rgba(59,130,246,0.02); border: 1px solid rgba(59,130,246,0.1);">
        <h4 style="color:#60a5fa; font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px; text-align:center; font-family:'Orbitron',sans-serif;">
          死亡天使 (SM)
        </h4>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>⚔️ 新增击杀得分：</span>
            <span style="font-weight:bold; color:var(--sm-accent);">${i.tempSmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${i.tempSmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">任务结算助手 (Objective Checklist)</div>
            <label class="scoring-item">
              <input type="checkbox" ${i.tempSmChecklist[0]?"checked":""} onchange="toggleScoringChecklist('sm', 0)">
              <span>控制1+目标点 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${i.tempSmChecklist[1]?"checked":""} onchange="toggleScoringChecklist('sm', 1)">
              <span>控制目标多于对手 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${i.tempSmChecklist[2]?"checked":""} onchange="toggleScoringChecklist('sm', 2)">
              <span>完成特定任务动作 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${i.tempSmChecklist[3]?"checked":""} onchange="toggleScoringChecklist('sm', 3)">
              <span>本回合秘密任务1 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${i.tempSmChecklist[4]?"checked":""} onchange="toggleScoringChecklist('sm', 4)">
              <span>本回合秘密任务2 (+1 VP)</span>
            </label>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span>🎯 调整任务得分 (Total Obj VP)：</span>
            <div class="val-control">
              <button class="adjust-btn" onclick="adjustScoreTemp('sm', -1)">-</button>
              <span class="val" style="font-size:1.1rem; font-weight:bold; min-width:20px; text-align:center;">${i.tempSmObjVp}</span>
              <button class="adjust-btn" onclick="adjustScoreTemp('sm', 1)">+</button>
            </div>
          </div>
          <div style="border-top:1px dashed rgba(255,255,255,0.1); padding-top:8px; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:0.95rem;">
            <span>本回合得分小计：</span>
            <span style="color:#60a5fa;">+${t} VP</span>
          </div>
        </div>
      </div>

      <!-- PM 结算 -->
      <div class="init-team-col pm" style="align-items:stretch; background: rgba(34,197,94,0.02); border: 1px solid rgba(34,197,94,0.1);">
        <h4 style="color:var(--pm-accent); font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px; text-align:center; font-family:'Orbitron',sans-serif;">
          瘟疫守卫 (PM)
        </h4>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>⚔️ 新增击杀得分：</span>
            <span style="font-weight:bold; color:var(--pm-accent);">${i.tempPmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${i.tempPmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">任务结算助手 (Objective Checklist)</div>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${i.tempPmChecklist[0]?"checked":""} onchange="toggleScoringChecklist('pm', 0)">
              <span>控制1+目标点 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${i.tempPmChecklist[1]?"checked":""} onchange="toggleScoringChecklist('pm', 1)">
              <span>控制目标多于对手 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${i.tempPmChecklist[2]?"checked":""} onchange="toggleScoringChecklist('pm', 2)">
              <span>完成特定任务动作 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${i.tempPmChecklist[3]?"checked":""} onchange="toggleScoringChecklist('pm', 3)">
              <span>本回合秘密任务1 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${i.tempPmChecklist[4]?"checked":""} onchange="toggleScoringChecklist('pm', 4)">
              <span>本回合秘密任务2 (+1 VP)</span>
            </label>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span>🎯 调整任务得分 (Total Obj VP)：</span>
            <div class="val-control">
              <button class="adjust-btn" onclick="adjustScoreTemp('pm', -1)">-</button>
              <span class="val" style="font-size:1.1rem; font-weight:bold; min-width:20px; text-align:center;">${i.tempPmObjVp}</span>
              <button class="adjust-btn" onclick="adjustScoreTemp('pm', 1)">+</button>
            </div>
          </div>
          <div style="border-top:1px dashed rgba(255,255,255,0.1); padding-top:8px; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:0.95rem;">
            <span>本回合得分小计：</span>
            <span style="color:var(--pm-accent);">+${s} VP</span>
          </div>
        </div>
      </div>

    </div>

    <button class="btn-large" onclick="${o}" style="padding: 12px 30px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #065f46); border-color:#059669; box-shadow:none; width: 100%;">
      ${n}
    </button>
  `}function Re(e,t){m("click"),e==="sm"?(i.tempSmChecklist[t]=!i.tempSmChecklist[t],i.tempSmObjVp=Math.max(0,i.tempSmChecklist.filter(Boolean).length+i.tempSmObjManualOffset)):(i.tempPmChecklist[t]=!i.tempPmChecklist[t],i.tempPmObjVp=Math.max(0,i.tempPmChecklist.filter(Boolean).length+i.tempPmObjManualOffset)),Q()}function He(e,t){m("click"),e==="sm"?(i.tempSmObjManualOffset+=t,i.tempSmObjVp=Math.max(0,i.tempSmChecklist.filter(Boolean).length+i.tempSmObjManualOffset)):(i.tempPmObjManualOffset+=t,i.tempPmObjVp=Math.max(0,i.tempPmChecklist.filter(Boolean).length+i.tempPmObjManualOffset)),Q()}function Oe(){m("crit");const e=i.tempSmKillVp+i.tempSmObjVp,t=i.tempPmKillVp+i.tempPmObjVp;i.smVp+=e,i.pmVp+=t,i.smKillsScored=i.tempSmKills,i.pmKillsScored=i.tempPmKills,C(`
--- Turning Point ${i.turningPoint} 回合结算结果 ---`),C(`[死亡天使] 新增 ${e} VP (任务:${i.tempSmObjVp}, 击杀:${i.tempSmKillVp}) | 累计 VP: ${i.smVp}`),C(`[瘟疫守卫] 新增 ${t} VP (任务:${i.tempPmObjVp}, 击杀:${i.tempPmKillVp}) | 累计 VP: ${i.pmVp}`),U(),ge()}function ze(){m("crit");const e=i.tempSmKillVp+i.tempSmObjVp,t=i.tempPmKillVp+i.tempPmObjVp;i.smVp+=e,i.pmVp+=t,i.smKillsScored=i.tempSmKills,i.pmKillsScored=i.tempPmKills,i.gameOver=!0,E();let s=`双方经历五回合激烈交火，战斗正式落幕！
最终战队积分：
死亡天使: ${i.smVp} VP
瘟疫守卫: ${i.pmVp} VP

`;i.smVp===i.pmVp?I("draw",s+"双方得分平分秋色，本局握手言和！"):i.smVp>i.pmVp?I("sm",s+"死亡天使胜利点数更高，赢得最终胜利！"):I("pm",s+"瘟疫守卫胜利点数更高，赢得最终胜利！")}function _e(e,t){e.stopPropagation();const s=document.getElementById("global-avatar-uploader");s&&(s.dataset.targetOpId=t,s.value="",s.click())}function Ne(e){const t=e.target.files[0];if(!t)return;const s=e.target.dataset.targetOpId;if(!s)return;const l=new FileReader;l.onload=function(n){const o=n.target.result;i.customAvatars[s]=o,K(),H(),B(),C(`[头像上传] 成功更新特工 [${s}] 的自定义照片！`)},l.readAsDataURL(t)}function qe(e,t="normal"){document.body.classList.remove("intense-shake"),document.body.offsetWidth,document.body.classList.add("intense-shake"),setTimeout(()=>{document.body.classList.remove("intense-shake")},400);const s=document.createElement("div");s.className="impact-effect-text",s.textContent=e,t==="strike"?(s.style.color="var(--red)",s.style.textShadow="0 0 20px rgba(225, 29, 72, 0.85), 0 0 40px #000"):t==="parry"?(s.style.color="#38bdf8",s.style.textShadow="0 0 20px rgba(56, 189, 248, 0.85), 0 0 40px #000"):t==="shoot"?s.style.color="var(--sm-accent)":t==="deflect"&&(s.style.color="#a3e635",s.style.textShadow="0 0 20px rgba(163, 230, 53, 0.85), 0 0 40px #000"),document.body.appendChild(s),setTimeout(()=>{s.remove()},1800)}function Fe(e,t){[`.duel-avatar-${e}`,`.main-avatar-${e}`].forEach(l=>{const n=document.querySelector(l);if(!n)return;n.classList.remove("avatar-hit-flash"),n.querySelectorAll(".bullet-hole-effect, .slash-effect").forEach(r=>r.remove()),n.offsetWidth,n.classList.add("avatar-hit-flash");const c=document.createElement("div");c.className=t==="shoot"?"bullet-hole-effect":"slash-effect",n.appendChild(c),setTimeout(()=>{n.classList.remove("avatar-hit-flash"),c.remove()},900)})}const w={};function je(e){Object.assign(w,e)}function ce(){document.getElementById("combat-modal").style.display="flex",document.getElementById("modal-btn-next").disabled=!0}function F(){m("click"),document.getElementById("combat-modal").style.display="none",w.renderOperatives(),w.updateActivePanel()}function Y(){if(m("click"),a.actionType==="shoot"){if(a.step===3){if(!a.inRangeAndVisible){m("alert"),alert("目标不可见或超出武器射程，无法进行射击行动！");return}if(a.inCoverConcealed){m("alert"),alert("目标处于隐蔽姿态且紧贴重掩体，属于不可被选定状态，无法对其进行射击！");return}}else if(a.step===4&&a.mode==="manual"){if(tt(),a.attackRolls.length===0){alert("请输入有效的攻击骰点数！");return}}else if(a.step===5&&a.mode==="manual"){nt();const e=document.getElementById("manual-def-dice-val");if(e&&e.value.trim()!==""&&a.defenseRolls.length===0){alert("请输入有效的防御骰点数！");return}}}else if(a.actionType==="fight"&&a.step===3){if(!a.inMeleeRange){m("alert"),alert("目标必须在 1 英寸（1🔺）交战距离内，才能进行近战搏斗！");return}if(a.hasFallenBack){m("alert"),alert("已执行退却（Fall Back）行动的特工，本回合激活内无法执行格斗（Fight）动作！");return}}a.step++,a.actionType==="shoot"?A():a.actionType==="fight"&&L()}function re(){m("click");const e=i.activeAgent;if(!e)return;const t=document.querySelector("#combat-modal .modal-content");if(t&&(t.style.backgroundImage='linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("assets/images/backgrounds/bg_shoot_action.png")',t.style.backgroundSize="cover",t.style.backgroundPosition="center"),Object.assign(a,{actionType:"shoot",step:1,attacker:e,defender:null,weapon:e.weapons.filter(s=>s.isRanged)[0]||null,inRangeAndVisible:!0,inCoverConcealed:!1,inCover:!1,mode:"random",attRerollIndex:-1,defRerollIndex:-1,attackRolls:[],defenseRolls:[]}),!a.weapon){alert("该特工没有配备任何远程武器！");return}ce(),A()}function A(){const e=document.getElementById("modal-title"),t=document.getElementById("modal-body"),s=document.getElementById("modal-btn-next"),l=document.getElementById("modal-btn-cancel");if(s.onclick=Y,l.style.display="inline-block",a.step===1){e.textContent="射击结算 - 步骤 1: 选择目标";const n=a.attacker.faction==="Space Marine"?"Plague Marine":"Space Marine",o=i.operatives.filter(r=>r.faction===n&&!r.isDead);if(o.length===0){t.innerHTML='<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>',s.disabled=!0;return}let c='<div class="weapon-picker-list">';o.forEach(r=>{c+=`
        <div class="weapon-pick-item ${a.defender&&a.defender.id===r.id?"selected":""}" onclick="selectShootDefender('${r.id}')">
          <span class="weapon-pick-name">${r.name}</span>
          <span class="weapon-pick-stats">HP: ${r.wounds}/${r.maxWounds} | DF:${r.df}</span>
        </div>
      `}),c+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要射击的敌方特工：</p>
      ${c}
    `,s.textContent="选择武器",s.disabled=!a.defender}else if(a.step===2){e.textContent="射击结算 - 步骤 2: 选择武器";const n=a.attacker.weapons.filter(c=>c.isRanged);let o='<div class="weapon-picker-list">';n.forEach((c,r)=>{o+=`
        <div class="weapon-pick-item ${a.weapon.name===c.name?"selected":""}" onclick="selectShootWeapon(${r})">
          <span class="weapon-pick-name">${c.name}</span>
          <span class="weapon-pick-stats">A: ${c.attacks} | BS: ${c.ts}+ | D: ${c.normalDamage}/${c.criticalDamage}</span>
        </div>
      `}),o+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要射击使用的武器：</p>
      ${o}
    `,s.textContent="回答判定问题",s.disabled=!1}else if(a.step===3)e.textContent="射击结算 - 步骤 3: 距离与掩体判定",t.innerHTML=`
      <p style="margin-bottom: 12px; color:var(--text-muted);">回答以下判定问题以完成结算：</p>

      <div class="qa-card">
        <div class="qa-question">1. 目标是否在你的有效视线和射程内？</div>
        <div class="qa-options">
          <button class="qa-btn ${a.inRangeAndVisible?"selected":""}" onclick="setQA('inRangeAndVisible', true)">是 (在射程内)</button>
          <button class="qa-btn ${a.inRangeAndVisible?"":"selected"}" onclick="setQA('inRangeAndVisible', false)">否 (无法见/超射程)</button>
        </div>
      </div>

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">2. 目标是否处于【隐蔽】状态，且紧贴重掩体？</div>
        <div class="qa-options">
          <button class="qa-btn ${a.inCoverConcealed?"selected":""}" onclick="setQA('inCoverConcealed', true)">是 (无法射击)</button>
          <button class="qa-btn ${a.inCoverConcealed?"":"selected"}" onclick="setQA('inCoverConcealed', false)">否 (可以选定)</button>
        </div>
      </div>

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">3. 目标是否在掩体中 (Cover)？</div>
        <div class="qa-options">
          <button class="qa-btn ${a.inCover?"selected":""}" onclick="setQA('inCover', true)">是 (触发掩体成功保留)</button>
          <button class="qa-btn ${a.inCover?"":"selected"}" onclick="setQA('inCover', false)">否 (开阔地带)</button>
        </div>
      </div>
    `,s.textContent="选择掷骰模式",s.disabled=!1;else if(a.step===4){e.textContent="射击结算 - 步骤 4: 攻击方掷骰 (Angels of Death)";let n="";const o=a.attacker.faction==="Space Marine"?i.smCp:i.pmCp;a.attackRolls.length>0&&(n=`
        <div class="roll-summary-block" style="margin-top:10px;">
          🎯 <b>命中统计:</b> 暴击(6点): <span style="color:var(--sm-accent); font-weight:bold;">${a.attackCrit}</span>, 普通命中(${a.weapon.ts}+): <span style="color:#60a5fa;">${a.attackNorm}</span>
          ${o>=1&&a.attRerollIndex===-1?'<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上方任何一个未命中的灰色骰子重投。</span>':""}
        </div>
      `),t.innerHTML=`
      ${W()}

      <p style="margin-bottom: 12px;">武器 [${a.weapon.name}]，攻击骰数: <b>${a.weapon.attacks}</b>，命中要求: <b>${a.weapon.ts}+</b></p>

      <div class="qa-options" style="margin-bottom: 16px;">
        <button class="qa-btn ${a.mode==="random"?"selected":""}" onclick="setRollMode('random')">动画/数字掷骰 (Mode B)</button>
        <button class="qa-btn ${a.mode==="manual"?"selected":""}" onclick="setRollMode('manual')">物理骰子录入 (Mode A)</button>
      </div>

      <div class="dice-rolling-area" id="attack-rolling-zone">
        <div class="dice-pool-view" id="attack-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        <button class="modal-btn primary" id="btn-roll-attack" onclick="rollAttackDice()">开始顺序掷骰</button>
      </div>

      ${n}

      <div id="manual-attack-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${a.weapon.attacks} 个骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-att-dice-val" value="6, 4, 3, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
      </div>
    `,a.attackRolls.length>0?(s.disabled=!1,Ye()):a.mode==="manual"?s.disabled=!1:s.disabled=!0,s.textContent="防守方投骰"}else if(a.step===5){e.textContent="射击结算 - 步骤 5: 防守方防御掷骰 (Plague Marines)";let n="",o=a.defender.df;a.inCover&&(n=`<p style="color:var(--pm-accent); margin-bottom: 4px;">🛡️ 目标在掩体中：自动获得 1 个普通成功，且防御投骰池减 1 (DF = ${o} -> ${o-1})</p>`,o=Math.max(0,o-1));let c="";const r=a.defender.faction==="Space Marine"?i.smCp:i.pmCp;a.defenseRolls.length>0&&o>0&&(c=`
        <div class="roll-summary-block" style="margin-top:10px;">
          🛡️ <b>防守统计:</b> 暴击防守: <span style="color:var(--pm-accent); font-weight:bold;">${a.defCrit}</span>, 普通防守(${a.defender.sv}+): <span style="color:#86efac;">${a.defNorm}</span>
          ${r>=1&&a.defRerollIndex===-1?'<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上面任何一个未命中的灰色骰子重投。</span>':""}
        </div>
      `),t.innerHTML=`
      ${W()}

      <p style="margin-bottom: 6px;">防守特工: [${a.defender.name}]，保护要求: <b>${a.defender.sv}+</b></p>
      ${n}
      <p style="margin-bottom: 12px;">需要投掷的防御骰数: <b>${o}</b></p>

      <div class="dice-rolling-area" id="defense-rolling-zone">
        <div class="dice-pool-view" id="defense-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        <button class="modal-btn primary" id="btn-roll-defense" onclick="rollDefenseDice(${o})">开始顺序防守投骰</button>
      </div>

      ${c}

      <div id="manual-defense-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${o} 个防御骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-def-dice-val" value="5, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
      </div>
    `,a.defenseRolls.length>0||o===0?(s.disabled=!1,Ze()):a.mode==="manual"?s.disabled=!1:s.disabled=!0,s.textContent="计算伤害与对消"}else if(a.step===6){e.textContent="射击结算 - 步骤 6: 匹配对消与最终扣血";let n=a.attackCrit,o=a.attackNorm,c=a.defCrit,r=a.defNorm;const d=Math.min(n,c);n-=d,c-=d;let f=0;n>0&&r>=2&&(f=Math.min(n,Math.floor(r/2)),n-=f,r-=f*2);const g=Math.min(o,r);o-=g,r-=g;const v=Math.min(o,c);o-=v,c-=v;const y=n*a.weapon.criticalDamage+o*a.weapon.normalDamage;let x=`
      <div class="matching-view">
        <div class="matching-row">
          <span class="matching-label">攻击命中</span>
          <div class="matching-dice-list">
    `;for(let u=0;u<a.attackCrit;u++)x+='<div class="kt-dice-cube sm-dice crit-dice">6</div>';for(let u=0;u<a.attackNorm;u++)x+=`<div class="kt-dice-cube sm-dice">${a.weapon.ts}</div>`;a.attackCrit+a.attackNorm===0&&(x+='<span style="font-size:0.8rem; color:var(--text-muted);">无命中</span>'),x+=`
          </div>
        </div>
        <div class="matching-row">
          <span class="matching-label">防御保护</span>
          <div class="matching-dice-list">
    `;for(let u=0;u<a.defCrit;u++)x+='<div class="kt-dice-cube pm-dice crit-dice">6</div>';for(let u=0;u<a.defNorm;u++)x+=`<div class="kt-dice-cube pm-dice">${a.defender.sv}</div>`;a.defCrit+a.defNorm===0&&(x+='<span style="font-size:0.8rem; color:var(--text-muted);">无防御成功</span>'),x+=`
          </div>
        </div>
      </div>
    `;let $="";a.defender.faction==="Plague Marine"&&y>0&&($=`
        <div id="manual-dr-container" style="background:var(--dark-card); padding:10px; border-radius:8px; margin-top:8px; border:1px solid var(--panel-border);">
          <label style="font-size:0.75rem; color:var(--text-muted);">录入瘟疫守卫【恶心作呕】的 ${y} 个投骰点数 (为空则按随机)：</label>
          <input type="text" id="manual-dr-dice-val" placeholder="placeholder" style="margin-top:4px; padding:6px; font-size:0.9rem; background:#000; border:1px solid #334155; color:#fff; width:100%;">
        </div>
      `),t.innerHTML=`
      ${W()}

      ${x}

      <div class="qa-card" style="margin-top:10px;">
        <p style="font-size:0.95rem; font-weight:600; color:#fff;">最终对消计算汇报：</p>
        <p style="margin-top:4px;">- 暴击命中残留: <b>${n}</b> 个 (每个伤害: ${a.weapon.criticalDamage})</p>
        <p>- 普通命中残留: <b>${o}</b> 个 (每个伤害: ${a.weapon.normalDamage})</p>
        <p style="color:var(--sm-accent); font-weight:bold; margin-top:8px; font-size:1rem;">分配伤害总计: ${y} 点</p>
      </div>

      ${$}
    `,s.textContent="完成结算并扣血",s.disabled=!1,s.onclick=()=>at(y),y>0&&setTimeout(()=>{w.triggerAvatarHitEffect(a.defender.id,"shoot")},150)}}function We(e){m("click"),a.defender=i.operatives.find(t=>t.id===e),A()}function Ke(e){m("click"),a.weapon=a.attacker.weapons.filter(t=>t.isRanged)[e],A()}function Ge(e,t){m("click"),a[e]=t,A()}function Ue(e){m("click"),a.mode=e,A(),e==="manual"?(document.getElementById("manual-attack-input").style.display="block",document.getElementById("attack-rolling-zone").style.display="none",document.getElementById("modal-btn-next").disabled=!1):(document.getElementById("manual-attack-input").style.display="none",document.getElementById("attack-rolling-zone").style.display="flex",document.getElementById("modal-btn-next").disabled=a.attackRolls.length===0)}function Qe(){const e=document.getElementById("modal-btn-next"),t=document.getElementById("attack-dice-pool"),s=document.getElementById("btn-roll-attack");s.disabled=!0,e.disabled=!0;const l=a.attacker.faction==="Space Marine"?"sm-dice":"pm-dice";t.innerHTML="";const n=a.weapon.attacks;for(let d=0;d<n;d++)t.innerHTML+=`<div class="kt-dice-cube ${l} rolling">?</div>`;w.triggerCombatVisual("🔥 OPEN FIRE!","shoot"),m("shoot");const o=[];let c=0;function r(){if(c<n){const d=Math.floor(Math.random()*6)+1;o.push(d);const g=t.getElementsByClassName("kt-dice-cube")[c];g.classList.remove("rolling"),g.textContent=d,d===6?(g.classList.add("crit-dice"),m("crit")):(d<a.weapon.ts&&g.classList.add("fail-dice"),m("click")),c++,setTimeout(r,400)}else{a.attackRolls=o,X();const d=a.attackCrit+a.attackNorm;d===0?(m("epic_fail"),w.triggerCombatVisual("❌ ALL MISSED!","normal")):(d===n||a.attackCrit>=2)&&(m("epic_win"),w.triggerCombatVisual("✨ EPIC SHOTS!","shoot")),A()}}setTimeout(r,1200)}function Ye(){const e=document.getElementById("attack-dice-pool");if(!e)return;e.innerHTML="";const t=a.attacker.faction,s=t==="Space Marine"?i.smCp:i.pmCp,l=t==="Space Marine"?"sm-dice":"pm-dice";a.attackRolls.forEach((n,o)=>{const c=document.createElement("div");let r=`kt-dice-cube ${l}`;if(n===6?r+=" crit-dice":n<a.weapon.ts&&(r+=" fail-dice"),c.className=r,c.textContent=n,n<a.weapon.ts&&s>=1&&a.attRerollIndex===-1){const f=document.createElement("div");f.className="reroll-indicator",f.textContent="R",c.appendChild(f),c.onclick=()=>Xe(o),c.style.cursor="pointer"}else if(o===a.attRerollIndex){const f=document.createElement("div");f.className="reroll-indicator",f.style.background="var(--green)",f.textContent="✓",c.appendChild(f)}e.appendChild(c)})}function Xe(e){m("shoot"),a.attacker.faction==="Space Marine"?i.smCp-=1:i.pmCp-=1,w.updateScoresUI(),a.attRerollIndex=e;const l=document.getElementById("attack-dice-pool").getElementsByClassName("kt-dice-cube")[e],n=a.attacker.faction==="Space Marine"?"sm-dice":"pm-dice";l.className=`kt-dice-cube ${n} rolling`,l.innerHTML="?",setTimeout(()=>{const o=Math.floor(Math.random()*6)+1;w.addLog(`  - [重投] 攻击方消耗 1 CP重投 D6: [${a.attackRolls[e]}] -> [${o}]`),a.attackRolls[e]=o,X(),A()},500)}function X(){let e=0,t=0;const s=a.weapon.ts;a.attackRolls.forEach(l=>{l===6?e++:l>=s&&t++}),a.attackCrit=e,a.attackNorm=t}function Je(e){const t=document.getElementById("modal-btn-next"),s=document.getElementById("defense-dice-pool"),l=document.getElementById("btn-roll-defense");if(e===0){a.defCrit=0,a.defNorm=a.inCover?1:0,t.disabled=!1;return}l.disabled=!0,t.disabled=!0;const n=a.defender.faction==="Space Marine"?"sm-dice":"pm-dice";s.innerHTML="";for(let d=0;d<e;d++)s.innerHTML+=`<div class="kt-dice-cube ${n} rolling">?</div>`;w.triggerCombatVisual("🛡️ INCOMING FIRE!","parry"),m("shoot");const o=[];let c=0;function r(){if(c<e){const d=Math.floor(Math.random()*6)+1;o.push(d);const g=s.getElementsByClassName("kt-dice-cube")[c];g.classList.remove("rolling"),g.textContent=d,d===6?(g.classList.add("crit-dice"),m("crit")):(d<a.defender.sv&&g.classList.add("fail-dice"),m("click")),c++,setTimeout(r,400)}else{a.defenseRolls=o,J();const d=a.defender.sv,f=o.filter(v=>v>=d).length,g=o.filter(v=>v===6).length;f===0?(m("epic_fail"),w.triggerCombatVisual("💀 DEFENSE BUSTED!","normal")):(f===e||g>=2)&&(m("epic_win"),w.triggerCombatVisual("🛡️ SHIELD CLUTCH!","deflect")),A()}}setTimeout(r,1200)}function Ze(e){const t=document.getElementById("defense-dice-pool");if(!t)return;t.innerHTML="";const s=a.defender.faction,l=s==="Space Marine"?i.smCp:i.pmCp,n=s==="Space Marine"?"sm-dice":"pm-dice";a.defenseRolls.forEach((o,c)=>{const r=document.createElement("div");let d=`kt-dice-cube ${n}`;if(o===6?d+=" crit-dice":o<a.defender.sv&&(d+=" fail-dice"),r.className=d,r.textContent=o,o<a.defender.sv&&l>=1&&a.defRerollIndex===-1){const g=document.createElement("div");g.className="reroll-indicator",g.textContent="R",r.appendChild(g),r.onclick=()=>et(c),r.style.cursor="pointer"}else if(c===a.defRerollIndex){const g=document.createElement("div");g.className="reroll-indicator",g.style.background="var(--green)",g.textContent="✓",r.appendChild(g)}t.appendChild(r)})}function et(e,t){m("save"),a.defender.faction==="Space Marine"?i.smCp-=1:i.pmCp-=1,w.updateScoresUI(),a.defRerollIndex=e;const n=document.getElementById("defense-dice-pool").getElementsByClassName("kt-dice-cube")[e],o=a.defender.faction==="Space Marine"?"sm-dice":"pm-dice";n.className=`kt-dice-cube ${o} rolling`,n.innerHTML="?",setTimeout(()=>{const c=Math.floor(Math.random()*6)+1;w.addLog(`  - [重投] 防御方消耗 1 CP重投 D6: [${a.defenseRolls[e]}] -> [${c}]`),a.defenseRolls[e]=c,J(),A()},500)}function J(){let e=0,t=a.inCover?1:0;const s=a.defender.sv;a.defenseRolls.forEach(l=>{l===6?e++:l>=s&&t++}),a.defCrit=e,a.defNorm=t}function tt(){const e=document.getElementById("manual-att-dice-val");if(!e)return;const s=e.value.split(",").map(l=>parseInt(l.trim(),10)).filter(l=>!isNaN(l)&&l>=1&&l<=6);a.attackRolls=s,X()}function nt(){const e=document.getElementById("manual-def-dice-val");if(!e)return;const s=e.value.split(",").map(l=>parseInt(l.trim(),10)).filter(l=>!isNaN(l)&&l>=1&&l<=6);a.defenseRolls=s,J()}function at(e){m("click");const t=a.attacker,s=a.defender;let l=null;const n=document.getElementById("manual-dr-dice-val");n&&n.value.trim()!==""&&(l=n.value.split(",").map(c=>parseInt(c.trim(),10)).filter(c=>!isNaN(c)&&c>=1&&c<=6)),w.addLog(`
--- 射击对决结果 ---`),w.addLog(`[攻击方] ${t.name} 使用 ${a.weapon.name} 射击`),w.addLog(`[防守方] ${s.name}`);const o=s.applyWounds(e,l);t.apl-=1,t.actionsPerformed.push("Shoot"),w.addLog(`[行动点] ${t.name} 消耗 1 APL，当前 APL: ${t.apl}`),F(),o>0&&setTimeout(()=>{w.triggerAvatarHitEffect(s.id,"shoot")},100)}function de(){m("click");const e=i.activeAgent;if(!e)return;const t=document.querySelector("#combat-modal .modal-content");if(t&&(t.style.backgroundImage='linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("assets/images/backgrounds/bg_melee_action.png")',t.style.backgroundSize="cover",t.style.backgroundPosition="center"),Object.assign(a,{actionType:"fight",step:1,attacker:e,defender:null,weapon:e.weapons.filter(s=>!s.isRanged)[0]||null,inMeleeRange:!0,hasFallenBack:!1,mode:"random",activeAttackerDice:[],activeDefenderDice:[],meleeTurn:"attacker",meleeLogs:""}),!a.weapon){alert("该特工没有配备任何近战武器！");return}ce(),L()}function it(e){m("click"),a.defender=i.operatives.find(t=>t.id===e),L()}function st(e){m("click"),a.weapon=a.attacker.weapons.filter(t=>!t.isRanged)[e],L()}function L(){const e=document.getElementById("modal-title"),t=document.getElementById("modal-body"),s=document.getElementById("modal-btn-next"),l=document.getElementById("modal-btn-cancel");if(s.onclick=Y,l.style.display="inline-block",a.step===1){e.textContent="近战结算 - 步骤 1: 选择目标";const n=a.attacker.faction==="Space Marine"?"Plague Marine":"Space Marine",o=i.operatives.filter(r=>r.faction===n&&!r.isDead);if(o.length===0){t.innerHTML='<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>',s.disabled=!0;return}let c='<div class="weapon-picker-list">';o.forEach(r=>{c+=`
        <div class="weapon-pick-item ${a.defender&&a.defender.id===r.id?"selected":""}" onclick="selectFightDefender('${r.id}')">
          <span class="weapon-pick-name">${r.name}</span>
          <span class="weapon-pick-stats">HP: ${r.wounds}/${r.maxWounds} | DF:${r.df}</span>
        </div>
      `}),c+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要交战的敌方特工 (必须在交战距离内)：</p>
      ${c}
    `,s.textContent="判定近战条件",s.disabled=!a.defender}else if(a.step===2){e.textContent="近战结算 - 步骤 2: 选择近战武器";const n=a.attacker.weapons.filter(c=>!c.isRanged);let o='<div class="weapon-picker-list">';n.forEach((c,r)=>{o+=`
        <div class="weapon-pick-item ${a.weapon.name===c.name?"selected":""}" onclick="selectFightWeapon(${r})">
          <span class="weapon-pick-name">${c.name}</span>
          <span class="weapon-pick-stats">A: ${c.attacks} | WS: ${c.ts}+ | D: ${c.normalDamage}/${c.criticalDamage}</span>
        </div>
      `}),o+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要使用的近战武器：</p>
      ${o}
    `,s.textContent="判定交战距离与退却",s.disabled=!1}else if(a.step===3)e.textContent="近战结算 - 步骤 3: 距离与退却判定",t.innerHTML=`
      <p style="margin-bottom: 12px; color:var(--text-muted);">回答以下判定问题以完成结算：</p>

      <div class="qa-card">
        <div class="qa-question">1. 目标是否在你的交战距离内（即 1 英寸 / 1🔺 范围内）？</div>
        <div class="qa-options">
          <button class="qa-btn ${a.inMeleeRange?"selected":""}" onclick="setQA('inMeleeRange', true)">是 (在交战距离内)</button>
          <button class="qa-btn ${a.inMeleeRange?"":"selected"}" onclick="setQA('inMeleeRange', false)">否 (交战距离不足，无法近战)</button>
        </div>
      </div>

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">2. 本回合该特工是否执行过【退却 (Fall Back)】动作？</div>
        <div class="qa-options">
          <button class="qa-btn ${a.hasFallenBack?"":"selected"}" onclick="setQA('hasFallenBack', false)">否 (允许近战)</button>
          <button class="qa-btn ${a.hasFallenBack?"selected":""}" onclick="setQA('hasFallenBack', true)">是 (已退却，无法近战)</button>
        </div>
      </div>
    `,s.textContent="双方近战掷骰",s.disabled=!1;else if(a.step===4)e.textContent="近战结算 - 步骤 4: 双方近战掷骰",t.innerHTML=`
      <div class="melee-grid" style="margin-bottom: 16px;">
        <div class="melee-pool-card">
          <div class="melee-pool-title">攻击方 (${a.attacker.name})</div>
          <div class="melee-dice-pool" id="melee-att-pool">
            <span style="color:var(--text-muted); font-size:0.8rem;">等待投骰...</span>
          </div>
        </div>

        <div class="melee-pool-card">
          <div class="melee-pool-title">防守方 (${a.defender.name})</div>
          <div class="melee-dice-pool" id="melee-def-pool">
            <span style="color:var(--text-muted); font-size:0.8rem;">等待投骰...</span>
          </div>
        </div>
      </div>

      <button class="btn-large" id="btn-roll-melee" onclick="rollMeleeDice()">开始掷骰</button>
    `,a.activeAttackerDice.length>0||a.activeDefenderDice.length>0?(s.disabled=!1,lt()):s.disabled=!0,s.textContent="进入伤害/格挡分配";else if(a.step===5){e.textContent="近战结算 - 步骤 5: 伤害与格挡交替分配";const n=a.attacker.wounds>0,o=a.defender.wounds>0,c=a.activeAttackerDice.some(h=>!h.used),r=a.activeDefenderDice.some(h=>!h.used);if(!n||!o||!c&&!r){let h="";!n&&!o?h="双方同归于尽！":n?o?h="双方所有成功骰已分配完毕。":h=`防守方 [${a.defender.name}] 已阵亡！`:h=`攻击方 [${a.attacker.name}] 已阵亡！`,t.innerHTML=`
        <!-- 双方状态卡 -->
        ${te()}

        <div class="qa-card" style="text-align: center; margin-top: 16px;">
          <h4 style="color: var(--sm-accent); margin-bottom: 8px;">战斗结束</h4>
          <p>${h}</p>
        </div>

        <div class="melee-interactive-log" id="melee-int-log" style="margin-top:12px; height: 100px;">
          ${a.meleeLogs}
        </div>
      `,s.textContent="完成近战结算",s.disabled=!1,s.onclick=mt,l.style.display="none";return}const d=a.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",f=a.defender.faction==="Space Marine"?"sm-dice":"pm-dice";let g="";a.activeAttackerDice.forEach((h,b)=>{let T=`melee-dice-btn ${d}`;h.isCrit&&(T+=" crit"),h.used&&(T+=" used");const D=a.selectedMeleeDice&&a.selectedMeleeDice.side==="attacker"&&a.selectedMeleeDice.idx===b?"outline: 3px solid #60a5fa; transform: scale(1.15); box-shadow: 0 0 15px rgba(96,165,250,0.8); z-index: 2;":"";g+=`<button class="${T}" style="${D}" onclick="chooseMeleeDice('attacker', ${b})">${h.val}</button>`}),a.activeAttackerDice.length===0&&(g='<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>');let v="";a.activeDefenderDice.forEach((h,b)=>{let T=`melee-dice-btn ${f}`;h.isCrit&&(T+=" crit"),h.used&&(T+=" used");const D=a.selectedMeleeDice&&a.selectedMeleeDice.side==="defender"&&a.selectedMeleeDice.idx===b?"outline: 3px solid var(--pm-accent); transform: scale(1.15); box-shadow: 0 0 15px rgba(34,197,94,0.8); z-index: 2;":"";v+=`<button class="${T}" style="${D}" onclick="chooseMeleeDice('defender', ${b})">${h.val}</button>`}),a.activeDefenderDice.length===0&&(v='<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>');const y=a.meleeTurn==="attacker"?"攻击方":"防守方",x=a.meleeTurn==="attacker"?"#60a5fa":"var(--pm-accent)";let $="";if(a.selectedMeleeDice){const{side:h,idx:b}=a.selectedMeleeDice,O=(h==="attacker"?a.activeAttackerDice:a.activeDefenderDice)[b];let D;h==="attacker"?D=a.weapon:D=a.defender.weapons.filter(j=>!j.isRanged)[0]||{normalDamage:3,criticalDamage:4};const me=O.isCrit?D.criticalDamage:D.normalDamage,pe=(h==="attacker"?a.activeDefenderDice:a.activeAttackerDice).some(j=>!j.used);$=`
        <div class="melee-choice-card" style="background: rgba(30, 41, 59, 0.95); border: 2px solid ${x}; border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: center; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
          <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: #fff;">
            🎯 已选中点数 <span style="display:inline-block; padding: 2px 8px; border-radius: 4px; background: ${h==="attacker"?"rgba(59,130,246,0.3)":"rgba(34,197,94,0.3)"}; color: ${h==="attacker"?"#60a5fa":"var(--pm-accent)"}; font-weight: 900; font-family:'Orbitron',sans-serif;">${O.val}${O.isCrit?" (⚡暴击)":""}</span>，请选择分配动作：
          </div>

          <div style="display: flex; gap: 16px; justify-content: center;">
            <button onclick="resolveMeleeChoice('strike')" class="melee-action-btn strike-btn" style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, var(--red), #991b1b); border: 2px solid #ef4444; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3); transition: all 0.2s ease;">
              ⚔️ 打击 (STRIKE)<br>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.9;">造成 ${me} 点伤害</span>
            </button>

            <button onclick="resolveMeleeChoice('parry')" class="melee-action-btn parry-btn" ${pe?"":'disabled style="opacity: 0.4; cursor: not-allowed;"'} style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, #0284c7, #075985); border: 2px solid #0ea5e9; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); transition: all 0.2s ease;">
              🛡️ 格挡 (PARRY)<br>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.9;">消去对方一个成功骰</span>
            </button>
          </div>

          <div style="margin-top: 10px;">
            <button onclick="cancelMeleeChoice()" class="modal-btn" style="padding: 4px 12px; font-size: 0.75rem; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: var(--text-muted);">
              取消选择
            </button>
          </div>
        </div>
      `}t.innerHTML=`
      <!-- 双方实时血条与头像 -->
      ${te()}

      <p style="margin-bottom: 10px; font-weight: bold; text-align: center; color: ${x}; font-size: 1.05rem;">
        👉 当前轮到：【${y}】分配骰子
      </p>

      ${$}

      <div class="melee-grid" style="margin-bottom: 16px;">
        <div class="melee-pool-card">
          <div class="melee-pool-title" style="display:flex; justify-content:space-between;">
            <span>攻击方成功骰</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">HP: ${a.attacker.wounds}</span>
          </div>
          <div class="melee-dice-pool">
            ${g}
          </div>
        </div>

        <div class="melee-pool-card">
          <div class="melee-pool-title" style="display:flex; justify-content:space-between;">
            <span>防守方成功骰</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">HP: ${a.defender.wounds}</span>
          </div>
          <div class="melee-dice-pool">
            ${v}
          </div>
        </div>
      </div>

      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 6px;">
        💡 <b>分配指南:</b> 点击你的高亮骰子，若对方有剩余成功骰，可选择格挡(Parry)消去对方一个未使用的成功骰，或选择打击(Strike)对敌方特工造成伤害。
      </div>

      <div class="melee-interactive-log" id="melee-int-log">
        <!-- 滚动记录 -->
      </div>
    `;const u=document.getElementById("melee-int-log");u&&(u.innerHTML=a.meleeLogs,u.scrollTop=u.scrollHeight),s.textContent="交替进行中...",s.disabled=!0}}function ot(){const e=document.getElementById("modal-btn-next"),t=document.getElementById("melee-att-pool"),s=document.getElementById("melee-def-pool"),l=document.getElementById("btn-roll-melee");l.disabled=!0,e.disabled=!0;const n=a.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",o=a.defender.faction==="Space Marine"?"sm-dice":"pm-dice";t.innerHTML="";const c=a.weapon.attacks;for(let u=0;u<c;u++)t.innerHTML+=`<div class="kt-dice-cube ${n} rolling">?</div>`;const r=a.defender.weapons.filter(u=>!u.isRanged)[0]||new k("重拳 (Fists)",3,3,3,4,!1),d=r.attacks;s.innerHTML="";for(let u=0;u<d;u++)s.innerHTML+=`<div class="kt-dice-cube ${o} rolling">?</div>`;w.triggerCombatVisual("⚔️ MELEE CLASH!","shoot"),m("shoot");const f=[],g=[];let v=0,y=0;function x(){if(v<c){const u=Math.floor(Math.random()*6)+1;f.push(u);const b=t.getElementsByClassName("kt-dice-cube")[v];b.classList.remove("rolling"),b.textContent=u,u===6?(b.classList.add("crit-dice"),m("crit")):(u<a.weapon.ts&&b.classList.add("fail-dice"),m("click")),v++,setTimeout(x,400)}else $()}function $(){if(y<d){const u=Math.floor(Math.random()*6)+1;g.push(u);const b=s.getElementsByClassName("kt-dice-cube")[y];b.classList.remove("rolling"),b.textContent=u,u===6?(b.classList.add("crit-dice"),m("crit")):(u<r.ts&&b.classList.add("fail-dice"),m("click")),y++,setTimeout($,400)}else a.activeAttackerDice=f.filter(u=>u>=a.weapon.ts).map(u=>({val:u,isCrit:u===6,used:!1})),a.activeDefenderDice=g.filter(u=>u>=r.ts).map(u=>({val:u,isCrit:u===6,used:!1})),e.disabled=!1}setTimeout(x,1200)}function lt(){const e=document.getElementById("melee-att-pool"),t=document.getElementById("melee-def-pool");if(!e||!t)return;const s=a.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",l=a.defender.faction==="Space Marine"?"sm-dice":"pm-dice";e.innerHTML="",a.activeAttackerDice.forEach(n=>{let o=`kt-dice-cube ${s}`;n.isCrit&&(o+=" crit-dice"),e.innerHTML+=`<div class="${o}">${n.val}</div>`}),a.activeAttackerDice.length===0&&(e.innerHTML='<span style="color:var(--text-muted);font-size:0.85rem;">全部未命中</span>'),t.innerHTML="",a.activeDefenderDice.forEach(n=>{let o=`kt-dice-cube ${l}`;n.isCrit&&(o+=" crit-dice"),t.innerHTML+=`<div class="${o}">${n.val}</div>`}),a.activeDefenderDice.length===0&&(t.innerHTML='<span style="color:var(--text-muted);font-size:0.85rem;">全部未命中</span>')}function N(e,t){const s=i.customAvatars[e];let l=t==="Space Marine"?"./assets/images/defaults/default_sm_avatar.png":"./assets/images/defaults/default_pm_avatar.png";const n=i.operatives.find(c=>c.id===e);if(n&&n.defaultAvatar)l=n.defaultAvatar;else{const c=t==="Space Marine",r=e.replace(/^(sm_|pm_)/,"");l=`./assets/images/operatives/${c?"sm":"pm"}/${c?"sm":"pm"}_${r}.png`}return`<div class="op-avatar-slot duel-avatar-${e}" style="width: 50px; height: 50px; cursor: default; position: relative;">
            <img src="${s||l}" class="op-avatar-img" />
          </div>`}function te(){const e=a.attacker,t=a.defender,s=Math.max(0,e.wounds/e.maxWounds*100),l=Math.max(0,t.wounds/t.maxWounds*100);return`
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(15,23,42,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${N(e.id,e.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:#60a5fa; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${e.name}">${e.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Orbitron',sans-serif; text-transform:uppercase;">攻击方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${s}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Orbitron',sans-serif; color:var(--red);">${Math.max(0,e.wounds)} / ${e.maxWounds} HP</div>
      </div>

      <!-- VS icon -->
      <div style="font-size:1.2rem; font-weight:900; color:var(--text-muted); padding:0 8px; font-family:'Orbitron',sans-serif; font-style:italic;">VS</div>

      <!-- Defender Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${N(t.id,t.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${t.name}">${t.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Orbitron',sans-serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${l}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Orbitron',sans-serif; color:var(--red);">${Math.max(0,t.wounds)} / ${t.maxWounds} HP</div>
      </div>
    </div>
  `}function W(){const e=a.attacker,t=a.defender,s=Math.max(0,e.wounds/e.maxWounds*100),l=Math.max(0,t.wounds/t.maxWounds*100);return`
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(15,23,42,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${N(e.id,e.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:#60a5fa; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${e.name}">${e.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Orbitron',sans-serif; text-transform:uppercase;">射击方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${s}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Orbitron',sans-serif; color:var(--red);">${Math.max(0,e.wounds)} / ${e.maxWounds} HP</div>
      </div>

      <!-- VS icon -->
      <div style="font-size:1.2rem; font-weight:900; color:var(--text-muted); padding:0 8px; font-family:'Orbitron',sans-serif; font-style:italic;">VS</div>

      <!-- Defender Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${N(t.id,t.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${t.name}">${t.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Orbitron',sans-serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${l}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Orbitron',sans-serif; color:var(--red);">${Math.max(0,t.wounds)} / ${t.maxWounds} HP</div>
      </div>
    </div>
  `}function ct(e,t){if(e!==a.meleeTurn){m("alert"),alert("现在不属于你的近战分配回合！");return}(e==="attacker"?a.activeAttackerDice:a.activeDefenderDice)[t].used||(a.selectedMeleeDice={side:e,idx:t},L())}function rt(e){if(!a.selectedMeleeDice)return;const{side:t,idx:s}=a.selectedMeleeDice,n=(t==="attacker"?a.activeAttackerDice:a.activeDefenderDice)[s];if(n.used)return;const o=t==="attacker"?a.defender:a.attacker,c=t==="attacker"?a.activeDefenderDice:a.activeAttackerDice;let r;if(t==="attacker"?r=a.weapon:r=a.defender.weapons.filter(u=>!u.isRanged)[0]||{normalDamage:3,criticalDamage:4},a.meleeLogs||(a.meleeLogs=""),e==="strike"){n.used=!0;const u=n.isCrit?r.criticalDamage:r.normalDamage,h=`> ${t==="attacker"?"攻击方":"防守方"} 执行打击 (Strike)，分配了 ${u} 伤害！<br>`;a.meleeLogs+=h,o.applyWounds(u),m("heavy_strike"),w.triggerCombatVisual("⚔️ STRIKE! -"+u,"strike")}else{let u=-1;if(n.isCrit?(u=c.findIndex(b=>!b.used&&b.isCrit),u===-1&&(u=c.findIndex(b=>!b.used))):u=c.findIndex(b=>!b.used&&!b.isCrit),u===-1){m("alert"),alert("没有合法的对方骰子可供格挡招架！");return}n.used=!0,c[u].used=!0;const h=`> ${t==="attacker"?"攻击方":"防守方"} 执行格挡 (Parry)，消去对方一个骰子 [${c[u].val}]！<br>`;a.meleeLogs+=h,m("metal_clash"),w.triggerCombatVisual("🛡️ PARRY!","parry")}const d=t==="attacker"?"defender":"attacker",f=d==="attacker"?a.attacker.wounds:a.defender.wounds,v=(d==="attacker"?a.activeAttackerDice:a.activeDefenderDice).some(u=>!u.used)&&f>0,y=t==="attacker"?a.attacker.wounds:a.defender.wounds,$=(t==="attacker"?a.activeAttackerDice:a.activeDefenderDice).some(u=>!u.used)&&y>0;v&&$||v?a.meleeTurn=d:$&&(a.meleeTurn=t),a.selectedMeleeDice=null,L(),e==="strike"&&w.triggerAvatarHitEffect(o.id,"melee")}function dt(){m("click"),a.selectedMeleeDice=null,L()}function mt(){m("click");const e=a.attacker,t=a.defender;w.addLog(`
--- 近战搏斗结果 ---`),w.addLog(`[双核交锋] ${e.name} vs ${t.name}`),w.addLog(`  - ${e.name} 生命值: ${e.wounds}/${e.maxWounds}`),w.addLog(`  - ${t.name} 生命值: ${t.wounds}/${t.maxWounds}`),e.apl-=1,e.actionsPerformed.push("Fight"),w.addLog(`[行动点] ${e.name} 消耗 1 APL，当前 APL: ${e.apl}`),F()}fe({addLog:C,updateScoresUI:E,renderOperatives:H,updateActivePanel:B,startInitiativePhase:se,showTurnEndScoringOverlay:le,hidePhaseOverlay:U});be({addLog:C,triggerOperativeDeathOverlay:Be});xe({openShootWizard:re,openFightWizard:de,renderShootStep:A,renderFightStep:L,closeModal:F});je({addLog:C,renderOperatives:H,updateActivePanel:B,updateScoresUI:E,triggerAvatarHitEffect:Fe,triggerCombatVisual:qe});window.adjustScore=ke;window.confirmReset=we;window.toggleSelectSM=ne;window.toggleSelectPM=ae;window.validateRostersAndDeploy=Ce;window.triggerAvatarUpload=_e;window.handleAvatarFileSelect=Ne;window.activateOperative=ie;window.performMove=$e;window.performCharge=Me;window.openShootWizard=re;window.openFightWizard=de;window.endActivation=Te;window.showRuleHelp=De;window.closeHelpModal=Le;window.closeModal=F;window.nextModalStep=Y;window.selectShootDefender=We;window.selectShootWeapon=Ke;window.setQA=Ge;window.setRollMode=Ue;window.rollAttackDice=Qe;window.rollDefenseDice=Je;window.selectFightDefender=it;window.selectFightWeapon=st;window.rollMeleeDice=ot;window.chooseMeleeDice=ct;window.resolveMeleeChoice=rt;window.cancelMeleeChoice=dt;window.rollInitiativeOverlay=Ae;window.selectTurnOrder=Se;window.buyPloy=Pe;window.proceedToFirefight=Ee;window.confirmOperativeDeath=Ie;window.declareScoreVictory=ze;window.toggleScoringChecklist=Re;window.adjustScoreTemp=He;window.confirmTurnEndScoring=Oe;document.addEventListener("DOMContentLoaded",()=>{K()});
