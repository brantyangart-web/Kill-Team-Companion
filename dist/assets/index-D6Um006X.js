(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function i(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(a){if(a.ep)return;a.ep=!0;const l=i(a);fetch(a.href,l)}})();const h=new(window.AudioContext||window.webkitAudioContext);function f(e){try{h.state==="suspended"&&h.resume();const t=h.createOscillator(),i=h.createGain();if(t.connect(i),i.connect(h.destination),e==="click")t.frequency.setValueAtTime(600,h.currentTime),i.gain.setValueAtTime(.04,h.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.08),t.start(),t.stop(h.currentTime+.08);else if(e==="shoot"){const s=h.currentTime;[0,.08,.16].forEach(l=>{const c=h.sampleRate*.08,r=h.createBuffer(1,c,h.sampleRate),d=r.getChannelData(0);for(let k=0;k<c;k++)d[k]=Math.random()*2-1;const p=h.createBufferSource();p.buffer=r;const m=h.createBiquadFilter();m.type="lowpass",m.frequency.value=1e3;const u=h.createGain();u.gain.setValueAtTime(.12,s+l),u.gain.exponentialRampToValueAtTime(1e-4,s+l+.08),p.connect(m),m.connect(u),u.connect(h.destination),p.start(s+l);const v=h.createOscillator(),g=h.createGain();v.frequency.setValueAtTime(160,s+l),v.frequency.linearRampToValueAtTime(80,s+l+.06),g.gain.setValueAtTime(.15,s+l),g.gain.exponentialRampToValueAtTime(1e-4,s+l+.06),v.connect(g),g.connect(h.destination),v.start(s+l),v.stop(s+l+.06)})}else if(e==="crit")t.type="sawtooth",t.frequency.setValueAtTime(880,h.currentTime),t.frequency.setValueAtTime(1200,h.currentTime+.08),i.gain.setValueAtTime(.06,h.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.25),t.start(),t.stop(h.currentTime+.25);else if(e==="save")t.type="sine",t.frequency.setValueAtTime(988,h.currentTime),i.gain.setValueAtTime(.05,h.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.12),t.start(),t.stop(h.currentTime+.12);else if(e==="flesh"){const s=h.sampleRate*.15,a=h.createBuffer(1,s,h.sampleRate),l=a.getChannelData(0);for(let p=0;p<s;p++)l[p]=Math.random()*2-1;const c=h.createBufferSource();c.buffer=a;const r=h.createBiquadFilter();r.type="bandpass",r.frequency.value=300;const d=h.createGain();d.gain.setValueAtTime(.08,h.currentTime),d.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.15),c.connect(r),r.connect(d),d.connect(h.destination),c.start()}else if(e==="bubble")t.type="sine",t.frequency.setValueAtTime(200,h.currentTime),t.frequency.exponentialRampToValueAtTime(1200,h.currentTime+.06),i.gain.setValueAtTime(.05,h.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.06),t.start(),t.stop(h.currentTime+.06);else if(e==="alert")t.type="triangle",t.frequency.setValueAtTime(330,h.currentTime),i.gain.setValueAtTime(.08,h.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.3),t.start(),t.stop(h.currentTime+.3);else if(e==="epic_win"){const s=[523.25,659.25,783.99,1046.5],a=h.currentTime;s.forEach((l,c)=>{const r=h.createOscillator(),d=h.createGain();r.type="triangle",r.frequency.setValueAtTime(l,a+c*.08),d.gain.setValueAtTime(0,a+c*.08),d.gain.linearRampToValueAtTime(.08,a+c*.08+.02),d.gain.exponentialRampToValueAtTime(1e-4,a+c*.08+.22),r.connect(d),d.connect(h.destination),r.start(a+c*.08),r.stop(a+c*.08+.22)})}else if(e==="epic_fail"){const s=[164.81,155.56,146.83,138.59],a=h.currentTime;s.forEach((l,c)=>{const r=h.createOscillator(),d=h.createGain();r.type="sawtooth";const p=a+c*.2,m=c===3?.65:.18;r.frequency.setValueAtTime(l,p),c===3&&r.frequency.linearRampToValueAtTime(95,p+m),d.gain.setValueAtTime(0,p),d.gain.linearRampToValueAtTime(.08,p+.02),d.gain.exponentialRampToValueAtTime(1e-4,p+m),r.connect(d),d.connect(h.destination),r.start(p),r.stop(p+m)})}else if(e==="funeral"){const s=[261.63,261.63,261.63,207.65],a=[.35,.35,.35,.7],l=[0,.45,.9,1.35],c=h.currentTime;s.forEach((r,d)=>{const p=h.createOscillator(),m=h.createGain();p.type="sine";const u=c+l[d],v=a[d];p.frequency.setValueAtTime(r,u),m.gain.setValueAtTime(0,u),m.gain.linearRampToValueAtTime(.06,u+.05),m.gain.exponentialRampToValueAtTime(1e-4,u+v),p.connect(m),m.connect(h.destination),p.start(u),p.stop(u+v)})}else if(e==="metal_clash"){const s=h.currentTime,a=h.createOscillator(),l=h.createGain();a.type="sine",a.frequency.setValueAtTime(1400,s),a.frequency.linearRampToValueAtTime(900,s+.25),l.gain.setValueAtTime(.06,s),l.gain.exponentialRampToValueAtTime(1e-4,s+.3),a.connect(l),l.connect(h.destination),a.start(),a.stop(s+.3);const c=h.createOscillator(),r=h.createGain();c.type="triangle",c.frequency.setValueAtTime(300,s),c.frequency.linearRampToValueAtTime(120,s+.15),r.gain.setValueAtTime(.1,s),r.gain.exponentialRampToValueAtTime(1e-4,s+.18),c.connect(r),r.connect(h.destination),c.start(),c.stop(s+.18)}else if(e==="heavy_strike"){const s=h.currentTime,a=h.createOscillator(),l=h.createGain();a.type="sawtooth",a.frequency.setValueAtTime(80,s),a.frequency.exponentialRampToValueAtTime(35,s+.2),l.gain.setValueAtTime(.2,s),l.gain.exponentialRampToValueAtTime(1e-4,s+.2),a.connect(l),l.connect(h.destination),a.start(),a.stop(s+.2);const c=h.createOscillator(),r=h.createGain();c.type="sine",c.frequency.setValueAtTime(550,s),r.gain.setValueAtTime(.05,s),r.gain.exponentialRampToValueAtTime(1e-4,s+.12),c.connect(r),r.connect(h.destination),c.start(),c.stop(s+.12);const d=h.sampleRate*.12,p=h.createBuffer(1,d,h.sampleRate),m=p.getChannelData(0);for(let k=0;k<d;k++)m[k]=Math.random()*2-1;const u=h.createBufferSource();u.buffer=p;const v=h.createBiquadFilter();v.type="bandpass",v.frequency.value=220;const g=h.createGain();g.gain.setValueAtTime(.12,s),g.gain.exponentialRampToValueAtTime(1e-4,s+.12),u.connect(v),v.connect(g),g.connect(h.destination),u.start()}}catch{}}const I={};function ot(e){Object.assign(I,e)}const o={turningPoint:1,phase:"Initiative",initiative:"Space Marine",activeTurn:"Space Marine",activeAgent:null,pendingActivation:null,smVp:0,smCp:2,pmVp:0,pmCp:2,smActivePloys:[],pmActivePloys:[],operatives:[],gameOver:!1,customAvatars:{},smKillsScored:0,pmKillsScored:0,counteractUsedThisTrigger:!1,missionType:"seize_ground"},st={actionType:"shoot",step:1,attacker:null,defender:null,weapon:null,inRangeAndVisible:!0,inCoverConcealed:!1,inCover:!1,mode:"random",attackRolls:[],attackCrit:0,attackNorm:0,defenseRolls:[],defCrit:0,defNorm:0,attRerollIndex:-1,defRerollIndex:-1,brutalUsed:!1,activeAttackerDice:[],activeDefenderDice:[],meleeTurn:"attacker"};let n={...st};const Ie=["医疗兵默默拿出了骨灰盒，叹气道：『这活我接不了，抬走，下一位！』","他为了信仰流尽了最后一滴血，虽然倒下的姿势实在不够优雅。","战锤世界可没有复活币，老铁一路走好！","这大概就是传说中的『战术性白给』吧……","棋子已变成战场地形/掩体的一部分（大雾）。","纳垢大父叹了口气，表示可以多一碗上好的堆肥了。","帝皇叹了口气，并从垃圾桶里捞了捞他的物理模型。"];function X(e){return o.operatives.some(t=>t.faction===e&&!t.isDead&&!t.hasActed)}function lt(){if(f("click"),o.turningPoint>=5){I.addLog(`
========================================`),I.addLog(">>> 已达第 5 回合上限！进入最终胜负结算！"),I.addLog("========================================"),I.showTurnEndScoringOverlay(!0);return}o.turningPoint+=1,o.phase="Initiative",o.smActivePloys=[],o.pmActivePloys=[],o.counteractUsedThisTrigger=!1,o.operatives.forEach(t=>{t.isDead||(t.hasActed=!1,t.apl=t.currentApl,t.actionsPerformed=[])});const e=document.getElementById("btn-next-phase");e&&(e.style.display="none"),I.addLog(`
========================================`),I.addLog(`>>> Turning Point ${o.turningPoint} 开始！`),I.addLog("========================================"),I.startInitiativePhase()}function rt(e){return o.operatives.some(t=>t.faction===e&&!t.isDead&&t.hasActed&&!t.hasConceal)}function ct(){const e=o.activeTurn==="Space Marine"?"Plague Marine":"Space Marine",t=X(e),i=X(o.activeTurn),s=a=>a==="Space Marine"?"死亡天使":"瘟疫守卫";if(t)o.activeTurn=e,I.addLog(`>>> 交替轮转：轮到【${s(e)}】选择特工激活。`);else if(i)if(o.activeTurn=e,rt(e)&&!o.counteractUsedThisTrigger)I.addLog(`>>> 【${s(e)}】无可用特工，但可发动反击 (Counteract)！`),I.showCounteractOverlay(e);else{const a=o.counteractUsedThisTrigger?"反击机会已使用":"无法反击";I.addLog(`>>> 【${s(e)}】已无可用特工且${a}。轮到【${s(o.activeTurn===e?o.activeTurn:e)}】继续。`),o.activeTurn=e==="Space Marine"?"Plague Marine":"Space Marine"}else I.addLog(">>> 双方全部特工激活完毕。准备开始回合得分结算。"),I.showTurnEndScoringOverlay();I.renderOperatives(),I.updateActivePanel()}function He(){const e=o.activeTurn,t=e==="Space Marine"?"Plague Marine":"Space Marine",i=s=>s==="Space Marine"?"死亡天使":"瘟疫守卫";I.addLog(`>>> 【${i(e)}】选择跳过反击。`),X(t)?(o.activeTurn=t,I.addLog(`>>> 轮到【${i(t)}】继续激活。`)):(I.addLog(">>> 双方均已无法激活。回合得分结算开始。"),I.showTurnEndScoringOverlay()),I.renderOperatives(),I.updateActivePanel()}function dt(e){const t=o.operatives.find(i=>i.id===e);t&&(t.hasActed=!1,t.apl=1,t.counteracting=!0,t.actionsPerformed=[],o.activeAgent=t,o.counteractUsedThisTrigger=!0,I.addLog(`>>> 【${t.name}】发动反击！获得 1 AP（移动不超过 2"）。`),I.hideCounteractOverlay(),I.renderOperatives(),I.updateActivePanel())}const z={};function pt(e){Object.assign(z,e)}const ze={PSYCHIC:"灵能",Saturate:"饱和",Severe:"重伤",Poison:"毒素",Toxic:"剧毒","Piercing Crits 1":"穿甲暴击 1",'Torrent 1"':'涌流 1"','Torrent 2"':'涌流 2"',Shock:"震击",Stun:"眩晕",Brutal:"残暴","Indirect Fire":"间接射击","Heavy (Dash only)":"重型(仅冲刺)","Seek Light":"追光",Silent:"静默"};function xe(e){return ze[e]||e}class M{constructor(t,i,s,a,l,c=!0,r=null,d=[]){this.name=t,this.attacks=i,this.ts=s,this.normalDamage=a,this.criticalDamage=l,this.isRanged=c,this.range=r,this.rules=d}hasRule(t){return this.rules.includes(t)}get displayRange(){return this.range===null?"-":this.range+'"'}get displayRules(){return this.rules.length>0?this.rules.map(t=>ze[t]||t).join(", "):"-"}}class De{constructor(t,i,s,a,l,c,r,d=[],p="",m=6){this.id=t,this.name=i,this.faction=s,this.maxWounds=a,this.wounds=a,this.maxApl=l,this.apl=l,this.df=c,this.sv=r,this.weapons=d,this.defaultAvatar=p,this.maxMove=m,this.move=m,this.hasActed=!1,this.isDead=!1,this.actionsPerformed=[],this.poisonTokens=0,this.hasConceal=!1,this.counteracting=!1,this.orderSwitchedThisActivation=!1}get isInjured(){return this.wounds>0&&this.wounds<this.maxWounds/2}get currentApl(){return this.maxApl-(this.isInjured?1:0)}get currentMove(){return Math.max(0,this.maxMove-(this.isInjured?2:0))}toggleConceal(){this.hasConceal=!this.hasConceal}reset(){this.wounds=this.maxWounds,this.apl=this.maxApl,this.move=this.maxMove,this.hasActed=!1,this.isDead=!1,this.actionsPerformed=[],this.poisonTokens=0,this.hasConceal=!1,this.counteracting=!1,this.orderSwitchedThisActivation=!1}applyWounds(t,i=null){if(this.isDead)return 0;const s=this.faction==="Plague Marine";let a=0,l=[];Array.isArray(t)?(l=t,a=t.reduce((d,p)=>d+p,0)):(a=t,l=[t]),z.addLog(`[伤害] ${this.name} 准备分配 ${a} 点伤害...`);let c=0;if(s){const d=o.pmActivePloys.includes("contagious_resilience");z.addLog(`[特性] 触发瘟疫守卫专属【恶心作呕 (DR 4+)】 ${d?"(已开启传染韧性，允许首个失败重投)":""}：`);let p=0,m=!1;for(const u of l){if(u<3){z.addLog(`  - 单次攻击伤害 ${u} (<3)，不触发 DR。`),c+=u;continue}let v;if(i&&p<i.length?(v=i[p++],z.addLog(`  - 伤害 ${u} (>=3): 手动录入 DR 骰子 [${v}]`)):(v=Math.floor(Math.random()*6)+1,z.addLog(`  - 伤害 ${u} (>=3): 投 DR 骰子 [${v}]`)),v<4&&d&&!m&&!i){m=!0;const g=v;v=Math.floor(Math.random()*6)+1,z.addLog(`    -> [传染韧性] 自动重投失败 [${g}] -> [${v}]`)}if(v>=4){const g=u-1;z.addLog(`    -> 成功！伤害减免 1 点 (${u} -> ${g})`),f("bubble"),c+=g}else z.addLog(`    -> 减免失败，受到全额 ${u} 点伤害。`),c+=u,f("flesh")}}else c=a,c>0&&f("flesh");const r=this.wounds;return this.wounds=Math.max(0,this.wounds-c),z.addLog(`[分配] ${this.name} 生命值: ${r} -> ${this.wounds} ${this.wounds===0?"(已阵亡!)":""}`),this.wounds===0&&(this.isDead=!0,this.hasActed=!0,z.triggerOperativeDeathOverlay(this)),c}}const H=[{id:"sm_1",name:"Space Marine Captain (SM 船长)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_captain.png",weapons:[new M("Master-crafted Bolt Rifle (精铸爆弹步枪)",4,3,4,5,!0,24,["Indirect Fire"]),new M("Relic Blade (遗物利刃)",5,3,5,6,!1,null,["Severe"])]},{id:"sm_2",name:"Assault Intercessor Sergeant (突击军士)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sergeant.png",weapons:[new M("Hand Flamer (手持火焰喷射器)",4,2,3,3,!0,6,["Saturate",'Torrent 1"']),new M("Chainsword (链锯剑)",5,3,4,5,!1,null,[])]},{id:"sm_3",name:"Intercessor Sergeant (战术军士)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sergeant.png",weapons:[new M("Bolt Rifle (爆弹步枪)",4,3,3,4,!0,null,["Piercing Crits 1"]),new M("Chainsword (链锯剑)",4,3,4,5,!1,null,[])]},{id:"sm_4",name:"Eliminator Sniper (Eliminator 狙击手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sniper.png",weapons:[new M("Bolt Sniper Rifle (爆弹狙击步枪)",4,2,3,4,!0,null,["Heavy (Dash only)","Saturate","Seek Light","Silent"]),new M("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_5",name:"Heavy Intercessor Gunner (重型火力手)",wounds:18,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/sm/sm_heavy_gunner.png",weapons:[new M("Heavy Bolter (重型爆弹枪)",5,3,4,5,!0,null,["Piercing Crits 1"]),new M("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_8",name:"Intercessor Gunner (战术火力手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_warrior_b.png",weapons:[new M("Auto Bolt Rifle (自动爆弹步枪)",4,3,3,4,!0,null,['Torrent 1"']),new M("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_6",name:"Assault Intercessor Warrior (突击战士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_assault.png",weapons:[new M("Heavy Bolt Pistol (重型爆弹手枪)",4,3,3,4,!0,8,["Piercing Crits 1"]),new M("Chainsword (链锯剑)",5,3,4,5,!1,null,[])]},{id:"sm_7",name:"Intercessor Warrior (战术战士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_warrior_a.png",weapons:[new M("Bolt Rifle (爆弹步枪)",4,3,3,4,!0,null,["Piercing Crits 1"]),new M("Fists (铁拳)",4,3,3,4,!1,null,[])]}],_=[{id:"pm_1",name:"Plague Marine Champion (瘟疫冠军)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_champion.png",weapons:[new M("Plague Sword (瘟疫之剑)",5,3,4,5,!1,null,["Severe","Poison","Toxic"])]},{id:"pm_2",name:"Malignant Plaguecaster (恶性瘟疫术士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_caster.png",weapons:[new M("Entropy (熵能术)",4,3,3,7,!0,7,["PSYCHIC","Saturate","Severe","Poison"]),new M("Plague Wind (瘟疫之风)",6,3,2,3,!0,null,["PSYCHIC","Saturate","Severe",'Torrent 1"',"Poison"]),new M("Corrupted Staff (腐蚀法杖)",4,3,3,4,!1,null,["PSYCHIC","Severe","Shock","Stun","Poison"])]},{id:"pm_3",name:"Plague Marine Bombardier (瘟疫掷弹兵)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_gunner.png",weapons:[new M("Boltgun (爆弹枪)",4,3,3,4,!0,null,["Toxic"]),new M("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"pm_4",name:"Plague Marine Fighter (瘟疫搏击手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_fighter.png",weapons:[new M("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new M("Flail of Corruption (腐化之链枷)",5,3,4,5,!1,null,["Brutal","Severe","Shock","Poison"])]},{id:"pm_5",name:"Plague Marine Heavy Gunner (瘟疫重炮手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_heavy.png",weapons:[new M("Plague Spewer (瘟疫喷射器)",5,2,3,3,!0,7,["Saturate","Severe",'Torrent 2"',"Poison"]),new M("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"pm_6",name:"Plague Marine Icon Bearer (瘟疫圣像手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_icon.png",weapons:[new M("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new M("Plague Knife (瘟疫匕首)",5,3,3,4,!1,null,["Severe","Poison"])]},{id:"pm_7",name:"Plague Marine Warrior (瘟疫战士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_warrior.png",weapons:[new M("Boltgun (爆弹枪)",4,3,3,4,!0,null,["Toxic"]),new M("Plague Knife (瘟疫匕首)",4,3,3,4,!1,null,["Severe","Poison"])]}],mt={move:{title:"🏃 移动 (Normal Move) 规则帮助",body:`
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
        `},advance:{title:"🏃💨 前进 (Advance) 规则帮助",body:`
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>移动距离:</b> 角色移动值 <b>+3"</b> (即 9 英寸)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 需要快速移动到掩体或有利位置时使用。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>前进后<b>不能再射击或近战</b>。</li>
            <li>如果本回合该特工已经执行过任意移动/冲锋/前进/冲刺/撤退，则<b>不能</b>执行前进。</li>
          </ul>
        `},dash:{title:"💨💨 冲刺 (Dash) 规则帮助",body:`
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>移动距离:</b> 角色移动值 <b>×2</b> (即 12 英寸)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 需要最快速度穿越战场时使用。同时也是唯一能让 <b>Heavy (Dash only)</b> 武器开火的方式。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>冲刺后<b>不能再射击或近战</b>（Heavy (Dash only) 武器例外：Dash 后可以射击）。</li>
            <li>如果本回合该特工已经执行过任意移动/冲锋/前进/冲刺/撤退，则<b>不能</b>执行冲刺。</li>
          </ul>
        `},fallback:{title:"🔙 撤退 (Fall Back) 规则帮助",body:`
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>移动距离:</b> 角色正常移动值 (6 英寸)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 脱离当前交战（敌方 1 英寸范围内），避免被近战缠住。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>撤退移动必须<b>远离所有敌人</b>，结束时不能在任何敌方特工的交战距离内。</li>
            <li>撤退后<b>不能再射击或近战</b>。</li>
            <li>如果本回合该特工已经执行过任意移动/冲锋/前进/冲刺/撤退，则<b>不能</b>执行撤退。</li>
          </ul>
        `},mission:{title:"🎯 任务类型 (Mission Type) 规则帮助",body:`
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
        `}},ut=window.matchMedia("(prefers-reduced-motion: reduce)"),Ne={seize_ground:"夺取阵地 (Seize Ground)",recovery:"物资回收 (Recovery)",breakthrough:"突破防线 (Breakthrough)",custom:"自定义 (Custom)"},ft={seize_ground:'<b style="color:var(--imperial-gold);">夺取阵地：</b>棋盘上通常摆放 3 个目标点。每回合结束时，根据控制的目标数量与局势获得 VP。',recovery:'<b style="color:var(--imperial-gold);">物资回收：</b>棋盘上散布遗物/情报标记。通过移动或激活动作拾取，并护送携带者回到己方部署区以完成回收。',breakthrough:'<b style="color:var(--imperial-gold);">突破防线：</b>派遣特工穿越战场，进入敌方部署区以获取 VP。先抵达敌方阵地者得分。',custom:'<b style="color:var(--imperial-gold);">自定义任务：</b>根据实体任务卡或自定规则，自由勾选各项得分条件。'},Be={seize_ground:["控制中央目标点 (+1 VP)","控制左翼目标点 (+1 VP)","控制右翼目标点 (+1 VP)","控制目标数量多于对手 (+1 VP)","消灭对方半数以上特工 (+1 VP)"],recovery:["拾取 1 枚遗物/情报 (+1 VP)","拾取 2 枚及以上遗物/情报 (+1 VP)","将遗物送回己方部署区 (+1 VP)","阻止对手完成回收 (+1 VP)","消灭敌方携带遗物的特工 (+1 VP)"],breakthrough:["1 名特工进入敌方部署区 (+1 VP)","2+ 名特工进入敌方部署区 (+1 VP)","控制敌方部署区内的目标 (+1 VP)","阻滞敌方推进（敌方无人进入你部署区）(+1 VP)","歼灭敌方后卫力量 (+1 VP)"],custom:["控制 1+ 目标点 (+1 VP)","控制目标多于对手 (+1 VP)","完成特定任务动作 (+1 VP)","本回合秘密任务 1 (+1 VP)","本回合秘密任务 2 (+1 VP)"]};function gt(){const e=document.getElementById("mission-type"),t=document.getElementById("mission-desc");e&&t&&(t.innerHTML=ft[e.value]||"")}let vt=0;function W(e,t="info",i=4e3){const s=document.getElementById("toast-container");if(!s){console.warn(`[Toast ${t}]:`,e);return}const a=document.createElement("div");a.className=`toast toast-${t}`,a.setAttribute("role",t==="error"?"alert":"status"),a.textContent=e,a.id=`toast-${++vt}`,s.appendChild(a);const l=setTimeout(()=>{a.classList.add("toast-exit"),setTimeout(()=>a.remove(),300)},i);a.addEventListener("click",()=>{clearTimeout(l),a.classList.add("toast-exit"),setTimeout(()=>a.remove(),300)})}function ht(e,t){const i=document.createElement("div");i.className="modal-overlay",i.style.display="flex",i.setAttribute("role","alertdialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-label","确认操作"),i.innerHTML=`
    <div class="modal-content" style="max-width: 420px;">
      <div class="modal-header">
        <div class="modal-title">⚠️ 确认操作</div>
      </div>
      <div class="modal-body">
        <p style="font-size: 0.95rem; line-height: 1.6;">${e}</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn" id="confirm-dialog-cancel">取消</button>
        <button class="modal-btn primary" id="confirm-dialog-ok" style="background: linear-gradient(135deg, var(--red), #5a2020); border-color: #b84c4c;">确认</button>
      </div>
    </div>
  `,document.body.appendChild(i),re(i);const s=()=>{ce(),i.remove()};i.querySelector("#confirm-dialog-cancel").addEventListener("click",()=>{s()}),i.querySelector("#confirm-dialog-ok").addEventListener("click",()=>{s(),t&&t()});const a=l=>{l.key==="Escape"&&(s(),document.removeEventListener("keydown",a))};document.addEventListener("keydown",a)}let Y=null,se=null;function Re(e){return e.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])')}function re(e){se=document.activeElement,Y=e;const t=Re(e);t.length>0&&t[0].focus(),e._focusTrapHandler=i=>{if(i.key==="Tab"){const s=Re(e);if(s.length===0)return;const a=s[0],l=s[s.length-1];i.shiftKey?document.activeElement===a&&(i.preventDefault(),l.focus()):document.activeElement===l&&(i.preventDefault(),a.focus())}},e.addEventListener("keydown",e._focusTrapHandler)}function ce(){Y&&Y._focusTrapHandler&&(Y.removeEventListener("keydown",Y._focusTrapHandler),delete Y._focusTrapHandler),Y=null,se&&se.focus&&se.focus(),se=null}document.addEventListener("keydown",e=>{if(e.key==="Escape"){const t=document.getElementById("help-modal");if(t&&t.style.display==="flex"){Ge();return}const i=document.getElementById("combat-modal");if(i&&i.style.display==="flex"){je.closeModal();return}const s=document.getElementById("death-overlay");if(s&&s.style.display==="flex"){Qe();return}}});const Z={},ee={},je={};function bt(e){Object.assign(je,e)}function S(e){const t=document.getElementById("battle-log-lines");if(!t)return;const i=document.createElement("div");i.textContent=e,t.appendChild(i),t.scrollTop=t.scrollHeight}function K(){document.getElementById("sm-vp").textContent=o.smVp,document.getElementById("sm-cp").textContent=o.smCp,document.getElementById("pm-vp").textContent=o.pmVp,document.getElementById("pm-cp").textContent=o.pmCp,document.getElementById("dash-tp").textContent=o.turningPoint;let e=o.phase;e==="Initiative"?e="先攻阶段":e==="Strategy"?e="策略阶段":e==="Firefight"&&(e="战斗阶段"),document.getElementById("dash-phase").textContent=e;const t=document.getElementById("sm-ploy-tags");t.innerHTML="",o.smActivePloys.forEach(a=>{const l=document.createElement("span");l.className="ploy-tag sm",l.textContent=a==="bolter_discipline"?"爆弹惩戒":a,t.appendChild(l)});const i=document.getElementById("pm-ploy-tags");i.innerHTML="",o.pmActivePloys.forEach(a=>{const l=document.createElement("span");l.className="ploy-tag pm",l.textContent=a==="contagious_resilience"?"传染韧性":a,i.appendChild(l)});const s=document.getElementById("btn-next-phase");s&&(o.phase==="Firefight"&&!X("Space Marine")&&!X("Plague Marine")?(s.style.display="inline-block",s.textContent="回合得分结算",s.onclick=Ye):s.style.display="none")}function yt(e,t,i){f("click"),t!=="cp"&&(e==="sm"?o.smVp=Math.max(0,o.smVp+i):o.pmVp=Math.max(0,o.pmVp+i),K())}function xt(){ht("确定要重置当前对局吗？所有进度和选择将被清空。",()=>{f("click"),o.turningPoint=1,o.phase="Initiative",o.smVp=0,o.smCp=2,o.pmVp=0,o.pmCp=2,o.smActivePloys=[],o.pmActivePloys=[],o.operatives=[],o.activeAgent=null,o.gameOver=!1,o.smKillsScored=0,o.pmKillsScored=0,document.getElementById("start-screen").style.display="flex",document.getElementById("global-dash").style.display="none",document.getElementById("battle-area").style.display="none",document.getElementById("guidance-banner").style.display="none",document.getElementById("battle-log-lines").innerHTML="",ke()})}function N(e){document.getElementById("guidance-text").textContent=e}function pe(e,t){var r;const i=o.customAvatars[e];let s=t==="Space Marine"?"assets/images/defaults/default_sm_avatar.png":"assets/images/defaults/default_pm_avatar.png";const a=o.operatives.find(d=>d.id===e),l=a?a.name:((r=H.concat(_).find(d=>d.id===e))==null?void 0:r.name)||e;if(a&&a.defaultAvatar)s=a.defaultAvatar;else{const d=H.concat(_).find(p=>p.id===e);d&&d.defaultAvatar&&(s=d.defaultAvatar)}return`<div class="op-avatar-slot main-avatar-${e}">
            <img src="${i||s}" class="op-avatar-img" alt="${l} 头像" loading="lazy" />
          </div>`}function kt(e){return e.weapons.map(t=>{const i=t.name.split(" ")[0],s=t.rules&&t.rules.length>0?` [${t.rules.map(xe).join(",")}]`:"";return i+s}).join(" / ")}function de(e,t,i,s,a,l,c){const r=i?`<span class="role-badge leader" ${c?`style="${c}"`:""}>LEADER</span>`:'<span class="role-badge">OPERATOR</span>',d=s?"checked":"",p=a?"disabled":"",m=pe(e.id,t),u=e.isWarrior?' <span style="color:#c9a84c; font-size:0.65rem;">[Warrior]</span>':"";let v;return e.isWarrior?v=`
      <div class="warrior-counter" data-warrior-id="${e.id}">
        <button class="warrior-counter-btn minus" onclick="event.stopPropagation(); decrementWarrior('${e.id}')" aria-label="减少数量">−</button>
        <span class="warrior-counter-value" id="warrior-count-${e.id}">0</span>
        <button class="warrior-counter-btn plus" onclick="event.stopPropagation(); incrementWarrior('${e.id}')" aria-label="增加数量">+</button>
      </div>
    `:v=`<input type="checkbox" class="roster-checkbox" id="check-${e.id}" ${d} ${p} onchange="${l}('${e.id}')">`,`
    ${v}
    ${m}
    <div class="roster-op-info">
      <div class="roster-op-name">${e.name} ${r}${u}</div>
      <div class="roster-op-weapons">Move: ${e.move||6}" | HP: ${e.wounds} | APL: ${e.apl}</div>
      <div style="font-size:0.65rem; color:#9a9da5; margin-top:2px;">武器: ${kt(e)}</div>
    </div>
  `}function ve(e,t,i,s=!1){e.onclick=a=>{if(a.target.className!=="roster-checkbox"&&!a.target.closest(".op-avatar-slot")&&!a.target.closest(".warrior-counter"))if(s)Fe(t);else{const l=document.getElementById(`check-${t}`);l&&!l.disabled&&(l.checked=!l.checked,i(t))}}}function Fe(e){f("click");const t=H.some(p=>p.id===e),i=t?"sm":"pm",s=t?H:_,a=t?Z:ee,l=s.find(p=>p.id===e);if(!l||!l.isWarrior)return;if(te(i)>=5){W("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning");return}a[e]=(a[e]||0)+1;const r=document.getElementById(`warrior-count-${e}`);r&&(r.textContent=a[e]);const d=document.getElementById(`picker-row-${e}`);d&&(a[e]>0?d.classList.add("selected"):d.classList.remove("selected")),ne(),oe(i)}function wt(e){f("click");const t=H.some(c=>c.id===e),i=t?"sm":"pm",s=t?Z:ee;if(!s[e]||s[e]<=0)return;s[e]--;const a=document.getElementById(`warrior-count-${e}`);a&&(a.textContent=s[e]);const l=document.getElementById(`picker-row-${e}`);l&&s[e]<=0&&l.classList.remove("selected"),ne(),oe(i)}function te(e){const t=e==="sm"?H:_,i=e==="sm"?Z:ee;let s=0;return t.filter(a=>!a.isLeader&&!a.isWarrior).forEach(a=>{var l;(l=document.getElementById(`check-${a.id}`))!=null&&l.checked&&s++}),t.filter(a=>!a.isLeader&&a.isWarrior).forEach(a=>{s+=i[a.id]||0}),s}function Ve(e){const t=e==="sm"?H:_;let i=0;return t.filter(s=>s.isLeader).forEach(s=>{var a;e==="pm"?i=1:(a=document.getElementById(`check-${s.id}`))!=null&&a.checked&&i++}),i+te(e)}function ke(){Object.keys(Z).forEach(p=>delete Z[p]),Object.keys(ee).forEach(p=>delete ee[p]);const e=H.filter(p=>p.isLeader),t=H.filter(p=>!p.isLeader),i=document.getElementById("sm-leader-section"),s=document.getElementById("sm-operator-section");i.innerHTML="",s.innerHTML="",i.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:#6a9ad4; margin-bottom:6px; padding-left:4px;">
      ⚜ 🎖️ LEADER — 单选 1 名 (3 选 1) ⚜
    </div>
  `,e.forEach(p=>{const m=document.createElement("div");m.className="roster-pick-row",m.id=`picker-row-${p.id}`,m.innerHTML=de(p,"Space Marine",!0,!1,!1,"toggleSelectSM"),ve(m,p.id,be,!1),i.appendChild(m)}),s.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:#6a9ad4; margin:12px 0 6px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span>⚜ 🎯 OPERATORS — 共选 5 名 (Warrior 可用计数器重复选取) ⚜</span>
      <span id="sm-op-count" style="font-size:0.75rem; color:#9a9da5; font-family:'Pirata One',serif;">0 / 5</span>
    </div>
    <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px; padding-left:4px;">
      ⚠️ 非 Warrior 每种只能带一名。Warrior [Warrior] 可用 +/− 按钮选取最多 5 名同型单位。
    </p>
  `,t.forEach(p=>{const m=document.createElement("div");m.className="roster-pick-row",m.id=`picker-row-${p.id}`,m.innerHTML=de(p,"Space Marine",!1,!1,!1,"toggleSelectSM"),ve(m,p.id,be,p.isWarrior),s.appendChild(m)});const a=_.filter(p=>p.isLeader),l=_.filter(p=>!p.isLeader),c=document.getElementById("pm-leader-section"),r=document.getElementById("pm-operator-section");c.innerHTML="",r.innerHTML="",c.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:var(--pm-accent); margin-bottom:6px; padding-left:4px;">
      ☠ 🎖️ LEADER — 必选 ☠
    </div>
  `;const d="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(122,184,138,0.15)";a.forEach(p=>{const m=document.createElement("div");m.className="roster-pick-row selected",m.id=`picker-row-${p.id}`,m.innerHTML=de(p,"Plague Marine",!0,!0,!0,"toggleSelectPM",d),c.appendChild(m)}),r.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:var(--pm-accent); margin:12px 0 6px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span>☠ 🎯 OPERATORS — 共选 5 名 (6 类型, Warrior 可重复) ☠</span>
      <span id="pm-op-count" style="font-size:0.75rem; color:#9a9da5; font-family:'Pirata One',serif;">0 / 5</span>
    </div>
    <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px; padding-left:4px;">
      ⚠️ 非 Warrior 每种只能带一名。Warrior [Warrior] 可用 +/− 按钮选取多名同型单位。
    </p>
  `,l.forEach(p=>{const m=document.createElement("div");m.className="roster-pick-row",m.id=`picker-row-${p.id}`,m.innerHTML=de(p,"Plague Marine",!1,!1,!1,"toggleSelectPM",d),ve(m,p.id,We,p.isWarrior),r.appendChild(m)}),ne(),oe("sm"),oe("pm")}function be(e){f("click");const t=H.find(a=>a.id===e),i=document.getElementById(`check-${e}`),s=document.getElementById(`picker-row-${e}`);if(!(!t||!i)){if(t.isLeader)i.checked&&H.filter(a=>a.isLeader&&a.id!==e).forEach(a=>{var c;const l=document.getElementById(`check-${a.id}`);l&&(l.checked=!1,(c=document.getElementById(`picker-row-${a.id}`))==null||c.classList.remove("selected"))});else if(i.checked&&te("sm")>5){i.checked=!1,W("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning"),ne();return}i.checked?s.classList.add("selected"):s.classList.remove("selected"),ne(),oe("sm")}}function We(e){f("click");const t=_.find(a=>a.id===e),i=document.getElementById(`check-${e}`),s=document.getElementById(`picker-row-${e}`);if(!(!t||!i)&&!t.isLeader){if(i.checked&&te("pm")>5){i.checked=!1,W("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning"),ne();return}i.checked?s.classList.add("selected"):s.classList.remove("selected"),ne(),oe("pm")}}function oe(e){const t=e==="sm"?H:_,i=e==="sm"?Z:ee,a=te(e)>=5;t.filter(l=>!l.isLeader).forEach(l=>{if(l.isWarrior){const c=document.querySelector(`#picker-row-${l.id} .warrior-counter-btn.plus`),r=document.querySelector(`#picker-row-${l.id} .warrior-counter-btn.minus`),d=i[l.id]||0;c&&(c.disabled=a),r&&(r.disabled=d<=0)}else{const c=document.getElementById(`check-${l.id}`);if(!c)return;a&&!c.checked?c.disabled=!0:c.disabled=!1}})}function ne(){const e=Ve("sm"),t=te("sm");document.getElementById("sm-roster-count").textContent=`已选: ${e} / 6 人`;const i=document.getElementById("sm-op-count");i&&(i.textContent=`${t} / 5`);const s=Ve("pm"),a=te("pm");document.getElementById("pm-roster-count").textContent=`已选: ${s} / 6 人`;const l=document.getElementById("pm-op-count");l&&(l.textContent=`${a} / 5`)}function $t(){var r;f("click");const e=[];let t=0;H.forEach(d=>{var p;if(d.isWarrior){const m=Z[d.id]||0;m>0&&e.push({tmpl:d,count:m})}else(p=document.getElementById(`check-${d.id}`))!=null&&p.checked&&(e.push({tmpl:d,count:1}),d.isLeader&&t++)});const i=e.reduce((d,p)=>d+p.count,0),s=[];_.forEach(d=>{var p;if(d.isWarrior){const m=ee[d.id]||0;m>0&&s.push({tmpl:d,count:m})}else(p=document.getElementById(`check-${d.id}`))!=null&&p.checked&&s.push({tmpl:d,count:1})});const a=s.reduce((d,p)=>d+p.count,0);if(i!==6){f("alert"),W(`星际战士 (死亡天使) 必须刚好选择 6 人！当前选择了 ${i} 人。`,"error");return}if(t!==1){f("alert"),W("星际战士 必须选择且仅选择 1 名队长！","error");return}if(a!==6){f("alert"),W(`瘟疫守卫 必须刚好选择 6 人！当前选择了 ${a} 人。`,"error");return}if(!((r=document.getElementById("check-pm_1"))==null?void 0:r.checked)){f("alert"),W("瘟疫守卫 的 冠军队长 (Plague Champion) 是强制出战的 Leader 角色！","error");return}o.operatives=[],e.forEach(({tmpl:d,count:p})=>{for(let m=0;m<p;m++){const u=p>1?`${d.id}_${m+1}`:d.id,v=p>1?`${d.name} #${m+1}`:d.name;o.operatives.push(new De(u,v,"Space Marine",d.wounds,d.apl,d.df,d.sv,d.weapons,d.defaultAvatar,d.move||6))}}),s.forEach(({tmpl:d,count:p})=>{for(let m=0;m<p;m++){const u=p>1?`${d.id}_${m+1}`:d.id,v=p>1?`${d.name} #${m+1}`:d.name;o.operatives.push(new De(u,v,"Plague Marine",d.wounds,d.apl,d.df,d.sv,d.weapons,d.defaultAvatar,d.move||5))}});const c=document.getElementById("mission-type");c&&(o.missionType=c.value),S(`  - 当前任务: ${Ne[o.missionType]||o.missionType}`),document.getElementById("start-screen").style.display="none",document.getElementById("global-dash").style.display="grid",document.getElementById("battle-area").style.display="grid",document.getElementById("guidance-banner").style.display="flex",S(">>> 战队挑选部署完毕！"),S(`  - Angels of Death (星际战士) 登场: ${o.operatives.filter(d=>d.faction==="Space Marine").map(d=>d.name).join(", ")}`),S(`  - Plague Marines (瘟疫守卫) 登场: ${o.operatives.filter(d=>d.faction==="Plague Marine").map(d=>d.name).join(", ")}`),K(),q(),qe()}function q(){const e=document.getElementById("sm-ops-list"),t=document.getElementById("pm-ops-list");e.innerHTML="",t.innerHTML="";let i=0,s=0;o.operatives.forEach(a=>{const l=a.faction==="Space Marine";l&&!a.isDead&&i++,!l&&!a.isDead&&s++;const c=document.createElement("div");let r=`op-card ${l?"sm-theme":"pm-theme"}`;a.isDead?r+=" dead":a.hasActed&&(r+=" activated"),o.activeAgent&&o.activeAgent.id===a.id&&(r+=" active-target"),c.className=r;const d=a.wounds/a.maxWounds*100,p=a.weapons.map(b=>b.name.split(" ")[0]).join(" / ");let m="";!l&&o.pmActivePloys.includes("contagious_resilience")&&!a.isDead&&(m='<span class="card-ploy-tag" style="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(122,184,138,0.15);">减伤重投</span>');let u="";a.isDead||(a.hasConceal&&(u+='<span class="card-ploy-tag" style="border-color:#818cf8; color:#818cf8; background:rgba(129,140,248,0.15); font-size:0.6rem;">隐蔽</span>'),a.isInjured&&(u+='<span class="card-ploy-tag" style="border-color:var(--red); color:var(--red); background:rgba(184,76,76,0.15); font-size:0.6rem;">重伤</span>'),a.poisonTokens>0&&(u+='<span class="card-ploy-tag" style="border-color:#7ab88a; color:#7ab88a; background:rgba(122,184,138,0.15); font-size:0.6rem;">毒素×'+a.poisonTokens+"</span>"));const v=!a.isDead&&!a.hasActed&&o.phase==="Firefight"&&o.activeTurn===a.faction,g=o.activeAgent&&o.activeAgent.id===a.id,k=(v||g)&&!a.orderSwitchedThisActivation,w=(v||g)&&a.orderSwitchedThisActivation,y=k?`<button class="conceal-toggle-btn" onclick="event.stopPropagation(); toggleConceal('${a.id}')" title="切换命令 (每激活限 1 次)" style="font-size:0.65rem; padding:2px 6px; margin-left:4px; background:${a.hasConceal?"rgba(129,140,248,0.3)":"transparent"}; border:1px solid #818cf8; color:#818cf8; border-radius:4px; cursor:pointer;">${a.hasConceal?"🛡️隐蔽":"🛡️"}</button>`:w?'<button class="conceal-toggle-btn" disabled title="本激活已切换过命令" style="font-size:0.65rem; padding:2px 6px; margin-left:4px; background:transparent; border:1px solid #475569; color:#475569; border-radius:4px; cursor:not-allowed; opacity:0.5;">🛡️已切换</button>':"",$=pe(a.id,a.faction);c.innerHTML=`
      <div style="position:absolute;top:3px;right:6px;color:var(--imperial-gold);font-size:10px;opacity:0.4;pointer-events:none;z-index:1;">✦</div>
      <div class="op-card-top">
        <div class="op-avatar-row">
          ${$}
          <span class="op-card-title">${a.name} ${m} ${u} ${y}</span>
        </div>
        <span class="op-card-tag">${a.currentApl} APL${a.isInjured?' <span style="color:var(--red); font-size:0.6rem;">(-1)</span>':""}</span>
      </div>
      <div class="op-card-hp">
        <span>HP (Wounds):</span>
        <span>${a.wounds} / ${a.maxWounds}</span>
      </div>
      <div class="op-hp-bar-container">
        <div class="op-hp-bar" style="width: ${d}%; background-color: ${d<40?"var(--red)":"var(--green)"}"></div>
      </div>
      <div class="op-card-stats">
        <span>Move: <strong>${a.currentMove}"</strong>${a.isInjured?' <span style="color:var(--red); font-size:0.55rem;">(-2)</span>':""}</span>
        <span>DF: <strong>${a.df}</strong></span>
        <span>SV: <strong>${a.sv}+</strong></span>
        <span style="font-size: 0.65rem; color: #5a5d65; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">
          ${p}
        </span>
      </div>
    `,c.setAttribute("role","button"),c.setAttribute("tabindex","0"),c.setAttribute("aria-label",`${a.name}，HP: ${a.wounds}/${a.maxWounds}，${a.isDead?"已阵亡":a.hasActed?"已激活":"可激活"}`),o.pendingActivation&&o.pendingActivation.id===a.id&&c.classList.add("pending-activation"),!a.isDead&&!a.hasActed&&o.phase==="Firefight"&&o.activeTurn===a.faction&&!o.activeAgent?(c.onclick=()=>ye(a.id),c.onkeydown=b=>{(b.key==="Enter"||b.key===" ")&&(b.preventDefault(),ye(a.id))}):(c.onclick=null,c.onkeydown=null,a.isDead&&c.setAttribute("aria-disabled","true")),l?e.appendChild(c):t.appendChild(c)}),document.getElementById("sm-alive-count").textContent=`${i} / 6 存活`,document.getElementById("pm-alive-count").textContent=`${s} / 6 存活`}function Ct(e){f("click");const t=o.operatives.find(i=>i.id===e);if(!(!t||t.isDead)){if(t.orderSwitchedThisActivation){W("本激活已切换过命令 (每激活限切换 1 次)！","warning");return}t.toggleConceal(),t.orderSwitchedThisActivation=!0,S(`[命令切换] ${t.name} ${t.hasConceal?"进入隐蔽状态 (Conceal Order)，不可被指定为射击/近战目标。":"切换为交战状态 (Engage Order)。"}`),q(),O()}}function ye(e){f("click");const t=o.operatives.find(i=>i.id===e);!t||t.isDead||t.hasActed||o.phase!=="Firefight"||o.activeTurn!==t.faction||o.activeAgent||(o.pendingActivation&&o.pendingActivation.id===e?o.pendingActivation=null:o.pendingActivation=t,q(),O())}function Tt(){const e=o.pendingActivation;e&&(o.pendingActivation=null,_e(e.id))}function Mt(){f("click"),o.pendingActivation=null,q(),O()}function _e(e){f("click");const t=o.operatives.find(i=>i.id===e);if(!(!t||t.isDead||t.hasActed)){if(o.activeAgent=t,o.pendingActivation=null,t.actionsPerformed=[],t.orderSwitchedThisActivation=!1,t.poisonTokens>0&&(S(`[毒素] ${t.name} 携带毒素标记，激活开始受到 1 点伤害！`),t.applyWounds(1),t.isDead)){q(),O();return}t.apl=t.currentApl,S(`[激活] ${t.name} 开始激活，获得 ${t.apl} APL！${t.isInjured?" (Injured: APL -1)":""}`),q(),O()}}function O(){const e=document.getElementById("active-panel-content"),t=document.getElementById("active-panel-empty"),i=document.getElementById("active-panel-status"),s=document.getElementById("active-panel"),a=document.getElementById("turn-indicator"),l=document.getElementById("turn-indicator-faction"),c=document.querySelector(".turn-indicator-label");if(a&&o.phase==="Firefight"){a.style.display="flex";const g=o.activeTurn==="Space Marine"?"死亡天使":"瘟疫守卫";l&&(l.textContent=g),a.className=`turn-indicator ${o.activeTurn==="Space Marine"?"sm-turn":"pm-turn"}`,c&&(o.activeAgent?c.textContent=" — 正在行动":o.pendingActivation?c.textContent=" — 请确认激活":c.textContent="的回合 — 请选择特工")}else a&&(a.style.display="none");const r=document.getElementById("pending-activation-panel");if(r)if(o.pendingActivation&&!o.activeAgent){r.style.display="flex";const g=o.pendingActivation,k=document.getElementById("pending-op-avatar");k&&(k.innerHTML=pe(g.id,g.faction)),document.getElementById("pending-op-name").textContent=g.name,document.getElementById("pending-op-faction").textContent=g.faction==="Space Marine"?"死亡天使":"瘟疫守卫",document.getElementById("pending-op-move").textContent=g.currentMove+'"',document.getElementById("pending-op-hp").textContent=`${g.wounds}/${g.maxWounds}`,document.getElementById("pending-op-apl").textContent=g.currentApl}else r.style.display="none";const d=document.getElementById("sm-board"),p=document.getElementById("pm-board"),m=o.phase==="Firefight",u=m&&o.activeTurn==="Space Marine",v=m&&o.activeTurn==="Plague Marine";if(d&&(d.classList.toggle("active-turn",u),d.classList.toggle("inactive-turn",m&&!u)),p&&(p.classList.toggle("active-turn",v),p.classList.toggle("inactive-turn",m&&!v)),o.activeAgent){e.style.display="flex",t.style.display="none";const g=o.activeAgent;i.textContent="当前激活特工";const k=document.getElementById("active-op-avatar-container");k&&(k.innerHTML=pe(g.id,g.faction)),s.className=`active-card ${g.faction==="Space Marine"?"sm-active":"pm-active"}`,document.getElementById("active-op-name").textContent=g.name,document.getElementById("active-op-faction").textContent=g.faction==="Space Marine"?"死亡天使":"瘟疫守卫";const w=document.getElementById("active-apl-dots");w.innerHTML="";for(let L=0;L<g.maxApl;L++){const ae=document.createElement("div");ae.className="apl-dot"+(L<g.apl?" active":""),w.appendChild(ae)}const y=g.actionsPerformed.includes("Move"),$=g.actionsPerformed.includes("Charge"),b=g.actionsPerformed.includes("Advance"),C=g.actionsPerformed.includes("Dash"),E=g.weapons.some(L=>L.hasRule("Heavy")),D=g.actionsPerformed.includes("FallBack"),P=g.actionsPerformed.filter(L=>L==="Shoot").length,B=g.actionsPerformed.filter(L=>L==="Fight").length,A=P>0,U=B>0,R=g.counteracting===!0,T=y||$||b||C||D,G=b||D,et=C&&!E,Te=R?1:2,Me=R?1:2,Se=!R&&U,Ae=!R&&A,tt=P>=Te,nt=B>=Me;document.getElementById("action-move").disabled=g.apl<1||T||R,document.getElementById("action-charge").disabled=R?!0:g.apl<1||T||U||A||g.hasConceal,document.getElementById("action-advance").disabled=g.apl<1||T||U||A||R,document.getElementById("action-dash").disabled=g.apl<1||T||U||A||R,document.getElementById("action-fallback").disabled=g.apl<1||T||U||A||R;const at=E&&!C&&g.weapons.every(L=>L.hasRule("Heavy"));document.getElementById("action-shoot").disabled=g.apl<1||tt||Se||$||G||et||at,document.getElementById("action-fight").disabled=g.apl<1||nt||Ae||G||C;const it=g.faction==="Plague Marine"&&o.pmActivePloys.includes("contagious_resilience"),Pe=document.getElementById("active-ploys-display");if(Pe){const L=[];R&&L.push('<span style="color:#f97316;">⚡ 反击 (Counteract): 仅限 1 次行动, 移动≤2", 不可冲锋</span>'),b&&L.push('<span style="color:#f59e0b;">🏃💨 已前进 (Advance): 不能再射击/近战</span>'),C&&L.push(`<span style="color:#f59e0b;">💨💨 已冲刺 (Dash): 不能再近战${E?"，仅 Heavy 武器可射击":"，不能射击"}</span>`),D&&L.push('<span style="color:#f59e0b;">🔙 已撤退 (Fall Back): 不能再射击/近战</span>'),A&&!R&&L.push(`<span style="color:#6a9ad4;">💥 Astartes: 已射击×${P}，锁定近战</span>`),U&&!R&&L.push(`<span style="color:#f87171;">⚔️ Astartes: 已近战×${B}，锁定射击</span>`),it&&L.push('<span style="color:var(--pm-accent);">🛡️ 传染韧性生效中</span>'),Pe.innerHTML=L.length>0?L.join(" | "):""}const Ee=document.querySelector("#action-shoot span:first-child");if(Ee){const L=Te-P,ae=Se?" (已锁定)":"";Ee.innerHTML=`💥 射击 [${L>0?L:0}次剩余${ae}]`}const Le=document.querySelector("#action-fight span:first-child");if(Le){const L=Me-B,ae=Ae?" (已锁定)":"";Le.innerHTML=`⚔️ 近战 [${L>0?L:0}次剩余${ae}]`}N(`【特工行动】${g.name} 剩余 APL: ${g.apl}。可执行移动/冲锋/前进/冲刺/撤退/射击/近战，或点击下方按钮结束。`)}else if(o.pendingActivation)e.style.display="none",t.style.display="none",i.textContent="等待确认",s.className="active-card",N(`【预选确认】已选中【${o.pendingActivation.name}】。请在右侧面板点击「确认激活」或「取消」。`);else{e.style.display="none",t.style.display="block",i.textContent="等待特工激活",s.className="active-card";const g=o.activeTurn,k=g==="Space Marine"?"死亡天使":"瘟疫守卫";X(g)?N(`【激活提示】请从${g==="Space Marine"?"左边":"右边"}【${k}】战队卡片列表中选择点击发亮的特工卡片，载入动作。`):X(g==="Space Marine"?"Plague Marine":"Space Marine")?N("【激活换边】因为当前轮次已无可用单位，权能自动转回另一方。请继续点击激活。"):N("【激活结束】双方所有特工已耗尽激活！请点击右上角的回合推进至下一TP。")}}function St(){const e=o.activeAgent;!e||e.apl<1||(f("click"),e.apl-=1,e.actionsPerformed.push("Move"),e.counteracting?S(`  - ${e.name} 执行 [反击移动]，消耗 1 AP。⚠️ 物理沙盘移动不得超过 2"！`):S(`  - ${e.name} 执行 [移动 (Move)]，消耗 1 APL。`),O())}function At(){const e=o.activeAgent;!e||e.apl<1||(f("click"),e.apl-=1,e.actionsPerformed.push("Charge"),S(`  - ${e.name} 执行 [冲锋 (Charge)] 移动近战位，消耗 1 APL。`),O())}function Pt(){const e=o.activeAgent;!e||e.apl<1||(f("click"),e.apl-=1,e.actionsPerformed.push("Advance"),S(`  - ${e.name} 执行 [前进 (Advance)]，移动距离 +3" (总计 ${e.currentMove+3}")，但本激活不能再射击/近战。`),O())}function Et(){const e=o.activeAgent;!e||e.apl<1||(f("click"),e.apl-=1,e.actionsPerformed.push("Dash"),S(`  - ${e.name} 执行 [冲刺 (Dash)]，移动距离 ×2 (总计 ${e.currentMove*2}")，但本激活不能再射击/近战。`),O())}function Lt(){const e=o.activeAgent;!e||e.apl<1||(f("click"),e.apl-=1,e.actionsPerformed.push("FallBack"),S(`  - ${e.name} 执行 [撤退 (Fall Back)]，脱离交战区域。本激活不能再射击/近战。`),O())}function It(){f("click");const e=o.activeAgent;e&&(e.counteracting&&(S(`[反击结束] ${e.name} 的反击行动完毕。`),e.counteracting=!1),e.hasActed=!0,e.apl=0,S(`[结束激活] ${e.name} 结束了本次激活。`),o.activeAgent=null,o.pendingActivation=null,ct())}function qe(){o.phase="Initiative",K(),fe();const e=document.getElementById("phase-overlay-content");e.innerHTML=`
    <h3>Turning Point ${o.turningPoint} - 先攻掷骰</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:10px;">
      游戏开始前，双方通过投掷先攻骰 (Initiative Roll-Off) 判定胜负，胜者决定谁拿先攻手牌。
    </p>

    <div class="init-roll-grid" style="margin-bottom:12px;">
      <div class="init-team-col sm">
        <h4 style="color:#6a9ad4; font-size:0.9rem;">死亡天使先攻骰</h4>
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
  `,N("【先攻阶段】点击按钮开始判定本回合先手优势权。")}function fe(){const e=document.getElementById("phase-overlay");e.style.display="flex";const t=document.getElementById("phase-overlay-content");t&&(t.classList.add("gothic-panel"),t.querySelector(".gothic-arch")||t.insertAdjacentHTML("afterbegin",'<div class="gothic-arch"></div>')),re(e)}function we(){document.getElementById("phase-overlay").style.display="none",ce()}function Dt(){const e=document.getElementById("counteract-overlay");e&&(e.style.display="none"),ce()}function Ke(e){const t=document.getElementById("counteract-overlay"),i=document.getElementById("counteract-content"),s=e==="Space Marine"?"死亡天使":"瘟疫守卫",a=e==="Space Marine"?"#6a9ad4":"var(--pm-accent)",l=o.operatives.filter(r=>r.faction===e&&!r.isDead&&r.hasActed&&!r.hasConceal);let c="";l.forEach(r=>{c+=`
      <div class="counteract-op-row" onclick="selectCounteractOperative('${r.id}')" style="
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 6px;
        cursor: pointer;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        gap: 10px;
      " onmouseover="this.style.borderColor='${a}'; this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.03)'">
        <div style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.1); overflow:hidden; flex-shrink:0;">
          <img src="${r.defaultAvatar}" style="width:100%; height:100%; object-fit:cover;" alt="${r.name}" />
        </div>
        <div style="flex:1;">
          <div style="font-weight:600; color:#fff; font-size:0.85rem;">${r.name}</div>
          <div style="font-size:0.7rem; color:var(--text-muted);">HP: ${r.wounds}/${r.maxWounds} | 武器: ${r.weapons.length} 种</div>
        </div>
        <div style="color:${a}; font-size:0.75rem; font-weight:600;">选择 →</div>
      </div>
    `}),i.innerHTML=`
    <h3 style="color:${a}; margin-bottom:8px;">⚡ 反击时机 (Counteract)</h3>
    <p style="color:var(--text-muted); font-size:0.8rem; margin-bottom:12px; line-height:1.5;">
      【${s}】所有特工已耗尽，但对方仍有未激活特工。<br>
      可选择一名已耗尽的 <b>Engage 标记</b> 特工发动反击：<br>
      <span style="color:#f97316;">• 免费获得 1 AP 执行一个行动 • 移动不得超过 2" • 不可冲锋</span>
    </p>

    <div style="margin-bottom:16px;">
      ${l.length>0?c:'<p style="color:var(--text-muted); text-align:center; padding:20px;">无符合条件的特工 (需要 Engage 标记且存活)</p>'}
    </div>

    <div style="display:flex; gap:10px;">
      <button class="btn-large" onclick="skipCounteract()" style="flex:1; padding:10px 20px; font-size:0.85rem; background:rgba(100,116,139,0.2); border-color:#475569;">
        跳过反击 (Skip)
      </button>
    </div>
  `,t.style.display="flex",re(t)}function Bt(e){f("crit"),dt(e)}function Rt(){f("click"),He()}function Vt(){const e=document.getElementById("overlay-init-sm-dice"),t=document.getElementById("overlay-init-pm-dice"),i=document.getElementById("btn-overlay-roll");i.disabled=!0,e.innerHTML='<div class="kt-dice-cube sm-dice rolling">?</div>',t.innerHTML='<div class="kt-dice-cube pm-dice rolling">?</div>',f("shoot"),setTimeout(()=>{const s=Math.floor(Math.random()*6)+1;e.innerHTML=`<div class="kt-dice-cube sm-dice ${s===6?"crit-dice":""}">${s}</div>`,f("click"),s===6&&f("crit"),setTimeout(()=>{const a=Math.floor(Math.random()*6)+1;if(t.innerHTML=`<div class="kt-dice-cube pm-dice ${a===6?"crit-dice":""}">${a}</div>`,f("click"),a===6&&f("crit"),s===a)f("alert"),document.getElementById("overlay-init-sm-val").textContent=`平局 [${s}]`,document.getElementById("overlay-init-pm-val").textContent=`平局 [${a}]`,i.disabled=!1,i.textContent="平局！重新投骰",S(`  - 先攻判定平局 [${s}]，准备重投...`);else{const c=(s>a?"Space Marine":"Plague Marine")==="Space Marine"?"死亡天使":"瘟疫守卫";f("crit"),i.style.display="none",document.getElementById("overlay-init-sm-val").textContent=`点数: ${s}`,document.getElementById("overlay-init-pm-val").textContent=`点数: ${a}`,S(`  - 先攻判定掷骰：死亡天使 [${s}] vs 瘟疫守卫 [${a}]`),S(`  - 【${c}】赢得了投骰，准备选择先攻权归属。`);const r=document.getElementById("phase-overlay-content"),d=document.createElement("div");d.style.cssText="border-top:1px solid var(--panel-border); margin-top:16px; padding-top:16px; width:100%;",d.innerHTML=`
            <p style="color:var(--sm-accent); font-weight:bold; margin-bottom:10px;">👑 【${c}】选择首发玩家：</p>
            <div id="turn-order-buttons" style="display:flex; gap:10px; margin-bottom:10px;">
              <button class="qa-btn turn-order-btn" data-faction="Space Marine" onclick="selectTurnOrder('Space Marine')" style="flex:1;">死亡天使先攻</button>
              <button class="qa-btn turn-order-btn" data-faction="Plague Marine" onclick="selectTurnOrder('Plague Marine')" style="flex:1;">瘟疫守卫先攻</button>
            </div>
            <button id="btn-confirm-turn-order" class="btn-large" onclick="confirmTurnOrder()" style="display:none; padding:10px 30px; font-size:0.9rem; width:100%; margin-top:8px;">
              确认首发选择
            </button>
        `,r.appendChild(d),N(`【选择先后】王座归属：【${c}】玩家获胜，请点击按钮选择首发方并确认。`)}},300)},700)}function Ot(e){f("click"),document.querySelectorAll(".turn-order-btn").forEach(a=>{a.dataset.faction===e?(a.classList.add("selected"),a.style.background="linear-gradient(135deg, var(--imperial-gold), #8a6a1c)",a.style.color="#000",a.style.borderColor="var(--imperial-gold-bright)",a.style.boxShadow="0 0 12px rgba(201, 168, 76, 0.5)"):(a.classList.remove("selected"),a.style.background="",a.style.color="",a.style.borderColor="",a.style.boxShadow="")});const i=document.getElementById("btn-confirm-turn-order");i&&(i.style.display="block",i.dataset.pending=e),N(`【预选首发】已选中【${e==="Space Marine"?"死亡天使":"瘟疫守卫"}】为先攻方，请点击确认按钮完成选择。`)}function Ht(){const e=document.getElementById("btn-confirm-turn-order"),t=e&&e.dataset.pending;t&&(f("crit"),o.initiative=t,o.activeTurn=t,S(`  - 确认：【${t==="Space Marine"?"死亡天使":"瘟疫守卫"}】获得本回合的先攻优势！`),Ue())}function Ue(){const e=o.phase;if(o.phase="Strategy",e!=="Strategy")if(o.turningPoint===1)o.smCp+=1,o.pmCp+=1,S("  💰 第1回合策略阶段：双方各获得 1 CP。");else{const i=o.initiative,s=i==="Space Marine"?"Plague Marine":"Space Marine";i==="Space Marine"?(o.smCp+=1,o.pmCp+=2):(o.pmCp+=1,o.smCp+=2);const a=l=>l==="Space Marine"?"死亡天使":"瘟疫守卫";S(`  💰 TP${o.turningPoint} 策略阶段：${a(i)}(先攻) +1 CP, ${a(s)} +2 CP。`)}K(),fe();const t=document.getElementById("phase-overlay-content");t.innerHTML=`
    <h3>Turning Point ${o.turningPoint} - 策略阶段</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">
      在此阶段，双方可以使用命令点 (CP) 激活计策 (Strategic Ploys)。
    </p>

    <div class="gothic-divider"><span style="color:var(--imperial-gold);font-size:8px;">⬥</span><span style="color:var(--imperial-gold);font-size:14px;">✠</span><span style="color:var(--imperial-gold);font-size:8px;">⬥</span></div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">
      <div class="ploy-choice-card ${o.smActivePloys.includes("bolter_discipline")?"selected":""}" role="button" tabindex="0" onclick="buyPloy('sm')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();buyPloy('sm')}">
        <div class="ploy-title">
          <span>🔥 爆弹惩戒 (1 CP)</span>
          <span style="font-size:0.75rem; color:#6a9ad4;">Astartes</span>
        </div>
        <div class="ploy-desc">
          死亡天使特工本回合激活内，可以使用<b>两次</b>射击行动。
        </div>
        <div style="margin-top:6px; font-weight:bold; font-size:0.75rem; color:var(--sm-accent);">
          ${o.smActivePloys.includes("bolter_discipline")?"● 生效中":"点击启用"}
        </div>
      </div>

      <div class="ploy-choice-card ${o.pmActivePloys.includes("contagious_resilience")?"selected":""}" role="button" tabindex="0" onclick="buyPloy('pm')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();buyPloy('pm')}">
        <div class="ploy-title">
          <span>🛡️ 传染韧性 (1 CP)</span>
          <span style="font-size:0.75rem; color:var(--pm-accent);">Death Guard</span>
        </div>
        <div class="ploy-desc">
          瘟疫守卫在结算【恶心作呕 (DR)】伤害减免时，可<b>重投第一个失败的减伤骰</b>。
        </div>
        <div style="margin-top:6px; font-weight:bold; font-size:0.75rem; color:var(--pm-accent);">
          ${o.pmActivePloys.includes("contagious_resilience")?"● 生效中":"点击启用"}
        </div>
      </div>
    </div>

    <button class="btn-large" onclick="proceedToFirefight()" style="padding: 10px 40px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #2a5a3a); border-color:#4a7c59; box-shadow:none;">
      进入战斗阶段 (Proceed to Firefight)
    </button>
  `,N("【策略阶段】双方轮流消费 1 CP 采购策略 Ploys。按 Proceed 按钮进入实际交火战斗。")}function zt(e){if(e==="sm")if(o.smActivePloys.includes("bolter_discipline"))f("click"),o.smActivePloys=[],o.smCp+=1;else{if(o.smCp<1){f("alert"),W("死亡天使 CP 不足！","warning");return}f("crit"),o.smActivePloys.push("bolter_discipline"),o.smCp-=1,S("  - 死亡天使激活策略：【爆弹惩戒】！本回合可双击开火！")}else if(o.pmActivePloys.includes("contagious_resilience"))f("click"),o.pmActivePloys=[],o.pmCp+=1;else{if(o.pmCp<1){f("alert"),W("瘟疫守卫 CP 不足！","warning");return}f("crit"),o.pmActivePloys.push("contagious_resilience"),o.pmCp-=1,S("  - 瘟疫守卫激活策略：【传染韧性】！DR首发失败可重投！")}Ue()}function Nt(){f("click"),we(),o.phase="Firefight",K(),S(`
【战斗阶段开始】Turning Point ${o.turningPoint}`),S(`>>> 首发方【${o.activeTurn==="Space Marine"?"死亡天使":"瘟疫守卫"}】可以激活一名特工。`),q(),O(),N("【特工激活期】在两侧列表中点击未激活的特工（高亮）卡片，载入中央控制板执行动作。")}function jt(e){f("click");const t=mt[e];if(!t)return;document.getElementById("help-title").textContent=t.title,document.getElementById("help-body").innerHTML=t.body;const i=document.getElementById("help-modal");i.style.display="flex",re(i)}function Ge(){f("click"),document.getElementById("help-modal").style.display="none",ce()}function Ft(e){f("funeral");const t=document.getElementById("death-overlay"),i=document.getElementById("death-model-name"),s=document.getElementById("death-model-faction"),a=document.getElementById("death-gag-text");if(t){i.textContent=e.name,s.textContent=e.faction==="Space Marine"?"死亡天使 (Angels of Death)":"瘟疫守卫 (Plague Marines)";const l=Math.floor(Math.random()*Ie.length);a.textContent=Ie[l],t.style.display="flex",re(t)}S(`[阵亡提示] 特工 ${e.name} 已阵亡！请在物理沙盘中移除模型。`)}function Qe(){f("click");const e=document.getElementById("death-overlay");e&&(e.style.display="none",ce()),Wt()}function Wt(){if(o.gameOver)return;const e=o.operatives.filter(i=>i.faction==="Space Marine"&&!i.isDead).length,t=o.operatives.filter(i=>i.faction==="Plague Marine"&&!i.isDead).length;e===0&&t===0?(o.gameOver=!0,ie("draw","双方均全员阵亡，战斗以同归于尽平局告终！")):e===0?(o.gameOver=!0,ie("pm",`死亡天使战队全员阵亡！
瘟疫守卫 (Plague Marines) 成功清剿了残敌，夺取了战场的完全控制权！`)):t===0&&(o.gameOver=!0,ie("sm",`瘟疫守卫战队全员阵亡！
死亡天使 (Angels of Death) 肃清了战场，坚守住帝国的光荣防线！`))}function ie(e,t){fe();const i=document.getElementById("phase-overlay-content");let s="🎉 对局结束 🎉",a="var(--text-main)";e==="sm"?(s="🏆 死亡天使 (Angels of Death) 荣获胜利！ 🏆",a="#6a9ad4"):e==="pm"?(s="🏆 瘟疫守卫 (Plague Marines) 荣获胜利！ 🏆",a="var(--pm-accent)"):e==="draw"&&(s="🤝 双方同归于尽 (Match Draw) 🤝",a="var(--sm-accent)"),i.innerHTML=`
    <h3 style="color: ${a}; font-size: 1.4rem; margin-bottom: 12px;">${s}</h3>
    <div class="qa-card" style="margin-bottom: 20px; font-size: 0.95rem; text-align: center; line-height: 1.6; border-color: rgba(255,255,255,0.1);">
      <p style="white-space: pre-line; color: var(--text-main);">${t}</p>
    </div>
    <button class="btn-large" onclick="confirmReset()" style="padding: 10px 30px; font-size:0.9rem; background: var(--red); border-color: #b84c4c; width: 100%;">
      返回主菜单并重置对局
    </button>
  `}function Ye(e=!1){o.phase="TurnEndScoring",o.isFinalScoring=e,K(),fe();const t=o.operatives.filter(l=>l.faction==="Plague Marine"&&l.isDead).length,i=o.operatives.filter(l=>l.faction==="Space Marine"&&l.isDead).length,s=t-o.smKillsScored,a=i-o.pmKillsScored;o.tempSmChecklist=[!1,!1,!1,!1,!1],o.tempPmChecklist=[!1,!1,!1,!1,!1],o.tempSmObjManualOffset=0,o.tempPmObjManualOffset=0,o.tempSmObjVp=0,o.tempPmObjVp=0,o.tempSmKillVp=s,o.tempPmKillVp=a,o.tempSmKills=t,o.tempPmKills=i,$e(),N("【回合结算】引导计算 VP：请输入双方本回合完成任务的 VP，并确认得分结算。")}function $e(){const e=document.getElementById("phase-overlay-content"),t=o.tempSmKillVp+o.tempSmObjVp,i=o.tempPmKillVp+o.tempPmObjVp,s=Be[o.missionType]||Be.custom,a=Ne[o.missionType]||"自定义任务",l=(p,m,u)=>s.map((v,g)=>`
      <label class="scoring-item">
        <input type="checkbox" ${u?`style="accent-color: ${u};"`:""} ${m[g]?"checked":""} onchange="toggleScoringChecklist('${p}', ${g})">
        <span>${v}</span>
      </label>
    `).join(""),c=o.turningPoint>=5,r=c?"确认结算并完成对局":"确认结算并推进回合",d=c?"declareScoreVictory()":"confirmTurnEndScoring()";e.innerHTML=`
    <h3 style="font-size:1.3rem; margin-bottom: 8px;">Turning Point ${o.turningPoint} - 得分结算</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:15px; text-align:center;">
      每回合结束时，引导玩家计算任务得分，并由系统自动根据击杀数累加击杀 VP（1 击杀 = 1 VP）。
    </p>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">

      <!-- SM 结算 -->
      <div class="init-team-col sm" style="align-items:stretch; background: rgba(74,106,154,0.02); border: 1px solid rgba(74,106,154,0.1);">
        <h4 style="color:#6a9ad4; font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px; text-align:center; font-family:'Pirata One',serif;">
          死亡天使 (SM)
        </h4>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>⚔️ 新增击杀得分：</span>
            <span style="font-weight:bold; color:var(--sm-accent);">${o.tempSmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${o.tempSmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">
              ${a} — 任务结算助手
            </div>
            ${l("sm",o.tempSmChecklist,"")}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span>🎯 调整任务得分 (Total Obj VP)：</span>
            <div class="val-control">
              <button class="adjust-btn" onclick="adjustScoreTemp('sm', -1)">-</button>
              <span class="val" style="font-size:1.1rem; font-weight:bold; min-width:20px; text-align:center;">${o.tempSmObjVp}</span>
              <button class="adjust-btn" onclick="adjustScoreTemp('sm', 1)">+</button>
            </div>
          </div>
          <div style="border-top:1px dashed rgba(255,255,255,0.1); padding-top:8px; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:0.95rem;">
            <span>本回合得分小计：</span>
            <span style="color:#6a9ad4;">+${t} VP</span>
          </div>
        </div>
      </div>

      <!-- PM 结算 -->
      <div class="init-team-col pm" style="align-items:stretch; background: rgba(74,124,89,0.02); border: 1px solid rgba(74,124,89,0.1);">
        <h4 style="color:var(--pm-accent); font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px; text-align:center; font-family:'Pirata One',serif;">
          瘟疫守卫 (PM)
        </h4>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>⚔️ 新增击杀得分：</span>
            <span style="font-weight:bold; color:var(--pm-accent);">${o.tempPmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${o.tempPmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">
              ${a} — 任务结算助手
            </div>
            ${l("pm",o.tempPmChecklist,"var(--pm-accent)")}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span>🎯 调整任务得分 (Total Obj VP)：</span>
            <div class="val-control">
              <button class="adjust-btn" onclick="adjustScoreTemp('pm', -1)">-</button>
              <span class="val" style="font-size:1.1rem; font-weight:bold; min-width:20px; text-align:center;">${o.tempPmObjVp}</span>
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

    <button class="btn-large" onclick="${d}" style="padding: 12px 30px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #2a5a3a); border-color:#4a7c59; box-shadow:none; width: 100%;">
      ${r}
    </button>
  `}function _t(e,t){f("click"),e==="sm"?(o.tempSmChecklist[t]=!o.tempSmChecklist[t],o.tempSmObjVp=Math.max(0,o.tempSmChecklist.filter(Boolean).length+o.tempSmObjManualOffset)):(o.tempPmChecklist[t]=!o.tempPmChecklist[t],o.tempPmObjVp=Math.max(0,o.tempPmChecklist.filter(Boolean).length+o.tempPmObjManualOffset)),$e()}function qt(e,t){f("click"),e==="sm"?(o.tempSmObjManualOffset+=t,o.tempSmObjVp=Math.max(0,o.tempSmChecklist.filter(Boolean).length+o.tempSmObjManualOffset)):(o.tempPmObjManualOffset+=t,o.tempPmObjVp=Math.max(0,o.tempPmChecklist.filter(Boolean).length+o.tempPmObjManualOffset)),$e()}function Kt(){f("crit");const e=o.tempSmKillVp+o.tempSmObjVp,t=o.tempPmKillVp+o.tempPmObjVp;o.smVp+=e,o.pmVp+=t,o.smKillsScored=o.tempSmKills,o.pmKillsScored=o.tempPmKills,S(`
--- Turning Point ${o.turningPoint} 回合结算结果 ---`),S(`[死亡天使] 新增 ${e} VP (任务:${o.tempSmObjVp}, 击杀:${o.tempSmKillVp}) | 累计 VP: ${o.smVp}`),S(`[瘟疫守卫] 新增 ${t} VP (任务:${o.tempPmObjVp}, 击杀:${o.tempPmKillVp}) | 累计 VP: ${o.pmVp}`),we(),lt()}function Ut(){f("crit");const e=o.tempSmKillVp+o.tempSmObjVp,t=o.tempPmKillVp+o.tempPmObjVp;o.smVp+=e,o.pmVp+=t,o.smKillsScored=o.tempSmKills,o.pmKillsScored=o.tempPmKills,o.gameOver=!0,K();let i=`双方经历五回合激烈交火，战斗正式落幕！
最终战队积分：
死亡天使: ${o.smVp} VP
瘟疫守卫: ${o.pmVp} VP

`;o.smVp===o.pmVp?ie("draw",i+"双方得分平分秋色，本局握手言和！"):o.smVp>o.pmVp?ie("sm",i+"死亡天使胜利点数更高，赢得最终胜利！"):ie("pm",i+"瘟疫守卫胜利点数更高，赢得最终胜利！")}function Gt(e,t){e.stopPropagation();const i=document.getElementById("global-avatar-uploader");i&&(i.dataset.targetOpId=t,i.value="",i.click())}function Qt(e){const t=e.target.files[0];if(!t)return;const i=e.target.dataset.targetOpId;if(!i)return;const s=new FileReader;s.onload=function(a){const l=a.target.result;o.customAvatars[i]=l,ke(),q(),O(),S(`[头像上传] 成功更新特工 [${i}] 的自定义照片！`)},s.readAsDataURL(t)}function Yt(e,t="normal"){ut.matches||(document.body.classList.remove("intense-shake"),document.body.offsetWidth,document.body.classList.add("intense-shake"),setTimeout(()=>{document.body.classList.remove("intense-shake")},400));const i=document.createElement("div");i.className="impact-effect-text",i.textContent=e,t==="strike"?(i.style.color="var(--red)",i.style.textShadow="0 0 20px rgba(225, 29, 72, 0.85), 0 0 40px #000"):t==="parry"?(i.style.color="#38bdf8",i.style.textShadow="0 0 20px rgba(56, 189, 248, 0.85), 0 0 40px #000"):t==="shoot"?i.style.color="var(--sm-accent)":t==="deflect"&&(i.style.color="#7ab88a",i.style.textShadow="0 0 20px rgba(163, 230, 53, 0.85), 0 0 40px #000"),document.body.appendChild(i),setTimeout(()=>{i.remove()},1800)}function Jt(e,t){[`.duel-avatar-${e}`,`.main-avatar-${e}`].forEach(s=>{const a=document.querySelector(s);if(!a)return;a.classList.remove("avatar-hit-flash"),a.querySelectorAll(".bullet-hole-effect, .slash-effect").forEach(r=>r.remove()),a.offsetWidth,a.classList.add("avatar-hit-flash");const c=document.createElement("div");c.className=t==="shoot"?"bullet-hole-effect":"slash-effect",a.appendChild(c),setTimeout(()=>{a.classList.remove("avatar-hit-flash"),c.remove()},900)})}const x={};function Xt(e){Object.assign(x,e)}window.matchMedia("(prefers-reduced-motion: reduce)");let j=!1,F=[];function J(e,t){const i=setTimeout(e,t);return F.push(i),i}function Je(){const e=document.getElementById("combat-modal");e.style.display="flex",document.getElementById("modal-btn-next").disabled=!0}function ge(){f("click"),document.getElementById("combat-modal").style.display="none",j=!1,F=[],x.renderOperatives(),x.updateActivePanel()}function Ce(){var e;if(f("click"),n.actionType==="shoot"){if(n.step===3){if(!n.inRangeAndVisible){f("alert");return}if(n.inCoverConcealed){f("alert");return}const t=n.weapon.rules.find(i=>i.startsWith("Torrent"));if(t){const i=parseInt(((e=t.match(/\d+/))==null?void 0:e[0])||n.weapon.attacks);n.attackRolls=[],n.attackCrit=0,n.attackNorm=i,n.step=5,V();return}}else if(n.step===4&&n.mode==="manual"){if(pn(),n.attackRolls.length===0)return}else if(n.step===5&&n.mode==="manual"){mn();const t=document.getElementById("manual-def-dice-val");if(t&&t.value.trim()!==""&&n.defenseRolls.length===0)return}}else if(n.actionType==="fight"&&n.step===3){if(!n.inMeleeRange){f("alert");return}if(n.hasFallenBack){f("alert");return}}n.step++,n.actionType==="shoot"?V():n.actionType==="fight"&&Q()}function Xe(){f("click");const e=o.activeAgent;if(!e)return;const t=document.querySelector("#combat-modal .modal-content");t&&(t.style.backgroundImage='linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("assets/images/backgrounds/bg_shoot_action.png")',t.style.backgroundSize="cover",t.style.backgroundPosition="center"),Object.assign(n,{actionType:"shoot",step:1,attacker:e,defender:null,weapon:e.weapons.filter(i=>i.isRanged)[0]||null,inRangeAndVisible:!0,inCoverConcealed:!1,inCover:!1,mode:"random",attRerollIndex:-1,defRerollIndex:-1,brutalUsed:!1,attackRolls:[],defenseRolls:[]}),n.weapon&&(Je(),V())}function V(){var a,l;const e=document.getElementById("modal-title"),t=document.getElementById("modal-body"),i=document.getElementById("modal-btn-next"),s=document.getElementById("modal-btn-cancel");if(i.onclick=Ce,s.style.display="inline-block",n.step===1){e.textContent="射击结算 - 步骤 1: 选择目标";const c=n.attacker.faction==="Space Marine"?"Plague Marine":"Space Marine",r=o.operatives.filter(m=>m.faction===c&&!m.isDead),d=r.filter(m=>!m.hasConceal);if(r.length>0&&d.length===0){t.innerHTML='<p style="color:var(--red);">所有敌方特工均处于隐蔽状态，无法被指定为射击目标。</p>',i.disabled=!0;return}if(d.length===0){t.innerHTML='<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>',i.disabled=!0;return}let p='<div class="weapon-picker-list">';d.forEach(m=>{const u=m.isInjured?' <span style="color:var(--red); font-size:0.7rem;">[重伤]</span>':"",v=m.poisonTokens>0?' <span style="color:#7ab88a; font-size:0.7rem;">[毒素]</span>':"";p+=`
        <div class="weapon-pick-item ${n.defender&&n.defender.id===m.id?"selected":""}" role="button" tabindex="0" onclick="selectShootDefender('${m.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectShootDefender('${m.id}')}">
          <span class="weapon-pick-name">${m.name}${u}${v}</span>
          <span class="weapon-pick-stats">HP: ${m.wounds}/${m.maxWounds} | DF:${m.df} | Move:${m.currentMove}"</span>
        </div>
      `}),p+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要射击的敌方特工：</p>
      ${p}
    `,i.textContent="选择武器",i.disabled=!n.defender}else if(n.step===2){e.textContent="射击结算 - 步骤 2: 选择武器";const c=n.attacker.weapons.filter(u=>u.isRanged),r=n.attacker.isInjured,d=n.attacker.actionsPerformed.includes("Dash");let p='<div class="weapon-picker-list">';c.forEach((u,v)=>{const g=r?`${u.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${u.ts+1}+</span>`:`${u.ts}+`,k=u.range?` | Range: ${u.range}"`:"",w=u.rules&&u.rules.length>0?` | ${u.rules.map(xe).join(", ")}`:"",$=u.hasRule("Heavy")&&!d,b=$?' <span style="color:var(--red); font-size:0.65rem;">[需先冲刺]</span>':"",C=$?"opacity:0.4; cursor:not-allowed; pointer-events:none;":"";p+=`
        <div class="weapon-pick-item ${n.weapon.name===u.name?"selected":""}" role="button" tabindex="0" style="${C}" onclick="${$?"":`selectShootWeapon(${v})`}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${$?"":`selectShootWeapon(${v})`}}">
          <span class="weapon-pick-name">${u.name}${b}</span>
          <span class="weapon-pick-stats">A: ${u.attacks} | BS: ${g} | D: ${u.normalDamage}/${u.criticalDamage}${k}${w}</span>
        </div>
      `}),p+="</div>";const m=d?"":'<p style="color:var(--text-muted); font-size:0.75rem; margin-bottom:8px;">💡 标注<span style="color:var(--red);">[需先冲刺]</span>的武器为重武器，仅在执行冲刺 (Dash) 后可使用。</p>';t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要射击使用的武器：</p>
      ${m}
      ${p}
    `,i.textContent="回答判定问题",i.disabled=!1}else if(n.step===3){e.textContent="射击结算 - 步骤 3: 距离与掩体判定";const c=n.weapon,r=c.hasRule("Indirect Fire"),d=c.hasRule("Silent"),p=c.hasRule("Seek Light"),m=r?'<p style="color:#818cf8; font-size:0.75rem;">💡 <b>间接射击</b>：无需视线，射程判定跳过。</p>':d?'<p style="color:#818cf8; font-size:0.75rem;">💡 <b>寂静</b>：无射程限制。</p>':"",u=p?'<p style="color:#f59e0b; font-size:0.75rem;">💡 <b>寻光</b>：目标即使在掩体中也无法获得掩体加成。</p>':"";t.innerHTML=`
      <p style="margin-bottom: 12px; color:var(--text-muted);">回答以下判定问题以完成结算：</p>
      ${m}
      ${u}

      <div class="qa-card">
        <div class="qa-question">1. 目标是否在你的有效视线和射程内？${r||d?' <span style="color:#818cf8;">(自动判定为是)</span>':""}</div>
        <div class="qa-options">
          <button class="qa-btn ${n.inRangeAndVisible?"selected":""}" onclick="setQA('inRangeAndVisible', true)" ${r||d?'style="pointer-events:none; opacity:0.6;"':""}>是 (在射程内)</button>
          <button class="qa-btn ${n.inRangeAndVisible?"":"selected"}" onclick="setQA('inRangeAndVisible', false)" ${r||d?'style="pointer-events:none; opacity:0.6;"':""}>否 (无法见/超射程)</button>
        </div>
      </div>

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">2. 目标是否处于【隐蔽】状态，且紧贴重掩体？</div>
        <div class="qa-options">
          <button class="qa-btn ${n.inCoverConcealed?"selected":""}" onclick="setQA('inCoverConcealed', true)">是 (无法射击)</button>
          <button class="qa-btn ${n.inCoverConcealed?"":"selected"}" onclick="setQA('inCoverConcealed', false)">否 (可以选定)</button>
        </div>
      </div>

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">3. 目标是否在掩体中 (Cover)？${p?' <span style="color:#f59e0b;">(寻光忽略掩体)</span>':""}</div>
        <div class="qa-options">
          <button class="qa-btn ${n.inCover?"selected":""}" onclick="setQA('inCover', true)" ${p?'style="pointer-events:none; opacity:0.6;"':""}>是 (触发掩体成功保留)</button>
          <button class="qa-btn ${n.inCover?"":"selected"}" onclick="setQA('inCover', false)" ${p?'style="pointer-events:none; opacity:0.6;"':""}>否 (开阔地带)</button>
        </div>
      </div>
    `,(r||d)&&(n.inRangeAndVisible=!0),p&&(n.inCover=!1),i.textContent="选择掷骰模式",i.disabled=!1}else if(n.step===4){e.textContent="射击结算 - 步骤 4: 攻击方掷骰 (Angels of Death)";let c="";const r=n.attacker.faction==="Space Marine"?o.smCp:o.pmCp;if(n.attackRolls.length>0){const m=n.weapon.ts+(n.attacker.isInjured?1:0),u=n.attacker.isInjured?' <span style="color:var(--red); font-size:0.75rem;">(重伤+1)</span>':"",v=n.weapon.hasRule&&n.weapon.hasRule("Brutal"),g=n.attackRolls.filter(w=>w<m&&w!==6).length,k=v&&g>0&&!n.brutalUsed?`<br><button class="qa-btn" onclick="brutalReroll()" style="margin-top:6px; font-size:0.8rem; padding:6px 12px; background:linear-gradient(135deg, #b91c1c, #7f1d1d); border-color:#dc2626;">🔥 残暴重投 (Brutal): 重投 ${g} 个失败骰</button>`:v&&n.brutalUsed?'<br><span style="color:var(--text-muted); font-size:0.75rem;">🔥 残暴重投已使用</span>':"";c=`
        <div class="roll-summary-block" style="margin-top:10px;">
          🎯 <b>命中统计:</b> 暴击(6点): <span style="color:var(--sm-accent); font-weight:bold;">${n.attackCrit}</span>, 普通命中(${m}+${u}): <span style="color:#6a9ad4;">${n.attackNorm}</span>
          ${r>=1&&n.attRerollIndex===-1?'<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上方任何一个未命中的灰色骰子重投。</span>':""}
          ${k}
        </div>
      `}const d=n.weapon.ts+(n.attacker.isInjured?1:0),p=n.attacker.isInjured?` <span style="color:var(--red); font-size:0.75rem;">(重伤+1 → ${d}+)</span>`:"";t.innerHTML=`
      ${he()}

      <p style="margin-bottom: 12px;">武器 [${n.weapon.name}]，攻击骰数: <b>${n.weapon.attacks}</b>，命中要求: <b>${d}+</b>${p}</p>

      <div class="qa-options" style="margin-bottom: 16px;">
        <button class="qa-btn ${n.mode==="random"?"selected":""}" onclick="setRollMode('random')">动画/数字掷骰 (Mode B)</button>
        <button class="qa-btn ${n.mode==="manual"?"selected":""}" onclick="setRollMode('manual')">物理骰子录入 (Mode A)</button>
      </div>

      <div class="dice-rolling-area" id="attack-rolling-zone">
        <div class="dice-pool-view" id="attack-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        ${n.attackRolls.length===0?'<button class="modal-btn primary" id="btn-roll-attack" onclick="rollAttackDice()">开始顺序掷骰</button>':""}
      </div>

      ${c}

      <div id="manual-attack-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${n.weapon.attacks} 个骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-att-dice-val" value="6, 4, 3, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
      </div>
    `,n.attackRolls.length>0?(i.disabled=!1,on()):n.mode==="manual"?i.disabled=!1:i.disabled=!0,i.textContent="防守方投骰"}else if(n.step===5){e.textContent="射击结算 - 步骤 5: 防守方防御掷骰 (Plague Marines)";let c="",r=n.defender.df;n.inCover&&(c=`<p style="color:var(--pm-accent); margin-bottom: 4px;">🛡️ 目标在掩体中：自动获得 1 个普通成功，且防御投骰池减 1 (DF = ${r} -> ${r-1})</p>`,r=Math.max(0,r-1));const d=n.weapon.rules.find(v=>v.startsWith("Shock"));let p=0;if(d){const v=parseInt(((a=d.match(/\d+/))==null?void 0:a[0])||"1"),g=n.attackCrit+n.attackNorm;p=v*g;const k=r;r=Math.max(0,r-p),c+=`<p style="color:#f97316; margin-bottom: 4px;">⚡ <b>冲击 (Shock ${v})</b>：${g} 次命中 × ${v} = DF 池减少 ${p} (DF = ${k} -> ${r})</p>`}let m="";const u=n.defender.faction==="Space Marine"?o.smCp:o.pmCp;n.defenseRolls.length>0&&r>0&&(m=`
        <div class="roll-summary-block" style="margin-top:10px;">
          🛡️ <b>防守统计:</b> 暴击防守: <span style="color:var(--pm-accent); font-weight:bold;">${n.defCrit}</span>, 普通防守(${n.defender.sv}+): <span style="color:#b0d4ba;">${n.defNorm}</span>
          ${u>=1&&n.defRerollIndex===-1?'<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上面任何一个未命中的灰色骰子重投。</span>':""}
        </div>
      `),t.innerHTML=`
      ${he()}

      <p style="margin-bottom: 6px;">防守特工: [${n.defender.name}]，保护要求: <b>${n.defender.sv}+</b></p>
      ${c}
      <p style="margin-bottom: 12px;">需要投掷的防御骰数: <b>${r}</b></p>

      <div class="dice-rolling-area" id="defense-rolling-zone">
        <div class="dice-pool-view" id="defense-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        ${n.defenseRolls.length===0?`<button class="modal-btn primary" id="btn-roll-defense" onclick="rollDefenseDice(${r})">开始顺序防守投骰</button>`:""}
      </div>

      ${m}

      <div id="manual-defense-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${r} 个防御骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-def-dice-val" value="5, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
      </div>
    `,n.defenseRolls.length>0||r===0?(i.disabled=!1,cn()):n.mode==="manual"?i.disabled=!1:i.disabled=!0,i.textContent="计算伤害与对消"}else if(n.step===6){e.textContent="射击结算 - 步骤 6: 匹配对消与最终扣血";let c=n.attackCrit,r=n.attackNorm,d=n.defCrit,p=n.defNorm;const m=n.weapon.hasRule&&n.weapon.hasRule("Saturate");let u=0;m&&c>0&&(u=c,x.addLog(`[饱和] ${u} 个暴击命中无法被防御骰抵消，直接穿透！`),c=0);const v=n.weapon.rules.find(T=>T.startsWith("Piercing Crits"));if(v&&n.attackCrit>0){const T=parseInt(((l=v.match(/\d+/))==null?void 0:l[0])||"1");x.addLog(`[穿透暴击 ${T}] 暴击命中时，防御骰 SV 判定 -${T}。`);const G=Math.min(n.attackCrit*T,p);G>0&&(p-=G,x.addLog(`  → 穿透效果抵消了 ${G} 个普通防御成功。`))}const g=Math.min(c,d);c-=g,d-=g;let k=0;c>0&&p>=2&&(k=Math.min(c,Math.floor(p/2)),c-=k,p-=k*2);const w=Math.min(r,p);r-=w,p-=w;const y=Math.min(r,d);r-=y,d-=y;let $=n.weapon.normalDamage,b=n.weapon.criticalDamage;const C=n.weapon.hasRule&&n.weapon.hasRule("Toxic");C&&n.defender.poisonTokens>0&&($+=1,b+=1,x.addLog(`[剧毒] 目标携带毒素标记，${n.weapon.name} 伤害 +1 (${$}/${b})`)),n.weapon.hasRule&&n.weapon.hasRule("Severe")&&(b+=1,x.addLog(`[严重] ${n.weapon.name} 暴击伤害 +1 (${b})`));const D=[];for(let T=0;T<u+c;T++)D.push(b);for(let T=0;T<r;T++)D.push($);const P=D.reduce((T,G)=>T+G,0),B=D.filter(T=>T>=3).length;let A=`
      <div class="matching-view">
        <div class="matching-row">
          <span class="matching-label">攻击命中</span>
          <div class="matching-dice-list">
    `;const U=n.weapon.ts+(n.attacker.isInjured?1:0);for(let T=0;T<n.attackCrit;T++)A+='<div class="kt-dice-cube sm-dice crit-dice">6</div>';for(let T=0;T<n.attackNorm;T++)A+=`<div class="kt-dice-cube sm-dice">${U}</div>`;n.attackCrit+n.attackNorm===0&&(A+='<span style="font-size:0.8rem; color:var(--text-muted);">无命中</span>'),A+=`
          </div>
        </div>
        <div class="matching-row">
          <span class="matching-label">防御保护</span>
          <div class="matching-dice-list">
    `;for(let T=0;T<n.defCrit;T++)A+='<div class="kt-dice-cube pm-dice crit-dice">6</div>';for(let T=0;T<n.defNorm;T++)A+=`<div class="kt-dice-cube pm-dice">${n.defender.sv}</div>`;n.defCrit+n.defNorm===0&&(A+='<span style="font-size:0.8rem; color:var(--text-muted);">无防御成功</span>'),A+=`
          </div>
        </div>
      </div>
    `;let R="";n.defender.faction==="Plague Marine"&&B>0&&(R=`
        <div id="manual-dr-container" style="background:var(--dark-card); padding:10px; border-radius:8px; margin-top:8px; border:1px solid var(--panel-border);">
          <label style="font-size:0.75rem; color:var(--text-muted);">录入瘟疫守卫【恶心作呕】的 ${B} 个投骰点数 (每次≥3伤害的攻击各投一次, 为空则按随机)：</label>
          <input type="text" id="manual-dr-dice-val" placeholder="例: 4,2,5" style="margin-top:4px; padding:6px; font-size:0.9rem; background:#000; border:1px solid #334155; color:#fff; width:100%;">
        </div>
      `),t.innerHTML=`
      ${he()}

      ${A}

      <div class="qa-card" style="margin-top:10px;">
        <p style="font-size:0.95rem; font-weight:600; color:#fff;">最终对消计算汇报：</p>
        <p style="margin-top:4px;">- 暴击命中残留: <b>${c}</b> 个 (每个伤害: ${b}${C&&n.defender.poisonTokens>0?' <span style="color:#a78bfa;">[剧毒+1]</span>':""})</p>
        <p>- 普通命中残留: <b>${r}</b> 个 (每个伤害: ${$}${C&&n.defender.poisonTokens>0?' <span style="color:#a78bfa;">[剧毒+1]</span>':""})</p>
        <p style="color:var(--sm-accent); font-weight:bold; margin-top:8px; font-size:1rem;">分配伤害总计: ${P} 点</p>
      </div>

      ${R}
    `,i.textContent="完成结算并扣血",i.disabled=!1,i.onclick=()=>un(D),P>0&&setTimeout(()=>{x.triggerAvatarHitEffect(n.defender.id,"shoot")},150)}}function Zt(e){f("click"),n.defender=o.operatives.find(t=>t.id===e),V()}function en(e){f("click"),n.weapon=n.attacker.weapons.filter(t=>t.isRanged)[e],V()}function tn(e,t){f("click"),n[e]=t,V()}function nn(e){f("click"),n.mode=e,V(),e==="manual"?(document.getElementById("manual-attack-input").style.display="block",document.getElementById("attack-rolling-zone").style.display="none",document.getElementById("modal-btn-next").disabled=!1):(document.getElementById("manual-attack-input").style.display="none",document.getElementById("attack-rolling-zone").style.display="flex",document.getElementById("modal-btn-next").disabled=n.attackRolls.length===0)}function an(){const e=document.getElementById("modal-btn-next"),t=document.getElementById("attack-dice-pool"),i=document.getElementById("btn-roll-attack");if(n.attackRolls.length>0)return;i.disabled=!0,e.disabled=!0;const s=n.attacker.faction==="Space Marine"?"sm-dice":"pm-dice";t.innerHTML="";const a=n.weapon.attacks;j=!1,F=[];for(let p=0;p<a;p++){const m=document.createElement("div");m.className=`kt-dice-cube ${s} rolling`,m.textContent="?",t.appendChild(m)}const l=document.createElement("button");l.className="modal-btn",l.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",l.textContent="跳过动画 (Skip)",l.onclick=()=>{j=!0,F.forEach(u=>clearTimeout(u)),F=[];const p=t.getElementsByClassName("kt-dice-cube"),m=n.weapon.ts+(n.attacker.isInjured?1:0);for(let u=r;u<a;u++){const v=Math.floor(Math.random()*6)+1;c.push(v);const g=p[u];g&&(g.classList.remove("rolling"),g.textContent=v,v===6?g.classList.add("crit-dice"):v<m&&g.classList.add("fail-dice"))}n.attackRolls=c,le(),V()},t.parentElement.appendChild(l),x.triggerCombatVisual("🔥 OPEN FIRE!","shoot"),f("shoot");const c=[];let r=0;function d(){if(!j)if(r<a){const p=Math.floor(Math.random()*6)+1;c.push(p);const u=t.getElementsByClassName("kt-dice-cube")[r];u.classList.remove("rolling"),u.textContent=p;const v=n.weapon.ts+(n.attacker.isInjured?1:0);p===6?(u.classList.add("crit-dice"),f("crit")):(p<v&&u.classList.add("fail-dice"),f("click")),r++,J(d,400)}else{n.attackRolls=c,le(),l.remove();const p=n.attackCrit+n.attackNorm;p===0?(f("epic_fail"),x.triggerCombatVisual("❌ ALL MISSED!","normal")):(p===a||n.attackCrit>=2)&&(f("epic_win"),x.triggerCombatVisual("✨ EPIC SHOTS!","shoot")),V()}}J(d,1200)}function on(){const e=document.getElementById("attack-dice-pool");if(!e)return;e.innerHTML="";const t=n.attacker.faction,i=t==="Space Marine"?o.smCp:o.pmCp,s=t==="Space Marine"?"sm-dice":"pm-dice",a=n.weapon.ts+(n.attacker.isInjured?1:0);n.attackRolls.forEach((l,c)=>{const r=document.createElement("div");let d=`kt-dice-cube ${s}`;if(l===6?d+=" crit-dice":l<a&&(d+=" fail-dice"),r.className=d,r.textContent=l,l<a&&i>=1&&n.attRerollIndex===-1){const m=document.createElement("div");m.className="reroll-indicator",m.textContent="R",r.appendChild(m),r.onclick=()=>sn(c),r.style.cursor="pointer"}else if(c===n.attRerollIndex){const m=document.createElement("div");m.className="reroll-indicator",m.style.background="var(--green)",m.textContent="✓",r.appendChild(m)}e.appendChild(r)})}function sn(e){f("shoot"),n.attacker.faction==="Space Marine"?o.smCp-=1:o.pmCp-=1,x.updateScoresUI(),n.attRerollIndex=e;const s=document.getElementById("attack-dice-pool").getElementsByClassName("kt-dice-cube")[e],a=n.attacker.faction==="Space Marine"?"sm-dice":"pm-dice";s.className=`kt-dice-cube ${a} rolling`,s.innerHTML="?",setTimeout(()=>{const l=Math.floor(Math.random()*6)+1;x.addLog(`  - [重投] 攻击方消耗 1 CP重投 D6: [${n.attackRolls[e]}] -> [${l}]`),n.attackRolls[e]=l,le(),V()},500)}function ln(){if(n.brutalUsed)return;f("shoot");const e=n.weapon.ts+(n.attacker.isInjured?1:0),t=[...n.attackRolls],i=[];n.attackRolls.forEach((s,a)=>{s<e&&s!==6&&i.push(a)}),i.length!==0&&(i.forEach(s=>{n.attackRolls[s]=Math.floor(Math.random()*6)+1}),n.brutalUsed=!0,x.addLog(`[残暴重投] ${n.weapon.name} 重投 ${i.length} 个失败骰子！`),x.addLog(`  旧结果: [${t.join(", ")}] → 新结果: [${n.attackRolls.join(", ")}]`),le(),V())}function le(){let e=0,t=0;const i=n.attacker,s=i&&i.isInjured?1:0,a=n.weapon.ts+s;n.attackRolls.forEach(l=>{l===6?e++:l>=a&&t++}),n.attackCrit=e,n.attackNorm=t}function rn(e){const t=document.getElementById("modal-btn-next"),i=document.getElementById("defense-dice-pool"),s=document.getElementById("btn-roll-defense");if(n.defenseRolls.length>0)return;if(e===0){n.defCrit=0,n.defNorm=n.inCover?1:0,t.disabled=!1;return}s.disabled=!0,t.disabled=!0;const a=n.defender.faction==="Space Marine"?"sm-dice":"pm-dice";i.innerHTML="",j=!1,F=[];for(let p=0;p<e;p++){const m=document.createElement("div");m.className=`kt-dice-cube ${a} rolling`,m.textContent="?",i.appendChild(m)}const l=document.createElement("button");l.className="modal-btn",l.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",l.textContent="跳过动画 (Skip)",l.onclick=()=>{j=!0,F.forEach(m=>clearTimeout(m)),F=[];const p=i.getElementsByClassName("kt-dice-cube");for(let m=r;m<e;m++){const u=Math.floor(Math.random()*6)+1;c.push(u);const v=p[m];v&&(v.classList.remove("rolling"),v.textContent=u,u===6?v.classList.add("crit-dice"):u<n.defender.sv&&v.classList.add("fail-dice"))}n.defenseRolls=c,me(),V()},i.parentElement.appendChild(l),x.triggerCombatVisual("🛡️ INCOMING FIRE!","parry"),f("shoot");const c=[];let r=0;function d(){if(!j)if(r<e){const p=Math.floor(Math.random()*6)+1;c.push(p);const u=i.getElementsByClassName("kt-dice-cube")[r];u.classList.remove("rolling"),u.textContent=p,p===6?(u.classList.add("crit-dice"),f("crit")):(p<n.defender.sv&&u.classList.add("fail-dice"),f("click")),r++,J(d,400)}else{n.defenseRolls=c,me(),l.remove();const p=n.defender.sv,m=c.filter(v=>v>=p).length,u=c.filter(v=>v===6).length;m===0?(f("epic_fail"),x.triggerCombatVisual("💀 DEFENSE BUSTED!","normal")):(m===e||u>=2)&&(f("epic_win"),x.triggerCombatVisual("🛡️ SHIELD CLUTCH!","deflect")),V()}}J(d,1200)}function cn(e){const t=document.getElementById("defense-dice-pool");if(!t)return;t.innerHTML="";const i=n.defender.faction,s=i==="Space Marine"?o.smCp:o.pmCp,a=i==="Space Marine"?"sm-dice":"pm-dice";n.defenseRolls.forEach((l,c)=>{const r=document.createElement("div");let d=`kt-dice-cube ${a}`;if(l===6?d+=" crit-dice":l<n.defender.sv&&(d+=" fail-dice"),r.className=d,r.textContent=l,l<n.defender.sv&&s>=1&&n.defRerollIndex===-1){const m=document.createElement("div");m.className="reroll-indicator",m.textContent="R",r.appendChild(m),r.onclick=()=>dn(c),r.style.cursor="pointer"}else if(c===n.defRerollIndex){const m=document.createElement("div");m.className="reroll-indicator",m.style.background="var(--green)",m.textContent="✓",r.appendChild(m)}t.appendChild(r)})}function dn(e,t){f("save"),n.defender.faction==="Space Marine"?o.smCp-=1:o.pmCp-=1,x.updateScoresUI(),n.defRerollIndex=e;const a=document.getElementById("defense-dice-pool").getElementsByClassName("kt-dice-cube")[e],l=n.defender.faction==="Space Marine"?"sm-dice":"pm-dice";a.className=`kt-dice-cube ${l} rolling`,a.innerHTML="?",setTimeout(()=>{const c=Math.floor(Math.random()*6)+1;x.addLog(`  - [重投] 防御方消耗 1 CP重投 D6: [${n.defenseRolls[e]}] -> [${c}]`),n.defenseRolls[e]=c,me(),V()},500)}function me(){let e=0,t=n.inCover?1:0;const i=n.defender.sv;n.defenseRolls.forEach(s=>{s===6?e++:s>=i&&t++}),n.defCrit=e,n.defNorm=t}function pn(){const e=document.getElementById("manual-att-dice-val");if(!e)return;const i=e.value.split(",").map(s=>parseInt(s.trim(),10)).filter(s=>!isNaN(s)&&s>=1&&s<=6);n.attackRolls=i,le()}function mn(){const e=document.getElementById("manual-def-dice-val");if(!e)return;const i=e.value.split(",").map(s=>parseInt(s.trim(),10)).filter(s=>!isNaN(s)&&s>=1&&s<=6);n.defenseRolls=i,me()}function un(e){var p;f("click");const t=n.attacker,i=n.defender;let s=null;const a=document.getElementById("manual-dr-dice-val");a&&a.value.trim()!==""&&(s=a.value.split(",").map(m=>parseInt(m.trim(),10)).filter(m=>!isNaN(m)&&m>=1&&m<=6)),x.addLog(`
--- 射击对决结果 ---`),x.addLog(`[攻击方] ${t.name} 使用 ${n.weapon.name} 射击`),x.addLog(`[防守方] ${i.name}`);const l=i.applyWounds(e,s);n.weapon.hasRule&&n.weapon.hasRule("Poison")&&l>0&&i.poisonTokens<1&&(i.poisonTokens=1,x.addLog(`[毒素] ${i.name} 获得了 1 个毒素标记！下次激活开始时将受到 1 点伤害。`));const r=n.weapon.rules.find(m=>m.startsWith("Stun"));if(r&&l>0){const m=parseInt(((p=r.match(/\d+/))==null?void 0:p[0])||"1"),u=i.apl;i.apl=Math.max(0,i.apl-m),x.addLog(`[震慑] ${i.name} 被震慑！APL: ${u} → ${i.apl} (-${m})`)}if(n.weapon.hasRule&&n.weapon.hasRule("PSYCHIC")){const m=n.attackRolls.filter(u=>u===1).length;m>0&&(x.addLog(`[灵能反噬] ${n.weapon.name} 引发危险！投出 ${m} 个 1，攻击方受到 ${m} 点伤害。`),t.applyWounds(m))}t.apl-=1,t.actionsPerformed.push("Shoot"),x.addLog(`[行动点] ${t.name} 消耗 1 APL，当前 APL: ${t.apl}`),ge(),l>0&&setTimeout(()=>{x.triggerAvatarHitEffect(i.id,"shoot")},100)}function Ze(){f("click");const e=o.activeAgent;if(!e)return;const t=document.querySelector("#combat-modal .modal-content");t&&(t.style.backgroundImage='linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("assets/images/backgrounds/bg_melee_action.png")',t.style.backgroundSize="cover",t.style.backgroundPosition="center"),Object.assign(n,{actionType:"fight",step:1,attacker:e,defender:null,weapon:e.weapons.filter(i=>!i.isRanged)[0]||null,inMeleeRange:!0,hasFallenBack:!1,mode:"random",activeAttackerDice:[],activeDefenderDice:[],meleeTurn:"attacker",meleeLogs:""}),n.weapon&&(Je(),Q())}function fn(e){f("click"),n.defender=o.operatives.find(t=>t.id===e),Q()}function gn(e){f("click"),n.weapon=n.attacker.weapons.filter(t=>!t.isRanged)[e],Q()}function Q(){const e=document.getElementById("modal-title"),t=document.getElementById("modal-body"),i=document.getElementById("modal-btn-next"),s=document.getElementById("modal-btn-cancel");if(i.onclick=Ce,s.style.display="inline-block",n.step===1){e.textContent="近战结算 - 步骤 1: 选择目标";const a=n.attacker.faction==="Space Marine"?"Plague Marine":"Space Marine",l=o.operatives.filter(d=>d.faction===a&&!d.isDead),c=l.filter(d=>!d.hasConceal);if(l.length>0&&c.length===0){t.innerHTML='<p style="color:var(--red);">所有敌方特工均处于隐蔽状态，无法被指定为近战目标。</p>',i.disabled=!0;return}if(c.length===0){t.innerHTML='<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>',i.disabled=!0;return}let r='<div class="weapon-picker-list">';c.forEach(d=>{const p=d.isInjured?' <span style="color:var(--red); font-size:0.7rem;">[重伤]</span>':"",m=d.poisonTokens>0?' <span style="color:#7ab88a; font-size:0.7rem;">[毒素]</span>':"";r+=`
        <div class="weapon-pick-item ${n.defender&&n.defender.id===d.id?"selected":""}" role="button" tabindex="0" onclick="selectFightDefender('${d.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightDefender('${d.id}')}">
          <span class="weapon-pick-name">${d.name}${p}${m}</span>
          <span class="weapon-pick-stats">HP: ${d.wounds}/${d.maxWounds} | DF:${d.df}</span>
        </div>
      `}),r+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要交战的敌方特工 (必须在交战距离内)：</p>
      ${r}
    `,i.textContent="判定近战条件",i.disabled=!n.defender}else if(n.step===2){e.textContent="近战结算 - 步骤 2: 选择近战武器";const a=n.attacker.weapons.filter(r=>!r.isRanged),l=n.attacker.isInjured;let c='<div class="weapon-picker-list">';a.forEach((r,d)=>{const p=l?`${r.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${r.ts+1}+</span>`:`${r.ts}+`,m=r.rules&&r.rules.length>0?` | ${r.rules.map(xe).join(", ")}`:"";c+=`
        <div class="weapon-pick-item ${n.weapon.name===r.name?"selected":""}" role="button" tabindex="0" onclick="selectFightWeapon(${d})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightWeapon(${d})}">
          <span class="weapon-pick-name">${r.name}</span>
          <span class="weapon-pick-stats">A: ${r.attacks} | WS: ${p} | D: ${r.normalDamage}/${r.criticalDamage}${m}</span>
        </div>
      `}),c+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要使用的近战武器：</p>
      ${c}
    `,i.textContent="判定交战距离与退却",i.disabled=!1}else if(n.step===3)e.textContent="近战结算 - 步骤 3: 距离与退却判定",t.innerHTML=`
      <p style="margin-bottom: 12px; color:var(--text-muted);">回答以下判定问题以完成结算：</p>

      <div class="qa-card">
        <div class="qa-question">1. 目标是否在你的交战距离内（即 1 英寸 / 1🔺 范围内）？</div>
        <div class="qa-options">
          <button class="qa-btn ${n.inMeleeRange?"selected":""}" onclick="setQA('inMeleeRange', true)">是 (在交战距离内)</button>
          <button class="qa-btn ${n.inMeleeRange?"":"selected"}" onclick="setQA('inMeleeRange', false)">否 (交战距离不足，无法近战)</button>
        </div>
      </div>

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">2. 本回合该特工是否执行过【退却 (Fall Back)】动作？</div>
        <div class="qa-options">
          <button class="qa-btn ${n.hasFallenBack?"":"selected"}" onclick="setQA('hasFallenBack', false)">否 (允许近战)</button>
          <button class="qa-btn ${n.hasFallenBack?"selected":""}" onclick="setQA('hasFallenBack', true)">是 (已退却，无法近战)</button>
        </div>
      </div>
    `,i.textContent="双方近战掷骰",i.disabled=!1;else if(n.step===4)e.textContent="近战结算 - 步骤 4: 双方近战掷骰",t.innerHTML=`
      <div class="melee-grid" style="margin-bottom: 16px;">
        <div class="melee-pool-card">
          <div class="melee-pool-title">攻击方 (${n.attacker.name})</div>
          <div class="melee-dice-pool" id="melee-att-pool">
            <span style="color:var(--text-muted); font-size:0.8rem;">等待投骰...</span>
          </div>
        </div>

        <div class="melee-pool-card">
          <div class="melee-pool-title">防守方 (${n.defender.name})</div>
          <div class="melee-dice-pool" id="melee-def-pool">
            <span style="color:var(--text-muted); font-size:0.8rem;">等待投骰...</span>
          </div>
        </div>
      </div>

      <button class="btn-large" id="btn-roll-melee" onclick="rollMeleeDice()">开始掷骰</button>
    `,n.activeAttackerDice.length>0||n.activeDefenderDice.length>0?(i.disabled=!1,hn()):i.disabled=!0,i.textContent="进入伤害/格挡分配";else if(n.step===5){e.textContent="近战结算 - 步骤 5: 伤害与格挡交替分配";const a=n.attacker.wounds>0,l=n.defender.wounds>0,c=n.activeAttackerDice.some(y=>!y.used),r=n.activeDefenderDice.some(y=>!y.used);if(!a||!l||!c&&!r){let y="";!a&&!l?y="双方同归于尽！":a?l?y="双方所有成功骰已分配完毕。":y=`防守方 [${n.defender.name}] 已阵亡！`:y=`攻击方 [${n.attacker.name}] 已阵亡！`,t.innerHTML=`
        <!-- 双方状态卡 -->
        ${Oe()}

        <div class="qa-card" style="text-align: center; margin-top: 16px;">
          <h4 style="color: var(--sm-accent); margin-bottom: 8px;">战斗结束</h4>
          <p>${y}</p>
        </div>

        <div class="melee-interactive-log" id="melee-int-log" style="margin-top:12px; height: 100px;">
          ${n.meleeLogs}
        </div>
      `,i.textContent="完成近战结算",i.disabled=!1,i.onclick=kn,s.style.display="none";return}const d=n.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",p=n.defender.faction==="Space Marine"?"sm-dice":"pm-dice";let m="";n.activeAttackerDice.forEach((y,$)=>{let b=`melee-dice-btn ${d}`;y.isCrit&&(b+=" crit"),y.used&&(b+=" used");const E=n.selectedMeleeDice&&n.selectedMeleeDice.side==="attacker"&&n.selectedMeleeDice.idx===$?"outline: 3px solid #6a9ad4; transform: scale(1.15); box-shadow: 0 0 15px rgba(96,165,250,0.8); z-index: 2;":"";m+=`<button class="${b}" style="${E}" onclick="chooseMeleeDice('attacker', ${$})">${y.val}</button>`}),n.activeAttackerDice.length===0&&(m='<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>');let u="";n.activeDefenderDice.forEach((y,$)=>{let b=`melee-dice-btn ${p}`;y.isCrit&&(b+=" crit"),y.used&&(b+=" used");const E=n.selectedMeleeDice&&n.selectedMeleeDice.side==="defender"&&n.selectedMeleeDice.idx===$?"outline: 3px solid var(--pm-accent); transform: scale(1.15); box-shadow: 0 0 15px rgba(74,124,89,0.8); z-index: 2;":"";u+=`<button class="${b}" style="${E}" onclick="chooseMeleeDice('defender', ${$})">${y.val}</button>`}),n.activeDefenderDice.length===0&&(u='<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>');const v=n.meleeTurn==="attacker"?"攻击方":"防守方",g=n.meleeTurn==="attacker"?"#6a9ad4":"var(--pm-accent)";let k="";if(n.selectedMeleeDice){const{side:y,idx:$}=n.selectedMeleeDice,C=(y==="attacker"?n.activeAttackerDice:n.activeDefenderDice)[$];let E;y==="attacker"?E=n.weapon:E=n.defender.weapons.filter(A=>!A.isRanged)[0]||new M("重拳 (Fists)",4,3,3,4,!1,null,[]);const D=C.isCrit?E.criticalDamage:E.normalDamage,B=(y==="attacker"?n.activeDefenderDice:n.activeAttackerDice).some(A=>!A.used);k=`
        <div class="melee-choice-card" style="position:relative; background: linear-gradient(180deg, #2a2d35, #1e2128); border: 2px solid ${g}; border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: center; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
          <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: #fff;">
            🎯 已选中点数 <span style="display:inline-block; padding: 2px 8px; border-radius: 4px; background: ${y==="attacker"?"rgba(74,106,154,0.3)":"rgba(74,124,89,0.3)"}; color: ${y==="attacker"?"#6a9ad4":"var(--pm-accent)"}; font-weight: 900; font-family:'Pirata One',serif;">${C.val}${C.isCrit?" (⚡暴击)":""}</span>，请选择分配动作：
          </div>

          <div style="display: flex; gap: 16px; justify-content: center;">
            <button onclick="resolveMeleeChoice('strike')" class="melee-action-btn strike-btn" style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, var(--red), #5a2020); border: 2px solid #b84c4c; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(184, 76, 76, 0.3); transition: all 0.2s ease;">
              ⚔️ 打击 (STRIKE)<br>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.9;">造成 ${D} 点伤害</span>
            </button>

            <button onclick="resolveMeleeChoice('parry')" class="melee-action-btn parry-btn" ${B?"":'disabled style="opacity: 0.4; cursor: not-allowed;"'} style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, #4a6a9a, #3a5580); border: 2px solid #6a9ad4; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(74, 106, 154, 0.3); transition: all 0.2s ease;">
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
      ${Oe()}

      <p style="margin-bottom: 10px; font-weight: bold; text-align: center; color: ${g}; font-size: 1.05rem;">
        👉 当前轮到：【${v}】分配骰子
      </p>

      ${k}

      <div class="melee-grid" style="margin-bottom: 16px;">
        <div class="melee-pool-card">
          <div class="melee-pool-title" style="display:flex; justify-content:space-between;">
            <span>攻击方成功骰</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">HP: ${n.attacker.wounds}</span>
          </div>
          <div class="melee-dice-pool">
            ${m}
          </div>
        </div>

        <div class="melee-pool-card">
          <div class="melee-pool-title" style="display:flex; justify-content:space-between;">
            <span>防守方成功骰</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">HP: ${n.defender.wounds}</span>
          </div>
          <div class="melee-dice-pool">
            ${u}
          </div>
        </div>
      </div>

      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 6px;">
        💡 <b>分配指南:</b> 点击你的高亮骰子，若对方有剩余成功骰，可选择格挡(Parry)消去对方一个未使用的成功骰，或选择打击(Strike)对敌方特工造成伤害。
      </div>

      <div class="melee-interactive-log" id="melee-int-log">
        <!-- 滚动记录 -->
      </div>
    `;const w=document.getElementById("melee-int-log");w&&(w.innerHTML=n.meleeLogs,w.scrollTop=w.scrollHeight),i.textContent="交替进行中...",i.disabled=!0}}function vn(){const e=document.getElementById("modal-btn-next"),t=document.getElementById("melee-att-pool"),i=document.getElementById("melee-def-pool"),s=document.getElementById("btn-roll-melee");s.disabled=!0,e.disabled=!0;const a=n.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",l=n.defender.faction==="Space Marine"?"sm-dice":"pm-dice";t.innerHTML="",j=!1,F=[];const c=n.weapon.attacks;for(let b=0;b<c;b++){const C=document.createElement("div");C.className=`kt-dice-cube ${a} rolling`,C.textContent="?",t.appendChild(C)}const r=n.defender.weapons.filter(b=>!b.isRanged)[0]||new M("重拳 (Fists)",3,3,3,4,!1),d=r.attacks;i.innerHTML="";for(let b=0;b<d;b++){const C=document.createElement("div");C.className=`kt-dice-cube ${l} rolling`,C.textContent="?",i.appendChild(C)}const p=document.createElement("button");p.className="modal-btn",p.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",p.textContent="跳过动画 (Skip)",p.onclick=()=>{j=!0,F.forEach(P=>clearTimeout(P)),F=[];const b=t.getElementsByClassName("kt-dice-cube"),C=n.weapon.ts+(n.attacker.isInjured?1:0),E=r.ts+(n.defender.isInjured?1:0);for(let P=g;P<c;P++){const B=Math.floor(Math.random()*6)+1;u.push(B);const A=b[P];A&&(A.classList.remove("rolling"),A.textContent=B,B===6?A.classList.add("crit-dice"):B<C&&A.classList.add("fail-dice"))}const D=i.getElementsByClassName("kt-dice-cube");for(let P=k;P<d;P++){const B=Math.floor(Math.random()*6)+1;v.push(B);const A=D[P];A&&(A.classList.remove("rolling"),A.textContent=B,B===6?A.classList.add("crit-dice"):B<E&&A.classList.add("fail-dice"))}$()};const m=document.getElementById("modal-body");m&&m.appendChild(p),x.triggerCombatVisual("⚔️ MELEE CLASH!","shoot"),f("shoot");const u=[],v=[];let g=0,k=0;function w(){if(!j)if(g<c){const b=Math.floor(Math.random()*6)+1;u.push(b);const E=t.getElementsByClassName("kt-dice-cube")[g];E.classList.remove("rolling"),E.textContent=b;const D=n.weapon.ts+(n.attacker.isInjured?1:0);b===6?(E.classList.add("crit-dice"),f("crit")):(b<D&&E.classList.add("fail-dice"),f("click")),g++,J(w,400)}else y()}function y(){if(!j)if(k<d){const b=Math.floor(Math.random()*6)+1;v.push(b);const E=i.getElementsByClassName("kt-dice-cube")[k];E.classList.remove("rolling"),E.textContent=b;const D=r.ts+(n.defender.isInjured?1:0);b===6?(E.classList.add("crit-dice"),f("crit")):(b<D&&E.classList.add("fail-dice"),f("click")),k++,J(y,400)}else $()}function $(){p.remove();const b=n.attacker&&n.attacker.isInjured?1:0,C=n.defender&&n.defender.isInjured?1:0,E=n.weapon.ts+b,D=r.ts+C;n.activeAttackerDice=u.filter(P=>P>=E||P===6).map(P=>({val:P,isCrit:P===6,used:!1})),n.activeDefenderDice=v.filter(P=>P>=D||P===6).map(P=>({val:P,isCrit:P===6,used:!1})),e.disabled=!1}J(w,1200)}function hn(){const e=document.getElementById("melee-att-pool"),t=document.getElementById("melee-def-pool");if(!e||!t)return;const i=n.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",s=n.defender.faction==="Space Marine"?"sm-dice":"pm-dice";if(e.innerHTML="",n.activeAttackerDice.forEach(a=>{let l=`kt-dice-cube ${i}`;a.isCrit&&(l+=" crit-dice");const c=document.createElement("div");c.className=l,c.textContent=a.val,e.appendChild(c)}),n.activeAttackerDice.length===0){const a=document.createElement("span");a.style.cssText="color:var(--text-muted);font-size:0.85rem;",a.textContent="全部未命中",e.appendChild(a)}if(t.innerHTML="",n.activeDefenderDice.forEach(a=>{let l=`kt-dice-cube ${s}`;a.isCrit&&(l+=" crit-dice");const c=document.createElement("div");c.className=l,c.textContent=a.val,t.appendChild(c)}),n.activeDefenderDice.length===0){const a=document.createElement("span");a.style.cssText="color:var(--text-muted);font-size:0.85rem;",a.textContent="全部未命中",t.appendChild(a)}}function ue(e,t){const i=o.customAvatars[e];let s=t==="Space Marine"?"./assets/images/defaults/default_sm_avatar.png":"./assets/images/defaults/default_pm_avatar.png";const a=o.operatives.find(r=>r.id===e);if(a&&a.defaultAvatar)s=a.defaultAvatar;else{const r=t==="Space Marine",d=e.replace(/^(sm_|pm_)/,"");s=`./assets/images/operatives/${r?"sm":"pm"}/${r?"sm":"pm"}_${d}.png`}const l=i||s,c=a?a.name:e;return`<div class="op-avatar-slot duel-avatar-${e}" style="width: 50px; height: 50px; cursor: default; position: relative;">
            <img src="${l}" class="op-avatar-img" alt="${c} 头像" loading="lazy" />
          </div>`}function Oe(){const e=n.attacker,t=n.defender,i=Math.max(0,e.wounds/e.maxWounds*100),s=Math.max(0,t.wounds/t.maxWounds*100);return`
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(26,29,36,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${ue(e.id,e.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:#6a9ad4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${e.name}">${e.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">攻击方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${i}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0,e.wounds)} / ${e.maxWounds} HP</div>
      </div>

      <!-- VS icon -->
      <div style="display:flex;align-items:center;gap:6px;padding:0 8px;">
        <div style="width:16px;height:1px;background:var(--imperial-gold);"></div>
        <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
        <span style="font-size:1rem;color:var(--text-muted);font-family:'Pirata One',serif;">VS</span>
        <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
        <div style="width:16px;height:1px;background:var(--imperial-gold);"></div>
      </div>

      <!-- Defender Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${ue(t.id,t.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${t.name}">${t.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${s}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0,t.wounds)} / ${t.maxWounds} HP</div>
      </div>
    </div>
  `}function he(){const e=n.attacker,t=n.defender,i=Math.max(0,e.wounds/e.maxWounds*100),s=Math.max(0,t.wounds/t.maxWounds*100);return`
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(26,29,36,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${ue(e.id,e.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:#6a9ad4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${e.name}">${e.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">射击方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${i}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0,e.wounds)} / ${e.maxWounds} HP</div>
      </div>

      <!-- VS icon -->
      <div style="display:flex;align-items:center;gap:6px;padding:0 8px;">
        <div style="width:16px;height:1px;background:var(--imperial-gold);"></div>
        <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
        <span style="font-size:1rem;color:var(--text-muted);font-family:'Pirata One',serif;">VS</span>
        <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
        <div style="width:16px;height:1px;background:var(--imperial-gold);"></div>
      </div>

      <!-- Defender Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${ue(t.id,t.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${t.name}">${t.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${s}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0,t.wounds)} / ${t.maxWounds} HP</div>
      </div>
    </div>
  `}function bn(e,t){if(e!==n.meleeTurn){f("alert");return}(e==="attacker"?n.activeAttackerDice:n.activeDefenderDice)[t].used||(n.selectedMeleeDice={side:e,idx:t},Q())}function yn(e){if(!n.selectedMeleeDice)return;const{side:t,idx:i}=n.selectedMeleeDice,a=(t==="attacker"?n.activeAttackerDice:n.activeDefenderDice)[i];if(a.used)return;const l=t==="attacker"?n.defender:n.attacker,c=t==="attacker"?n.activeDefenderDice:n.activeAttackerDice;let r;if(t==="attacker"?r=n.weapon:r=n.defender.weapons.filter(w=>!w.isRanged)[0]||new M("重拳 (Fists)",4,3,3,4,!1,null,[]),n.meleeLogs||(n.meleeLogs=""),e==="strike"){a.used=!0;let w=r.normalDamage,y=r.criticalDamage;r.hasRule&&r.hasRule("Toxic")&&l.poisonTokens>0&&(w+=1,y+=1);const b=a.isCrit?y:w,C=`> ${t==="attacker"?"攻击方":"防守方"} 执行打击 (Strike)，分配了 ${b} 伤害！<br>`;n.meleeLogs+=C,l.applyWounds(b),r.hasRule&&r.hasRule("Poison")&&b>0&&l.poisonTokens<1&&(l.poisonTokens=1,x.addLog(`[毒素] ${l.name} 获得了 1 个毒素标记！(来自近战)`)),f("heavy_strike"),x.triggerCombatVisual("⚔️ STRIKE! -"+b,"strike")}else{let w=-1;if(a.isCrit?(w=c.findIndex($=>!$.used&&$.isCrit),w===-1&&(w=c.findIndex($=>!$.used))):w=c.findIndex($=>!$.used&&!$.isCrit),w===-1){f("alert");return}a.used=!0,c[w].used=!0;const y=`> ${t==="attacker"?"攻击方":"防守方"} 执行格挡 (Parry)，消去对方一个骰子 [${c[w].val}]！<br>`;n.meleeLogs+=y,f("metal_clash"),x.triggerCombatVisual("🛡️ PARRY!","parry")}const d=t==="attacker"?"defender":"attacker",p=d==="attacker"?n.attacker.wounds:n.defender.wounds,u=(d==="attacker"?n.activeAttackerDice:n.activeDefenderDice).some(w=>!w.used)&&p>0,v=t==="attacker"?n.attacker.wounds:n.defender.wounds,k=(t==="attacker"?n.activeAttackerDice:n.activeDefenderDice).some(w=>!w.used)&&v>0;u&&k||u?n.meleeTurn=d:k&&(n.meleeTurn=t),n.selectedMeleeDice=null,Q(),e==="strike"&&x.triggerAvatarHitEffect(l.id,"melee")}function xn(){f("click"),n.selectedMeleeDice=null,Q()}function kn(){f("click");const e=n.attacker,t=n.defender;x.addLog(`
--- 近战搏斗结果 ---`),x.addLog(`[双核交锋] ${e.name} vs ${t.name}`),x.addLog(`  - ${e.name} 生命值: ${e.wounds}/${e.maxWounds}`),x.addLog(`  - ${t.name} 生命值: ${t.wounds}/${t.maxWounds}`),e.apl-=1,e.actionsPerformed.push("Fight"),x.addLog(`[行动点] ${e.name} 消耗 1 APL，当前 APL: ${e.apl}`),ge()}ot({addLog:S,updateScoresUI:K,renderOperatives:q,updateActivePanel:O,startInitiativePhase:qe,showTurnEndScoringOverlay:Ye,showCounteractOverlay:Ke,hidePhaseOverlay:we,hideCounteractOverlay:Dt});pt({addLog:S,triggerOperativeDeathOverlay:Ft});bt({openShootWizard:Xe,openFightWizard:Ze,renderShootStep:V,renderFightStep:Q,closeModal:ge});Xt({addLog:S,renderOperatives:q,updateActivePanel:O,updateScoresUI:K,triggerAvatarHitEffect:Jt,triggerCombatVisual:Yt});window.adjustScore=yt;window.confirmReset=xt;window.toggleSelectSM=be;window.toggleSelectPM=We;window.incrementWarrior=Fe;window.decrementWarrior=wt;window.validateRostersAndDeploy=$t;window.updateMissionDesc=gt;window.triggerAvatarUpload=Gt;window.handleAvatarFileSelect=Qt;window.selectOperative=ye;window.confirmActivation=Tt;window.cancelSelection=Mt;window.activateOperative=_e;window.toggleConceal=Ct;window.performMove=St;window.performCharge=At;window.performAdvance=Pt;window.performDash=Et;window.performFallBack=Lt;window.openShootWizard=Xe;window.openFightWizard=Ze;window.endActivation=It;window.showRuleHelp=jt;window.closeHelpModal=Ge;window.closeModal=ge;window.nextModalStep=Ce;window.selectShootDefender=Zt;window.selectShootWeapon=en;window.setQA=tn;window.setRollMode=nn;window.rollAttackDice=an;window.brutalReroll=ln;window.rollDefenseDice=rn;window.selectFightDefender=fn;window.selectFightWeapon=gn;window.rollMeleeDice=vn;window.chooseMeleeDice=bn;window.resolveMeleeChoice=yn;window.cancelMeleeChoice=xn;window.rollInitiativeOverlay=Vt;window.selectTurnOrder=Ot;window.confirmTurnOrder=Ht;window.buyPloy=zt;window.proceedToFirefight=Nt;window.showCounteractOverlay=Ke;window.selectCounteractOperative=Bt;window.skipCounteract=He;window.skipCounteractAction=Rt;window.confirmOperativeDeath=Qe;window.declareScoreVictory=Ut;window.toggleScoringChecklist=_t;window.adjustScoreTemp=qt;window.confirmTurnEndScoring=Kt;document.addEventListener("DOMContentLoaded",()=>{ke()});
