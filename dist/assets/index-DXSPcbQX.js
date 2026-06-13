(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const r of c.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&l(r)}).observe(document,{childList:!0,subtree:!0});function i(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function l(n){if(n.ep)return;n.ep=!0;const c=i(n);fetch(n.href,c)}})();const f=new(window.AudioContext||window.webkitAudioContext);function u(e){try{f.state==="suspended"&&f.resume();const t=f.createOscillator(),i=f.createGain();if(t.connect(i),i.connect(f.destination),e==="click")t.frequency.setValueAtTime(600,f.currentTime),i.gain.setValueAtTime(.04,f.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,f.currentTime+.08),t.start(),t.stop(f.currentTime+.08);else if(e==="shoot"){const l=f.currentTime;[0,.08,.16].forEach(c=>{const r=f.sampleRate*.08,o=f.createBuffer(1,r,f.sampleRate),m=o.getChannelData(0);for(let $=0;$<r;$++)m[$]=Math.random()*2-1;const d=f.createBufferSource();d.buffer=o;const p=f.createBiquadFilter();p.type="lowpass",p.frequency.value=1e3;const g=f.createGain();g.gain.setValueAtTime(.12,l+c),g.gain.exponentialRampToValueAtTime(1e-4,l+c+.08),d.connect(p),p.connect(g),g.connect(f.destination),d.start(l+c);const v=f.createOscillator(),k=f.createGain();v.frequency.setValueAtTime(160,l+c),v.frequency.linearRampToValueAtTime(80,l+c+.06),k.gain.setValueAtTime(.15,l+c),k.gain.exponentialRampToValueAtTime(1e-4,l+c+.06),v.connect(k),k.connect(f.destination),v.start(l+c),v.stop(l+c+.06)})}else if(e==="crit")t.type="sawtooth",t.frequency.setValueAtTime(880,f.currentTime),t.frequency.setValueAtTime(1200,f.currentTime+.08),i.gain.setValueAtTime(.06,f.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,f.currentTime+.25),t.start(),t.stop(f.currentTime+.25);else if(e==="save")t.type="sine",t.frequency.setValueAtTime(988,f.currentTime),i.gain.setValueAtTime(.05,f.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,f.currentTime+.12),t.start(),t.stop(f.currentTime+.12);else if(e==="flesh"){const l=f.sampleRate*.15,n=f.createBuffer(1,l,f.sampleRate),c=n.getChannelData(0);for(let d=0;d<l;d++)c[d]=Math.random()*2-1;const r=f.createBufferSource();r.buffer=n;const o=f.createBiquadFilter();o.type="bandpass",o.frequency.value=300;const m=f.createGain();m.gain.setValueAtTime(.08,f.currentTime),m.gain.exponentialRampToValueAtTime(1e-4,f.currentTime+.15),r.connect(o),o.connect(m),m.connect(f.destination),r.start()}else if(e==="bubble")t.type="sine",t.frequency.setValueAtTime(200,f.currentTime),t.frequency.exponentialRampToValueAtTime(1200,f.currentTime+.06),i.gain.setValueAtTime(.05,f.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,f.currentTime+.06),t.start(),t.stop(f.currentTime+.06);else if(e==="alert")t.type="triangle",t.frequency.setValueAtTime(330,f.currentTime),i.gain.setValueAtTime(.08,f.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,f.currentTime+.3),t.start(),t.stop(f.currentTime+.3);else if(e==="epic_win"){const l=[523.25,659.25,783.99,1046.5],n=f.currentTime;l.forEach((c,r)=>{const o=f.createOscillator(),m=f.createGain();o.type="triangle",o.frequency.setValueAtTime(c,n+r*.08),m.gain.setValueAtTime(0,n+r*.08),m.gain.linearRampToValueAtTime(.08,n+r*.08+.02),m.gain.exponentialRampToValueAtTime(1e-4,n+r*.08+.22),o.connect(m),m.connect(f.destination),o.start(n+r*.08),o.stop(n+r*.08+.22)})}else if(e==="epic_fail"){const l=[164.81,155.56,146.83,138.59],n=f.currentTime;l.forEach((c,r)=>{const o=f.createOscillator(),m=f.createGain();o.type="sawtooth";const d=n+r*.2,p=r===3?.65:.18;o.frequency.setValueAtTime(c,d),r===3&&o.frequency.linearRampToValueAtTime(95,d+p),m.gain.setValueAtTime(0,d),m.gain.linearRampToValueAtTime(.08,d+.02),m.gain.exponentialRampToValueAtTime(1e-4,d+p),o.connect(m),m.connect(f.destination),o.start(d),o.stop(d+p)})}else if(e==="funeral"){const l=[261.63,261.63,261.63,207.65],n=[.35,.35,.35,.7],c=[0,.45,.9,1.35],r=f.currentTime;l.forEach((o,m)=>{const d=f.createOscillator(),p=f.createGain();d.type="sine";const g=r+c[m],v=n[m];d.frequency.setValueAtTime(o,g),p.gain.setValueAtTime(0,g),p.gain.linearRampToValueAtTime(.06,g+.05),p.gain.exponentialRampToValueAtTime(1e-4,g+v),d.connect(p),p.connect(f.destination),d.start(g),d.stop(g+v)})}else if(e==="metal_clash"){const l=f.currentTime,n=f.createOscillator(),c=f.createGain();n.type="sine",n.frequency.setValueAtTime(1400,l),n.frequency.linearRampToValueAtTime(900,l+.25),c.gain.setValueAtTime(.06,l),c.gain.exponentialRampToValueAtTime(1e-4,l+.3),n.connect(c),c.connect(f.destination),n.start(),n.stop(l+.3);const r=f.createOscillator(),o=f.createGain();r.type="triangle",r.frequency.setValueAtTime(300,l),r.frequency.linearRampToValueAtTime(120,l+.15),o.gain.setValueAtTime(.1,l),o.gain.exponentialRampToValueAtTime(1e-4,l+.18),r.connect(o),o.connect(f.destination),r.start(),r.stop(l+.18)}else if(e==="heavy_strike"){const l=f.currentTime,n=f.createOscillator(),c=f.createGain();n.type="sawtooth",n.frequency.setValueAtTime(80,l),n.frequency.exponentialRampToValueAtTime(35,l+.2),c.gain.setValueAtTime(.2,l),c.gain.exponentialRampToValueAtTime(1e-4,l+.2),n.connect(c),c.connect(f.destination),n.start(),n.stop(l+.2);const r=f.createOscillator(),o=f.createGain();r.type="sine",r.frequency.setValueAtTime(550,l),o.gain.setValueAtTime(.05,l),o.gain.exponentialRampToValueAtTime(1e-4,l+.12),r.connect(o),o.connect(f.destination),r.start(),r.stop(l+.12);const m=f.sampleRate*.12,d=f.createBuffer(1,m,f.sampleRate),p=d.getChannelData(0);for(let $=0;$<m;$++)p[$]=Math.random()*2-1;const g=f.createBufferSource();g.buffer=d;const v=f.createBiquadFilter();v.type="bandpass",v.frequency.value=220;const k=f.createGain();k.gain.setValueAtTime(.12,l),k.gain.exponentialRampToValueAtTime(1e-4,l+.12),g.connect(v),v.connect(k),k.connect(f.destination),g.start()}}catch{}}const B={};function Ie(e){Object.assign(B,e)}const s={turningPoint:1,phase:"Initiative",initiative:"Space Marine",activeTurn:"Space Marine",activeAgent:null,smVp:0,smCp:2,pmVp:0,pmCp:2,smActivePloys:[],pmActivePloys:[],operatives:[],gameOver:!1,customAvatars:{},smKillsScored:0,pmKillsScored:0},Re={actionType:"shoot",step:1,attacker:null,defender:null,weapon:null,inRangeAndVisible:!0,inCoverConcealed:!1,inCover:!1,mode:"random",attackRolls:[],attackCrit:0,attackNorm:0,defenseRolls:[],defCrit:0,defNorm:0,attRerollIndex:-1,defRerollIndex:-1,activeAttackerDice:[],activeDefenderDice:[],meleeTurn:"attacker"};let a={...Re};const be=["医疗兵默默拿出了骨灰盒，叹气道：『这活我接不了，抬走，下一位！』","他为了信仰流尽了最后一滴血，虽然倒下的姿势实在不够优雅。","战锤世界可没有复活币，老铁一路走好！","这大概就是传说中的『战术性白给』吧……","棋子已变成战场地形/掩体的一部分（大雾）。","纳垢大父叹了口气，表示可以多一碗上好的堆肥了。","帝皇叹了口气，并从垃圾桶里捞了捞他的物理模型。"];function J(e){return s.operatives.some(t=>t.faction===e&&!t.isDead&&!t.hasActed)}function Ve(){u("click"),s.turningPoint+=1,s.phase="Initiative",s.smCp+=1,s.pmCp+=1,s.smActivePloys=[],s.pmActivePloys=[],s.operatives.forEach(t=>{t.isDead||(t.hasActed=!1,t.apl=t.currentApl,t.actionsPerformed=[])});const e=document.getElementById("btn-next-phase");e&&(e.style.display="none"),B.addLog(`
========================================`),B.addLog(`>>> Turning Point ${s.turningPoint} 开始！`),B.addLog(">>> 双方各获得 1 CP。"),B.addLog("========================================"),B.startInitiativePhase()}function Oe(){const e=s.activeTurn==="Space Marine"?"Plague Marine":"Space Marine",t=J(e),i=J(s.activeTurn);t?(s.activeTurn=e,B.addLog(`>>> 交替轮转：轮到【${e==="Space Marine"?"死亡天使":"瘟疫守卫"}】选择特工激活。`)):i?B.addLog(`>>> 【${e==="Space Marine"?"死亡天使":"瘟疫守卫"}】已无可用特工。继续激活【${s.activeTurn==="Space Marine"?"死亡天使":"瘟疫守卫"}】。`):(B.addLog(">>> 双方全部特工激活完毕。准备开始回合得分结算。"),B.showTurnEndScoringOverlay()),B.renderOperatives(),B.updateActivePanel()}const I={};function He(e){Object.assign(I,e)}class w{constructor(t,i,l,n,c,r=!0,o=null,m=[]){this.name=t,this.attacks=i,this.ts=l,this.normalDamage=n,this.criticalDamage=c,this.isRanged=r,this.range=o,this.rules=m}hasRule(t){return this.rules.includes(t)}get displayRange(){return this.range===null?"-":this.range+'"'}get displayRules(){return this.rules.length>0?this.rules.join(", "):"-"}}class ye{constructor(t,i,l,n,c,r,o,m=[],d="",p=6){this.id=t,this.name=i,this.faction=l,this.maxWounds=n,this.wounds=n,this.maxApl=c,this.apl=c,this.df=r,this.sv=o,this.weapons=m,this.defaultAvatar=d,this.maxMove=p,this.move=p,this.hasActed=!1,this.isDead=!1,this.actionsPerformed=[],this.poisonTokens=0,this.hasConceal=!1}get isInjured(){return this.wounds>0&&this.wounds<this.maxWounds/2}get currentApl(){return this.maxApl-(this.isInjured?1:0)}get currentMove(){return Math.max(0,this.maxMove-(this.isInjured?2:0))}toggleConceal(){this.hasConceal=!this.hasConceal}reset(){this.wounds=this.maxWounds,this.apl=this.maxApl,this.move=this.maxMove,this.hasActed=!1,this.isDead=!1,this.actionsPerformed=[],this.poisonTokens=0,this.hasConceal=!1}applyWounds(t,i=null){if(this.isDead)return 0;const l=this.faction==="Plague Marine";let n=0,c=[];Array.isArray(t)?(c=t,n=t.reduce((m,d)=>m+d,0)):(n=t,c=[t]),I.addLog(`[伤害] ${this.name} 准备分配 ${n} 点伤害...`);let r=0;if(l){const m=s.pmActivePloys.includes("contagious_resilience");I.addLog(`[特性] 触发瘟疫守卫专属【恶心作呕 (DR 4+)】 ${m?"(已开启传染韧性，允许首个失败重投)":""}：`);let d=0,p=!1;for(const g of c){if(g<3){I.addLog(`  - 单次攻击伤害 ${g} (<3)，不触发 DR。`),r+=g;continue}let v;if(i&&d<i.length?(v=i[d++],I.addLog(`  - 伤害 ${g} (>=3): 手动录入 DR 骰子 [${v}]`)):(v=Math.floor(Math.random()*6)+1,I.addLog(`  - 伤害 ${g} (>=3): 投 DR 骰子 [${v}]`)),v<4&&m&&!p&&!i){p=!0;const k=v;v=Math.floor(Math.random()*6)+1,I.addLog(`    -> [传染韧性] 自动重投失败 [${k}] -> [${v}]`)}if(v>=4){const k=g-1;I.addLog(`    -> 成功！伤害减免 1 点 (${g} -> ${k})`),u("bubble"),r+=k}else I.addLog(`    -> 减免失败，受到全额 ${g} 点伤害。`),r+=g,u("flesh")}}else r=n,r>0&&u("flesh");const o=this.wounds;return this.wounds=Math.max(0,this.wounds-r),I.addLog(`[分配] ${this.name} 生命值: ${o} -> ${this.wounds} ${this.wounds===0?"(已阵亡!)":""}`),this.wounds===0&&(this.isDead=!0,this.hasActed=!0,I.triggerOperativeDeathOverlay(this)),r}}const L=[{id:"sm_1",name:"Space Marine Captain (SM 船长)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_captain.png",weapons:[new w("Master-crafted Bolt Rifle (精铸爆弹步枪)",4,3,4,5,!0,24,["Indirect Fire"]),new w("Relic Blade (遗物利刃)",5,3,5,6,!1,null,["Severe"])]},{id:"sm_2",name:"Assault Intercessor Sergeant (突击军士)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sergeant.png",weapons:[new w("Hand Flamer (手持火焰喷射器)",4,2,3,3,!0,6,["Saturate",'Torrent 1"']),new w("Chainsword (链锯剑)",5,3,4,5,!1,null,[])]},{id:"sm_3",name:"Intercessor Sergeant (战术军士)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sergeant.png",weapons:[new w("Bolt Rifle (爆弹步枪)",4,3,3,4,!0,null,["Piercing Crits 1"]),new w("Chainsword (链锯剑)",4,3,4,5,!1,null,[])]},{id:"sm_4",name:"Eliminator Sniper (Eliminator 狙击手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sniper.png",weapons:[new w("Bolt Sniper Rifle (爆弹狙击步枪)",4,2,3,4,!0,null,["Heavy (Dash only)","Saturate","Seek Light","Silent"]),new w("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_5",name:"Heavy Intercessor Gunner (重型火力手)",wounds:18,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/sm/sm_heavy_gunner.png",weapons:[new w("Heavy Bolter (重型爆弹枪)",5,3,4,5,!0,null,["Piercing Crits 1"]),new w("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_8",name:"Intercessor Gunner (战术火力手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_warrior_b.png",weapons:[new w("Auto Bolt Rifle (自动爆弹步枪)",4,3,3,4,!0,null,['Torrent 1"']),new w("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_6",name:"Assault Intercessor Warrior (突击战士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_assault.png",weapons:[new w("Heavy Bolt Pistol (重型爆弹手枪)",4,3,3,4,!0,8,["Piercing Crits 1"]),new w("Chainsword (链锯剑)",5,3,4,5,!1,null,[])]},{id:"sm_7",name:"Intercessor Warrior (战术战士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_warrior_a.png",weapons:[new w("Bolt Rifle (爆弹步枪)",4,3,3,4,!0,null,["Piercing Crits 1"]),new w("Fists (铁拳)",4,3,3,4,!1,null,[])]}],H=[{id:"pm_1",name:"Plague Marine Champion (瘟疫冠军)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_champion.png",weapons:[new w("Plague Sword (瘟疫之剑)",5,3,4,5,!1,null,["Severe","Poison","Toxic"])]},{id:"pm_2",name:"Malignant Plaguecaster (恶性瘟疫术士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_caster.png",weapons:[new w("Entropy (熵能术)",4,3,3,7,!0,7,["PSYCHIC","Saturate","Severe","Poison"]),new w("Plague Wind (瘟疫之风)",6,3,2,3,!0,null,["PSYCHIC","Saturate","Severe",'Torrent 1"',"Poison"]),new w("Corrupted Staff (腐蚀法杖)",4,3,3,4,!1,null,["PSYCHIC","Severe","Shock","Stun","Poison"])]},{id:"pm_3",name:"Plague Marine Bombardier (瘟疫掷弹兵)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_gunner.png",weapons:[new w("Boltgun (爆弹枪)",4,3,3,4,!0,null,["Toxic"]),new w("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"pm_4",name:"Plague Marine Fighter (瘟疫搏击手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_fighter.png",weapons:[new w("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new w("Flail of Corruption (腐化之链枷)",5,3,4,5,!1,null,["Brutal","Severe","Shock","Poison"])]},{id:"pm_5",name:"Plague Marine Heavy Gunner (瘟疫重炮手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_heavy.png",weapons:[new w("Plague Spewer (瘟疫喷射器)",5,2,3,3,!0,7,["Saturate","Severe",'Torrent 2"',"Poison"]),new w("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"pm_6",name:"Plague Marine Icon Bearer (瘟疫圣像手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_icon.png",weapons:[new w("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new w("Plague Knife (瘟疫匕首)",5,3,3,4,!1,null,["Severe","Poison"])]},{id:"pm_7",name:"Plague Marine Warrior (瘟疫战士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_warrior.png",weapons:[new w("Boltgun (爆弹枪)",4,3,3,4,!0,null,["Toxic"]),new w("Plague Knife (瘟疫匕首)",4,3,3,4,!1,null,["Severe","Poison"])]}],ze={move:{title:"🏃 移动 (Normal Move) 规则帮助",body:`
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
        `}},Ne=window.matchMedia("(prefers-reduced-motion: reduce)");let je=0;function z(e,t="info",i=4e3){const l=document.getElementById("toast-container");if(!l){console.warn(`[Toast ${t}]:`,e);return}const n=document.createElement("div");n.className=`toast toast-${t}`,n.setAttribute("role",t==="error"?"alert":"status"),n.textContent=e,n.id=`toast-${++je}`,l.appendChild(n);const c=setTimeout(()=>{n.classList.add("toast-exit"),setTimeout(()=>n.remove(),300)},i);n.addEventListener("click",()=>{clearTimeout(c),n.classList.add("toast-exit"),setTimeout(()=>n.remove(),300)})}function We(e,t){const i=document.createElement("div");i.className="modal-overlay",i.style.display="flex",i.setAttribute("role","alertdialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-label","确认操作"),i.innerHTML=`
    <div class="modal-content" style="max-width: 420px;">
      <div class="modal-header">
        <div class="modal-title">⚠️ 确认操作</div>
      </div>
      <div class="modal-body">
        <p style="font-size: 0.95rem; line-height: 1.6;">${e}</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn" id="confirm-dialog-cancel">取消</button>
        <button class="modal-btn primary" id="confirm-dialog-ok" style="background: linear-gradient(135deg, var(--red), #991b1b); border-color: #f43f5e;">确认</button>
      </div>
    </div>
  `,document.body.appendChild(i),se(i);const l=()=>{oe(),i.remove()};i.querySelector("#confirm-dialog-cancel").addEventListener("click",()=>{l()}),i.querySelector("#confirm-dialog-ok").addEventListener("click",()=>{l(),t&&t()});const n=c=>{c.key==="Escape"&&(l(),document.removeEventListener("keydown",n))};document.addEventListener("keydown",n)}let q=null,ee=null;function xe(e){return e.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])')}function se(e){ee=document.activeElement,q=e;const t=xe(e);t.length>0&&t[0].focus(),e._focusTrapHandler=i=>{if(i.key==="Tab"){const l=xe(e);if(l.length===0)return;const n=l[0],c=l[l.length-1];i.shiftKey?document.activeElement===n&&(i.preventDefault(),c.focus()):document.activeElement===c&&(i.preventDefault(),n.focus())}},e.addEventListener("keydown",e._focusTrapHandler)}function oe(){q&&q._focusTrapHandler&&(q.removeEventListener("keydown",q._focusTrapHandler),delete q._focusTrapHandler),q=null,ee&&ee.focus&&ee.focus(),ee=null}document.addEventListener("keydown",e=>{if(e.key==="Escape"){const t=document.getElementById("help-modal");if(t&&t.style.display==="flex"){Ee();return}const i=document.getElementById("combat-modal");if(i&&i.style.display==="flex"){Ce.closeModal();return}const l=document.getElementById("death-overlay");if(l&&l.style.display==="flex"){Pe();return}}});const G={},U={},Ce={};function _e(e){Object.assign(Ce,e)}function T(e){const t=document.getElementById("battle-log-lines");if(!t)return;const i=document.createElement("div");i.textContent=e,t.appendChild(i),t.scrollTop=t.scrollHeight}function j(){document.getElementById("sm-vp").textContent=s.smVp,document.getElementById("sm-cp").textContent=s.smCp,document.getElementById("pm-vp").textContent=s.pmVp,document.getElementById("pm-cp").textContent=s.pmCp,document.getElementById("dash-tp").textContent=s.turningPoint;let e=s.phase;e==="Initiative"?e="先攻阶段":e==="Strategy"?e="策略阶段":e==="Firefight"&&(e="战斗阶段"),document.getElementById("dash-phase").textContent=e;const t=document.getElementById("sm-ploy-tags");t.innerHTML="",s.smActivePloys.forEach(n=>{const c=document.createElement("span");c.className="ploy-tag sm",c.textContent=n==="bolter_discipline"?"爆弹惩戒":n,t.appendChild(c)});const i=document.getElementById("pm-ploy-tags");i.innerHTML="",s.pmActivePloys.forEach(n=>{const c=document.createElement("span");c.className="ploy-tag pm",c.textContent=n==="contagious_resilience"?"传染韧性":n,i.appendChild(c)});const l=document.getElementById("btn-next-phase");l&&(s.phase==="Firefight"&&!J("Space Marine")&&!J("Plague Marine")?(l.style.display="inline-block",l.textContent="回合得分结算",l.onclick=Ae):l.style.display="none")}function Fe(e,t,i){u("click"),e==="sm"?t==="vp"?s.smVp=Math.max(0,s.smVp+i):s.smCp=Math.max(0,s.smCp+i):t==="vp"?s.pmVp=Math.max(0,s.pmVp+i):s.pmCp=Math.max(0,s.pmCp+i),j()}function qe(){We("确定要重置当前对局吗？所有进度和选择将被清空。",()=>{u("click"),s.turningPoint=1,s.phase="Initiative",s.smVp=0,s.smCp=2,s.pmVp=0,s.pmCp=2,s.smActivePloys=[],s.pmActivePloys=[],s.operatives=[],s.activeAgent=null,s.gameOver=!1,s.smKillsScored=0,s.pmKillsScored=0,document.getElementById("start-screen").style.display="flex",document.getElementById("global-dash").style.display="none",document.getElementById("battle-area").style.display="none",document.getElementById("guidance-banner").style.display="none",document.getElementById("battle-log-lines").innerHTML="",fe()})}function N(e){document.getElementById("guidance-text").textContent=e}function ue(e,t){var o;const i=s.customAvatars[e];let l=t==="Space Marine"?"assets/images/defaults/default_sm_avatar.png":"assets/images/defaults/default_pm_avatar.png";const n=s.operatives.find(m=>m.id===e),c=n?n.name:((o=L.concat(H).find(m=>m.id===e))==null?void 0:o.name)||e;if(n&&n.defaultAvatar)l=n.defaultAvatar;else{const m=L.concat(H).find(d=>d.id===e);m&&m.defaultAvatar&&(l=m.defaultAvatar)}return`<div class="op-avatar-slot main-avatar-${e}">
            <img src="${i||l}" class="op-avatar-img" alt="${c} 头像" loading="lazy" />
          </div>`}function Ke(e){return e.weapons.map(t=>{const i=t.name.split(" ")[0],l=t.rules&&t.rules.length>0?` [${t.rules.join(",")}]`:"";return i+l}).join(" / ")}function te(e,t,i,l,n,c,r){const o=i?`<span class="role-badge leader" ${r?`style="${r}"`:""}>LEADER</span>`:'<span class="role-badge">OPERATOR</span>',m=l?"checked":"",d=n?"disabled":"",p=ue(e.id,t),g=e.isWarrior?' <span style="color:#fbbf24; font-size:0.65rem;">[Warrior]</span>':"";let v;return e.isWarrior?v=`
      <div class="warrior-counter" data-warrior-id="${e.id}">
        <button class="warrior-counter-btn minus" onclick="event.stopPropagation(); decrementWarrior('${e.id}')" aria-label="减少数量">−</button>
        <span class="warrior-counter-value" id="warrior-count-${e.id}">0</span>
        <button class="warrior-counter-btn plus" onclick="event.stopPropagation(); incrementWarrior('${e.id}')" aria-label="增加数量">+</button>
      </div>
    `:v=`<input type="checkbox" class="roster-checkbox" id="check-${e.id}" ${m} ${d} onchange="${c}('${e.id}')">`,`
    ${v}
    ${p}
    <div class="roster-op-info">
      <div class="roster-op-name">${e.name} ${o}${g}</div>
      <div class="roster-op-weapons">Move: ${e.move||6}" | HP: ${e.wounds} | APL: ${e.apl}</div>
      <div style="font-size:0.65rem; color:#94a3b8; margin-top:2px;">武器: ${Ke(e)}</div>
    </div>
  `}function re(e,t,i,l=!1){e.onclick=n=>{if(n.target.className!=="roster-checkbox"&&!n.target.closest(".op-avatar-slot")&&!n.target.closest(".warrior-counter"))if(l)$e(t);else{const c=document.getElementById(`check-${t}`);c&&!c.disabled&&(c.checked=!c.checked,i(t))}}}function $e(e){u("click");const t=L.some(d=>d.id===e),i=t?"sm":"pm",l=t?L:H,n=t?G:U,c=l.find(d=>d.id===e);if(!c||!c.isWarrior)return;if(Q(i)>=5){z("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning");return}n[e]=(n[e]||0)+1;const o=document.getElementById(`warrior-count-${e}`);o&&(o.textContent=n[e]);const m=document.getElementById(`picker-row-${e}`);m&&(n[e]>0?m.classList.add("selected"):m.classList.remove("selected")),Y(),Z(i)}function Ge(e){u("click");const t=L.some(r=>r.id===e),i=t?"sm":"pm",l=t?G:U;if(!l[e]||l[e]<=0)return;l[e]--;const n=document.getElementById(`warrior-count-${e}`);n&&(n.textContent=l[e]);const c=document.getElementById(`picker-row-${e}`);c&&l[e]<=0&&c.classList.remove("selected"),Y(),Z(i)}function Q(e){const t=e==="sm"?L:H,i=e==="sm"?G:U;let l=0;return t.filter(n=>!n.isLeader&&!n.isWarrior).forEach(n=>{var c;(c=document.getElementById(`check-${n.id}`))!=null&&c.checked&&l++}),t.filter(n=>!n.isLeader&&n.isWarrior).forEach(n=>{l+=i[n.id]||0}),l}function ke(e){const t=e==="sm"?L:H;let i=0;return t.filter(l=>l.isLeader).forEach(l=>{var n;e==="pm"?i=1:(n=document.getElementById(`check-${l.id}`))!=null&&n.checked&&i++}),i+Q(e)}function fe(){Object.keys(G).forEach(d=>delete G[d]),Object.keys(U).forEach(d=>delete U[d]);const e=L.filter(d=>d.isLeader),t=L.filter(d=>!d.isLeader),i=document.getElementById("sm-leader-section"),l=document.getElementById("sm-operator-section");i.innerHTML="",l.innerHTML="",i.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:#60a5fa; margin-bottom:6px; padding-left:4px;">
      🎖️ LEADER — 单选 1 名 (3 选 1)
    </div>
  `,e.forEach(d=>{const p=document.createElement("div");p.className="roster-pick-row",p.id=`picker-row-${d.id}`,p.innerHTML=te(d,"Space Marine",!0,!1,!1,"toggleSelectSM"),re(p,d.id,me,!1),i.appendChild(p)}),l.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:#60a5fa; margin:12px 0 6px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span>🎯 OPERATORS — 共选 5 名 (Warrior 可用计数器重复选取)</span>
      <span id="sm-op-count" style="font-size:0.75rem; color:#94a3b8; font-family:'Orbitron',sans-serif;">0 / 5</span>
    </div>
    <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px; padding-left:4px;">
      ⚠️ 非 Warrior 每种只能带一名。Warrior [Warrior] 可用 +/− 按钮选取最多 5 名同型单位。
    </p>
  `,t.forEach(d=>{const p=document.createElement("div");p.className="roster-pick-row",p.id=`picker-row-${d.id}`,p.innerHTML=te(d,"Space Marine",!1,!1,!1,"toggleSelectSM"),re(p,d.id,me,d.isWarrior),l.appendChild(p)});const n=H.filter(d=>d.isLeader),c=H.filter(d=>!d.isLeader),r=document.getElementById("pm-leader-section"),o=document.getElementById("pm-operator-section");r.innerHTML="",o.innerHTML="",r.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:var(--pm-accent); margin-bottom:6px; padding-left:4px;">
      🎖️ LEADER — 必选
    </div>
  `;const m="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(132,204,22,0.15)";n.forEach(d=>{const p=document.createElement("div");p.className="roster-pick-row selected",p.id=`picker-row-${d.id}`,p.innerHTML=te(d,"Plague Marine",!0,!0,!0,"toggleSelectPM",m),r.appendChild(p)}),o.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:var(--pm-accent); margin:12px 0 6px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span>🎯 OPERATORS — 共选 5 名 (6 类型, Warrior 可重复)</span>
      <span id="pm-op-count" style="font-size:0.75rem; color:#94a3b8; font-family:'Orbitron',sans-serif;">0 / 5</span>
    </div>
    <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px; padding-left:4px;">
      ⚠️ 非 Warrior 每种只能带一名。Warrior [Warrior] 可用 +/− 按钮选取多名同型单位。
    </p>
  `,c.forEach(d=>{const p=document.createElement("div");p.className="roster-pick-row",p.id=`picker-row-${d.id}`,p.innerHTML=te(d,"Plague Marine",!1,!1,!1,"toggleSelectPM",m),re(p,d.id,Te,d.isWarrior),o.appendChild(p)}),Y(),Z("sm"),Z("pm")}function me(e){u("click");const t=L.find(n=>n.id===e),i=document.getElementById(`check-${e}`),l=document.getElementById(`picker-row-${e}`);if(!(!t||!i)){if(t.isLeader)i.checked&&L.filter(n=>n.isLeader&&n.id!==e).forEach(n=>{var r;const c=document.getElementById(`check-${n.id}`);c&&(c.checked=!1,(r=document.getElementById(`picker-row-${n.id}`))==null||r.classList.remove("selected"))});else if(i.checked&&Q("sm")>5){i.checked=!1,z("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning"),Y();return}i.checked?l.classList.add("selected"):l.classList.remove("selected"),Y(),Z("sm")}}function Te(e){u("click");const t=H.find(n=>n.id===e),i=document.getElementById(`check-${e}`),l=document.getElementById(`picker-row-${e}`);if(!(!t||!i)&&!t.isLeader){if(i.checked&&Q("pm")>5){i.checked=!1,z("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning"),Y();return}i.checked?l.classList.add("selected"):l.classList.remove("selected"),Y(),Z("pm")}}function Z(e){const t=e==="sm"?L:H,i=e==="sm"?G:U,n=Q(e)>=5;t.filter(c=>!c.isLeader).forEach(c=>{if(c.isWarrior){const r=document.querySelector(`#picker-row-${c.id} .warrior-counter-btn.plus`),o=document.querySelector(`#picker-row-${c.id} .warrior-counter-btn.minus`),m=i[c.id]||0;r&&(r.disabled=n),o&&(o.disabled=m<=0)}else{const r=document.getElementById(`check-${c.id}`);if(!r)return;n&&!r.checked?r.disabled=!0:r.disabled=!1}})}function Y(){const e=ke("sm"),t=Q("sm");document.getElementById("sm-roster-count").textContent=`已选: ${e} / 6 人`;const i=document.getElementById("sm-op-count");i&&(i.textContent=`${t} / 5`);const l=ke("pm"),n=Q("pm");document.getElementById("pm-roster-count").textContent=`已选: ${l} / 6 人`;const c=document.getElementById("pm-op-count");c&&(c.textContent=`${n} / 5`)}function Ue(){var r;u("click");const e=[];let t=0;L.forEach(o=>{var m;if(o.isWarrior){const d=G[o.id]||0;d>0&&e.push({tmpl:o,count:d})}else(m=document.getElementById(`check-${o.id}`))!=null&&m.checked&&(e.push({tmpl:o,count:1}),o.isLeader&&t++)});const i=e.reduce((o,m)=>o+m.count,0),l=[];H.forEach(o=>{var m;if(o.isWarrior){const d=U[o.id]||0;d>0&&l.push({tmpl:o,count:d})}else(m=document.getElementById(`check-${o.id}`))!=null&&m.checked&&l.push({tmpl:o,count:1})});const n=l.reduce((o,m)=>o+m.count,0);if(i!==6){u("alert"),z(`星际战士 (死亡天使) 必须刚好选择 6 人！当前选择了 ${i} 人。`,"error");return}if(t!==1){u("alert"),z("星际战士 必须选择且仅选择 1 名队长！","error");return}if(n!==6){u("alert"),z(`瘟疫守卫 必须刚好选择 6 人！当前选择了 ${n} 人。`,"error");return}if(!((r=document.getElementById("check-pm_1"))==null?void 0:r.checked)){u("alert"),z("瘟疫守卫 的 冠军队长 (Plague Champion) 是强制出战的 Leader 角色！","error");return}s.operatives=[],e.forEach(({tmpl:o,count:m})=>{for(let d=0;d<m;d++){const p=m>1?`${o.id}_${d+1}`:o.id,g=m>1?`${o.name} #${d+1}`:o.name;s.operatives.push(new ye(p,g,"Space Marine",o.wounds,o.apl,o.df,o.sv,o.weapons,o.defaultAvatar,o.move||6))}}),l.forEach(({tmpl:o,count:m})=>{for(let d=0;d<m;d++){const p=m>1?`${o.id}_${d+1}`:o.id,g=m>1?`${o.name} #${d+1}`:o.name;s.operatives.push(new ye(p,g,"Plague Marine",o.wounds,o.apl,o.df,o.sv,o.weapons,o.defaultAvatar,o.move||5))}}),document.getElementById("start-screen").style.display="none",document.getElementById("global-dash").style.display="grid",document.getElementById("battle-area").style.display="grid",document.getElementById("guidance-banner").style.display="flex",T(">>> 战队挑选部署完毕！"),T(`  - Angels of Death (星际战士) 登场: ${s.operatives.filter(o=>o.faction==="Space Marine").map(o=>o.name).join(", ")}`),T(`  - Plague Marines (瘟疫守卫) 登场: ${s.operatives.filter(o=>o.faction==="Plague Marine").map(o=>o.name).join(", ")}`),j(),W(),Me()}function W(){const e=document.getElementById("sm-ops-list"),t=document.getElementById("pm-ops-list");e.innerHTML="",t.innerHTML="";let i=0,l=0;s.operatives.forEach(n=>{const c=n.faction==="Space Marine";c&&!n.isDead&&i++,!c&&!n.isDead&&l++;const r=document.createElement("div");let o=`op-card ${c?"sm-theme":"pm-theme"}`;n.isDead?o+=" dead":n.hasActed&&(o+=" activated"),s.activeAgent&&s.activeAgent.id===n.id&&(o+=" active-target"),r.className=o;const m=n.wounds/n.maxWounds*100,d=n.weapons.map(y=>y.name.split(" ")[0]).join(" / ");let p="";!c&&s.pmActivePloys.includes("contagious_resilience")&&!n.isDead&&(p='<span class="card-ploy-tag" style="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(132,204,22,0.15);">减伤重投</span>');let g="";n.isDead||(n.hasConceal&&(g+='<span class="card-ploy-tag" style="border-color:#818cf8; color:#818cf8; background:rgba(129,140,248,0.15); font-size:0.6rem;">隐蔽</span>'),n.isInjured&&(g+='<span class="card-ploy-tag" style="border-color:var(--red); color:var(--red); background:rgba(239,68,68,0.15); font-size:0.6rem;">重伤</span>'),n.poisonTokens>0&&(g+='<span class="card-ploy-tag" style="border-color:#a3e635; color:#a3e635; background:rgba(163,230,53,0.15); font-size:0.6rem;">毒素×'+n.poisonTokens+"</span>"));const k=!n.isDead&&!n.hasActed&&s.phase==="Firefight"&&s.activeTurn===n.faction?`<button class="conceal-toggle-btn" onclick="event.stopPropagation(); toggleConceal('${n.id}')" title="切换隐蔽状态" style="font-size:0.65rem; padding:2px 6px; margin-left:4px; background:${n.hasConceal?"rgba(129,140,248,0.3)":"transparent"}; border:1px solid #818cf8; color:#818cf8; border-radius:4px; cursor:pointer;">${n.hasConceal?"🛡️隐蔽":"🛡️"}</button>`:"",$=ue(n.id,n.faction);r.innerHTML=`
      <div class="op-card-top">
        <div class="op-avatar-row">
          ${$}
          <span class="op-card-title">${n.name} ${p} ${g} ${k}</span>
        </div>
        <span class="op-card-tag">${n.currentApl} APL${n.isInjured?' <span style="color:var(--red); font-size:0.6rem;">(-1)</span>':""}</span>
      </div>
      <div class="op-card-hp">
        <span>HP (Wounds):</span>
        <span>${n.wounds} / ${n.maxWounds}</span>
      </div>
      <div class="op-hp-bar-container">
        <div class="op-hp-bar" style="width: ${m}%; background-color: ${m<40?"var(--red)":"var(--green)"}"></div>
      </div>
      <div class="op-card-stats">
        <span>Move: <strong>${n.currentMove}"</strong>${n.isInjured?' <span style="color:var(--red); font-size:0.55rem;">(-2)</span>':""}</span>
        <span>DF: <strong>${n.df}</strong></span>
        <span>SV: <strong>${n.sv}+</strong></span>
        <span style="font-size: 0.65rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">
          ${d}
        </span>
      </div>
    `,r.setAttribute("role","button"),r.setAttribute("tabindex","0"),r.setAttribute("aria-label",`${n.name}，HP: ${n.wounds}/${n.maxWounds}，${n.isDead?"已阵亡":n.hasActed?"已激活":"可激活"}`),!n.isDead&&!n.hasActed&&s.phase==="Firefight"&&s.activeTurn===n.faction&&!s.activeAgent?(r.onclick=()=>pe(n.id),r.onkeydown=y=>{(y.key==="Enter"||y.key===" ")&&(y.preventDefault(),pe(n.id))}):(r.onclick=null,r.onkeydown=null,n.isDead&&r.setAttribute("aria-disabled","true")),c?e.appendChild(r):t.appendChild(r)}),document.getElementById("sm-alive-count").textContent=`${i} / 6 存活`,document.getElementById("pm-alive-count").textContent=`${l} / 6 存活`}function Qe(e){u("click");const t=s.operatives.find(i=>i.id===e);!t||t.isDead||t.hasActed||(t.toggleConceal(),T(`[隐蔽] ${t.name} ${t.hasConceal?"进入隐蔽状态 (Conceal Order)，不可被指定为射击/近战目标。":"解除了隐蔽状态。"}`),W())}function pe(e){u("click");const t=s.operatives.find(i=>i.id===e);if(!(!t||t.isDead||t.hasActed)){if(s.activeAgent=t,t.actionsPerformed=[],t.poisonTokens>0&&(T(`[Poison] ${t.name} 携带毒素标记，激活开始受到 1 点伤害！`),t.applyWounds(1),t.isDead)){W(),_();return}t.apl=t.currentApl,T(`[激活] ${t.name} 开始激活，获得 ${t.apl} APL！${t.isInjured?" (Injured: APL -1)":""}`),W(),_()}}function _(){const e=document.getElementById("active-panel-content"),t=document.getElementById("active-panel-empty"),i=document.getElementById("active-panel-status"),l=document.getElementById("active-panel");if(s.activeAgent){e.style.display="flex",t.style.display="none";const n=s.activeAgent;i.textContent="当前激活特工";const c=document.getElementById("active-op-avatar-container");c&&(c.innerHTML=ue(n.id,n.faction)),l.className=`active-card ${n.faction==="Space Marine"?"sm-active":"pm-active"}`,document.getElementById("active-op-name").textContent=n.name,document.getElementById("active-op-faction").textContent=n.faction==="Space Marine"?"死亡天使":"瘟疫守卫";const r=document.getElementById("active-apl-dots");r.innerHTML="";for(let E=0;E<n.maxApl;E++){const O=document.createElement("div");O.className="apl-dot"+(E<n.apl?" active":""),r.appendChild(O)}const o=n.actionsPerformed.includes("Move"),m=n.actionsPerformed.includes("Charge"),d=n.actionsPerformed.filter(E=>E==="Shoot").length,p=n.actionsPerformed.filter(E=>E==="Fight").length,g=d>0,v=p>0,k=2,$=2,y=v,x=g,M=d>=k,h=p>=$;document.getElementById("action-move").disabled=n.apl<1||o||m,document.getElementById("action-charge").disabled=n.apl<1||o||m||v,document.getElementById("action-shoot").disabled=n.apl<1||M||y||m,document.getElementById("action-fight").disabled=n.apl<1||h||x;const S=n.faction==="Plague Marine"&&s.pmActivePloys.includes("contagious_resilience"),b=document.getElementById("active-ploys-display");if(b){const E=[];g&&E.push(`<span style="color:#60a5fa;">💥 Astartes: 已射击×${d}，锁定近战</span>`),v&&E.push(`<span style="color:#f87171;">⚔️ Astartes: 已近战×${p}，锁定射击</span>`),S&&E.push('<span style="color:var(--pm-accent);">🛡️ 传染韧性生效中</span>'),b.innerHTML=E.length>0?E.join(" | "):""}const P=document.querySelector("#action-shoot span:first-child");if(P){const E=k-d,O=y?" (已锁定)":"";P.innerHTML=`💥 射击 [${E>0?E:0}次剩余${O}]`}const A=document.querySelector("#action-fight span:first-child");if(A){const E=$-p,O=x?" (已锁定)":"";A.innerHTML=`⚔️ 近战 [${E>0?E:0}次剩余${O}]`}N(`【特工行动】${n.name} 剩余 APL: ${n.apl}。可执行移动/冲锋/射击/近战，或点击下方按钮结束。`)}else{e.style.display="none",t.style.display="block",i.textContent="等待特工激活",l.className="active-card";const n=s.activeTurn,c=n==="Space Marine"?"死亡天使":"瘟疫守卫";J(n)?N(`【激活提示】请从${n==="Space Marine"?"左边":"右边"}【${c}】战队卡片列表中选择点击发亮的特工卡片，载入动作。`):J(n==="Space Marine"?"Plague Marine":"Space Marine")?N("【激活换边】因为当前轮次已无可用单位，权能自动转回另一方。请继续点击激活。"):N("【激活结束】双方所有特工已耗尽激活！请点击右上角的回合推进至下一TP。")}}function Ye(){const e=s.activeAgent;!e||e.apl<1||(u("click"),e.apl-=1,e.actionsPerformed.push("Move"),T(`  - ${e.name} 执行 [移动 (Move)]，消耗 1 APL。`),_())}function Xe(){const e=s.activeAgent;!e||e.apl<1||(u("click"),e.apl-=1,e.actionsPerformed.push("Charge"),T(`  - ${e.name} 执行 [冲锋 (Charge)] 移动近战位，消耗 1 APL。`),_())}function Je(){u("click");const e=s.activeAgent;e&&(e.hasActed=!0,e.apl=0,T(`[结束激活] ${e.name} 结束了本次激活。`),s.activeAgent=null,Oe())}function Me(){s.phase="Initiative",j(),le();const e=document.getElementById("phase-overlay-content");e.innerHTML=`
    <h3>Turning Point ${s.turningPoint} - 先攻掷骰</h3>
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
  `,N("【先攻阶段】点击按钮开始判定本回合先手优势权。")}function le(){const e=document.getElementById("phase-overlay");e.style.display="flex",se(e)}function ge(){document.getElementById("phase-overlay").style.display="none",oe()}function Ze(){const e=document.getElementById("overlay-init-sm-dice"),t=document.getElementById("overlay-init-pm-dice"),i=document.getElementById("btn-overlay-roll");i.disabled=!0,e.innerHTML='<div class="kt-dice-cube sm-dice rolling">?</div>',t.innerHTML='<div class="kt-dice-cube pm-dice rolling">?</div>',u("shoot"),setTimeout(()=>{const l=Math.floor(Math.random()*6)+1;e.innerHTML=`<div class="kt-dice-cube sm-dice ${l===6?"crit-dice":""}">${l}</div>`,u("click"),l===6&&u("crit"),setTimeout(()=>{const n=Math.floor(Math.random()*6)+1;if(t.innerHTML=`<div class="kt-dice-cube pm-dice ${n===6?"crit-dice":""}">${n}</div>`,u("click"),n===6&&u("crit"),l===n)u("alert"),document.getElementById("overlay-init-sm-val").textContent=`平局 [${l}]`,document.getElementById("overlay-init-pm-val").textContent=`平局 [${n}]`,i.disabled=!1,i.textContent="平局！重新投骰",T(`  - 先攻判定平局 [${l}]，准备重投...`);else{const r=(l>n?"Space Marine":"Plague Marine")==="Space Marine"?"死亡天使":"瘟疫守卫";u("crit"),document.getElementById("overlay-init-sm-val").textContent=`点数: ${l}`,document.getElementById("overlay-init-pm-val").textContent=`点数: ${n}`,T(`  - 先攻判定掷骰：死亡天使 [${l}] vs 瘟疫守卫 [${n}]`),T(`  - 【${r}】赢得了投骰，准备选择先攻权归属。`);const o=document.getElementById("phase-overlay-content"),m=document.createElement("div");m.style.cssText="border-top:1px solid var(--panel-border); margin-top:16px; padding-top:16px; width:100%;",m.innerHTML=`
            <p style="color:var(--sm-accent); font-weight:bold; margin-bottom:10px;">👑 【${r}】选择首发玩家：</p>
            <div style="display:flex; gap:10px;">
              <button class="qa-btn" onclick="selectTurnOrder('Space Marine')">死亡天使先攻 (Astartes First)</button>
              <button class="qa-btn" onclick="selectTurnOrder('Plague Marine')">瘟疫守卫先攻 (Death Guard First)</button>
            </div>
        `,o.appendChild(m),N(`【选择先后】王座归属：【${r}】玩家获胜，请点击按钮指定本回合先攻。`)}},300)},700)}function et(e){u("click"),s.initiative=e,s.activeTurn=e,T(`  - 确认：【${e==="Space Marine"?"死亡天使":"瘟疫守卫"}】获得本回合的先攻优势！`),Se()}function Se(){s.phase="Strategy",j(),le();const e=document.getElementById("phase-overlay-content");e.innerHTML=`
    <h3>Turning Point ${s.turningPoint} - 策略阶段</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">
      在此阶段，双方可以使用命令点 (CP) 激活计策 (Strategic Ploys)。
    </p>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">
      <div class="ploy-choice-card ${s.smActivePloys.includes("bolter_discipline")?"selected":""}" role="button" tabindex="0" onclick="buyPloy('sm')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();buyPloy('sm')}">
        <div class="ploy-title">
          <span>🔥 爆弹惩戒 (1 CP)</span>
          <span style="font-size:0.75rem; color:#60a5fa;">Astartes</span>
        </div>
        <div class="ploy-desc">
          死亡天使特工本回合激活内，可以使用<b>两次</b>射击行动。
        </div>
        <div style="margin-top:6px; font-weight:bold; font-size:0.75rem; color:var(--sm-accent);">
          ${s.smActivePloys.includes("bolter_discipline")?"● 生效中":"点击启用"}
        </div>
      </div>

      <div class="ploy-choice-card ${s.pmActivePloys.includes("contagious_resilience")?"selected":""}" role="button" tabindex="0" onclick="buyPloy('pm')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();buyPloy('pm')}">
        <div class="ploy-title">
          <span>🛡️ 传染韧性 (1 CP)</span>
          <span style="font-size:0.75rem; color:var(--pm-accent);">Death Guard</span>
        </div>
        <div class="ploy-desc">
          瘟疫守卫在结算【恶心作呕 (DR)】伤害减免时，可<b>重投第一个失败的减伤骰</b>。
        </div>
        <div style="margin-top:6px; font-weight:bold; font-size:0.75rem; color:var(--pm-accent);">
          ${s.pmActivePloys.includes("contagious_resilience")?"● 生效中":"点击启用"}
        </div>
      </div>
    </div>

    <button class="btn-large" onclick="proceedToFirefight()" style="padding: 10px 40px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #065f46); border-color:#059669; box-shadow:none;">
      进入战斗阶段 (Proceed to Firefight)
    </button>
  `,N("【策略阶段】双方轮流消费 1 CP 采购策略 Ploys。按 Proceed 按钮进入实际交火战斗。")}function tt(e){if(e==="sm")if(s.smActivePloys.includes("bolter_discipline"))u("click"),s.smActivePloys=[],s.smCp+=1;else{if(s.smCp<1){u("alert"),z("死亡天使 CP 不足！","warning");return}u("crit"),s.smActivePloys.push("bolter_discipline"),s.smCp-=1,T("  - 死亡天使激活策略：【爆弹惩戒】！本回合可双击开火！")}else if(s.pmActivePloys.includes("contagious_resilience"))u("click"),s.pmActivePloys=[],s.pmCp+=1;else{if(s.pmCp<1){u("alert"),z("瘟疫守卫 CP 不足！","warning");return}u("crit"),s.pmActivePloys.push("contagious_resilience"),s.pmCp-=1,T("  - 瘟疫守卫激活策略：【传染韧性】！DR首发失败可重投！")}Se()}function nt(){u("click"),ge(),s.phase="Firefight",j(),T(`
【战斗阶段开始】Turning Point ${s.turningPoint}`),T(`>>> 首发方【${s.activeTurn==="Space Marine"?"死亡天使":"瘟疫守卫"}】可以激活一名特工。`),W(),_(),N("【特工激活期】在两侧列表中点击未激活的特工（高亮）卡片，载入中央控制板执行动作。")}function at(e){u("click");const t=ze[e];if(!t)return;document.getElementById("help-title").textContent=t.title,document.getElementById("help-body").innerHTML=t.body;const i=document.getElementById("help-modal");i.style.display="flex",se(i)}function Ee(){u("click"),document.getElementById("help-modal").style.display="none",oe()}function it(e){u("funeral");const t=document.getElementById("death-overlay"),i=document.getElementById("death-model-name"),l=document.getElementById("death-model-faction"),n=document.getElementById("death-gag-text");if(t){i.textContent=e.name,l.textContent=e.faction==="Space Marine"?"死亡天使 (Angels of Death)":"瘟疫守卫 (Plague Marines)";const c=Math.floor(Math.random()*be.length);n.textContent=be[c],t.style.display="flex",se(t)}T(`[阵亡提示] 特工 ${e.name} 已阵亡！请在物理沙盘中移除模型。`)}function Pe(){u("click");const e=document.getElementById("death-overlay");e&&(e.style.display="none",oe()),st()}function st(){if(s.gameOver)return;const e=s.operatives.filter(i=>i.faction==="Space Marine"&&!i.isDead).length,t=s.operatives.filter(i=>i.faction==="Plague Marine"&&!i.isDead).length;e===0&&t===0?(s.gameOver=!0,X("draw","双方均全员阵亡，战斗以同归于尽平局告终！")):e===0?(s.gameOver=!0,X("pm",`死亡天使战队全员阵亡！
瘟疫守卫 (Plague Marines) 成功清剿了残敌，夺取了战场的完全控制权！`)):t===0&&(s.gameOver=!0,X("sm",`瘟疫守卫战队全员阵亡！
死亡天使 (Angels of Death) 肃清了战场，坚守住帝国的光荣防线！`))}function X(e,t){le();const i=document.getElementById("phase-overlay-content");let l="🎉 对局结束 🎉",n="var(--text-main)";e==="sm"?(l="🏆 死亡天使 (Angels of Death) 荣获胜利！ 🏆",n="#60a5fa"):e==="pm"?(l="🏆 瘟疫守卫 (Plague Marines) 荣获胜利！ 🏆",n="var(--pm-accent)"):e==="draw"&&(l="🤝 双方同归于尽 (Match Draw) 🤝",n="var(--sm-accent)"),i.innerHTML=`
    <h3 style="color: ${n}; font-size: 1.4rem; margin-bottom: 12px;">${l}</h3>
    <div class="qa-card" style="margin-bottom: 20px; font-size: 0.95rem; text-align: center; line-height: 1.6; border-color: rgba(255,255,255,0.1);">
      <p style="white-space: pre-line; color: var(--text-main);">${t}</p>
    </div>
    <button class="btn-large" onclick="confirmReset()" style="padding: 10px 30px; font-size:0.9rem; background: var(--red); border-color: #f43f5e; width: 100%;">
      返回主菜单并重置对局
    </button>
  `}function Ae(){s.phase="TurnEndScoring",j(),le();const e=s.operatives.filter(n=>n.faction==="Plague Marine"&&n.isDead).length,t=s.operatives.filter(n=>n.faction==="Space Marine"&&n.isDead).length,i=e-s.smKillsScored,l=t-s.pmKillsScored;s.tempSmChecklist=[!1,!1,!1,!1,!1],s.tempPmChecklist=[!1,!1,!1,!1,!1],s.tempSmObjManualOffset=0,s.tempPmObjManualOffset=0,s.tempSmObjVp=0,s.tempPmObjVp=0,s.tempSmKillVp=i,s.tempPmKillVp=l,s.tempSmKills=e,s.tempPmKills=t,ve(),N("【回合结算】引导计算 VP：请输入双方本回合完成任务的 VP，并确认得分结算。")}function ve(){const e=document.getElementById("phase-overlay-content"),t=s.tempSmKillVp+s.tempSmObjVp,i=s.tempPmKillVp+s.tempPmObjVp,l=s.turningPoint>=5,n=l?"确认结算并完成对局":"确认结算并推进回合",c=l?"declareScoreVictory()":"confirmTurnEndScoring()";e.innerHTML=`
    <h3 style="font-size:1.3rem; margin-bottom: 8px;">Turning Point ${s.turningPoint} - 得分结算</h3>
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
            <span style="font-weight:bold; color:var(--sm-accent);">${s.tempSmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${s.tempSmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">任务结算助手 (Objective Checklist)</div>
            <label class="scoring-item">
              <input type="checkbox" ${s.tempSmChecklist[0]?"checked":""} onchange="toggleScoringChecklist('sm', 0)">
              <span>控制1+目标点 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${s.tempSmChecklist[1]?"checked":""} onchange="toggleScoringChecklist('sm', 1)">
              <span>控制目标多于对手 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${s.tempSmChecklist[2]?"checked":""} onchange="toggleScoringChecklist('sm', 2)">
              <span>完成特定任务动作 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${s.tempSmChecklist[3]?"checked":""} onchange="toggleScoringChecklist('sm', 3)">
              <span>本回合秘密任务1 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${s.tempSmChecklist[4]?"checked":""} onchange="toggleScoringChecklist('sm', 4)">
              <span>本回合秘密任务2 (+1 VP)</span>
            </label>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span>🎯 调整任务得分 (Total Obj VP)：</span>
            <div class="val-control">
              <button class="adjust-btn" onclick="adjustScoreTemp('sm', -1)">-</button>
              <span class="val" style="font-size:1.1rem; font-weight:bold; min-width:20px; text-align:center;">${s.tempSmObjVp}</span>
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
            <span style="font-weight:bold; color:var(--pm-accent);">${s.tempPmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${s.tempPmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">任务结算助手 (Objective Checklist)</div>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${s.tempPmChecklist[0]?"checked":""} onchange="toggleScoringChecklist('pm', 0)">
              <span>控制1+目标点 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${s.tempPmChecklist[1]?"checked":""} onchange="toggleScoringChecklist('pm', 1)">
              <span>控制目标多于对手 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${s.tempPmChecklist[2]?"checked":""} onchange="toggleScoringChecklist('pm', 2)">
              <span>完成特定任务动作 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${s.tempPmChecklist[3]?"checked":""} onchange="toggleScoringChecklist('pm', 3)">
              <span>本回合秘密任务1 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${s.tempPmChecklist[4]?"checked":""} onchange="toggleScoringChecklist('pm', 4)">
              <span>本回合秘密任务2 (+1 VP)</span>
            </label>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span>🎯 调整任务得分 (Total Obj VP)：</span>
            <div class="val-control">
              <button class="adjust-btn" onclick="adjustScoreTemp('pm', -1)">-</button>
              <span class="val" style="font-size:1.1rem; font-weight:bold; min-width:20px; text-align:center;">${s.tempPmObjVp}</span>
              <button class="adjust-btn" onclick="adjustScoreTemp('pm', 1)">+</button>
            </div>
          </div>
          <div style="border-top:1px dashed rgba(255,255,255,0.1); padding-top:8px; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:0.95rem;">
            <span>本回合得分小计：</span>
            <span style="color:var(--pm-accent);">+${i} VP</span>
          </div>
        </div>
      </div>

    </div>

    <button class="btn-large" onclick="${c}" style="padding: 12px 30px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #065f46); border-color:#059669; box-shadow:none; width: 100%;">
      ${n}
    </button>
  `}function ot(e,t){u("click"),e==="sm"?(s.tempSmChecklist[t]=!s.tempSmChecklist[t],s.tempSmObjVp=Math.max(0,s.tempSmChecklist.filter(Boolean).length+s.tempSmObjManualOffset)):(s.tempPmChecklist[t]=!s.tempPmChecklist[t],s.tempPmObjVp=Math.max(0,s.tempPmChecklist.filter(Boolean).length+s.tempPmObjManualOffset)),ve()}function lt(e,t){u("click"),e==="sm"?(s.tempSmObjManualOffset+=t,s.tempSmObjVp=Math.max(0,s.tempSmChecklist.filter(Boolean).length+s.tempSmObjManualOffset)):(s.tempPmObjManualOffset+=t,s.tempPmObjVp=Math.max(0,s.tempPmChecklist.filter(Boolean).length+s.tempPmObjManualOffset)),ve()}function ct(){u("crit");const e=s.tempSmKillVp+s.tempSmObjVp,t=s.tempPmKillVp+s.tempPmObjVp;s.smVp+=e,s.pmVp+=t,s.smKillsScored=s.tempSmKills,s.pmKillsScored=s.tempPmKills,T(`
--- Turning Point ${s.turningPoint} 回合结算结果 ---`),T(`[死亡天使] 新增 ${e} VP (任务:${s.tempSmObjVp}, 击杀:${s.tempSmKillVp}) | 累计 VP: ${s.smVp}`),T(`[瘟疫守卫] 新增 ${t} VP (任务:${s.tempPmObjVp}, 击杀:${s.tempPmKillVp}) | 累计 VP: ${s.pmVp}`),ge(),Ve()}function rt(){u("crit");const e=s.tempSmKillVp+s.tempSmObjVp,t=s.tempPmKillVp+s.tempPmObjVp;s.smVp+=e,s.pmVp+=t,s.smKillsScored=s.tempSmKills,s.pmKillsScored=s.tempPmKills,s.gameOver=!0,j();let i=`双方经历五回合激烈交火，战斗正式落幕！
最终战队积分：
死亡天使: ${s.smVp} VP
瘟疫守卫: ${s.pmVp} VP

`;s.smVp===s.pmVp?X("draw",i+"双方得分平分秋色，本局握手言和！"):s.smVp>s.pmVp?X("sm",i+"死亡天使胜利点数更高，赢得最终胜利！"):X("pm",i+"瘟疫守卫胜利点数更高，赢得最终胜利！")}function dt(e,t){e.stopPropagation();const i=document.getElementById("global-avatar-uploader");i&&(i.dataset.targetOpId=t,i.value="",i.click())}function mt(e){const t=e.target.files[0];if(!t)return;const i=e.target.dataset.targetOpId;if(!i)return;const l=new FileReader;l.onload=function(n){const c=n.target.result;s.customAvatars[i]=c,fe(),W(),_(),T(`[头像上传] 成功更新特工 [${i}] 的自定义照片！`)},l.readAsDataURL(t)}function pt(e,t="normal"){Ne.matches||(document.body.classList.remove("intense-shake"),document.body.offsetWidth,document.body.classList.add("intense-shake"),setTimeout(()=>{document.body.classList.remove("intense-shake")},400));const i=document.createElement("div");i.className="impact-effect-text",i.textContent=e,t==="strike"?(i.style.color="var(--red)",i.style.textShadow="0 0 20px rgba(225, 29, 72, 0.85), 0 0 40px #000"):t==="parry"?(i.style.color="#38bdf8",i.style.textShadow="0 0 20px rgba(56, 189, 248, 0.85), 0 0 40px #000"):t==="shoot"?i.style.color="var(--sm-accent)":t==="deflect"&&(i.style.color="#a3e635",i.style.textShadow="0 0 20px rgba(163, 230, 53, 0.85), 0 0 40px #000"),document.body.appendChild(i),setTimeout(()=>{i.remove()},1800)}function ut(e,t){[`.duel-avatar-${e}`,`.main-avatar-${e}`].forEach(l=>{const n=document.querySelector(l);if(!n)return;n.classList.remove("avatar-hit-flash"),n.querySelectorAll(".bullet-hole-effect, .slash-effect").forEach(o=>o.remove()),n.offsetWidth,n.classList.add("avatar-hit-flash");const r=document.createElement("div");r.className=t==="shoot"?"bullet-hole-effect":"slash-effect",n.appendChild(r),setTimeout(()=>{n.classList.remove("avatar-hit-flash"),r.remove()},900)})}const C={};function ft(e){Object.assign(C,e)}window.matchMedia("(prefers-reduced-motion: reduce)");let R=!1,V=[];function K(e,t){const i=setTimeout(e,t);return V.push(i),i}function Le(){const e=document.getElementById("combat-modal");e.style.display="flex",document.getElementById("modal-btn-next").disabled=!0}function ce(){u("click"),document.getElementById("combat-modal").style.display="none",R=!1,V=[],C.renderOperatives(),C.updateActivePanel()}function he(){if(u("click"),a.actionType==="shoot"){if(a.step===3){if(!a.inRangeAndVisible){u("alert");return}if(a.inCoverConcealed){u("alert");return}}else if(a.step===4&&a.mode==="manual"){if(Tt(),a.attackRolls.length===0)return}else if(a.step===5&&a.mode==="manual"){Mt();const e=document.getElementById("manual-def-dice-val");if(e&&e.value.trim()!==""&&a.defenseRolls.length===0)return}}else if(a.actionType==="fight"&&a.step===3){if(!a.inMeleeRange){u("alert");return}if(a.hasFallenBack){u("alert");return}}a.step++,a.actionType==="shoot"?D():a.actionType==="fight"&&F()}function De(){u("click");const e=s.activeAgent;if(!e)return;const t=document.querySelector("#combat-modal .modal-content");t&&(t.style.backgroundImage='linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("assets/images/backgrounds/bg_shoot_action.png")',t.style.backgroundSize="cover",t.style.backgroundPosition="center"),Object.assign(a,{actionType:"shoot",step:1,attacker:e,defender:null,weapon:e.weapons.filter(i=>i.isRanged)[0]||null,inRangeAndVisible:!0,inCoverConcealed:!1,inCover:!1,mode:"random",attRerollIndex:-1,defRerollIndex:-1,attackRolls:[],defenseRolls:[]}),a.weapon&&(Le(),D())}function D(){const e=document.getElementById("modal-title"),t=document.getElementById("modal-body"),i=document.getElementById("modal-btn-next"),l=document.getElementById("modal-btn-cancel");if(i.onclick=he,l.style.display="inline-block",a.step===1){e.textContent="射击结算 - 步骤 1: 选择目标";const n=a.attacker.faction==="Space Marine"?"Plague Marine":"Space Marine",c=s.operatives.filter(m=>m.faction===n&&!m.isDead),r=c.filter(m=>!m.hasConceal);if(c.length>0&&r.length===0){t.innerHTML='<p style="color:var(--red);">所有敌方特工均处于隐蔽状态，无法被指定为射击目标。</p>',i.disabled=!0;return}if(r.length===0){t.innerHTML='<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>',i.disabled=!0;return}let o='<div class="weapon-picker-list">';r.forEach(m=>{const d=m.isInjured?' <span style="color:var(--red); font-size:0.7rem;">[重伤]</span>':"",p=m.poisonTokens>0?' <span style="color:#a3e635; font-size:0.7rem;">[毒素]</span>':"";o+=`
        <div class="weapon-pick-item ${a.defender&&a.defender.id===m.id?"selected":""}" role="button" tabindex="0" onclick="selectShootDefender('${m.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectShootDefender('${m.id}')}">
          <span class="weapon-pick-name">${m.name}${d}${p}</span>
          <span class="weapon-pick-stats">HP: ${m.wounds}/${m.maxWounds} | DF:${m.df} | Move:${m.currentMove}"</span>
        </div>
      `}),o+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要射击的敌方特工：</p>
      ${o}
    `,i.textContent="选择武器",i.disabled=!a.defender}else if(a.step===2){e.textContent="射击结算 - 步骤 2: 选择武器";const n=a.attacker.weapons.filter(o=>o.isRanged),c=a.attacker.isInjured;let r='<div class="weapon-picker-list">';n.forEach((o,m)=>{const d=c?`${o.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${o.ts+1}+</span>`:`${o.ts}+`,p=o.range?` | Range: ${o.range}"`:"",g=o.rules&&o.rules.length>0?` | ${o.rules.join(", ")}`:"";r+=`
        <div class="weapon-pick-item ${a.weapon.name===o.name?"selected":""}" role="button" tabindex="0" onclick="selectShootWeapon(${m})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectShootWeapon(${m})}">
          <span class="weapon-pick-name">${o.name}</span>
          <span class="weapon-pick-stats">A: ${o.attacks} | BS: ${d} | D: ${o.normalDamage}/${o.criticalDamage}${p}${g}</span>
        </div>
      `}),r+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要射击使用的武器：</p>
      ${r}
    `,i.textContent="回答判定问题",i.disabled=!1}else if(a.step===3)e.textContent="射击结算 - 步骤 3: 距离与掩体判定",t.innerHTML=`
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
    `,i.textContent="选择掷骰模式",i.disabled=!1;else if(a.step===4){e.textContent="射击结算 - 步骤 4: 攻击方掷骰 (Angels of Death)";let n="";const c=a.attacker.faction==="Space Marine"?s.smCp:s.pmCp;a.attackRolls.length>0&&(n=`
        <div class="roll-summary-block" style="margin-top:10px;">
          🎯 <b>命中统计:</b> 暴击(6点): <span style="color:var(--sm-accent); font-weight:bold;">${a.attackCrit}</span>, 普通命中(${a.weapon.ts}+): <span style="color:#60a5fa;">${a.attackNorm}</span>
          ${c>=1&&a.attRerollIndex===-1?'<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上方任何一个未命中的灰色骰子重投。</span>':""}
        </div>
      `),t.innerHTML=`
      ${de()}

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
    `,a.attackRolls.length>0?(i.disabled=!1,xt()):a.mode==="manual"?i.disabled=!1:i.disabled=!0,i.textContent="防守方投骰"}else if(a.step===5){e.textContent="射击结算 - 步骤 5: 防守方防御掷骰 (Plague Marines)";let n="",c=a.defender.df;a.inCover&&(n=`<p style="color:var(--pm-accent); margin-bottom: 4px;">🛡️ 目标在掩体中：自动获得 1 个普通成功，且防御投骰池减 1 (DF = ${c} -> ${c-1})</p>`,c=Math.max(0,c-1));let r="";const o=a.defender.faction==="Space Marine"?s.smCp:s.pmCp;a.defenseRolls.length>0&&c>0&&(r=`
        <div class="roll-summary-block" style="margin-top:10px;">
          🛡️ <b>防守统计:</b> 暴击防守: <span style="color:var(--pm-accent); font-weight:bold;">${a.defCrit}</span>, 普通防守(${a.defender.sv}+): <span style="color:#86efac;">${a.defNorm}</span>
          ${o>=1&&a.defRerollIndex===-1?'<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上面任何一个未命中的灰色骰子重投。</span>':""}
        </div>
      `),t.innerHTML=`
      ${de()}

      <p style="margin-bottom: 6px;">防守特工: [${a.defender.name}]，保护要求: <b>${a.defender.sv}+</b></p>
      ${n}
      <p style="margin-bottom: 12px;">需要投掷的防御骰数: <b>${c}</b></p>

      <div class="dice-rolling-area" id="defense-rolling-zone">
        <div class="dice-pool-view" id="defense-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        <button class="modal-btn primary" id="btn-roll-defense" onclick="rollDefenseDice(${c})">开始顺序防守投骰</button>
      </div>

      ${r}

      <div id="manual-defense-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${c} 个防御骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-def-dice-val" value="5, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
      </div>
    `,a.defenseRolls.length>0||c===0?(i.disabled=!1,Ct()):a.mode==="manual"?i.disabled=!1:i.disabled=!0,i.textContent="计算伤害与对消"}else if(a.step===6){e.textContent="射击结算 - 步骤 6: 匹配对消与最终扣血";let n=a.attackCrit,c=a.attackNorm,r=a.defCrit,o=a.defNorm;const m=Math.min(n,r);n-=m,r-=m;let d=0;n>0&&o>=2&&(d=Math.min(n,Math.floor(o/2)),n-=d,o-=d*2);const p=Math.min(c,o);c-=p,o-=p;const g=Math.min(c,r);c-=g,r-=g;let v=a.weapon.normalDamage,k=a.weapon.criticalDamage;const $=a.weapon.hasRule&&a.weapon.hasRule("Toxic");$&&a.defender.poisonTokens>0&&(v+=1,k+=1,C.addLog(`[Toxic] 目标携带毒素标记，${a.weapon.name} 伤害 +1 (${v}/${k})`));const y=[];for(let b=0;b<n;b++)y.push(k);for(let b=0;b<c;b++)y.push(v);const x=y.reduce((b,P)=>b+P,0),M=y.filter(b=>b>=3).length;let h=`
      <div class="matching-view">
        <div class="matching-row">
          <span class="matching-label">攻击命中</span>
          <div class="matching-dice-list">
    `;for(let b=0;b<a.attackCrit;b++)h+='<div class="kt-dice-cube sm-dice crit-dice">6</div>';for(let b=0;b<a.attackNorm;b++)h+=`<div class="kt-dice-cube sm-dice">${a.weapon.ts}</div>`;a.attackCrit+a.attackNorm===0&&(h+='<span style="font-size:0.8rem; color:var(--text-muted);">无命中</span>'),h+=`
          </div>
        </div>
        <div class="matching-row">
          <span class="matching-label">防御保护</span>
          <div class="matching-dice-list">
    `;for(let b=0;b<a.defCrit;b++)h+='<div class="kt-dice-cube pm-dice crit-dice">6</div>';for(let b=0;b<a.defNorm;b++)h+=`<div class="kt-dice-cube pm-dice">${a.defender.sv}</div>`;a.defCrit+a.defNorm===0&&(h+='<span style="font-size:0.8rem; color:var(--text-muted);">无防御成功</span>'),h+=`
          </div>
        </div>
      </div>
    `;let S="";a.defender.faction==="Plague Marine"&&M>0&&(S=`
        <div id="manual-dr-container" style="background:var(--dark-card); padding:10px; border-radius:8px; margin-top:8px; border:1px solid var(--panel-border);">
          <label style="font-size:0.75rem; color:var(--text-muted);">录入瘟疫守卫【恶心作呕】的 ${M} 个投骰点数 (每次≥3伤害的攻击各投一次, 为空则按随机)：</label>
          <input type="text" id="manual-dr-dice-val" placeholder="例: 4,2,5" style="margin-top:4px; padding:6px; font-size:0.9rem; background:#000; border:1px solid #334155; color:#fff; width:100%;">
        </div>
      `),t.innerHTML=`
      ${de()}

      ${h}

      <div class="qa-card" style="margin-top:10px;">
        <p style="font-size:0.95rem; font-weight:600; color:#fff;">最终对消计算汇报：</p>
        <p style="margin-top:4px;">- 暴击命中残留: <b>${n}</b> 个 (每个伤害: ${k}${$&&a.defender.poisonTokens>0?' <span style="color:#a78bfa;">[Toxic+1]</span>':""})</p>
        <p>- 普通命中残留: <b>${c}</b> 个 (每个伤害: ${v}${$&&a.defender.poisonTokens>0?' <span style="color:#a78bfa;">[Toxic+1]</span>':""})</p>
        <p style="color:var(--sm-accent); font-weight:bold; margin-top:8px; font-size:1rem;">分配伤害总计: ${x} 点</p>
      </div>

      ${S}
    `,i.textContent="完成结算并扣血",i.disabled=!1,i.onclick=()=>St(y),x>0&&setTimeout(()=>{C.triggerAvatarHitEffect(a.defender.id,"shoot")},150)}}function gt(e){u("click"),a.defender=s.operatives.find(t=>t.id===e),D()}function vt(e){u("click"),a.weapon=a.attacker.weapons.filter(t=>t.isRanged)[e],D()}function ht(e,t){u("click"),a[e]=t,D()}function bt(e){u("click"),a.mode=e,D(),e==="manual"?(document.getElementById("manual-attack-input").style.display="block",document.getElementById("attack-rolling-zone").style.display="none",document.getElementById("modal-btn-next").disabled=!1):(document.getElementById("manual-attack-input").style.display="none",document.getElementById("attack-rolling-zone").style.display="flex",document.getElementById("modal-btn-next").disabled=a.attackRolls.length===0)}function yt(){const e=document.getElementById("modal-btn-next"),t=document.getElementById("attack-dice-pool"),i=document.getElementById("btn-roll-attack");i.disabled=!0,e.disabled=!0;const l=a.attacker.faction==="Space Marine"?"sm-dice":"pm-dice";t.innerHTML="";const n=a.weapon.attacks;R=!1,V=[];for(let d=0;d<n;d++){const p=document.createElement("div");p.className=`kt-dice-cube ${l} rolling`,p.textContent="?",t.appendChild(p)}const c=document.createElement("button");c.className="modal-btn",c.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",c.textContent="跳过动画 (Skip)",c.onclick=()=>{R=!0,V.forEach(p=>clearTimeout(p)),V=[];const d=t.getElementsByClassName("kt-dice-cube");for(let p=o;p<n;p++){const g=Math.floor(Math.random()*6)+1;r.push(g);const v=d[p];v&&(v.classList.remove("rolling"),v.textContent=g,g===6?v.classList.add("crit-dice"):g<a.weapon.ts&&v.classList.add("fail-dice"))}a.attackRolls=r,ne(),D()},t.parentElement.appendChild(c),C.triggerCombatVisual("🔥 OPEN FIRE!","shoot"),u("shoot");const r=[];let o=0;function m(){if(!R)if(o<n){const d=Math.floor(Math.random()*6)+1;r.push(d);const g=t.getElementsByClassName("kt-dice-cube")[o];g.classList.remove("rolling"),g.textContent=d,d===6?(g.classList.add("crit-dice"),u("crit")):(d<a.weapon.ts&&g.classList.add("fail-dice"),u("click")),o++,K(m,400)}else{a.attackRolls=r,ne(),c.remove();const d=a.attackCrit+a.attackNorm;d===0?(u("epic_fail"),C.triggerCombatVisual("❌ ALL MISSED!","normal")):(d===n||a.attackCrit>=2)&&(u("epic_win"),C.triggerCombatVisual("✨ EPIC SHOTS!","shoot")),D()}}K(m,1200)}function xt(){const e=document.getElementById("attack-dice-pool");if(!e)return;e.innerHTML="";const t=a.attacker.faction,i=t==="Space Marine"?s.smCp:s.pmCp,l=t==="Space Marine"?"sm-dice":"pm-dice";a.attackRolls.forEach((n,c)=>{const r=document.createElement("div");let o=`kt-dice-cube ${l}`;if(n===6?o+=" crit-dice":n<a.weapon.ts&&(o+=" fail-dice"),r.className=o,r.textContent=n,n<a.weapon.ts&&i>=1&&a.attRerollIndex===-1){const d=document.createElement("div");d.className="reroll-indicator",d.textContent="R",r.appendChild(d),r.onclick=()=>kt(c),r.style.cursor="pointer"}else if(c===a.attRerollIndex){const d=document.createElement("div");d.className="reroll-indicator",d.style.background="var(--green)",d.textContent="✓",r.appendChild(d)}e.appendChild(r)})}function kt(e){u("shoot"),a.attacker.faction==="Space Marine"?s.smCp-=1:s.pmCp-=1,C.updateScoresUI(),a.attRerollIndex=e;const l=document.getElementById("attack-dice-pool").getElementsByClassName("kt-dice-cube")[e],n=a.attacker.faction==="Space Marine"?"sm-dice":"pm-dice";l.className=`kt-dice-cube ${n} rolling`,l.innerHTML="?",setTimeout(()=>{const c=Math.floor(Math.random()*6)+1;C.addLog(`  - [重投] 攻击方消耗 1 CP重投 D6: [${a.attackRolls[e]}] -> [${c}]`),a.attackRolls[e]=c,ne(),D()},500)}function ne(){let e=0,t=0;const i=a.weapon.ts;a.attackRolls.forEach(l=>{l===6?e++:l>=i&&t++}),a.attackCrit=e,a.attackNorm=t}function wt(e){const t=document.getElementById("modal-btn-next"),i=document.getElementById("defense-dice-pool"),l=document.getElementById("btn-roll-defense");if(e===0){a.defCrit=0,a.defNorm=a.inCover?1:0,t.disabled=!1;return}l.disabled=!0,t.disabled=!0;const n=a.defender.faction==="Space Marine"?"sm-dice":"pm-dice";i.innerHTML="",R=!1,V=[];for(let d=0;d<e;d++){const p=document.createElement("div");p.className=`kt-dice-cube ${n} rolling`,p.textContent="?",i.appendChild(p)}const c=document.createElement("button");c.className="modal-btn",c.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",c.textContent="跳过动画 (Skip)",c.onclick=()=>{R=!0,V.forEach(p=>clearTimeout(p)),V=[];const d=i.getElementsByClassName("kt-dice-cube");for(let p=o;p<e;p++){const g=Math.floor(Math.random()*6)+1;r.push(g);const v=d[p];v&&(v.classList.remove("rolling"),v.textContent=g,g===6?v.classList.add("crit-dice"):g<a.defender.sv&&v.classList.add("fail-dice"))}a.defenseRolls=r,ae(),D()},i.parentElement.appendChild(c),C.triggerCombatVisual("🛡️ INCOMING FIRE!","parry"),u("shoot");const r=[];let o=0;function m(){if(!R)if(o<e){const d=Math.floor(Math.random()*6)+1;r.push(d);const g=i.getElementsByClassName("kt-dice-cube")[o];g.classList.remove("rolling"),g.textContent=d,d===6?(g.classList.add("crit-dice"),u("crit")):(d<a.defender.sv&&g.classList.add("fail-dice"),u("click")),o++,K(m,400)}else{a.defenseRolls=r,ae(),c.remove();const d=a.defender.sv,p=r.filter(v=>v>=d).length,g=r.filter(v=>v===6).length;p===0?(u("epic_fail"),C.triggerCombatVisual("💀 DEFENSE BUSTED!","normal")):(p===e||g>=2)&&(u("epic_win"),C.triggerCombatVisual("🛡️ SHIELD CLUTCH!","deflect")),D()}}K(m,1200)}function Ct(e){const t=document.getElementById("defense-dice-pool");if(!t)return;t.innerHTML="";const i=a.defender.faction,l=i==="Space Marine"?s.smCp:s.pmCp,n=i==="Space Marine"?"sm-dice":"pm-dice";a.defenseRolls.forEach((c,r)=>{const o=document.createElement("div");let m=`kt-dice-cube ${n}`;if(c===6?m+=" crit-dice":c<a.defender.sv&&(m+=" fail-dice"),o.className=m,o.textContent=c,c<a.defender.sv&&l>=1&&a.defRerollIndex===-1){const p=document.createElement("div");p.className="reroll-indicator",p.textContent="R",o.appendChild(p),o.onclick=()=>$t(r),o.style.cursor="pointer"}else if(r===a.defRerollIndex){const p=document.createElement("div");p.className="reroll-indicator",p.style.background="var(--green)",p.textContent="✓",o.appendChild(p)}t.appendChild(o)})}function $t(e,t){u("save"),a.defender.faction==="Space Marine"?s.smCp-=1:s.pmCp-=1,C.updateScoresUI(),a.defRerollIndex=e;const n=document.getElementById("defense-dice-pool").getElementsByClassName("kt-dice-cube")[e],c=a.defender.faction==="Space Marine"?"sm-dice":"pm-dice";n.className=`kt-dice-cube ${c} rolling`,n.innerHTML="?",setTimeout(()=>{const r=Math.floor(Math.random()*6)+1;C.addLog(`  - [重投] 防御方消耗 1 CP重投 D6: [${a.defenseRolls[e]}] -> [${r}]`),a.defenseRolls[e]=r,ae(),D()},500)}function ae(){let e=0,t=a.inCover?1:0;const i=a.defender.sv;a.defenseRolls.forEach(l=>{l===6?e++:l>=i&&t++}),a.defCrit=e,a.defNorm=t}function Tt(){const e=document.getElementById("manual-att-dice-val");if(!e)return;const i=e.value.split(",").map(l=>parseInt(l.trim(),10)).filter(l=>!isNaN(l)&&l>=1&&l<=6);a.attackRolls=i,ne()}function Mt(){const e=document.getElementById("manual-def-dice-val");if(!e)return;const i=e.value.split(",").map(l=>parseInt(l.trim(),10)).filter(l=>!isNaN(l)&&l>=1&&l<=6);a.defenseRolls=i,ae()}function St(e){u("click");const t=a.attacker,i=a.defender;let l=null;const n=document.getElementById("manual-dr-dice-val");n&&n.value.trim()!==""&&(l=n.value.split(",").map(o=>parseInt(o.trim(),10)).filter(o=>!isNaN(o)&&o>=1&&o<=6)),C.addLog(`
--- 射击对决结果 ---`),C.addLog(`[攻击方] ${t.name} 使用 ${a.weapon.name} 射击`),C.addLog(`[防守方] ${i.name}`);const c=i.applyWounds(e,l);a.weapon.hasRule&&a.weapon.hasRule("Poison")&&c>0&&i.poisonTokens<1&&(i.poisonTokens=1,C.addLog(`[Poison] ${i.name} 获得了 1 个毒素标记！下次激活开始时将受到 1 点伤害。`)),t.apl-=1,t.actionsPerformed.push("Shoot"),C.addLog(`[行动点] ${t.name} 消耗 1 APL，当前 APL: ${t.apl}`),ce(),c>0&&setTimeout(()=>{C.triggerAvatarHitEffect(i.id,"shoot")},100)}function Be(){u("click");const e=s.activeAgent;if(!e)return;const t=document.querySelector("#combat-modal .modal-content");t&&(t.style.backgroundImage='linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("assets/images/backgrounds/bg_melee_action.png")',t.style.backgroundSize="cover",t.style.backgroundPosition="center"),Object.assign(a,{actionType:"fight",step:1,attacker:e,defender:null,weapon:e.weapons.filter(i=>!i.isRanged)[0]||null,inMeleeRange:!0,hasFallenBack:!1,mode:"random",activeAttackerDice:[],activeDefenderDice:[],meleeTurn:"attacker",meleeLogs:""}),a.weapon&&(Le(),F())}function Et(e){u("click"),a.defender=s.operatives.find(t=>t.id===e),F()}function Pt(e){u("click"),a.weapon=a.attacker.weapons.filter(t=>!t.isRanged)[e],F()}function F(){const e=document.getElementById("modal-title"),t=document.getElementById("modal-body"),i=document.getElementById("modal-btn-next"),l=document.getElementById("modal-btn-cancel");if(i.onclick=he,l.style.display="inline-block",a.step===1){e.textContent="近战结算 - 步骤 1: 选择目标";const n=a.attacker.faction==="Space Marine"?"Plague Marine":"Space Marine",c=s.operatives.filter(m=>m.faction===n&&!m.isDead),r=c.filter(m=>!m.hasConceal);if(c.length>0&&r.length===0){t.innerHTML='<p style="color:var(--red);">所有敌方特工均处于隐蔽状态，无法被指定为近战目标。</p>',i.disabled=!0;return}if(r.length===0){t.innerHTML='<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>',i.disabled=!0;return}let o='<div class="weapon-picker-list">';r.forEach(m=>{const d=m.isInjured?' <span style="color:var(--red); font-size:0.7rem;">[重伤]</span>':"",p=m.poisonTokens>0?' <span style="color:#a3e635; font-size:0.7rem;">[毒素]</span>':"";o+=`
        <div class="weapon-pick-item ${a.defender&&a.defender.id===m.id?"selected":""}" role="button" tabindex="0" onclick="selectFightDefender('${m.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightDefender('${m.id}')}">
          <span class="weapon-pick-name">${m.name}${d}${p}</span>
          <span class="weapon-pick-stats">HP: ${m.wounds}/${m.maxWounds} | DF:${m.df}</span>
        </div>
      `}),o+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要交战的敌方特工 (必须在交战距离内)：</p>
      ${o}
    `,i.textContent="判定近战条件",i.disabled=!a.defender}else if(a.step===2){e.textContent="近战结算 - 步骤 2: 选择近战武器";const n=a.attacker.weapons.filter(o=>!o.isRanged),c=a.attacker.isInjured;let r='<div class="weapon-picker-list">';n.forEach((o,m)=>{const d=c?`${o.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${o.ts+1}+</span>`:`${o.ts}+`,p=o.rules&&o.rules.length>0?` | ${o.rules.join(", ")}`:"";r+=`
        <div class="weapon-pick-item ${a.weapon.name===o.name?"selected":""}" role="button" tabindex="0" onclick="selectFightWeapon(${m})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightWeapon(${m})}">
          <span class="weapon-pick-name">${o.name}</span>
          <span class="weapon-pick-stats">A: ${o.attacks} | WS: ${d} | D: ${o.normalDamage}/${o.criticalDamage}${p}</span>
        </div>
      `}),r+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要使用的近战武器：</p>
      ${r}
    `,i.textContent="判定交战距离与退却",i.disabled=!1}else if(a.step===3)e.textContent="近战结算 - 步骤 3: 距离与退却判定",t.innerHTML=`
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
    `,i.textContent="双方近战掷骰",i.disabled=!1;else if(a.step===4)e.textContent="近战结算 - 步骤 4: 双方近战掷骰",t.innerHTML=`
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
    `,a.activeAttackerDice.length>0||a.activeDefenderDice.length>0?(i.disabled=!1,Lt()):i.disabled=!0,i.textContent="进入伤害/格挡分配";else if(a.step===5){e.textContent="近战结算 - 步骤 5: 伤害与格挡交替分配";const n=a.attacker.wounds>0,c=a.defender.wounds>0,r=a.activeAttackerDice.some(x=>!x.used),o=a.activeDefenderDice.some(x=>!x.used);if(!n||!c||!r&&!o){let x="";!n&&!c?x="双方同归于尽！":n?c?x="双方所有成功骰已分配完毕。":x=`防守方 [${a.defender.name}] 已阵亡！`:x=`攻击方 [${a.attacker.name}] 已阵亡！`,t.innerHTML=`
        <!-- 双方状态卡 -->
        ${we()}

        <div class="qa-card" style="text-align: center; margin-top: 16px;">
          <h4 style="color: var(--sm-accent); margin-bottom: 8px;">战斗结束</h4>
          <p>${x}</p>
        </div>

        <div class="melee-interactive-log" id="melee-int-log" style="margin-top:12px; height: 100px;">
          ${a.meleeLogs}
        </div>
      `,i.textContent="完成近战结算",i.disabled=!1,i.onclick=Rt,l.style.display="none";return}const m=a.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",d=a.defender.faction==="Space Marine"?"sm-dice":"pm-dice";let p="";a.activeAttackerDice.forEach((x,M)=>{let h=`melee-dice-btn ${m}`;x.isCrit&&(h+=" crit"),x.used&&(h+=" used");const b=a.selectedMeleeDice&&a.selectedMeleeDice.side==="attacker"&&a.selectedMeleeDice.idx===M?"outline: 3px solid #60a5fa; transform: scale(1.15); box-shadow: 0 0 15px rgba(96,165,250,0.8); z-index: 2;":"";p+=`<button class="${h}" style="${b}" onclick="chooseMeleeDice('attacker', ${M})">${x.val}</button>`}),a.activeAttackerDice.length===0&&(p='<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>');let g="";a.activeDefenderDice.forEach((x,M)=>{let h=`melee-dice-btn ${d}`;x.isCrit&&(h+=" crit"),x.used&&(h+=" used");const b=a.selectedMeleeDice&&a.selectedMeleeDice.side==="defender"&&a.selectedMeleeDice.idx===M?"outline: 3px solid var(--pm-accent); transform: scale(1.15); box-shadow: 0 0 15px rgba(34,197,94,0.8); z-index: 2;":"";g+=`<button class="${h}" style="${b}" onclick="chooseMeleeDice('defender', ${M})">${x.val}</button>`}),a.activeDefenderDice.length===0&&(g='<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>');const v=a.meleeTurn==="attacker"?"攻击方":"防守方",k=a.meleeTurn==="attacker"?"#60a5fa":"var(--pm-accent)";let $="";if(a.selectedMeleeDice){const{side:x,idx:M}=a.selectedMeleeDice,S=(x==="attacker"?a.activeAttackerDice:a.activeDefenderDice)[M];let b;x==="attacker"?b=a.weapon:b=a.defender.weapons.filter(O=>!O.isRanged)[0]||new w("重拳 (Fists)",4,3,3,4,!1,null,[]);const P=S.isCrit?b.criticalDamage:b.normalDamage,E=(x==="attacker"?a.activeDefenderDice:a.activeAttackerDice).some(O=>!O.used);$=`
        <div class="melee-choice-card" style="background: rgba(30, 41, 59, 0.95); border: 2px solid ${k}; border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: center; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
          <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: #fff;">
            🎯 已选中点数 <span style="display:inline-block; padding: 2px 8px; border-radius: 4px; background: ${x==="attacker"?"rgba(59,130,246,0.3)":"rgba(34,197,94,0.3)"}; color: ${x==="attacker"?"#60a5fa":"var(--pm-accent)"}; font-weight: 900; font-family:'Orbitron',sans-serif;">${S.val}${S.isCrit?" (⚡暴击)":""}</span>，请选择分配动作：
          </div>

          <div style="display: flex; gap: 16px; justify-content: center;">
            <button onclick="resolveMeleeChoice('strike')" class="melee-action-btn strike-btn" style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, var(--red), #991b1b); border: 2px solid #ef4444; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3); transition: all 0.2s ease;">
              ⚔️ 打击 (STRIKE)<br>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.9;">造成 ${P} 点伤害</span>
            </button>

            <button onclick="resolveMeleeChoice('parry')" class="melee-action-btn parry-btn" ${E?"":'disabled style="opacity: 0.4; cursor: not-allowed;"'} style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, #0284c7, #075985); border: 2px solid #0ea5e9; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); transition: all 0.2s ease;">
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
      ${we()}

      <p style="margin-bottom: 10px; font-weight: bold; text-align: center; color: ${k}; font-size: 1.05rem;">
        👉 当前轮到：【${v}】分配骰子
      </p>

      ${$}

      <div class="melee-grid" style="margin-bottom: 16px;">
        <div class="melee-pool-card">
          <div class="melee-pool-title" style="display:flex; justify-content:space-between;">
            <span>攻击方成功骰</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">HP: ${a.attacker.wounds}</span>
          </div>
          <div class="melee-dice-pool">
            ${p}
          </div>
        </div>

        <div class="melee-pool-card">
          <div class="melee-pool-title" style="display:flex; justify-content:space-between;">
            <span>防守方成功骰</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">HP: ${a.defender.wounds}</span>
          </div>
          <div class="melee-dice-pool">
            ${g}
          </div>
        </div>
      </div>

      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 6px;">
        💡 <b>分配指南:</b> 点击你的高亮骰子，若对方有剩余成功骰，可选择格挡(Parry)消去对方一个未使用的成功骰，或选择打击(Strike)对敌方特工造成伤害。
      </div>

      <div class="melee-interactive-log" id="melee-int-log">
        <!-- 滚动记录 -->
      </div>
    `;const y=document.getElementById("melee-int-log");y&&(y.innerHTML=a.meleeLogs,y.scrollTop=y.scrollHeight),i.textContent="交替进行中...",i.disabled=!0}}function At(){const e=document.getElementById("modal-btn-next"),t=document.getElementById("melee-att-pool"),i=document.getElementById("melee-def-pool"),l=document.getElementById("btn-roll-melee");l.disabled=!0,e.disabled=!0;const n=a.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",c=a.defender.faction==="Space Marine"?"sm-dice":"pm-dice";t.innerHTML="",R=!1,V=[];const r=a.weapon.attacks;for(let h=0;h<r;h++){const S=document.createElement("div");S.className=`kt-dice-cube ${n} rolling`,S.textContent="?",t.appendChild(S)}const o=a.defender.weapons.filter(h=>!h.isRanged)[0]||new w("重拳 (Fists)",3,3,3,4,!1),m=o.attacks;i.innerHTML="";for(let h=0;h<m;h++){const S=document.createElement("div");S.className=`kt-dice-cube ${c} rolling`,S.textContent="?",i.appendChild(S)}const d=document.createElement("button");d.className="modal-btn",d.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",d.textContent="跳过动画 (Skip)",d.onclick=()=>{R=!0,V.forEach(b=>clearTimeout(b)),V=[];const h=t.getElementsByClassName("kt-dice-cube");for(let b=k;b<r;b++){const P=Math.floor(Math.random()*6)+1;g.push(P);const A=h[b];A&&(A.classList.remove("rolling"),A.textContent=P,P===6?A.classList.add("crit-dice"):P<a.weapon.ts&&A.classList.add("fail-dice"))}const S=i.getElementsByClassName("kt-dice-cube");for(let b=$;b<m;b++){const P=Math.floor(Math.random()*6)+1;v.push(P);const A=S[b];A&&(A.classList.remove("rolling"),A.textContent=P,P===6?A.classList.add("crit-dice"):P<o.ts&&A.classList.add("fail-dice"))}M()};const p=document.getElementById("modal-body");p&&p.appendChild(d),C.triggerCombatVisual("⚔️ MELEE CLASH!","shoot"),u("shoot");const g=[],v=[];let k=0,$=0;function y(){if(!R)if(k<r){const h=Math.floor(Math.random()*6)+1;g.push(h);const b=t.getElementsByClassName("kt-dice-cube")[k];b.classList.remove("rolling"),b.textContent=h,h===6?(b.classList.add("crit-dice"),u("crit")):(h<a.weapon.ts&&b.classList.add("fail-dice"),u("click")),k++,K(y,400)}else x()}function x(){if(!R)if($<m){const h=Math.floor(Math.random()*6)+1;v.push(h);const b=i.getElementsByClassName("kt-dice-cube")[$];b.classList.remove("rolling"),b.textContent=h,h===6?(b.classList.add("crit-dice"),u("crit")):(h<o.ts&&b.classList.add("fail-dice"),u("click")),$++,K(x,400)}else M()}function M(){d.remove(),a.activeAttackerDice=g.filter(h=>h>=a.weapon.ts).map(h=>({val:h,isCrit:h===6,used:!1})),a.activeDefenderDice=v.filter(h=>h>=o.ts).map(h=>({val:h,isCrit:h===6,used:!1})),e.disabled=!1}K(y,1200)}function Lt(){const e=document.getElementById("melee-att-pool"),t=document.getElementById("melee-def-pool");if(!e||!t)return;const i=a.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",l=a.defender.faction==="Space Marine"?"sm-dice":"pm-dice";if(e.innerHTML="",a.activeAttackerDice.forEach(n=>{let c=`kt-dice-cube ${i}`;n.isCrit&&(c+=" crit-dice");const r=document.createElement("div");r.className=c,r.textContent=n.val,e.appendChild(r)}),a.activeAttackerDice.length===0){const n=document.createElement("span");n.style.cssText="color:var(--text-muted);font-size:0.85rem;",n.textContent="全部未命中",e.appendChild(n)}if(t.innerHTML="",a.activeDefenderDice.forEach(n=>{let c=`kt-dice-cube ${l}`;n.isCrit&&(c+=" crit-dice");const r=document.createElement("div");r.className=c,r.textContent=n.val,t.appendChild(r)}),a.activeDefenderDice.length===0){const n=document.createElement("span");n.style.cssText="color:var(--text-muted);font-size:0.85rem;",n.textContent="全部未命中",t.appendChild(n)}}function ie(e,t){const i=s.customAvatars[e];let l=t==="Space Marine"?"./assets/images/defaults/default_sm_avatar.png":"./assets/images/defaults/default_pm_avatar.png";const n=s.operatives.find(o=>o.id===e);if(n&&n.defaultAvatar)l=n.defaultAvatar;else{const o=t==="Space Marine",m=e.replace(/^(sm_|pm_)/,"");l=`./assets/images/operatives/${o?"sm":"pm"}/${o?"sm":"pm"}_${m}.png`}const c=i||l,r=n?n.name:e;return`<div class="op-avatar-slot duel-avatar-${e}" style="width: 50px; height: 50px; cursor: default; position: relative;">
            <img src="${c}" class="op-avatar-img" alt="${r} 头像" loading="lazy" />
          </div>`}function we(){const e=a.attacker,t=a.defender,i=Math.max(0,e.wounds/e.maxWounds*100),l=Math.max(0,t.wounds/t.maxWounds*100);return`
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(15,23,42,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${ie(e.id,e.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:#60a5fa; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${e.name}">${e.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Orbitron',sans-serif; text-transform:uppercase;">攻击方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${i}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Orbitron',sans-serif; color:var(--red);">${Math.max(0,e.wounds)} / ${e.maxWounds} HP</div>
      </div>

      <!-- VS icon -->
      <div style="font-size:1.2rem; font-weight:900; color:var(--text-muted); padding:0 8px; font-family:'Orbitron',sans-serif; font-style:italic;">VS</div>

      <!-- Defender Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${ie(t.id,t.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${t.name}">${t.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Orbitron',sans-serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${l}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Orbitron',sans-serif; color:var(--red);">${Math.max(0,t.wounds)} / ${t.maxWounds} HP</div>
      </div>
    </div>
  `}function de(){const e=a.attacker,t=a.defender,i=Math.max(0,e.wounds/e.maxWounds*100),l=Math.max(0,t.wounds/t.maxWounds*100);return`
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(15,23,42,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${ie(e.id,e.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:#60a5fa; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${e.name}">${e.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Orbitron',sans-serif; text-transform:uppercase;">射击方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${i}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Orbitron',sans-serif; color:var(--red);">${Math.max(0,e.wounds)} / ${e.maxWounds} HP</div>
      </div>

      <!-- VS icon -->
      <div style="font-size:1.2rem; font-weight:900; color:var(--text-muted); padding:0 8px; font-family:'Orbitron',sans-serif; font-style:italic;">VS</div>

      <!-- Defender Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${ie(t.id,t.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${t.name}">${t.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Orbitron',sans-serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${l}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Orbitron',sans-serif; color:var(--red);">${Math.max(0,t.wounds)} / ${t.maxWounds} HP</div>
      </div>
    </div>
  `}function Dt(e,t){if(e!==a.meleeTurn){u("alert");return}(e==="attacker"?a.activeAttackerDice:a.activeDefenderDice)[t].used||(a.selectedMeleeDice={side:e,idx:t},F())}function Bt(e){if(!a.selectedMeleeDice)return;const{side:t,idx:i}=a.selectedMeleeDice,n=(t==="attacker"?a.activeAttackerDice:a.activeDefenderDice)[i];if(n.used)return;const c=t==="attacker"?a.defender:a.attacker,r=t==="attacker"?a.activeDefenderDice:a.activeAttackerDice;let o;if(t==="attacker"?o=a.weapon:o=a.defender.weapons.filter(y=>!y.isRanged)[0]||new w("重拳 (Fists)",4,3,3,4,!1,null,[]),a.meleeLogs||(a.meleeLogs=""),e==="strike"){n.used=!0;let y=o.normalDamage,x=o.criticalDamage;o.hasRule&&o.hasRule("Toxic")&&c.poisonTokens>0&&(y+=1,x+=1);const h=n.isCrit?x:y,S=`> ${t==="attacker"?"攻击方":"防守方"} 执行打击 (Strike)，分配了 ${h} 伤害！<br>`;a.meleeLogs+=S,c.applyWounds(h),o.hasRule&&o.hasRule("Poison")&&h>0&&c.poisonTokens<1&&(c.poisonTokens=1,C.addLog(`[Poison] ${c.name} 获得了 1 个毒素标记！(来自近战)`)),u("heavy_strike"),C.triggerCombatVisual("⚔️ STRIKE! -"+h,"strike")}else{let y=-1;if(n.isCrit?(y=r.findIndex(M=>!M.used&&M.isCrit),y===-1&&(y=r.findIndex(M=>!M.used))):y=r.findIndex(M=>!M.used&&!M.isCrit),y===-1){u("alert");return}n.used=!0,r[y].used=!0;const x=`> ${t==="attacker"?"攻击方":"防守方"} 执行格挡 (Parry)，消去对方一个骰子 [${r[y].val}]！<br>`;a.meleeLogs+=x,u("metal_clash"),C.triggerCombatVisual("🛡️ PARRY!","parry")}const m=t==="attacker"?"defender":"attacker",d=m==="attacker"?a.attacker.wounds:a.defender.wounds,g=(m==="attacker"?a.activeAttackerDice:a.activeDefenderDice).some(y=>!y.used)&&d>0,v=t==="attacker"?a.attacker.wounds:a.defender.wounds,$=(t==="attacker"?a.activeAttackerDice:a.activeDefenderDice).some(y=>!y.used)&&v>0;g&&$||g?a.meleeTurn=m:$&&(a.meleeTurn=t),a.selectedMeleeDice=null,F(),e==="strike"&&C.triggerAvatarHitEffect(c.id,"melee")}function It(){u("click"),a.selectedMeleeDice=null,F()}function Rt(){u("click");const e=a.attacker,t=a.defender;C.addLog(`
--- 近战搏斗结果 ---`),C.addLog(`[双核交锋] ${e.name} vs ${t.name}`),C.addLog(`  - ${e.name} 生命值: ${e.wounds}/${e.maxWounds}`),C.addLog(`  - ${t.name} 生命值: ${t.wounds}/${t.maxWounds}`),e.apl-=1,e.actionsPerformed.push("Fight"),C.addLog(`[行动点] ${e.name} 消耗 1 APL，当前 APL: ${e.apl}`),ce()}Ie({addLog:T,updateScoresUI:j,renderOperatives:W,updateActivePanel:_,startInitiativePhase:Me,showTurnEndScoringOverlay:Ae,hidePhaseOverlay:ge});He({addLog:T,triggerOperativeDeathOverlay:it});_e({openShootWizard:De,openFightWizard:Be,renderShootStep:D,renderFightStep:F,closeModal:ce});ft({addLog:T,renderOperatives:W,updateActivePanel:_,updateScoresUI:j,triggerAvatarHitEffect:ut,triggerCombatVisual:pt});window.adjustScore=Fe;window.confirmReset=qe;window.toggleSelectSM=me;window.toggleSelectPM=Te;window.incrementWarrior=$e;window.decrementWarrior=Ge;window.validateRostersAndDeploy=Ue;window.triggerAvatarUpload=dt;window.handleAvatarFileSelect=mt;window.activateOperative=pe;window.toggleConceal=Qe;window.performMove=Ye;window.performCharge=Xe;window.openShootWizard=De;window.openFightWizard=Be;window.endActivation=Je;window.showRuleHelp=at;window.closeHelpModal=Ee;window.closeModal=ce;window.nextModalStep=he;window.selectShootDefender=gt;window.selectShootWeapon=vt;window.setQA=ht;window.setRollMode=bt;window.rollAttackDice=yt;window.rollDefenseDice=wt;window.selectFightDefender=Et;window.selectFightWeapon=Pt;window.rollMeleeDice=At;window.chooseMeleeDice=Dt;window.resolveMeleeChoice=Bt;window.cancelMeleeChoice=It;window.rollInitiativeOverlay=Ze;window.selectTurnOrder=et;window.buyPloy=tt;window.proceedToFirefight=nt;window.confirmOperativeDeath=Pe;window.declareScoreVictory=rt;window.toggleScoringChecklist=ot;window.adjustScoreTemp=lt;window.confirmTurnEndScoring=ct;document.addEventListener("DOMContentLoaded",()=>{fe()});
