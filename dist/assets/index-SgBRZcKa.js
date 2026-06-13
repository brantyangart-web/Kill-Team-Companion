(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const p of l.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&s(p)}).observe(document,{childList:!0,subtree:!0});function i(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(a){if(a.ep)return;a.ep=!0;const l=i(a);fetch(a.href,l)}})();const h=new(window.AudioContext||window.webkitAudioContext);function v(e){try{h.state==="suspended"&&h.resume();const t=h.createOscillator(),i=h.createGain();if(t.connect(i),i.connect(h.destination),e==="click")t.frequency.setValueAtTime(600,h.currentTime),i.gain.setValueAtTime(.04,h.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.08),t.start(),t.stop(h.currentTime+.08);else if(e==="shoot"){const s=h.currentTime;[0,.08,.16].forEach(l=>{const p=h.sampleRate*.08,d=h.createBuffer(1,p,h.sampleRate),r=d.getChannelData(0);for(let w=0;w<p;w++)r[w]=Math.random()*2-1;const c=h.createBufferSource();c.buffer=d;const m=h.createBiquadFilter();m.type="lowpass",m.frequency.value=1e3;const u=h.createGain();u.gain.setValueAtTime(.12,s+l),u.gain.exponentialRampToValueAtTime(1e-4,s+l+.08),c.connect(m),m.connect(u),u.connect(h.destination),c.start(s+l);const f=h.createOscillator(),g=h.createGain();f.frequency.setValueAtTime(160,s+l),f.frequency.linearRampToValueAtTime(80,s+l+.06),g.gain.setValueAtTime(.15,s+l),g.gain.exponentialRampToValueAtTime(1e-4,s+l+.06),f.connect(g),g.connect(h.destination),f.start(s+l),f.stop(s+l+.06)})}else if(e==="crit")t.type="sawtooth",t.frequency.setValueAtTime(880,h.currentTime),t.frequency.setValueAtTime(1200,h.currentTime+.08),i.gain.setValueAtTime(.06,h.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.25),t.start(),t.stop(h.currentTime+.25);else if(e==="save")t.type="sine",t.frequency.setValueAtTime(988,h.currentTime),i.gain.setValueAtTime(.05,h.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.12),t.start(),t.stop(h.currentTime+.12);else if(e==="flesh"){const s=h.sampleRate*.15,a=h.createBuffer(1,s,h.sampleRate),l=a.getChannelData(0);for(let c=0;c<s;c++)l[c]=Math.random()*2-1;const p=h.createBufferSource();p.buffer=a;const d=h.createBiquadFilter();d.type="bandpass",d.frequency.value=300;const r=h.createGain();r.gain.setValueAtTime(.08,h.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.15),p.connect(d),d.connect(r),r.connect(h.destination),p.start()}else if(e==="bubble")t.type="sine",t.frequency.setValueAtTime(200,h.currentTime),t.frequency.exponentialRampToValueAtTime(1200,h.currentTime+.06),i.gain.setValueAtTime(.05,h.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.06),t.start(),t.stop(h.currentTime+.06);else if(e==="alert")t.type="triangle",t.frequency.setValueAtTime(330,h.currentTime),i.gain.setValueAtTime(.08,h.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,h.currentTime+.3),t.start(),t.stop(h.currentTime+.3);else if(e==="epic_win"){const s=[523.25,659.25,783.99,1046.5],a=h.currentTime;s.forEach((l,p)=>{const d=h.createOscillator(),r=h.createGain();d.type="triangle",d.frequency.setValueAtTime(l,a+p*.08),r.gain.setValueAtTime(0,a+p*.08),r.gain.linearRampToValueAtTime(.08,a+p*.08+.02),r.gain.exponentialRampToValueAtTime(1e-4,a+p*.08+.22),d.connect(r),r.connect(h.destination),d.start(a+p*.08),d.stop(a+p*.08+.22)})}else if(e==="epic_fail"){const s=[164.81,155.56,146.83,138.59],a=h.currentTime;s.forEach((l,p)=>{const d=h.createOscillator(),r=h.createGain();d.type="sawtooth";const c=a+p*.2,m=p===3?.65:.18;d.frequency.setValueAtTime(l,c),p===3&&d.frequency.linearRampToValueAtTime(95,c+m),r.gain.setValueAtTime(0,c),r.gain.linearRampToValueAtTime(.08,c+.02),r.gain.exponentialRampToValueAtTime(1e-4,c+m),d.connect(r),r.connect(h.destination),d.start(c),d.stop(c+m)})}else if(e==="funeral"){const s=[261.63,261.63,261.63,207.65],a=[.35,.35,.35,.7],l=[0,.45,.9,1.35],p=h.currentTime;s.forEach((d,r)=>{const c=h.createOscillator(),m=h.createGain();c.type="sine";const u=p+l[r],f=a[r];c.frequency.setValueAtTime(d,u),m.gain.setValueAtTime(0,u),m.gain.linearRampToValueAtTime(.06,u+.05),m.gain.exponentialRampToValueAtTime(1e-4,u+f),c.connect(m),m.connect(h.destination),c.start(u),c.stop(u+f)})}else if(e==="metal_clash"){const s=h.currentTime,a=h.createOscillator(),l=h.createGain();a.type="sine",a.frequency.setValueAtTime(1400,s),a.frequency.linearRampToValueAtTime(900,s+.25),l.gain.setValueAtTime(.06,s),l.gain.exponentialRampToValueAtTime(1e-4,s+.3),a.connect(l),l.connect(h.destination),a.start(),a.stop(s+.3);const p=h.createOscillator(),d=h.createGain();p.type="triangle",p.frequency.setValueAtTime(300,s),p.frequency.linearRampToValueAtTime(120,s+.15),d.gain.setValueAtTime(.1,s),d.gain.exponentialRampToValueAtTime(1e-4,s+.18),p.connect(d),d.connect(h.destination),p.start(),p.stop(s+.18)}else if(e==="heavy_strike"){const s=h.currentTime,a=h.createOscillator(),l=h.createGain();a.type="sawtooth",a.frequency.setValueAtTime(80,s),a.frequency.exponentialRampToValueAtTime(35,s+.2),l.gain.setValueAtTime(.2,s),l.gain.exponentialRampToValueAtTime(1e-4,s+.2),a.connect(l),l.connect(h.destination),a.start(),a.stop(s+.2);const p=h.createOscillator(),d=h.createGain();p.type="sine",p.frequency.setValueAtTime(550,s),d.gain.setValueAtTime(.05,s),d.gain.exponentialRampToValueAtTime(1e-4,s+.12),p.connect(d),d.connect(h.destination),p.start(),p.stop(s+.12);const r=h.sampleRate*.12,c=h.createBuffer(1,r,h.sampleRate),m=c.getChannelData(0);for(let w=0;w<r;w++)m[w]=Math.random()*2-1;const u=h.createBufferSource();u.buffer=c;const f=h.createBiquadFilter();f.type="bandpass",f.frequency.value=220;const g=h.createGain();g.gain.setValueAtTime(.12,s),g.gain.exponentialRampToValueAtTime(1e-4,s+.12),u.connect(f),f.connect(g),g.connect(h.destination),u.start()}}catch{}}const D={};function rt(e){Object.assign(D,e)}const o={turningPoint:1,phase:"Initiative",initiative:"Space Marine",activeTurn:"Space Marine",activeAgent:null,pendingActivation:null,smVp:0,smCp:2,pmVp:0,pmCp:2,smActivePloys:[],pmActivePloys:[],operatives:[],gameOver:!1,customAvatars:{},smKillsScored:0,pmKillsScored:0,missionType:"seize_ground",rulesVersion:"lite"},ct={actionType:"shoot",step:1,attacker:null,defender:null,weapon:null,inRangeAndVisible:!0,inCoverConcealed:!1,inCover:!1,mode:"random",attackRolls:[],attackCrit:0,attackNorm:0,defenseRolls:[],defCrit:0,defNorm:0,attRerollIndex:-1,defRerollIndex:-1,stunApplied:!1,shockTriggered:!1,activeAttackerDice:[],activeDefenderDice:[],meleeTurn:"attacker"};let n={...ct};const De=["医疗兵默默拿出了骨灰盒，叹气道：『这活我接不了，抬走，下一位！』","他为了信仰流尽了最后一滴血，虽然倒下的姿势实在不够优雅。","战锤世界可没有复活币，老铁一路走好！","这大概就是传说中的『战术性白给』吧……","棋子已变成战场地形/掩体的一部分（大雾）。","纳垢大父叹了口气，表示可以多一碗上好的堆肥了。","帝皇叹了口气，并从垃圾桶里捞了捞他的物理模型。"];function ee(e){return o.operatives.some(t=>t.faction===e&&!t.isDead&&!t.hasActed)}function dt(){if(v("click"),o.turningPoint>=5){D.addLog(`
========================================`),D.addLog(">>> 已达第 5 回合上限！进入最终胜负结算！"),D.addLog("========================================"),D.showTurnEndScoringOverlay(!0);return}o.turningPoint+=1,o.phase="Initiative",o.smActivePloys=[],o.pmActivePloys=[],o.operatives.forEach(t=>{t.isDead||(t.hasActed=!1,t.apl=t.currentApl,t.actionsPerformed=[],t.hasCounteractedThisTP=!1)});const e=document.getElementById("btn-next-phase");e&&(e.style.display="none"),D.addLog(`
========================================`),D.addLog(`>>> Turning Point ${o.turningPoint} 开始！`),D.addLog("========================================"),D.startInitiativePhase()}function pt(e){return o.operatives.some(t=>t.faction===e&&!t.isDead&&t.hasActed&&!t.hasConceal&&!t.hasCounteractedThisTP)}function mt(){const e=o.activeTurn==="Space Marine"?"Plague Marine":"Space Marine",t=ee(e),i=ee(o.activeTurn),s=a=>a==="Space Marine"?"死亡天使":"瘟疫守卫";t?(o.activeTurn=e,D.addLog(`>>> 交替轮转：轮到【${s(e)}】选择特工激活。`)):i?(o.activeTurn=e,pt(e)?(D.addLog(`>>> 【${s(e)}】无可用特工，但可发动反击 (Counteract)！`),D.showCounteractOverlay(e)):(D.addLog(`>>> 【${s(e)}】已无可用特工且无反击机会。轮到【${s(o.activeTurn===e?o.activeTurn:e)}】继续。`),o.activeTurn=e==="Space Marine"?"Plague Marine":"Space Marine")):(D.addLog(">>> 双方全部特工激活完毕。准备开始回合得分结算。"),D.showTurnEndScoringOverlay()),D.renderOperatives(),D.updateActivePanel()}function ze(){const e=o.activeTurn,t=e==="Space Marine"?"Plague Marine":"Space Marine",i=s=>s==="Space Marine"?"死亡天使":"瘟疫守卫";D.addLog(`>>> 【${i(e)}】选择跳过反击。`),ee(t)?(o.activeTurn=t,D.addLog(`>>> 轮到【${i(t)}】继续激活。`)):(D.addLog(">>> 双方均已无法激活。回合得分结算开始。"),D.showTurnEndScoringOverlay()),D.renderOperatives(),D.updateActivePanel()}function ut(e){const t=o.operatives.find(i=>i.id===e);t&&(t.hasActed=!1,t.apl=1,t.counteracting=!0,t.hasCounteractedThisTP=!0,t.actionsPerformed=[],o.activeAgent=t,D.addLog(`>>> 【${t.name}】发动反击！获得 1 AP（移动不超过 2"）。`),D.hideCounteractOverlay(),D.renderOperatives(),D.updateActivePanel())}const F={};function ft(e){Object.assign(F,e)}const Ne={PSYCHIC:"灵能",Saturate:"饱和",Severe:"重伤",Poison:"毒素",Toxic:"剧毒","Piercing Crits 1":"穿甲暴击 1",'Torrent 1"':'涌流 1"','Torrent 2"':'涌流 2"',Shock:"震击",Stun:"眩晕",Brutal:"残暴","Indirect Fire":"间接射击","Heavy (Dash only)":"重型(仅冲刺)","Seek Light":"追光",Silent:"静默"};function we(e){return Ne[e]||e}class P{constructor(t,i,s,a,l,p=!0,d=null,r=[]){this.name=t,this.attacks=i,this.ts=s,this.normalDamage=a,this.criticalDamage=l,this.isRanged=p,this.range=d,this.rules=r}hasRule(t){return this.rules.includes(t)}get displayRange(){return this.range===null?"-":this.range+'"'}get displayRules(){return this.rules.length>0?this.rules.map(t=>Ne[t]||t).join(", "):"-"}}class Ie{constructor(t,i,s,a,l,p,d,r=[],c="",m=6){this.id=t,this.name=i,this.faction=s,this.maxWounds=a,this.wounds=a,this.maxApl=l,this.apl=l,this.df=p,this.sv=d,this.weapons=r,this.defaultAvatar=c,this.maxMove=m,this.move=m,this.hasActed=!1,this.isDead=!1,this.actionsPerformed=[],this.poisonTokens=0,this.hasConceal=!1,this.counteracting=!1,this.hasCounteractedThisTP=!1,this.orderSwitchedThisActivation=!1}get isInjured(){return this.wounds>0&&this.wounds<this.maxWounds/2}get currentApl(){return this.maxApl-(this.isInjured?1:0)}get currentMove(){return Math.max(0,this.maxMove-(this.isInjured?2:0))}toggleConceal(){this.hasConceal=!this.hasConceal}reset(){this.wounds=this.maxWounds,this.apl=this.maxApl,this.move=this.maxMove,this.hasActed=!1,this.isDead=!1,this.actionsPerformed=[],this.poisonTokens=0,this.hasConceal=!1,this.counteracting=!1,this.orderSwitchedThisActivation=!1}applyWounds(t,i=null){if(this.isDead)return 0;const s=this.faction==="Plague Marine";let a=0,l=[];Array.isArray(t)?(l=t,a=t.reduce((r,c)=>r+c,0)):(a=t,l=[t]),F.addLog(`[伤害] ${this.name} 准备分配 ${a} 点伤害...`);let p=0;if(s){const r=o.pmActivePloys.includes("contagious_resilience");F.addLog(`[特性] 触发瘟疫守卫专属【恶心作呕 (DR 4+)】 ${r?"(已开启传染韧性，允许首个失败重投)":""}：`);let c=0,m=!1;for(const u of l){if(u<3){F.addLog(`  - 单次攻击伤害 ${u} (<3)，不触发 DR。`),p+=u;continue}let f;if(i&&c<i.length?(f=i[c++],F.addLog(`  - 伤害 ${u} (>=3): 手动录入 DR 骰子 [${f}]`)):(f=Math.floor(Math.random()*6)+1,F.addLog(`  - 伤害 ${u} (>=3): 投 DR 骰子 [${f}]`)),f<4&&r&&!m&&!i){m=!0;const g=f;f=Math.floor(Math.random()*6)+1,F.addLog(`    -> [传染韧性] 自动重投失败 [${g}] -> [${f}]`)}if(f>=4){const g=u-1;F.addLog(`    -> 成功！伤害减免 1 点 (${u} -> ${g})`),v("bubble"),p+=g}else F.addLog(`    -> 减免失败，受到全额 ${u} 点伤害。`),p+=u,v("flesh")}}else p=a,p>0&&v("flesh");const d=this.wounds;return this.wounds=Math.max(0,this.wounds-p),F.addLog(`[分配] ${this.name} 生命值: ${d} -> ${this.wounds} ${this.wounds===0?"(已阵亡!)":""}`),this.wounds===0&&(this.isDead=!0,this.hasActed=!0,F.triggerOperativeDeathOverlay(this)),p}}const z=[{id:"sm_1",name:"Space Marine Captain (SM 队长)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_captain.png",weapons:[new P("Master-crafted Bolt Rifle (精铸爆弹步枪)",4,3,4,5,!0,24,["Indirect Fire"]),new P("Relic Blade (遗物利刃)",5,3,5,6,!1,null,["Severe"])]},{id:"sm_2",name:"Assault Intercessor Sergeant (突击军士)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sergeant.png",weapons:[new P("Hand Flamer (手持火焰喷射器)",4,2,3,3,!0,6,["Saturate",'Torrent 1"']),new P("Chainsword (链锯剑)",5,3,4,5,!1,null,[])]},{id:"sm_3",name:"Intercessor Sergeant (战术军士)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sergeant.png",weapons:[new P("Bolt Rifle (爆弹步枪)",4,3,3,4,!0,null,["Piercing Crits 1"]),new P("Chainsword (链锯剑)",4,3,4,5,!1,null,[])]},{id:"sm_4",name:"Eliminator Sniper (Eliminator 狙击手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sniper.png",weapons:[new P("Bolt Sniper Rifle (爆弹狙击步枪)",4,2,3,4,!0,null,["Heavy (Dash only)","Saturate","Seek Light","Silent"]),new P("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_5",name:"Heavy Intercessor Gunner (重型火力手)",wounds:18,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/sm/sm_heavy_gunner.png",weapons:[new P("Heavy Bolter (重型爆弹枪)",5,3,4,5,!0,null,["Piercing Crits 1"]),new P("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_8",name:"Intercessor Gunner (战术火力手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_warrior_b.png",weapons:[new P("Auto Bolt Rifle (自动爆弹步枪)",4,3,3,4,!0,null,['Torrent 1"']),new P("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_6",name:"Assault Intercessor Warrior (突击战士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_assault.png",weapons:[new P("Heavy Bolt Pistol (重型爆弹手枪)",4,3,3,4,!0,8,["Piercing Crits 1"]),new P("Chainsword (链锯剑)",5,3,4,5,!1,null,[])]},{id:"sm_7",name:"Intercessor Warrior (战术战士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_warrior_a.png",weapons:[new P("Bolt Rifle (爆弹步枪)",4,3,3,4,!0,null,["Piercing Crits 1"]),new P("Fists (铁拳)",4,3,3,4,!1,null,[])]}],K=[{id:"pm_1",name:"Plague Marine Champion (瘟疫冠军)",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_champion.png",weapons:[new P("Plague Sword (瘟疫之剑)",5,3,4,5,!1,null,["Severe","Poison","Toxic"])]},{id:"pm_2",name:"Malignant Plaguecaster (恶性瘟疫术士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_caster.png",weapons:[new P("Entropy (熵能术)",4,3,3,7,!0,7,["PSYCHIC","Saturate","Severe","Poison"]),new P("Plague Wind (瘟疫之风)",6,3,2,3,!0,null,["PSYCHIC","Saturate","Severe",'Torrent 1"',"Poison"]),new P("Corrupted Staff (腐蚀法杖)",4,3,3,4,!1,null,["PSYCHIC","Severe","Shock","Stun","Poison"])]},{id:"pm_3",name:"Plague Marine Bombardier (瘟疫掷弹兵)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_gunner.png",weapons:[new P("Boltgun (爆弹枪)",4,3,3,4,!0,null,["Toxic"]),new P("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"pm_4",name:"Plague Marine Fighter (瘟疫搏击手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_fighter.png",weapons:[new P("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new P("Flail of Corruption (腐化之链枷)",5,3,4,5,!1,null,["Brutal","Severe","Shock","Poison"])]},{id:"pm_5",name:"Plague Marine Heavy Gunner (瘟疫重炮手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_heavy.png",weapons:[new P("Plague Spewer (瘟疫喷射器)",5,2,3,3,!0,7,["Saturate","Severe",'Torrent 2"',"Poison"]),new P("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"pm_6",name:"Plague Marine Icon Bearer (瘟疫圣像手)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_icon.png",weapons:[new P("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new P("Plague Knife (瘟疫匕首)",5,3,3,4,!1,null,["Severe","Poison"])]},{id:"pm_7",name:"Plague Marine Warrior (瘟疫战士)",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_warrior.png",weapons:[new P("Boltgun (爆弹枪)",4,3,3,4,!0,null,["Toxic"]),new P("Plague Knife (瘟疫匕首)",4,3,3,4,!1,null,["Severe","Poison"])]}],gt={move:{title:"🏃 移动 (Normal Move) 规则帮助",body:`
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>基本移动距离:</b> 3⚪ (即 6 英寸)。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>不能移入任何敌方特工的<b>交战距离</b>（即敌方 1 英寸范围内）。</li>
            <li>如果本回合该特工已经执行过【冲锋 (Charge)】动作，则<b>不能</b>执行移动。</li>
          </ul>
        `},charge:{title:"⚡ 冲锋 (Charge Move) 规则帮助",body:`
          <p><b>行动点消耗:</b> 1 APL</p>
          <p style="margin-top:6px;"><b>冲锋移动距离:</b> 移动值 + 2" (即 8 英寸)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 当你想要近身与敌方搏斗时使用。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>冲锋移动结束时，该特工<b>必须</b>进入某个敌方特工的交战距离（1 英寸内）。</li>
            <li>如果本回合该特工已经执行过【移动】或【射击】动作，则<b>不能</b>执行冲锋。</li>
            <li>冲锋后<b>不能再射击</b>（已贴脸）。</li>
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
          <p style="margin-top:6px;"><b>移动距离:</b> 固定 <b>3"</b> (lite 规则，且不能攀爬)。</p>
          <p style="margin-top:6px;"><b>使用场景:</b> 需要快速穿越战场时使用。同时也是唯一能让 <b>Heavy (Dash only)</b> 武器开火的方式。</p>
          <p style="margin-top:6px;"><b>规则限制:</b></p>
          <ul>
            <li>冲刺后<b>不能再射击或近战</b>（Heavy (Dash only) 武器例外：Dash 后可以射击）。</li>
            <li>如果本回合该特工已经执行过任意移动/冲锋/前进/冲刺/撤退，则<b>不能</b>执行冲刺。</li>
          </ul>
        `},fallback:{title:"🔙 撤退 (Fall Back) 规则帮助",body:`
          <p><b>行动点消耗:</b> 2 APL</p>
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
        `},brutal:{title:"🔥 残暴 (Brutal) 武器规则帮助",body:`
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
        `},severe:{title:"⚠️ 严重 (Severe) 武器规则帮助",body:`
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
        `},saturate:{title:"🔥 饱和 (Saturate) 武器规则帮助",body:`
          <p><b>规则类型:</b> 防御阶段关键字</p>
          <p style="margin-top:6px;"><b>效果:</b> 防御方<b>不能保留掩体骰</b>。</p>
          <p style="margin-top:6px;"><b>适用阶段:</b> 防御骰计算阶段。</p>
          <p style="margin-top:6px;"><b>规则说明:</b></p>
          <ul>
            <li>掩体提供的加成（+1 DF 骰、1 个自动普通成功）被完全移除。</li>
            <li>防御方只能依赖投出的防御骰（SV 判定）。</li>
            <li>即使目标在掩体中，也不会获得任何掩体保护。</li>
          </ul>
        `},stun:{title:"💫 震慑 (Stun) 武器规则帮助",body:`
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
        `},shock:{title:"⚡ 冲击 (Shock) 武器规则帮助",body:`
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
        `},lethal:{title:"💀 致命 (Lethal) 武器规则帮助",body:`
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
        `},devastating:{title:"💥 毁灭 (Devastating) 武器规则帮助",body:`
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
        `},piercing:{title:"🔥 穿透 (Piercing) 武器规则帮助",body:`
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
        `},hot:{title:"🔥 过热 (Hot) 武器规则帮助",body:`
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
        `}},vt=window.matchMedia("(prefers-reduced-motion: reduce)"),Fe={seize_ground:"夺取阵地 (Seize Ground)",recovery:"物资回收 (Recovery)",breakthrough:"突破防线 (Breakthrough)",custom:"自定义 (Custom)"},ht={seize_ground:'<b style="color:var(--imperial-gold);">夺取阵地：</b>棋盘上通常摆放 3 个目标点。每回合结束时，根据控制的目标数量与局势获得 VP。',recovery:'<b style="color:var(--imperial-gold);">物资回收：</b>棋盘上散布遗物/情报标记。通过移动或激活动作拾取，并护送携带者回到己方部署区以完成回收。',breakthrough:'<b style="color:var(--imperial-gold);">突破防线：</b>派遣特工穿越战场，进入敌方部署区以获取 VP。先抵达敌方阵地者得分。',custom:'<b style="color:var(--imperial-gold);">自定义任务：</b>根据实体任务卡或自定规则，自由勾选各项得分条件。'},Re={seize_ground:["控制中央目标点 (+1 VP)","控制左翼目标点 (+1 VP)","控制右翼目标点 (+1 VP)","控制目标数量多于对手 (+1 VP)","消灭对方半数以上特工 (+1 VP)"],recovery:["拾取 1 枚遗物/情报 (+1 VP)","拾取 2 枚及以上遗物/情报 (+1 VP)","将遗物送回己方部署区 (+1 VP)","阻止对手完成回收 (+1 VP)","消灭敌方携带遗物的特工 (+1 VP)"],breakthrough:["1 名特工进入敌方部署区 (+1 VP)","2+ 名特工进入敌方部署区 (+1 VP)","控制敌方部署区内的目标 (+1 VP)","阻滞敌方推进（敌方无人进入你部署区）(+1 VP)","歼灭敌方后卫力量 (+1 VP)"],custom:["控制 1+ 目标点 (+1 VP)","控制目标多于对手 (+1 VP)","完成特定任务动作 (+1 VP)","本回合秘密任务 1 (+1 VP)","本回合秘密任务 2 (+1 VP)"]};function bt(){const e=document.getElementById("mission-type"),t=document.getElementById("mission-desc");e&&t&&(t.innerHTML=ht[e.value]||"")}function je(){const e=document.getElementById("rules-version"),t=document.getElementById("rules-version-desc");e&&(o.rulesVersion=e.value),t&&(o.rulesVersion==="lite"?t.innerHTML='<b style="color:var(--sm-accent);">Lite 规则：</b>简化版规则，隐藏 Advance（前进）行动，Dash 固定 3"，适合新手快速上手。':t.innerHTML='<b style="color:var(--imperial-gold);">Standard 规则：</b>完整版规则，包含所有行动（Advance/Dash/Fall Back），适合有经验的玩家。');const i=document.getElementById("action-advance");i&&(i.style.display=o.rulesVersion==="lite"?"none":"")}let yt=0;function q(e,t="info",i=4e3){const s=document.getElementById("toast-container");if(!s){console.warn(`[Toast ${t}]:`,e);return}const a=document.createElement("div");a.className=`toast toast-${t}`,a.setAttribute("role",t==="error"?"alert":"status"),a.textContent=e,a.id=`toast-${++yt}`,s.appendChild(a);const l=setTimeout(()=>{a.classList.add("toast-exit"),setTimeout(()=>a.remove(),300)},i);a.addEventListener("click",()=>{clearTimeout(l),a.classList.add("toast-exit"),setTimeout(()=>a.remove(),300)})}function xt(e,t){const i=document.createElement("div");i.className="modal-overlay",i.style.display="flex",i.setAttribute("role","alertdialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-label","确认操作"),i.innerHTML=`
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
  `,document.body.appendChild(i),ce(i);const s=()=>{de(),i.remove()};i.querySelector("#confirm-dialog-cancel").addEventListener("click",()=>{s()}),i.querySelector("#confirm-dialog-ok").addEventListener("click",()=>{s(),t&&t()});const a=l=>{l.key==="Escape"&&(s(),document.removeEventListener("keydown",a))};document.addEventListener("keydown",a)}let X=null,re=null;function Ve(e){return e.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])')}function ce(e){re=document.activeElement,X=e;const t=Ve(e);t.length>0&&t[0].focus(),e._focusTrapHandler=i=>{if(i.key==="Tab"){const s=Ve(e);if(s.length===0)return;const a=s[0],l=s[s.length-1];i.shiftKey?document.activeElement===a&&(i.preventDefault(),l.focus()):document.activeElement===l&&(i.preventDefault(),a.focus())}},e.addEventListener("keydown",e._focusTrapHandler)}function de(){X&&X._focusTrapHandler&&(X.removeEventListener("keydown",X._focusTrapHandler),delete X._focusTrapHandler),X=null,re&&re.focus&&re.focus(),re=null}document.addEventListener("keydown",e=>{if(e.key==="Escape"){const t=document.getElementById("help-modal");if(t&&t.style.display==="flex"){Ye();return}const i=document.getElementById("combat-modal");if(i&&i.style.display==="flex"){We.closeModal();return}const s=document.getElementById("death-overlay");if(s&&s.style.display==="flex"){Je();return}}});const te={},ne={},We={};function kt(e){Object.assign(We,e)}function S(e){const t=document.getElementById("battle-log-lines");if(!t)return;const i=document.createElement("div");i.textContent=e,t.appendChild(i),t.scrollTop=t.scrollHeight}function Q(){document.getElementById("sm-vp").textContent=o.smVp,document.getElementById("sm-cp").textContent=o.smCp,document.getElementById("pm-vp").textContent=o.pmVp,document.getElementById("pm-cp").textContent=o.pmCp,document.getElementById("dash-tp").textContent=o.turningPoint;let e=o.phase;e==="Initiative"?e="先攻阶段":e==="Strategy"?e="策略阶段":e==="Firefight"&&(e="战斗阶段"),document.getElementById("dash-phase").textContent=e;const t=document.getElementById("sm-ploy-tags");t.innerHTML="",o.smActivePloys.forEach(a=>{const l=document.createElement("span");l.className="ploy-tag sm",l.textContent=a==="bolter_discipline"?"爆弹惩戒":a,t.appendChild(l)});const i=document.getElementById("pm-ploy-tags");i.innerHTML="",o.pmActivePloys.forEach(a=>{const l=document.createElement("span");l.className="ploy-tag pm",l.textContent=a==="contagious_resilience"?"传染韧性":a,i.appendChild(l)});const s=document.getElementById("btn-next-phase");s&&(o.phase==="Firefight"&&!ee("Space Marine")&&!ee("Plague Marine")?(s.style.display="inline-block",s.textContent="回合得分结算",s.onclick=Xe):s.style.display="none")}function wt(e,t,i){v("click"),t!=="cp"&&(e==="sm"?o.smVp=Math.max(0,o.smVp+i):o.pmVp=Math.max(0,o.pmVp+i),Q())}function $t(){xt("确定要重置当前对局吗？所有进度和选择将被清空。",()=>{v("click"),o.turningPoint=1,o.phase="Initiative",o.smVp=0,o.smCp=2,o.pmVp=0,o.pmCp=2,o.smActivePloys=[],o.pmActivePloys=[],o.operatives=[],o.activeAgent=null,o.gameOver=!1,o.smKillsScored=0,o.pmKillsScored=0,document.getElementById("start-screen").style.display="flex",document.getElementById("global-dash").style.display="none",document.getElementById("battle-area").style.display="none",document.getElementById("guidance-banner").style.display="none",document.getElementById("battle-log-lines").innerHTML="",$e()})}function j(e){document.getElementById("guidance-text").textContent=e}function me(e,t){var d;const i=o.customAvatars[e];let s=t==="Space Marine"?"assets/images/defaults/default_sm_avatar.png":"assets/images/defaults/default_pm_avatar.png";const a=o.operatives.find(r=>r.id===e),l=a?a.name:((d=z.concat(K).find(r=>r.id===e))==null?void 0:d.name)||e;if(a&&a.defaultAvatar)s=a.defaultAvatar;else{const r=z.concat(K).find(c=>c.id===e);r&&r.defaultAvatar&&(s=r.defaultAvatar)}return`<div class="op-avatar-slot main-avatar-${e}">
            <img src="${i||s}" class="op-avatar-img" alt="${l} 头像" loading="lazy" />
          </div>`}function Ct(e){return e.weapons.map(t=>{const i=t.name.split(" ")[0],s=t.rules&&t.rules.length>0?` [${t.rules.map(we).join(",")}]`:"";return i+s}).join(" / ")}function pe(e,t,i,s,a,l,p){const d=i?`<span class="role-badge leader" ${p?`style="${p}"`:""}>LEADER</span>`:'<span class="role-badge">OPERATOR</span>',r=s?"checked":"",c=a?"disabled":"",m=me(e.id,t),u=e.isWarrior?' <span style="color:#c9a84c; font-size:0.65rem;">[Warrior]</span>':"";let f;return e.isWarrior?f=`
      <div class="warrior-counter" data-warrior-id="${e.id}">
        <button class="warrior-counter-btn minus" onclick="event.stopPropagation(); decrementWarrior('${e.id}')" aria-label="减少数量">−</button>
        <span class="warrior-counter-value" id="warrior-count-${e.id}">0</span>
        <button class="warrior-counter-btn plus" onclick="event.stopPropagation(); incrementWarrior('${e.id}')" aria-label="增加数量">+</button>
      </div>
    `:f=`<input type="checkbox" class="roster-checkbox" id="check-${e.id}" ${r} ${c} onchange="${l}('${e.id}')">`,`
    ${f}
    ${m}
    <div class="roster-op-info">
      <div class="roster-op-name">${e.name} ${d}${u}</div>
      <div class="roster-op-weapons">Move: ${e.move||6}" | HP: ${e.wounds} | APL: ${e.apl}</div>
      <div style="font-size:0.65rem; color:#9a9da5; margin-top:2px;">武器: ${Ct(e)}</div>
    </div>
  `}function be(e,t,i,s=!1){e.onclick=a=>{if(a.target.className!=="roster-checkbox"&&!a.target.closest(".op-avatar-slot")&&!a.target.closest(".warrior-counter"))if(s)_e(t);else{const l=document.getElementById(`check-${t}`);l&&!l.disabled&&(l.checked=!l.checked,i(t))}}}function _e(e){v("click");const t=z.some(c=>c.id===e),i=t?"sm":"pm",s=t?z:K,a=t?te:ne,l=s.find(c=>c.id===e);if(!l||!l.isWarrior)return;if(ae(i)>=5){q("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning");return}a[e]=(a[e]||0)+1;const d=document.getElementById(`warrior-count-${e}`);d&&(d.textContent=a[e]);const r=document.getElementById(`picker-row-${e}`);r&&(a[e]>0?r.classList.add("selected"):r.classList.remove("selected")),ie(),le(i)}function Tt(e){v("click");const t=z.some(p=>p.id===e),i=t?"sm":"pm",s=t?te:ne;if(!s[e]||s[e]<=0)return;s[e]--;const a=document.getElementById(`warrior-count-${e}`);a&&(a.textContent=s[e]);const l=document.getElementById(`picker-row-${e}`);l&&s[e]<=0&&l.classList.remove("selected"),ie(),le(i)}function ae(e){const t=e==="sm"?z:K,i=e==="sm"?te:ne;let s=0;return t.filter(a=>!a.isLeader&&!a.isWarrior).forEach(a=>{var l;(l=document.getElementById(`check-${a.id}`))!=null&&l.checked&&s++}),t.filter(a=>!a.isLeader&&a.isWarrior).forEach(a=>{s+=i[a.id]||0}),s}function He(e){const t=e==="sm"?z:K;let i=0;return t.filter(s=>s.isLeader).forEach(s=>{var a;e==="pm"?i=1:(a=document.getElementById(`check-${s.id}`))!=null&&a.checked&&i++}),i+ae(e)}function $e(){Object.keys(te).forEach(c=>delete te[c]),Object.keys(ne).forEach(c=>delete ne[c]);const e=z.filter(c=>c.isLeader),t=z.filter(c=>!c.isLeader),i=document.getElementById("sm-leader-section"),s=document.getElementById("sm-operator-section");i.innerHTML="",s.innerHTML="",i.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:#6a9ad4; margin-bottom:6px; padding-left:4px;">
      ⚜ 🎖️ LEADER — 单选 1 名 (3 选 1) ⚜
    </div>
  `,e.forEach(c=>{const m=document.createElement("div");m.className="roster-pick-row",m.id=`picker-row-${c.id}`,m.innerHTML=pe(c,"Space Marine",!0,!1,!1,"toggleSelectSM"),be(m,c.id,xe,!1),i.appendChild(m)}),s.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:#6a9ad4; margin:12px 0 6px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span>⚜ 🎯 OPERATORS — 共选 5 名 (Warrior 可用计数器重复选取) ⚜</span>
      <span id="sm-op-count" style="font-size:0.75rem; color:#9a9da5; font-family:'Pirata One',serif;">0 / 5</span>
    </div>
    <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px; padding-left:4px;">
      ⚠️ 非 Warrior 每种只能带一名。Warrior [Warrior] 可用 +/− 按钮选取最多 5 名同型单位。
    </p>
  `,t.forEach(c=>{const m=document.createElement("div");m.className="roster-pick-row",m.id=`picker-row-${c.id}`,m.innerHTML=pe(c,"Space Marine",!1,!1,!1,"toggleSelectSM"),be(m,c.id,xe,c.isWarrior),s.appendChild(m)});const a=K.filter(c=>c.isLeader),l=K.filter(c=>!c.isLeader),p=document.getElementById("pm-leader-section"),d=document.getElementById("pm-operator-section");p.innerHTML="",d.innerHTML="",p.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:var(--pm-accent); margin-bottom:6px; padding-left:4px;">
      ☠ 🎖️ LEADER — 必选 ☠
    </div>
  `;const r="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(122,184,138,0.15)";a.forEach(c=>{const m=document.createElement("div");m.className="roster-pick-row selected",m.id=`picker-row-${c.id}`,m.innerHTML=pe(c,"Plague Marine",!0,!0,!0,"toggleSelectPM",r),p.appendChild(m)}),d.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:var(--pm-accent); margin:12px 0 6px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span>☠ 🎯 OPERATORS — 共选 5 名 (6 类型, Warrior 可重复) ☠</span>
      <span id="pm-op-count" style="font-size:0.75rem; color:#9a9da5; font-family:'Pirata One',serif;">0 / 5</span>
    </div>
    <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px; padding-left:4px;">
      ⚠️ 非 Warrior 每种只能带一名。Warrior [Warrior] 可用 +/− 按钮选取多名同型单位。
    </p>
  `,l.forEach(c=>{const m=document.createElement("div");m.className="roster-pick-row",m.id=`picker-row-${c.id}`,m.innerHTML=pe(c,"Plague Marine",!1,!1,!1,"toggleSelectPM",r),be(m,c.id,qe,c.isWarrior),d.appendChild(m)}),ie(),le("sm"),le("pm")}function xe(e){v("click");const t=z.find(a=>a.id===e),i=document.getElementById(`check-${e}`),s=document.getElementById(`picker-row-${e}`);if(!(!t||!i)){if(t.isLeader)i.checked&&z.filter(a=>a.isLeader&&a.id!==e).forEach(a=>{var p;const l=document.getElementById(`check-${a.id}`);l&&(l.checked=!1,(p=document.getElementById(`picker-row-${a.id}`))==null||p.classList.remove("selected"))});else if(i.checked&&ae("sm")>5){i.checked=!1,q("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning"),ie();return}i.checked?s.classList.add("selected"):s.classList.remove("selected"),ie(),le("sm")}}function qe(e){v("click");const t=K.find(a=>a.id===e),i=document.getElementById(`check-${e}`),s=document.getElementById(`picker-row-${e}`);if(!(!t||!i)&&!t.isLeader){if(i.checked&&ae("pm")>5){i.checked=!1,q("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning"),ie();return}i.checked?s.classList.add("selected"):s.classList.remove("selected"),ie(),le("pm")}}function le(e){const t=e==="sm"?z:K,i=e==="sm"?te:ne,a=ae(e)>=5;t.filter(l=>!l.isLeader).forEach(l=>{if(l.isWarrior){const p=document.querySelector(`#picker-row-${l.id} .warrior-counter-btn.plus`),d=document.querySelector(`#picker-row-${l.id} .warrior-counter-btn.minus`),r=i[l.id]||0;p&&(p.disabled=a),d&&(d.disabled=r<=0)}else{const p=document.getElementById(`check-${l.id}`);if(!p)return;a&&!p.checked?p.disabled=!0:p.disabled=!1}})}function ie(){const e=He("sm"),t=ae("sm");document.getElementById("sm-roster-count").textContent=`已选: ${e} / 6 人`;const i=document.getElementById("sm-op-count");i&&(i.textContent=`${t} / 5`);const s=He("pm"),a=ae("pm");document.getElementById("pm-roster-count").textContent=`已选: ${s} / 6 人`;const l=document.getElementById("pm-op-count");l&&(l.textContent=`${a} / 5`)}function St(){var d;v("click");const e=[];let t=0;z.forEach(r=>{var c;if(r.isWarrior){const m=te[r.id]||0;m>0&&e.push({tmpl:r,count:m})}else(c=document.getElementById(`check-${r.id}`))!=null&&c.checked&&(e.push({tmpl:r,count:1}),r.isLeader&&t++)});const i=e.reduce((r,c)=>r+c.count,0),s=[];K.forEach(r=>{var c;if(r.isWarrior){const m=ne[r.id]||0;m>0&&s.push({tmpl:r,count:m})}else(c=document.getElementById(`check-${r.id}`))!=null&&c.checked&&s.push({tmpl:r,count:1})});const a=s.reduce((r,c)=>r+c.count,0);if(i!==6){v("alert"),q(`星际战士 (死亡天使) 必须刚好选择 6 人！当前选择了 ${i} 人。`,"error");return}if(t!==1){v("alert"),q("星际战士 必须选择且仅选择 1 名队长！","error");return}if(a!==6){v("alert"),q(`瘟疫守卫 必须刚好选择 6 人！当前选择了 ${a} 人。`,"error");return}if(!((d=document.getElementById("check-pm_1"))==null?void 0:d.checked)){v("alert"),q("瘟疫守卫 的 冠军队长 (Plague Champion) 是强制出战的 Leader 角色！","error");return}o.operatives=[],e.forEach(({tmpl:r,count:c})=>{for(let m=0;m<c;m++){const u=c>1?`${r.id}_${m+1}`:r.id,f=c>1?`${r.name} #${m+1}`:r.name;o.operatives.push(new Ie(u,f,"Space Marine",r.wounds,r.apl,r.df,r.sv,r.weapons,r.defaultAvatar,r.move||6))}}),s.forEach(({tmpl:r,count:c})=>{for(let m=0;m<c;m++){const u=c>1?`${r.id}_${m+1}`:r.id,f=c>1?`${r.name} #${m+1}`:r.name;o.operatives.push(new Ie(u,f,"Plague Marine",r.wounds,r.apl,r.df,r.sv,r.weapons,r.defaultAvatar,r.move||5))}});const p=document.getElementById("mission-type");p&&(o.missionType=p.value),S(`  - 当前任务: ${Fe[o.missionType]||o.missionType}`),document.getElementById("start-screen").style.display="none",document.getElementById("global-dash").style.display="grid",document.getElementById("battle-area").style.display="grid",document.getElementById("guidance-banner").style.display="flex",S(">>> 战队挑选部署完毕！"),S(`  - Angels of Death (星际战士) 登场: ${o.operatives.filter(r=>r.faction==="Space Marine").map(r=>r.name).join(", ")}`),S(`  - Plague Marines (瘟疫守卫) 登场: ${o.operatives.filter(r=>r.faction==="Plague Marine").map(r=>r.name).join(", ")}`),Q(),G(),Ge()}function G(){const e=document.getElementById("sm-ops-list"),t=document.getElementById("pm-ops-list");e.innerHTML="",t.innerHTML="";let i=0,s=0;o.operatives.forEach(a=>{const l=a.faction==="Space Marine";l&&!a.isDead&&i++,!l&&!a.isDead&&s++;const p=document.createElement("div");let d=`op-card ${l?"sm-theme":"pm-theme"}`;a.isDead?d+=" dead":a.hasActed&&(d+=" activated"),o.activeAgent&&o.activeAgent.id===a.id&&(d+=" active-target"),p.className=d;const r=a.wounds/a.maxWounds*100,c=a.weapons.map(b=>b.name.split(" ")[0]).join(" / ");let m="";!l&&o.pmActivePloys.includes("contagious_resilience")&&!a.isDead&&(m='<span class="card-ploy-tag" style="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(122,184,138,0.15);">减伤重投</span>');let u="";a.isDead||(a.hasConceal&&(u+='<span class="card-ploy-tag" style="border-color:#818cf8; color:#818cf8; background:rgba(129,140,248,0.15); font-size:0.6rem;">隐蔽</span>'),a.isInjured&&(u+='<span class="card-ploy-tag" style="border-color:var(--red); color:var(--red); background:rgba(184,76,76,0.15); font-size:0.6rem;">重伤</span>'),a.poisonTokens>0&&(u+='<span class="card-ploy-tag" style="border-color:#7ab88a; color:#7ab88a; background:rgba(122,184,138,0.15); font-size:0.6rem;">毒素×'+a.poisonTokens+"</span>"));const f=!a.isDead&&!a.hasActed&&o.phase==="Firefight"&&o.activeTurn===a.faction,g=o.activeAgent&&o.activeAgent.id===a.id,w=(f||g)&&!a.orderSwitchedThisActivation,T=(f||g)&&a.orderSwitchedThisActivation,k=w?`<button class="conceal-toggle-btn" onclick="event.stopPropagation(); toggleConceal('${a.id}')" title="切换命令 (每激活限 1 次)" style="font-size:0.65rem; padding:2px 6px; margin-left:4px; background:${a.hasConceal?"rgba(129,140,248,0.3)":"transparent"}; border:1px solid #818cf8; color:#818cf8; border-radius:4px; cursor:pointer;">${a.hasConceal?"🛡️隐蔽":"🛡️"}</button>`:T?'<button class="conceal-toggle-btn" disabled title="本激活已切换过命令" style="font-size:0.65rem; padding:2px 6px; margin-left:4px; background:transparent; border:1px solid #475569; color:#475569; border-radius:4px; cursor:not-allowed; opacity:0.5;">🛡️已切换</button>':"",B=me(a.id,a.faction);p.innerHTML=`
      <div style="position:absolute;top:3px;right:6px;color:var(--imperial-gold);font-size:10px;opacity:0.4;pointer-events:none;z-index:1;">✦</div>
      <div class="op-card-top">
        <div class="op-avatar-row">
          ${B}
          <span class="op-card-title">${a.name} ${m} ${u} ${k}</span>
        </div>
        <span class="op-card-tag">${a.currentApl} APL${a.isInjured?' <span style="color:var(--red); font-size:0.6rem;">(-1)</span>':""}</span>
      </div>
      <div class="op-card-hp">
        <span>HP (Wounds):</span>
        <span>${a.wounds} / ${a.maxWounds}</span>
      </div>
      <div class="op-hp-bar-container">
        <div class="op-hp-bar" style="width: ${r}%; background-color: ${r<40?"var(--red)":"var(--green)"}"></div>
      </div>
      <div class="op-card-stats">
        <span>Move: <strong>${a.currentMove}"</strong>${a.isInjured?' <span style="color:var(--red); font-size:0.55rem;">(-2)</span>':""}</span>
        <span>DF: <strong>${a.df}</strong></span>
        <span>SV: <strong>${a.sv}+</strong></span>
        <span style="font-size: 0.65rem; color: #5a5d65; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">
          ${c}
        </span>
      </div>
    `,p.setAttribute("role","button"),p.setAttribute("tabindex","0"),p.setAttribute("aria-label",`${a.name}，HP: ${a.wounds}/${a.maxWounds}，${a.isDead?"已阵亡":a.hasActed?"已激活":"可激活"}`),o.pendingActivation&&o.pendingActivation.id===a.id&&p.classList.add("pending-activation"),!a.isDead&&!a.hasActed&&o.phase==="Firefight"&&o.activeTurn===a.faction&&!o.activeAgent?(p.onclick=()=>ke(a.id),p.onkeydown=b=>{(b.key==="Enter"||b.key===" ")&&(b.preventDefault(),ke(a.id))}):(p.onclick=null,p.onkeydown=null,a.isDead&&p.setAttribute("aria-disabled","true")),l?e.appendChild(p):t.appendChild(p)}),document.getElementById("sm-alive-count").textContent=`${i} / 6 存活`,document.getElementById("pm-alive-count").textContent=`${s} / 6 存活`}function Pt(e){v("click");const t=o.operatives.find(i=>i.id===e);if(!(!t||t.isDead)){if(t.orderSwitchedThisActivation){q("本激活已切换过命令 (每激活限切换 1 次)！","warning");return}t.toggleConceal(),t.orderSwitchedThisActivation=!0,S(`[命令切换] ${t.name} ${t.hasConceal?"进入隐蔽状态 (Conceal Order)，不可被指定为射击/近战目标。":"切换为交战状态 (Engage Order)。"}`),G(),H()}}function ke(e){v("click");const t=o.operatives.find(i=>i.id===e);!t||t.isDead||t.hasActed||o.phase!=="Firefight"||o.activeTurn!==t.faction||o.activeAgent||(o.pendingActivation&&o.pendingActivation.id===e?o.pendingActivation=null:o.pendingActivation=t,G(),H())}function At(){const e=o.pendingActivation;e&&(o.pendingActivation=null,Ke(e.id))}function Mt(){v("click"),o.pendingActivation=null,G(),H()}function Ke(e){v("click");const t=o.operatives.find(i=>i.id===e);if(!(!t||t.isDead||t.hasActed)){if(o.activeAgent=t,o.pendingActivation=null,t.actionsPerformed=[],t.orderSwitchedThisActivation=!1,t.poisonTokens>0&&(S(`[毒素] ${t.name} 携带毒素标记，激活开始受到 1 点伤害！`),t.applyWounds(1),t.isDead)){G(),H();return}t.apl=t.currentApl,S(`[激活] ${t.name} 开始激活，获得 ${t.apl} APL！${t.isInjured?" (Injured: APL -1)":""}`),G(),H()}}function H(){const e=document.getElementById("active-panel-content"),t=document.getElementById("active-panel-empty"),i=document.getElementById("active-panel-status"),s=document.getElementById("active-panel"),a=document.getElementById("turn-indicator"),l=document.getElementById("turn-indicator-faction"),p=document.querySelector(".turn-indicator-label");if(a&&o.phase==="Firefight"){a.style.display="flex";const g=o.activeTurn==="Space Marine"?"死亡天使":"瘟疫守卫";l&&(l.textContent=g),a.className=`turn-indicator ${o.activeTurn==="Space Marine"?"sm-turn":"pm-turn"}`,p&&(o.activeAgent?p.textContent=" — 正在行动":o.pendingActivation?p.textContent=" — 请确认激活":p.textContent="的回合 — 请选择特工")}else a&&(a.style.display="none");const d=document.getElementById("pending-activation-panel");if(d)if(o.pendingActivation&&!o.activeAgent){d.style.display="flex";const g=o.pendingActivation,w=document.getElementById("pending-op-avatar");w&&(w.innerHTML=me(g.id,g.faction)),document.getElementById("pending-op-name").textContent=g.name,document.getElementById("pending-op-faction").textContent=g.faction==="Space Marine"?"死亡天使":"瘟疫守卫",document.getElementById("pending-op-move").textContent=g.currentMove+'"',document.getElementById("pending-op-hp").textContent=`${g.wounds}/${g.maxWounds}`,document.getElementById("pending-op-apl").textContent=g.currentApl}else d.style.display="none";const r=document.getElementById("sm-board"),c=document.getElementById("pm-board"),m=o.phase==="Firefight",u=m&&o.activeTurn==="Space Marine",f=m&&o.activeTurn==="Plague Marine";if(r&&(r.classList.toggle("active-turn",u),r.classList.toggle("inactive-turn",m&&!u)),c&&(c.classList.toggle("active-turn",f),c.classList.toggle("inactive-turn",m&&!f)),o.activeAgent){e.style.display="flex",t.style.display="none";const g=o.activeAgent;i.textContent="当前激活特工";const w=document.getElementById("active-op-avatar-container");w&&(w.innerHTML=me(g.id,g.faction)),s.className=`active-card ${g.faction==="Space Marine"?"sm-active":"pm-active"}`,document.getElementById("active-op-name").textContent=g.name,document.getElementById("active-op-faction").textContent=g.faction==="Space Marine"?"死亡天使":"瘟疫守卫";const T=document.getElementById("active-apl-dots");T.innerHTML="";for(let L=0;L<g.maxApl;L++){const oe=document.createElement("div");oe.className="apl-dot"+(L<g.apl?" active":""),T.appendChild(oe)}const k=g.actionsPerformed.includes("Move"),B=g.actionsPerformed.includes("Charge"),b=g.actionsPerformed.includes("Advance"),x=g.actionsPerformed.includes("Dash"),C=g.weapons.some(L=>L.hasRule("Heavy")),V=g.actionsPerformed.includes("FallBack"),A=g.actionsPerformed.filter(L=>L==="Shoot").length,M=g.actionsPerformed.filter(L=>L==="Fight").length,E=A>0,R=M>0,I=g.counteracting===!0,U=k||B||b||x||V,N=b||V,$=x&&!C,Y=I?1:2,Pe=I?1:2,Ae=!I&&R,Me=!I&&E,nt=A>=Y,at=M>=Pe;document.getElementById("action-move").disabled=g.apl<1||U||I,document.getElementById("action-charge").disabled=I?!0:g.apl<1||U||R||E||g.hasConceal,document.getElementById("action-advance").disabled=g.apl<1||U||R||E||I,document.getElementById("action-dash").disabled=g.apl<1||U||R||E||I,document.getElementById("action-fallback").disabled=g.apl<2||U||R||E||I;const it=C&&!x&&g.weapons.every(L=>L.hasRule("Heavy")),ot=g.weapons.some(L=>L.hasRule("Silent")),st=g.hasConceal&&!ot;document.getElementById("action-shoot").disabled=g.apl<1||nt||Ae||B||N||$||it||st,document.getElementById("action-fight").disabled=g.apl<1||at||Me||N||x;const lt=g.faction==="Plague Marine"&&o.pmActivePloys.includes("contagious_resilience"),Ee=document.getElementById("active-ploys-display");if(Ee){const L=[];I&&L.push('<span style="color:#f97316;">⚡ 反击 (Counteract): 仅限 1 次行动, 移动≤2", 不可冲锋</span>'),b&&L.push('<span style="color:#f59e0b;">🏃💨 已前进 (Advance): 不能再射击/近战</span>'),x&&L.push(`<span style="color:#f59e0b;">💨💨 已冲刺 (Dash): 不能再近战${C?"，仅 Heavy 武器可射击":"，不能射击"}</span>`),V&&L.push('<span style="color:#f59e0b;">🔙 已撤退 (Fall Back): 不能再射击/近战</span>'),E&&!I&&L.push(`<span style="color:#6a9ad4;">💥 Astartes: 已射击×${A}，锁定近战</span>`),R&&!I&&L.push(`<span style="color:#f87171;">⚔️ Astartes: 已近战×${M}，锁定射击</span>`),lt&&L.push('<span style="color:var(--pm-accent);">🛡️ 传染韧性生效中</span>'),Ee.innerHTML=L.length>0?L.join(" | "):""}const Le=document.querySelector("#action-shoot span:first-child");if(Le){const L=Y-A,oe=Ae?" (已锁定)":"";Le.innerHTML=`💥 射击 [${L>0?L:0}次剩余${oe}]`}const Be=document.querySelector("#action-fight span:first-child");if(Be){const L=Pe-M,oe=Me?" (已锁定)":"";Be.innerHTML=`⚔️ 近战 [${L>0?L:0}次剩余${oe}]`}j(`【特工行动】${g.name} 剩余 APL: ${g.apl}。可执行移动/冲锋/前进/冲刺/撤退/射击/近战，或点击下方按钮结束。`)}else if(o.pendingActivation)e.style.display="none",t.style.display="none",i.textContent="等待确认",s.className="active-card",j(`【预选确认】已选中【${o.pendingActivation.name}】。请在右侧面板点击「确认激活」或「取消」。`);else{e.style.display="none",t.style.display="block",i.textContent="等待特工激活",s.className="active-card";const g=o.activeTurn,w=g==="Space Marine"?"死亡天使":"瘟疫守卫";ee(g)?j(`【激活提示】请从${g==="Space Marine"?"左边":"右边"}【${w}】战队卡片列表中选择点击发亮的特工卡片，载入动作。`):ee(g==="Space Marine"?"Plague Marine":"Space Marine")?j("【激活换边】因为当前轮次已无可用单位，权能自动转回另一方。请继续点击激活。"):j("【激活结束】双方所有特工已耗尽激活！请点击右上角的回合推进至下一TP。")}}function Et(){const e=o.activeAgent;!e||e.apl<1||(v("click"),e.apl-=1,e.actionsPerformed.push("Move"),e.counteracting?S(`  - ${e.name} 执行 [反击移动]，消耗 1 AP。⚠️ 物理沙盘移动不得超过 2"！`):S(`  - ${e.name} 执行 [移动 (Move)]，消耗 1 APL。`),H())}function Lt(){const e=o.activeAgent;!e||e.apl<1||(v("click"),e.apl-=1,e.actionsPerformed.push("Charge"),S(`  - ${e.name} 执行 [冲锋 (Charge)]，移动最多 ${e.currentMove+2}" 并贴入敌方控制范围，消耗 1 APL。`),H())}function Bt(){const e=o.activeAgent;!e||e.apl<1||(v("click"),e.apl-=1,e.actionsPerformed.push("Advance"),S(`  - ${e.name} 执行 [前进 (Advance)]，移动距离 +3" (总计 ${e.currentMove+3}")，但本激活不能再射击/近战。`),H())}function Dt(){const e=o.activeAgent;!e||e.apl<1||(v("click"),e.apl-=1,e.actionsPerformed.push("Dash"),S(`  - ${e.name} 执行 [冲刺 (Dash)]，移动最多 3" (lite 规则，且不能攀爬)，本激活不能再射击/近战 (Heavy Dash-only 武器除外)。`),H())}function It(){const e=o.activeAgent;if(!e||e.apl<2){e&&S(`  - ❌ ${e.name} APL 不足 (${e.apl}/2)，无法执行撤退 (Fall Back)。`);return}v("click"),e.apl-=2,e.actionsPerformed.push("FallBack"),S(`  - ${e.name} 执行 [撤退 (Fall Back)]，脱离交战区域 (移动最多 ${e.currentMove}")，消耗 2 APL。本激活不能再射击/近战。`),H()}function Rt(){v("click");const e=o.activeAgent;e&&(e.counteracting&&(S(`[反击结束] ${e.name} 的反击行动完毕。`),e.counteracting=!1),e.hasActed=!0,e.apl=0,S(`[结束激活] ${e.name} 结束了本次激活。`),o.activeAgent=null,o.pendingActivation=null,mt())}function Ge(){o.phase="Initiative",Q(),ve();const e=document.getElementById("phase-overlay-content");e.innerHTML=`
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
  `,j("【先攻阶段】点击按钮开始判定本回合先手优势权。")}function ve(){const e=document.getElementById("phase-overlay");e.style.display="flex";const t=document.getElementById("phase-overlay-content");t&&(t.classList.add("gothic-panel"),t.querySelector(".gothic-arch")||t.insertAdjacentHTML("afterbegin",'<div class="gothic-arch"></div>')),ce(e)}function Ce(){document.getElementById("phase-overlay").style.display="none",de()}function Vt(){const e=document.getElementById("counteract-overlay");e&&(e.style.display="none"),de()}function Ue(e){const t=document.getElementById("counteract-overlay"),i=document.getElementById("counteract-content"),s=e==="Space Marine"?"死亡天使":"瘟疫守卫",a=e==="Space Marine"?"#6a9ad4":"var(--pm-accent)",l=o.operatives.filter(d=>d.faction===e&&!d.isDead&&d.hasActed&&!d.hasConceal);let p="";l.forEach(d=>{p+=`
      <div class="counteract-op-row" onclick="selectCounteractOperative('${d.id}')" style="
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
          <img src="${d.defaultAvatar}" style="width:100%; height:100%; object-fit:cover;" alt="${d.name}" />
        </div>
        <div style="flex:1;">
          <div style="font-weight:600; color:#fff; font-size:0.85rem;">${d.name}</div>
          <div style="font-size:0.7rem; color:var(--text-muted);">HP: ${d.wounds}/${d.maxWounds} | 武器: ${d.weapons.length} 种</div>
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
      ${l.length>0?p:'<p style="color:var(--text-muted); text-align:center; padding:20px;">无符合条件的特工 (需要 Engage 标记且存活)</p>'}
    </div>

    <div style="display:flex; gap:10px;">
      <button class="btn-large" onclick="skipCounteract()" style="flex:1; padding:10px 20px; font-size:0.85rem; background:rgba(100,116,139,0.2); border-color:#475569;">
        跳过反击 (Skip)
      </button>
    </div>
  `,t.style.display="flex",ce(t)}function Ht(e){v("crit"),ut(e)}function Ot(){v("click"),ze()}function zt(){const e=document.getElementById("overlay-init-sm-dice"),t=document.getElementById("overlay-init-pm-dice"),i=document.getElementById("btn-overlay-roll");i.disabled=!0,e.innerHTML='<div class="kt-dice-cube sm-dice rolling">?</div>',t.innerHTML='<div class="kt-dice-cube pm-dice rolling">?</div>',v("shoot"),setTimeout(()=>{const s=Math.floor(Math.random()*6)+1;e.innerHTML=`<div class="kt-dice-cube sm-dice ${s===6?"crit-dice":""}">${s}</div>`,v("click"),s===6&&v("crit"),setTimeout(()=>{const a=Math.floor(Math.random()*6)+1;if(t.innerHTML=`<div class="kt-dice-cube pm-dice ${a===6?"crit-dice":""}">${a}</div>`,v("click"),a===6&&v("crit"),s===a)v("alert"),document.getElementById("overlay-init-sm-val").textContent=`平局 [${s}]`,document.getElementById("overlay-init-pm-val").textContent=`平局 [${a}]`,i.disabled=!1,i.textContent="平局！重新投骰",S(`  - 先攻判定平局 [${s}]，准备重投...`);else{const p=(s>a?"Space Marine":"Plague Marine")==="Space Marine"?"死亡天使":"瘟疫守卫";v("crit"),i.style.display="none",document.getElementById("overlay-init-sm-val").textContent=`点数: ${s}`,document.getElementById("overlay-init-pm-val").textContent=`点数: ${a}`,S(`  - 先攻判定掷骰：死亡天使 [${s}] vs 瘟疫守卫 [${a}]`),S(`  - 【${p}】赢得了投骰，准备选择先攻权归属。`);const d=document.getElementById("phase-overlay-content"),r=document.createElement("div");r.style.cssText="border-top:1px solid var(--panel-border); margin-top:16px; padding-top:16px; width:100%;",r.innerHTML=`
            <p style="color:var(--sm-accent); font-weight:bold; margin-bottom:10px;">👑 【${p}】选择首发玩家：</p>
            <div id="turn-order-buttons" style="display:flex; gap:10px; margin-bottom:10px;">
              <button class="qa-btn turn-order-btn" data-faction="Space Marine" onclick="selectTurnOrder('Space Marine')" style="flex:1;">死亡天使先攻</button>
              <button class="qa-btn turn-order-btn" data-faction="Plague Marine" onclick="selectTurnOrder('Plague Marine')" style="flex:1;">瘟疫守卫先攻</button>
            </div>
            <button id="btn-confirm-turn-order" class="btn-large" onclick="confirmTurnOrder()" style="display:none; padding:10px 30px; font-size:0.9rem; width:100%; margin-top:8px;">
              确认首发选择
            </button>
        `,d.appendChild(r),j(`【选择先后】王座归属：【${p}】玩家获胜，请点击按钮选择首发方并确认。`)}},300)},700)}function Nt(e){v("click"),document.querySelectorAll(".turn-order-btn").forEach(a=>{a.dataset.faction===e?(a.classList.add("selected"),a.style.background="linear-gradient(135deg, var(--imperial-gold), #8a6a1c)",a.style.color="#000",a.style.borderColor="var(--imperial-gold-bright)",a.style.boxShadow="0 0 12px rgba(201, 168, 76, 0.5)"):(a.classList.remove("selected"),a.style.background="",a.style.color="",a.style.borderColor="",a.style.boxShadow="")});const i=document.getElementById("btn-confirm-turn-order");i&&(i.style.display="block",i.dataset.pending=e),j(`【预选首发】已选中【${e==="Space Marine"?"死亡天使":"瘟疫守卫"}】为先攻方，请点击确认按钮完成选择。`)}function Ft(){const e=document.getElementById("btn-confirm-turn-order"),t=e&&e.dataset.pending;t&&(v("crit"),o.initiative=t,o.activeTurn=t,S(`  - 确认：【${t==="Space Marine"?"死亡天使":"瘟疫守卫"}】获得本回合的先攻优势！`),Qe())}function Qe(){const e=o.phase;if(o.phase="Strategy",e!=="Strategy")if(o.turningPoint===1)o.smCp+=1,o.pmCp+=1,S("  💰 第1回合策略阶段：双方各获得 1 CP。");else{const i=o.initiative,s=i==="Space Marine"?"Plague Marine":"Space Marine";i==="Space Marine"?(o.smCp+=1,o.pmCp+=2):(o.pmCp+=1,o.smCp+=2);const a=l=>l==="Space Marine"?"死亡天使":"瘟疫守卫";S(`  💰 TP${o.turningPoint} 策略阶段：${a(i)}(先攻) +1 CP, ${a(s)} +2 CP。`)}Q(),ve();const t=document.getElementById("phase-overlay-content");t.innerHTML=`
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
  `,j("【策略阶段】双方轮流消费 1 CP 采购策略 Ploys。按 Proceed 按钮进入实际交火战斗。")}function jt(e){if(e==="sm")if(o.smActivePloys.includes("bolter_discipline"))v("click"),o.smActivePloys=[],o.smCp+=1;else{if(o.smCp<1){v("alert"),q("死亡天使 CP 不足！","warning");return}v("crit"),o.smActivePloys.push("bolter_discipline"),o.smCp-=1,S("  - 死亡天使激活策略：【爆弹惩戒】！本回合可双击开火！")}else if(o.pmActivePloys.includes("contagious_resilience"))v("click"),o.pmActivePloys=[],o.pmCp+=1;else{if(o.pmCp<1){v("alert"),q("瘟疫守卫 CP 不足！","warning");return}v("crit"),o.pmActivePloys.push("contagious_resilience"),o.pmCp-=1,S("  - 瘟疫守卫激活策略：【传染韧性】！DR首发失败可重投！")}Qe()}function Wt(){v("click"),Ce(),o.phase="Firefight",Q(),S(`
【战斗阶段开始】Turning Point ${o.turningPoint}`),S(`>>> 首发方【${o.activeTurn==="Space Marine"?"死亡天使":"瘟疫守卫"}】可以激活一名特工。`),G(),H(),j("【特工激活期】在两侧列表中点击未激活的特工（高亮）卡片，载入中央控制板执行动作。")}function _t(e){v("click");const t=gt[e];if(!t)return;document.getElementById("help-title").textContent=t.title,document.getElementById("help-body").innerHTML=t.body;const i=document.getElementById("help-modal");i.style.display="flex",ce(i)}function Ye(){v("click"),document.getElementById("help-modal").style.display="none",de()}function qt(e){v("funeral");const t=document.getElementById("death-overlay"),i=document.getElementById("death-model-name"),s=document.getElementById("death-model-faction"),a=document.getElementById("death-gag-text");if(t){i.textContent=e.name,s.textContent=e.faction==="Space Marine"?"死亡天使 (Angels of Death)":"瘟疫守卫 (Plague Marines)";const l=Math.floor(Math.random()*De.length);a.textContent=De[l],t.style.display="flex",ce(t)}S(`[阵亡提示] 特工 ${e.name} 已阵亡！请在物理沙盘中移除模型。`)}function Je(){v("click");const e=document.getElementById("death-overlay");e&&(e.style.display="none",de()),Kt()}function Kt(){if(o.gameOver)return;const e=o.operatives.filter(i=>i.faction==="Space Marine"&&!i.isDead).length,t=o.operatives.filter(i=>i.faction==="Plague Marine"&&!i.isDead).length;e===0&&t===0?(o.gameOver=!0,se("draw","双方均全员阵亡，战斗以同归于尽平局告终！")):e===0?(o.gameOver=!0,se("pm",`死亡天使战队全员阵亡！
瘟疫守卫 (Plague Marines) 成功清剿了残敌，夺取了战场的完全控制权！`)):t===0&&(o.gameOver=!0,se("sm",`瘟疫守卫战队全员阵亡！
死亡天使 (Angels of Death) 肃清了战场，坚守住帝国的光荣防线！`))}function se(e,t){ve();const i=document.getElementById("phase-overlay-content");let s="🎉 对局结束 🎉",a="var(--text-main)";e==="sm"?(s="🏆 死亡天使 (Angels of Death) 荣获胜利！ 🏆",a="#6a9ad4"):e==="pm"?(s="🏆 瘟疫守卫 (Plague Marines) 荣获胜利！ 🏆",a="var(--pm-accent)"):e==="draw"&&(s="🤝 双方同归于尽 (Match Draw) 🤝",a="var(--sm-accent)"),i.innerHTML=`
    <h3 style="color: ${a}; font-size: 1.4rem; margin-bottom: 12px;">${s}</h3>
    <div class="qa-card" style="margin-bottom: 20px; font-size: 0.95rem; text-align: center; line-height: 1.6; border-color: rgba(255,255,255,0.1);">
      <p style="white-space: pre-line; color: var(--text-main);">${t}</p>
    </div>
    <button class="btn-large" onclick="confirmReset()" style="padding: 10px 30px; font-size:0.9rem; background: var(--red); border-color: #b84c4c; width: 100%;">
      返回主菜单并重置对局
    </button>
  `}function Xe(e=!1){o.phase="TurnEndScoring",o.isFinalScoring=e,Q(),ve();const t=o.operatives.filter(l=>l.faction==="Plague Marine"&&l.isDead).length,i=o.operatives.filter(l=>l.faction==="Space Marine"&&l.isDead).length,s=t-o.smKillsScored,a=i-o.pmKillsScored;o.tempSmChecklist=[!1,!1,!1,!1,!1],o.tempPmChecklist=[!1,!1,!1,!1,!1],o.tempSmObjManualOffset=0,o.tempPmObjManualOffset=0,o.tempSmObjVp=0,o.tempPmObjVp=0,o.tempSmKillVp=s,o.tempPmKillVp=a,o.tempSmKills=t,o.tempPmKills=i,Te(),j("【回合结算】引导计算 VP：请输入双方本回合完成任务的 VP，并确认得分结算。")}function Te(){const e=document.getElementById("phase-overlay-content"),t=o.tempSmKillVp+o.tempSmObjVp,i=o.tempPmKillVp+o.tempPmObjVp,s=Re[o.missionType]||Re.custom,a=Fe[o.missionType]||"自定义任务",l=(c,m,u)=>s.map((f,g)=>`
      <label class="scoring-item">
        <input type="checkbox" ${u?`style="accent-color: ${u};"`:""} ${m[g]?"checked":""} onchange="toggleScoringChecklist('${c}', ${g})">
        <span>${f}</span>
      </label>
    `).join(""),p=o.turningPoint>=5,d=p?"确认结算并完成对局":"确认结算并推进回合",r=p?"declareScoreVictory()":"confirmTurnEndScoring()";e.innerHTML=`
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

    <button class="btn-large" onclick="${r}" style="padding: 12px 30px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #2a5a3a); border-color:#4a7c59; box-shadow:none; width: 100%;">
      ${d}
    </button>
  `}function Gt(e,t){v("click"),e==="sm"?(o.tempSmChecklist[t]=!o.tempSmChecklist[t],o.tempSmObjVp=Math.max(0,o.tempSmChecklist.filter(Boolean).length+o.tempSmObjManualOffset)):(o.tempPmChecklist[t]=!o.tempPmChecklist[t],o.tempPmObjVp=Math.max(0,o.tempPmChecklist.filter(Boolean).length+o.tempPmObjManualOffset)),Te()}function Ut(e,t){v("click"),e==="sm"?(o.tempSmObjManualOffset+=t,o.tempSmObjVp=Math.max(0,o.tempSmChecklist.filter(Boolean).length+o.tempSmObjManualOffset)):(o.tempPmObjManualOffset+=t,o.tempPmObjVp=Math.max(0,o.tempPmChecklist.filter(Boolean).length+o.tempPmObjManualOffset)),Te()}function Qt(){v("crit");const e=o.tempSmKillVp+o.tempSmObjVp,t=o.tempPmKillVp+o.tempPmObjVp;o.smVp+=e,o.pmVp+=t,o.smKillsScored=o.tempSmKills,o.pmKillsScored=o.tempPmKills,S(`
--- Turning Point ${o.turningPoint} 回合结算结果 ---`),S(`[死亡天使] 新增 ${e} VP (任务:${o.tempSmObjVp}, 击杀:${o.tempSmKillVp}) | 累计 VP: ${o.smVp}`),S(`[瘟疫守卫] 新增 ${t} VP (任务:${o.tempPmObjVp}, 击杀:${o.tempPmKillVp}) | 累计 VP: ${o.pmVp}`),Ce(),dt()}function Yt(){v("crit");const e=o.tempSmKillVp+o.tempSmObjVp,t=o.tempPmKillVp+o.tempPmObjVp;o.smVp+=e,o.pmVp+=t,o.smKillsScored=o.tempSmKills,o.pmKillsScored=o.tempPmKills,o.gameOver=!0,Q();let i=`双方经历五回合激烈交火，战斗正式落幕！
最终战队积分：
死亡天使: ${o.smVp} VP
瘟疫守卫: ${o.pmVp} VP

`;o.smVp===o.pmVp?se("draw",i+"双方得分平分秋色，本局握手言和！"):o.smVp>o.pmVp?se("sm",i+"死亡天使胜利点数更高，赢得最终胜利！"):se("pm",i+"瘟疫守卫胜利点数更高，赢得最终胜利！")}function Jt(e,t){e.stopPropagation();const i=document.getElementById("global-avatar-uploader");i&&(i.dataset.targetOpId=t,i.value="",i.click())}function Xt(e){const t=e.target.files[0];if(!t)return;const i=e.target.dataset.targetOpId;if(!i)return;const s=new FileReader;s.onload=function(a){const l=a.target.result;o.customAvatars[i]=l,$e(),G(),H(),S(`[头像上传] 成功更新特工 [${i}] 的自定义照片！`)},s.readAsDataURL(t)}function Zt(e,t="normal"){vt.matches||(document.body.classList.remove("intense-shake"),document.body.offsetWidth,document.body.classList.add("intense-shake"),setTimeout(()=>{document.body.classList.remove("intense-shake")},400));const i=document.createElement("div");i.className="impact-effect-text",i.textContent=e,t==="strike"?(i.style.color="var(--red)",i.style.textShadow="0 0 20px rgba(225, 29, 72, 0.85), 0 0 40px #000"):t==="parry"?(i.style.color="#38bdf8",i.style.textShadow="0 0 20px rgba(56, 189, 248, 0.85), 0 0 40px #000"):t==="shoot"?i.style.color="var(--sm-accent)":t==="deflect"&&(i.style.color="#7ab88a",i.style.textShadow="0 0 20px rgba(163, 230, 53, 0.85), 0 0 40px #000"),document.body.appendChild(i),setTimeout(()=>{i.remove()},1800)}function en(e,t){[`.duel-avatar-${e}`,`.main-avatar-${e}`].forEach(s=>{const a=document.querySelector(s);if(!a)return;a.classList.remove("avatar-hit-flash"),a.querySelectorAll(".bullet-hole-effect, .slash-effect").forEach(d=>d.remove()),a.offsetWidth,a.classList.add("avatar-hit-flash");const p=document.createElement("div");p.className=t==="shoot"?"bullet-hole-effect":"slash-effect",a.appendChild(p),setTimeout(()=>{a.classList.remove("avatar-hit-flash"),p.remove()},900)})}const y={};function tn(e){Object.assign(y,e)}window.matchMedia("(prefers-reduced-motion: reduce)");let W=!1,_=[];function Z(e,t){const i=setTimeout(e,t);return _.push(i),i}function Ze(){const e=document.getElementById("combat-modal");e.style.display="flex",document.getElementById("modal-btn-next").disabled=!0}function he(){v("click"),document.getElementById("combat-modal").style.display="none",W=!1,_=[],y.renderOperatives(),y.updateActivePanel()}function Se(){var e;if(v("click"),n.actionType==="shoot"){if(n.step===3){if(!n.inRangeAndVisible){v("alert");return}if(n.inCoverConcealed){v("alert");return}const t=n.weapon.rules.find(i=>i.startsWith("Torrent"));if(t){const i=parseInt(((e=t.match(/\d+/))==null?void 0:e[0])||n.weapon.attacks);n.attackRolls=[],n.attackCrit=0,n.attackNorm=i,n.step=5,O();return}}else if(n.step===4&&n.mode==="manual"){if(un(),n.attackRolls.length===0)return}else if(n.step===5&&n.mode==="manual"){fn();const t=document.getElementById("manual-def-dice-val");if(t&&t.value.trim()!==""&&n.defenseRolls.length===0)return}}else if(n.actionType==="fight"&&n.step===3){if(!n.inMeleeRange){v("alert");return}if(n.hasFallenBack){v("alert");return}}n.step++,n.actionType==="shoot"?O():n.actionType==="fight"&&J()}function et(){v("click");const e=o.activeAgent;if(!e)return;const t=document.querySelector("#combat-modal .modal-content");if(t&&(t.style.backgroundImage='linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("assets/images/backgrounds/bg_shoot_action.png")',t.style.backgroundSize="cover",t.style.backgroundPosition="center"),Object.assign(n,{actionType:"shoot",step:1,attacker:e,defender:null,weapon:e.weapons.filter(m=>m.isRanged)[0]||null,inRangeAndVisible:!0,inCoverConcealed:!1,inCover:!1,mode:"random",attRerollIndex:-1,defRerollIndex:-1,attackRolls:[],defenseRolls:[],stunApplied:!1,shockTriggered:!1}),!n.weapon)return;n.weapon.hasRule&&n.weapon.hasRule("Torrent")&&y.addLog(`[激流] ${n.weapon.name}：Torrent 规则生效！当前简化为仅对主目标射击。完整多目标选择待后续版本实现。`),n.weapon.hasRule&&n.weapon.hasRule("Blast")&&y.addLog(`[爆炸] ${n.weapon.name}：Blast 规则生效！当前简化为仅对主目标。完整 AoE 待后续版本实现。`),n.weapon.hasRule&&n.weapon.hasRule("Balanced")&&y.addLog(`[平衡] ${n.weapon.name}：Balanced 规则生效！可重投 1 个攻击骰（需手动操作）。`),n.weapon.hasRule&&n.weapon.hasRule("Ceaseless")&&y.addLog(`[不息] ${n.weapon.name}：Ceaseless 规则生效！可重投投出特定值的骰子（需手动操作）。`),n.weapon.hasRule&&n.weapon.hasRule("Relentless")&&y.addLog(`[无情] ${n.weapon.name}：Relentless 规则生效！可重投任意攻击骰（需手动操作）。`),n.weapon.hasRule&&n.weapon.hasRule("Limited")&&y.addLog(`[有限] ${n.weapon.name}：Limited 规则生效！每场战斗有使用次数限制（当前未追踪）。`),n.weapon.hasRule&&n.weapon.hasRule("Seek")&&y.addLog(`[寻的] ${n.weapon.name}：Seek 规则生效！隐蔽单位不能利用地形掩体。`),n.weapon.rules.some(m=>m.startsWith("Range"))&&y.addLog(`[射程] ${n.weapon.name}：Range 规则生效！有最大射程限制（当前未检查）。`),Ze(),O()}function O(){var a,l,p;const e=document.getElementById("modal-title"),t=document.getElementById("modal-body"),i=document.getElementById("modal-btn-next"),s=document.getElementById("modal-btn-cancel");if(i.onclick=Se,s.style.display="inline-block",n.step===1){e.textContent="射击结算 - 步骤 1: 选择目标";const d=n.attacker.faction==="Space Marine"?"Plague Marine":"Space Marine",r=o.operatives.filter(u=>u.faction===d&&!u.isDead),c=r.filter(u=>!u.hasConceal);if(r.length>0&&c.length===0){t.innerHTML='<p style="color:var(--red);">所有敌方特工均处于隐蔽状态，无法被指定为射击目标。</p>',i.disabled=!0;return}if(c.length===0){t.innerHTML='<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>',i.disabled=!0;return}let m='<div class="weapon-picker-list">';c.forEach(u=>{const f=u.isInjured?' <span style="color:var(--red); font-size:0.7rem;">[重伤]</span>':"",g=u.poisonTokens>0?' <span style="color:#7ab88a; font-size:0.7rem;">[毒素]</span>':"";m+=`
        <div class="weapon-pick-item ${n.defender&&n.defender.id===u.id?"selected":""}" role="button" tabindex="0" onclick="selectShootDefender('${u.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectShootDefender('${u.id}')}">
          <span class="weapon-pick-name">${u.name}${f}${g}</span>
          <span class="weapon-pick-stats">HP: ${u.wounds}/${u.maxWounds} | DF:${u.df} | Move:${u.currentMove}"</span>
        </div>
      `}),m+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要射击的敌方特工：</p>
      ${m}
    `,i.textContent="选择武器",i.disabled=!n.defender}else if(n.step===2){e.textContent="射击结算 - 步骤 2: 选择武器";const d=n.attacker.weapons.filter(f=>f.isRanged),r=n.attacker.isInjured,c=n.attacker.actionsPerformed.includes("Dash");let m='<div class="weapon-picker-list">';d.forEach((f,g)=>{const w=r?`${f.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${f.ts+1}+</span>`:`${f.ts}+`,T=f.range?` | Range: ${f.range}"`:"",k=f.rules&&f.rules.length>0?` | ${f.rules.map(we).join(", ")}`:"",b=f.hasRule("Heavy")&&!c,x=b?' <span style="color:var(--red); font-size:0.65rem;">[需先冲刺]</span>':"",C=b?"opacity:0.4; cursor:not-allowed; pointer-events:none;":"";m+=`
        <div class="weapon-pick-item ${n.weapon.name===f.name?"selected":""}" role="button" tabindex="0" style="${C}" onclick="${b?"":`selectShootWeapon(${g})`}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${b?"":`selectShootWeapon(${g})`}}">
          <span class="weapon-pick-name">${f.name}${x}</span>
          <span class="weapon-pick-stats">A: ${f.attacks} | BS: ${w} | D: ${f.normalDamage}/${f.criticalDamage}${T}${k}</span>
        </div>
      `}),m+="</div>";const u=c?"":'<p style="color:var(--text-muted); font-size:0.75rem; margin-bottom:8px;">💡 标注<span style="color:var(--red);">[需先冲刺]</span>的武器为重武器，仅在执行冲刺 (Dash) 后可使用。</p>';t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要射击使用的武器：</p>
      ${u}
      ${m}
    `,i.textContent="回答判定问题",i.disabled=!1}else if(n.step===3){e.textContent="射击结算 - 步骤 3: 距离与掩体判定";const d=n.weapon,r=d.hasRule("Indirect Fire"),c=d.hasRule("Seek Light"),m=r?'<p style="color:#818cf8; font-size:0.75rem;">💡 <b>间接射击</b>：无需视线，射程判定跳过。</p>':"",u=c?'<p style="color:#f59e0b; font-size:0.75rem;">💡 <b>寻光</b>：目标即使在掩体中也无法获得掩体加成。</p>':"";t.innerHTML=`
      <p style="margin-bottom: 12px; color:var(--text-muted);">回答以下判定问题以完成结算：</p>
      ${m}
      ${u}

      <div class="qa-card">
        <div class="qa-question">1. 目标是否在你的有效视线和射程内？${r?' <span style="color:#818cf8;">(自动判定为是)</span>':""}</div>
        <div class="qa-options">
          <button class="qa-btn ${n.inRangeAndVisible?"selected":""}" onclick="setQA('inRangeAndVisible', true)" ${r?'style="pointer-events:none; opacity:0.6;"':""}>是 (在射程内)</button>
          <button class="qa-btn ${n.inRangeAndVisible?"":"selected"}" onclick="setQA('inRangeAndVisible', false)" ${r?'style="pointer-events:none; opacity:0.6;"':""}>否 (无法见/超射程)</button>
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
        <div class="qa-question">3. 目标是否在掩体中 (Cover)？${c?' <span style="color:#f59e0b;">(寻光忽略掩体)</span>':""}</div>
        <div class="qa-options">
          <button class="qa-btn ${n.inCover?"selected":""}" onclick="setQA('inCover', true)" ${c?'style="pointer-events:none; opacity:0.6;"':""}>是 (触发掩体成功保留)</button>
          <button class="qa-btn ${n.inCover?"":"selected"}" onclick="setQA('inCover', false)" ${c?'style="pointer-events:none; opacity:0.6;"':""}>否 (开阔地带)</button>
        </div>
      </div>
    `,r&&(n.inRangeAndVisible=!0),c&&(n.inCover=!1),i.textContent="选择掷骰模式",i.disabled=!1}else if(n.step===4){e.textContent="射击结算 - 步骤 4: 攻击方掷骰 (Angels of Death)";let d="";const r=n.attacker.faction==="Space Marine"?o.smCp:o.pmCp;if(n.attackRolls.length>0){const u=n.weapon.ts+(n.attacker.isInjured?1:0),f=n.attacker.isInjured?' <span style="color:var(--red); font-size:0.75rem;">(重伤+1)</span>':"";d=`
        <div class="roll-summary-block" style="margin-top:10px;">
          🎯 <b>命中统计:</b> 暴击(6点): <span style="color:var(--sm-accent); font-weight:bold;">${n.attackCrit}</span>, 普通命中(${u}+${f}): <span style="color:#6a9ad4;">${n.attackNorm}</span>
          ${r>=1&&n.attRerollIndex===-1?'<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上方任何一个未命中的灰色骰子重投。</span>':""}
        </div>
      `}const c=n.weapon.ts+(n.attacker.isInjured?1:0),m=n.attacker.isInjured?` <span style="color:var(--red); font-size:0.75rem;">(重伤+1 → ${c}+)</span>`:"";t.innerHTML=`
      ${ye()}

      <p style="margin-bottom: 12px;">武器 [${n.weapon.name}]，攻击骰数: <b>${n.weapon.attacks}</b>，命中要求: <b>${c}+</b>${m}</p>

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

      ${d}

      <div id="manual-attack-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${n.weapon.attacks} 个骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-att-dice-val" value="6, 4, 3, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
      </div>
    `,n.attackRolls.length>0?(i.disabled=!1,rn()):n.mode==="manual"?i.disabled=!1:i.disabled=!0,i.textContent="防守方投骰"}else if(n.step===5){e.textContent="射击结算 - 步骤 5: 防守方防御掷骰 (Plague Marines)";let d="",r=n.defender.df;const c=n.weapon.hasRule&&n.weapon.hasRule("Saturate");n.inCover&&!c?(d=`<p style="color:var(--pm-accent); margin-bottom: 4px;">🛡️ 目标在掩体中：自动获得 1 个普通成功，且防御投骰池减 1 (DF = ${r} -> ${r-1})</p>`,r=Math.max(0,r-1)):n.inCover&&c&&(d='<p style="color:var(--red); margin-bottom: 4px;">🔥 [饱和] 目标在掩体中，但 Saturate 生效：不能保留掩体骰！</p>');const m=n.weapon.rules.find(g=>g.startsWith("Piercing")&&!g.startsWith("Piercing Crits"));if(m){const g=parseInt(((a=m.match(/\d+/))==null?void 0:a[0])||"1"),w=r;r=Math.max(0,r-g),d+=`<p style="color:#f97316; margin-bottom: 4px;">🔥 <b>穿透 (Piercing ${g})</b>：DF 池减少 ${g} (DF = ${w} -> ${r})</p>`}let u="";const f=n.defender.faction==="Space Marine"?o.smCp:o.pmCp;n.defenseRolls.length>0&&r>0&&(u=`
        <div class="roll-summary-block" style="margin-top:10px;">
          🛡️ <b>防守统计:</b> 暴击防守: <span style="color:var(--pm-accent); font-weight:bold;">${n.defCrit}</span>, 普通防守(${n.defender.sv}+): <span style="color:#b0d4ba;">${n.defNorm}</span>
          ${f>=1&&n.defRerollIndex===-1?'<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上面任何一个未命中的灰色骰子重投。</span>':""}
        </div>
      `),t.innerHTML=`
      ${ye()}

      <p style="margin-bottom: 6px;">防守特工: [${n.defender.name}]，保护要求: <b>${n.defender.sv}+</b></p>
      ${d}
      <p style="margin-bottom: 12px;">需要投掷的防御骰数: <b>${r}</b></p>

      <div class="dice-rolling-area" id="defense-rolling-zone">
        <div class="dice-pool-view" id="defense-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        ${n.defenseRolls.length===0?`<button class="modal-btn primary" id="btn-roll-defense" onclick="rollDefenseDice(${r})">开始顺序防守投骰</button>`:""}
      </div>

      ${u}

      <div id="manual-defense-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${r} 个防御骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-def-dice-val" value="5, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
      </div>
    `,n.defenseRolls.length>0||r===0?(i.disabled=!1,pn()):n.mode==="manual"?i.disabled=!1:i.disabled=!0,i.textContent="计算伤害与对消"}else if(n.step===6){e.textContent="射击结算 - 步骤 6: 匹配对消与最终扣血",n.weapon.hasRule&&n.weapon.hasRule("Severe")&&n.attackCrit===0&&n.attackNorm>=1&&(n.attackNorm-=1,n.attackCrit+=1,y.addLog(`[严重] ${n.weapon.name}：无暴击保留，升级 1 个普通命中为暴击！`)),n.weapon.hasRule&&n.weapon.hasRule("Stun")&&n.attackCrit>0&&!n.stunApplied&&(n.defender.apl=Math.max(0,n.defender.apl-1),n.defender.stunnedUntilEndOfNextActivation=!0,n.stunApplied=!0,y.addLog(`[震慑] ${n.weapon.name}：保留暴击生效，${n.defender.name} APL -1 (直到其下一次激活结束)！`),y.updateActivePanel());let c=n.attackCrit,m=n.attackNorm,u=n.defCrit,f=n.defNorm;if(n.weapon.hasRule&&n.weapon.hasRule("Saturate")&&n.inCover&&f>0){const $=Math.min(1,f);f-=$,y.addLog(`[饱和] ${n.weapon.name}：防御方不能保留掩体骰，移除 ${$} 个掩体自动成功！`)}const w=n.weapon.rules.find($=>$.startsWith("Piercing Crits"));if(w&&n.attackCrit>0){const $=parseInt(((l=w.match(/\d+/))==null?void 0:l[0])||"1");y.addLog(`[穿透暴击 ${$}] 暴击命中时，防御骰 SV 判定 -${$}。`);const Y=Math.min(n.attackCrit*$,f);Y>0&&(f-=Y,y.addLog(`  → 穿透效果抵消了 ${Y} 个普通防御成功。`))}const T=Math.min(c,u);c-=T,u-=T;let k=0;c>0&&f>=2&&(k=Math.min(c,Math.floor(f/2)),c-=k,f-=k*2);const B=Math.min(m,f);m-=B,f-=B;const b=Math.min(m,u);m-=b,u-=b;let x=n.weapon.normalDamage,C=n.weapon.criticalDamage;const V=n.weapon.hasRule&&n.weapon.hasRule("Toxic");V&&n.defender.poisonTokens>0&&(x+=1,C+=1,y.addLog(`[剧毒] 目标携带毒素标记，${n.weapon.name} 伤害 +1 (${x}/${C})`));const A=n.weapon.rules.find($=>$.startsWith("Devastating"));if(A&&c>0){const $=parseInt(((p=A.match(/\d+/))==null?void 0:p[0])||"0");$>0&&(C+=$,y.addLog(`[毁灭] ${n.weapon.name}：暴击额外 +${$} 伤害 (${C})！`))}const M=[];for(let $=0;$<c;$++)M.push(C);for(let $=0;$<m;$++)M.push(x);const E=M.reduce(($,Y)=>$+Y,0),R=M.filter($=>$>=3).length;let I=`
      <div class="matching-view">
        <div class="matching-row">
          <span class="matching-label">攻击命中</span>
          <div class="matching-dice-list">
    `;const U=n.weapon.ts+(n.attacker.isInjured?1:0);for(let $=0;$<n.attackCrit;$++)I+='<div class="kt-dice-cube sm-dice crit-dice">6</div>';for(let $=0;$<n.attackNorm;$++)I+=`<div class="kt-dice-cube sm-dice">${U}</div>`;n.attackCrit+n.attackNorm===0&&(I+='<span style="font-size:0.8rem; color:var(--text-muted);">无命中</span>'),I+=`
          </div>
        </div>
        <div class="matching-row">
          <span class="matching-label">防御保护</span>
          <div class="matching-dice-list">
    `;for(let $=0;$<n.defCrit;$++)I+='<div class="kt-dice-cube pm-dice crit-dice">6</div>';for(let $=0;$<n.defNorm;$++)I+=`<div class="kt-dice-cube pm-dice">${n.defender.sv}</div>`;n.defCrit+n.defNorm===0&&(I+='<span style="font-size:0.8rem; color:var(--text-muted);">无防御成功</span>'),I+=`
          </div>
        </div>
      </div>
    `;let N="";n.defender.faction==="Plague Marine"&&R>0&&(N=`
        <div id="manual-dr-container" style="background:var(--dark-card); padding:10px; border-radius:8px; margin-top:8px; border:1px solid var(--panel-border);">
          <label style="font-size:0.75rem; color:var(--text-muted);">录入瘟疫守卫【恶心作呕】的 ${R} 个投骰点数 (每次≥3伤害的攻击各投一次, 为空则按随机)：</label>
          <input type="text" id="manual-dr-dice-val" placeholder="例: 4,2,5" style="margin-top:4px; padding:6px; font-size:0.9rem; background:#000; border:1px solid #334155; color:#fff; width:100%;">
        </div>
      `),t.innerHTML=`
      ${ye()}

      ${I}

      <div class="qa-card" style="margin-top:10px;">
        <p style="font-size:0.95rem; font-weight:600; color:#fff;">最终对消计算汇报：</p>
        <p style="margin-top:4px;">- 暴击命中残留: <b>${c}</b> 个 (每个伤害: ${C}${V&&n.defender.poisonTokens>0?' <span style="color:#a78bfa;">[剧毒+1]</span>':""})</p>
        <p>- 普通命中残留: <b>${m}</b> 个 (每个伤害: ${x}${V&&n.defender.poisonTokens>0?' <span style="color:#a78bfa;">[剧毒+1]</span>':""})</p>
        <p style="color:var(--sm-accent); font-weight:bold; margin-top:8px; font-size:1rem;">分配伤害总计: ${E} 点</p>
      </div>

      ${N}
    `,i.textContent="完成结算并扣血",i.disabled=!1,i.onclick=()=>gn(M),E>0&&setTimeout(()=>{y.triggerAvatarHitEffect(n.defender.id,"shoot")},150)}}function nn(e){v("click"),n.defender=o.operatives.find(t=>t.id===e),O()}function an(e){v("click"),n.weapon=n.attacker.weapons.filter(t=>t.isRanged)[e],O()}function on(e,t){v("click"),n[e]=t,O()}function sn(e){v("click"),n.mode=e,O(),e==="manual"?(document.getElementById("manual-attack-input").style.display="block",document.getElementById("attack-rolling-zone").style.display="none",document.getElementById("modal-btn-next").disabled=!1):(document.getElementById("manual-attack-input").style.display="none",document.getElementById("attack-rolling-zone").style.display="flex",document.getElementById("modal-btn-next").disabled=n.attackRolls.length===0)}function ln(){const e=document.getElementById("modal-btn-next"),t=document.getElementById("attack-dice-pool"),i=document.getElementById("btn-roll-attack");if(n.attackRolls.length>0)return;i.disabled=!0,e.disabled=!0;const s=n.attacker.faction==="Space Marine"?"sm-dice":"pm-dice";t.innerHTML="";const a=n.weapon.attacks;W=!1,_=[];for(let c=0;c<a;c++){const m=document.createElement("div");m.className=`kt-dice-cube ${s} rolling`,m.textContent="?",t.appendChild(m)}const l=document.createElement("button");l.className="modal-btn",l.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",l.textContent="跳过动画 (Skip)",l.onclick=()=>{W=!0,_.forEach(u=>clearTimeout(u)),_=[];const c=t.getElementsByClassName("kt-dice-cube"),m=n.weapon.ts+(n.attacker.isInjured?1:0);for(let u=d;u<a;u++){const f=Math.floor(Math.random()*6)+1;p.push(f);const g=c[u];g&&(g.classList.remove("rolling"),g.textContent=f,f===6?g.classList.add("crit-dice"):f<m&&g.classList.add("fail-dice"))}n.attackRolls=p,ue(),O()},t.parentElement.appendChild(l),y.triggerCombatVisual("🔥 OPEN FIRE!","shoot"),v("shoot");const p=[];let d=0;function r(){if(!W)if(d<a){const c=Math.floor(Math.random()*6)+1;p.push(c);const u=t.getElementsByClassName("kt-dice-cube")[d];u.classList.remove("rolling"),u.textContent=c;const f=n.weapon.ts+(n.attacker.isInjured?1:0);c===6?(u.classList.add("crit-dice"),v("crit")):(c<f&&u.classList.add("fail-dice"),v("click")),d++,Z(r,400)}else{n.attackRolls=p,ue(),l.remove();const c=n.attackCrit+n.attackNorm;c===0?(v("epic_fail"),y.triggerCombatVisual("❌ ALL MISSED!","normal")):(c===a||n.attackCrit>=2)&&(v("epic_win"),y.triggerCombatVisual("✨ EPIC SHOTS!","shoot")),O()}}Z(r,1200)}function rn(){const e=document.getElementById("attack-dice-pool");if(!e)return;e.innerHTML="";const t=n.attacker.faction,i=t==="Space Marine"?o.smCp:o.pmCp,s=t==="Space Marine"?"sm-dice":"pm-dice",a=n.weapon.ts+(n.attacker.isInjured?1:0);n.attackRolls.forEach((l,p)=>{const d=document.createElement("div");let r=`kt-dice-cube ${s}`;if(l===6?r+=" crit-dice":l<a&&(r+=" fail-dice"),d.className=r,d.textContent=l,l<a&&i>=1&&n.attRerollIndex===-1){const m=document.createElement("div");m.className="reroll-indicator",m.textContent="R",d.appendChild(m),d.onclick=()=>cn(p),d.style.cursor="pointer"}else if(p===n.attRerollIndex){const m=document.createElement("div");m.className="reroll-indicator",m.style.background="var(--green)",m.textContent="✓",d.appendChild(m)}e.appendChild(d)})}function cn(e){v("shoot"),n.attacker.faction==="Space Marine"?o.smCp-=1:o.pmCp-=1,y.updateScoresUI(),n.attRerollIndex=e;const s=document.getElementById("attack-dice-pool").getElementsByClassName("kt-dice-cube")[e],a=n.attacker.faction==="Space Marine"?"sm-dice":"pm-dice";s.className=`kt-dice-cube ${a} rolling`,s.innerHTML="?",setTimeout(()=>{const l=Math.floor(Math.random()*6)+1;y.addLog(`  - [重投] 攻击方消耗 1 CP重投 D6: [${n.attackRolls[e]}] -> [${l}]`),n.attackRolls[e]=l,ue(),O()},500)}function ue(){var m,u;let e=0,t=0;const i=n.attacker,s=i&&i.isInjured?1:0,a=n.weapon.ts+s,l=n.weapon.rules.find(f=>f.startsWith("Lethal")),p=l?parseInt(((m=l.match(/\d+/))==null?void 0:m[0])||"6"):6;n.attackRolls.forEach(f=>{f>=p?e++:f>=a&&t++}),n.weapon.hasRule&&n.weapon.hasRule("Rending")&&e>0&&t>0&&(t-=1,e+=1,y.addLog(`[撕裂] ${n.weapon.name}：保留暴击生效，升级 1 个普通命中为暴击！`)),n.weapon.hasRule&&n.weapon.hasRule("Punishing")&&e>0&&n.attackRolls.filter(g=>g<a&&g!==6&&g<p).length>0&&(t+=1,y.addLog(`[惩罚] ${n.weapon.name}：保留暴击生效，保留 1 个失败骰作为普通成功！`));const c=n.weapon.rules.find(f=>f.startsWith("Accurate"));if(c){const f=parseInt(((u=c.match(/\d+/))==null?void 0:u[0])||"1"),g=n.attackRolls.filter(T=>T<a&&T<p).length,w=Math.min(f,g);w>0&&(t+=w,y.addLog(`[精准] ${n.weapon.name}：自动保留 ${w} 个普通成功！`))}n.attackCrit=e,n.attackNorm=t}function dn(e){const t=document.getElementById("modal-btn-next"),i=document.getElementById("defense-dice-pool"),s=document.getElementById("btn-roll-defense");if(n.defenseRolls.length>0)return;if(e===0){n.defCrit=0;const c=n.weapon.hasRule&&n.weapon.hasRule("Saturate");n.defNorm=n.inCover&&!c?1:0,t.disabled=!1;return}s.disabled=!0,t.disabled=!0;const a=n.defender.faction==="Space Marine"?"sm-dice":"pm-dice";i.innerHTML="",W=!1,_=[];for(let c=0;c<e;c++){const m=document.createElement("div");m.className=`kt-dice-cube ${a} rolling`,m.textContent="?",i.appendChild(m)}const l=document.createElement("button");l.className="modal-btn",l.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",l.textContent="跳过动画 (Skip)",l.onclick=()=>{W=!0,_.forEach(m=>clearTimeout(m)),_=[];const c=i.getElementsByClassName("kt-dice-cube");for(let m=d;m<e;m++){const u=Math.floor(Math.random()*6)+1;p.push(u);const f=c[m];f&&(f.classList.remove("rolling"),f.textContent=u,u===6?f.classList.add("crit-dice"):u<n.defender.sv&&f.classList.add("fail-dice"))}n.defenseRolls=p,fe(),O()},i.parentElement.appendChild(l),y.triggerCombatVisual("🛡️ INCOMING FIRE!","parry"),v("shoot");const p=[];let d=0;function r(){if(!W)if(d<e){const c=Math.floor(Math.random()*6)+1;p.push(c);const u=i.getElementsByClassName("kt-dice-cube")[d];u.classList.remove("rolling"),u.textContent=c,c===6?(u.classList.add("crit-dice"),v("crit")):(c<n.defender.sv&&u.classList.add("fail-dice"),v("click")),d++,Z(r,400)}else{n.defenseRolls=p,fe(),l.remove();const c=n.defender.sv,m=p.filter(f=>f>=c).length,u=p.filter(f=>f===6).length;m===0?(v("epic_fail"),y.triggerCombatVisual("💀 DEFENSE BUSTED!","normal")):(m===e||u>=2)&&(v("epic_win"),y.triggerCombatVisual("🛡️ SHIELD CLUTCH!","deflect")),O()}}Z(r,1200)}function pn(e){const t=document.getElementById("defense-dice-pool");if(!t)return;t.innerHTML="";const i=n.defender.faction,s=i==="Space Marine"?o.smCp:o.pmCp,a=i==="Space Marine"?"sm-dice":"pm-dice";n.defenseRolls.forEach((l,p)=>{const d=document.createElement("div");let r=`kt-dice-cube ${a}`;if(l===6?r+=" crit-dice":l<n.defender.sv&&(r+=" fail-dice"),d.className=r,d.textContent=l,l<n.defender.sv&&s>=1&&n.defRerollIndex===-1){const m=document.createElement("div");m.className="reroll-indicator",m.textContent="R",d.appendChild(m),d.onclick=()=>mn(p),d.style.cursor="pointer"}else if(p===n.defRerollIndex){const m=document.createElement("div");m.className="reroll-indicator",m.style.background="var(--green)",m.textContent="✓",d.appendChild(m)}t.appendChild(d)})}function mn(e,t){v("save"),n.defender.faction==="Space Marine"?o.smCp-=1:o.pmCp-=1,y.updateScoresUI(),n.defRerollIndex=e;const a=document.getElementById("defense-dice-pool").getElementsByClassName("kt-dice-cube")[e],l=n.defender.faction==="Space Marine"?"sm-dice":"pm-dice";a.className=`kt-dice-cube ${l} rolling`,a.innerHTML="?",setTimeout(()=>{const p=Math.floor(Math.random()*6)+1;y.addLog(`  - [重投] 防御方消耗 1 CP重投 D6: [${n.defenseRolls[e]}] -> [${p}]`),n.defenseRolls[e]=p,fe(),O()},500)}function fe(){let e=0;const t=n.weapon.hasRule&&n.weapon.hasRule("Saturate");let i=n.inCover&&!t?1:0;const s=n.defender.sv;n.defenseRolls.forEach(a=>{a===6?e++:a>=s&&i++}),n.defCrit=e,n.defNorm=i}function un(){const e=document.getElementById("manual-att-dice-val");if(!e)return;const i=e.value.split(",").map(s=>parseInt(s.trim(),10)).filter(s=>!isNaN(s)&&s>=1&&s<=6);n.attackRolls=i,ue()}function fn(){const e=document.getElementById("manual-def-dice-val");if(!e)return;const i=e.value.split(",").map(s=>parseInt(s.trim(),10)).filter(s=>!isNaN(s)&&s>=1&&s<=6);n.defenseRolls=i,fe()}function gn(e){v("click");const t=n.attacker,i=n.defender;let s=null;const a=document.getElementById("manual-dr-dice-val");a&&a.value.trim()!==""&&(s=a.value.split(",").map(c=>parseInt(c.trim(),10)).filter(c=>!isNaN(c)&&c>=1&&c<=6)),y.addLog(`
--- 射击对决结果 ---`),y.addLog(`[攻击方] ${t.name} 使用 ${n.weapon.name} 射击`),y.addLog(`[防守方] ${i.name}`);const l=i.applyWounds(e,s);if(n.weapon.hasRule&&n.weapon.hasRule("Poison")&&l>0&&i.poisonTokens<1&&(i.poisonTokens=1,y.addLog(`[毒素] ${i.name} 获得了 1 个毒素标记！下次激活开始时将受到 1 点伤害。`)),n.weapon.hasRule&&n.weapon.hasRule("PSYCHIC")){const c=n.attackRolls.filter(m=>m===1).length;c>0&&(y.addLog(`[灵能反噬] ${n.weapon.name} 引发危险！投出 ${c} 个 1，攻击方受到 ${c} 点伤害。`),t.applyWounds(c))}if(n.weapon.hasRule&&n.weapon.hasRule("Hot")){const c=Math.floor(Math.random()*6)+1,m=n.weapon.ts;if(c<m){const u=c*2;y.addLog(`[过热] ${n.weapon.name}：投出 ${c} < ${m}，反噬 ${u} 点伤害！`),t.applyWounds(u)}else y.addLog(`[过热] ${n.weapon.name}：投出 ${c} ≥ ${m}，安全。`)}t.apl-=1,t.actionsPerformed.push("Shoot"),y.addLog(`[行动点] ${t.name} 消耗 1 APL，当前 APL: ${t.apl}`),he(),l>0&&setTimeout(()=>{y.triggerAvatarHitEffect(i.id,"shoot")},100)}function tt(){v("click");const e=o.activeAgent;if(!e)return;const t=document.querySelector("#combat-modal .modal-content");t&&(t.style.backgroundImage='linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("assets/images/backgrounds/bg_melee_action.png")',t.style.backgroundSize="cover",t.style.backgroundPosition="center"),Object.assign(n,{actionType:"fight",step:1,attacker:e,defender:null,weapon:e.weapons.filter(i=>!i.isRanged)[0]||null,inMeleeRange:!0,hasFallenBack:!1,mode:"random",activeAttackerDice:[],activeDefenderDice:[],meleeTurn:"attacker",meleeLogs:""}),n.weapon&&(Ze(),J())}function vn(e){v("click"),n.defender=o.operatives.find(t=>t.id===e),J()}function hn(e){v("click"),n.weapon=n.attacker.weapons.filter(t=>!t.isRanged)[e],J()}function J(){const e=document.getElementById("modal-title"),t=document.getElementById("modal-body"),i=document.getElementById("modal-btn-next"),s=document.getElementById("modal-btn-cancel");if(i.onclick=Se,s.style.display="inline-block",n.step===1){e.textContent="近战结算 - 步骤 1: 选择目标";const a=n.attacker.faction==="Space Marine"?"Plague Marine":"Space Marine",l=o.operatives.filter(r=>r.faction===a&&!r.isDead),p=l.filter(r=>!r.hasConceal);if(l.length>0&&p.length===0){t.innerHTML='<p style="color:var(--red);">所有敌方特工均处于隐蔽状态，无法被指定为近战目标。</p>',i.disabled=!0;return}if(p.length===0){t.innerHTML='<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>',i.disabled=!0;return}let d='<div class="weapon-picker-list">';p.forEach(r=>{const c=r.isInjured?' <span style="color:var(--red); font-size:0.7rem;">[重伤]</span>':"",m=r.poisonTokens>0?' <span style="color:#7ab88a; font-size:0.7rem;">[毒素]</span>':"";d+=`
        <div class="weapon-pick-item ${n.defender&&n.defender.id===r.id?"selected":""}" role="button" tabindex="0" onclick="selectFightDefender('${r.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightDefender('${r.id}')}">
          <span class="weapon-pick-name">${r.name}${c}${m}</span>
          <span class="weapon-pick-stats">HP: ${r.wounds}/${r.maxWounds} | DF:${r.df}</span>
        </div>
      `}),d+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要交战的敌方特工 (必须在交战距离内)：</p>
      ${d}
    `,i.textContent="判定近战条件",i.disabled=!n.defender}else if(n.step===2){e.textContent="近战结算 - 步骤 2: 选择近战武器";const a=n.attacker.weapons.filter(d=>!d.isRanged),l=n.attacker.isInjured;let p='<div class="weapon-picker-list">';a.forEach((d,r)=>{const c=l?`${d.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${d.ts+1}+</span>`:`${d.ts}+`,m=d.rules&&d.rules.length>0?` | ${d.rules.map(we).join(", ")}`:"";p+=`
        <div class="weapon-pick-item ${n.weapon.name===d.name?"selected":""}" role="button" tabindex="0" onclick="selectFightWeapon(${r})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightWeapon(${r})}">
          <span class="weapon-pick-name">${d.name}</span>
          <span class="weapon-pick-stats">A: ${d.attacks} | WS: ${c} | D: ${d.normalDamage}/${d.criticalDamage}${m}</span>
        </div>
      `}),p+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要使用的近战武器：</p>
      ${p}
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
    `,n.activeAttackerDice.length>0||n.activeDefenderDice.length>0?(i.disabled=!1,yn()):i.disabled=!0,i.textContent="进入伤害/格挡分配";else if(n.step===5){e.textContent="近战结算 - 步骤 5: 伤害与格挡交替分配";const a=n.attacker.wounds>0,l=n.defender.wounds>0,p=n.activeAttackerDice.some(k=>!k.used),d=n.activeDefenderDice.some(k=>!k.used);if(!a||!l||!p&&!d){let k="";!a&&!l?k="双方同归于尽！":a?l?k="双方所有成功骰已分配完毕。":k=`防守方 [${n.defender.name}] 已阵亡！`:k=`攻击方 [${n.attacker.name}] 已阵亡！`,t.innerHTML=`
        <!-- 双方状态卡 -->
        ${Oe()}

        <div class="qa-card" style="text-align: center; margin-top: 16px;">
          <h4 style="color: var(--sm-accent); margin-bottom: 8px;">战斗结束</h4>
          <p>${k}</p>
        </div>

        <div class="melee-interactive-log" id="melee-int-log" style="margin-top:12px; height: 100px;">
          ${n.meleeLogs}
        </div>
      `,i.textContent="完成近战结算",i.disabled=!1,i.onclick=$n,s.style.display="none";return}const r=n.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",c=n.defender.faction==="Space Marine"?"sm-dice":"pm-dice";let m="";n.activeAttackerDice.forEach((k,B)=>{let b=`melee-dice-btn ${r}`;k.isCrit&&(b+=" crit"),k.used&&(b+=" used");const C=n.selectedMeleeDice&&n.selectedMeleeDice.side==="attacker"&&n.selectedMeleeDice.idx===B?"outline: 3px solid #6a9ad4; transform: scale(1.15); box-shadow: 0 0 15px rgba(96,165,250,0.8); z-index: 2;":"";m+=`<button class="${b}" style="${C}" onclick="chooseMeleeDice('attacker', ${B})">${k.val}</button>`}),n.activeAttackerDice.length===0&&(m='<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>');let u="";n.activeDefenderDice.forEach((k,B)=>{let b=`melee-dice-btn ${c}`;k.isCrit&&(b+=" crit"),k.used&&(b+=" used");const C=n.selectedMeleeDice&&n.selectedMeleeDice.side==="defender"&&n.selectedMeleeDice.idx===B?"outline: 3px solid var(--pm-accent); transform: scale(1.15); box-shadow: 0 0 15px rgba(74,124,89,0.8); z-index: 2;":"";u+=`<button class="${b}" style="${C}" onclick="chooseMeleeDice('defender', ${B})">${k.val}</button>`}),n.activeDefenderDice.length===0&&(u='<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>');const f=n.meleeTurn==="attacker"?"攻击方":"防守方",g=n.meleeTurn==="attacker"?"#6a9ad4":"var(--pm-accent)";let w="";if(n.selectedMeleeDice){const{side:k,idx:B}=n.selectedMeleeDice,x=(k==="attacker"?n.activeAttackerDice:n.activeDefenderDice)[B];let C;k==="attacker"?C=n.weapon:C=n.defender.weapons.filter(N=>!N.isRanged)[0]||new P("重拳 (Fists)",4,3,3,4,!1,null,[]);const V=x.isCrit?C.criticalDamage:C.normalDamage,M=(k==="attacker"?n.activeDefenderDice:n.activeAttackerDice).some(N=>!N.used),E=k==="attacker"?n.defender.weapons.filter(N=>!N.isRanged)[0]||null:n.weapon,R=E&&E.hasRule&&E.hasRule("Brutal"),I=R&&!x.isCrit,U=R?x.isCrit?'<div style="margin-top:8px; font-size:0.75rem; color:#22c55e;">🔥 残暴 (Brutal) 生效：你选择了暴击骰，可以格挡！</div>':'<div style="margin-top:8px; font-size:0.75rem; color:#ef4444;">🔥 残暴 (Brutal) 生效：只能用暴击骰格挡！此骰不可用于 Parry。</div>':"";w=`
        <div class="melee-choice-card" style="position:relative; background: linear-gradient(180deg, #2a2d35, #1e2128); border: 2px solid ${g}; border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: center; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
          <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: #fff;">
            🎯 已选中点数 <span style="display:inline-block; padding: 2px 8px; border-radius: 4px; background: ${k==="attacker"?"rgba(74,106,154,0.3)":"rgba(74,124,89,0.3)"}; color: ${k==="attacker"?"#6a9ad4":"var(--pm-accent)"}; font-weight: 900; font-family:'Pirata One',serif;">${x.val}${x.isCrit?" (⚡暴击)":""}</span>，请选择分配动作：
          </div>

          <div style="display: flex; gap: 16px; justify-content: center;">
            <button onclick="resolveMeleeChoice('strike')" class="melee-action-btn strike-btn" style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, var(--red), #5a2020); border: 2px solid #b84c4c; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(184, 76, 76, 0.3); transition: all 0.2s ease;">
              ⚔️ 打击 (STRIKE)<br>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.9;">造成 ${V} 点伤害</span>
            </button>

            <button onclick="resolveMeleeChoice('parry')" class="melee-action-btn parry-btn" ${!M||I?'disabled style="opacity: 0.4; cursor: not-allowed;"':""} style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, #4a6a9a, #3a5580); border: 2px solid #6a9ad4; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(74, 106, 154, 0.3); transition: all 0.2s ease;">
              🛡️ 格挡 (PARRY)<br>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.9;">消去对方一个成功骰</span>
            </button>
          </div>

          ${U}

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
        👉 当前轮到：【${f}】分配骰子
      </p>

      ${w}

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
    `;const T=document.getElementById("melee-int-log");T&&(T.innerHTML=n.meleeLogs,T.scrollTop=T.scrollHeight),i.textContent="交替进行中...",i.disabled=!0}}function bn(){const e=document.getElementById("modal-btn-next"),t=document.getElementById("melee-att-pool"),i=document.getElementById("melee-def-pool"),s=document.getElementById("btn-roll-melee");s.disabled=!0,e.disabled=!0;const a=n.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",l=n.defender.faction==="Space Marine"?"sm-dice":"pm-dice";t.innerHTML="",W=!1,_=[];const p=n.weapon.attacks;for(let b=0;b<p;b++){const x=document.createElement("div");x.className=`kt-dice-cube ${a} rolling`,x.textContent="?",t.appendChild(x)}const d=n.defender.weapons.filter(b=>!b.isRanged)[0]||new P("重拳 (Fists)",3,3,3,4,!1),r=d.attacks;i.innerHTML="";for(let b=0;b<r;b++){const x=document.createElement("div");x.className=`kt-dice-cube ${l} rolling`,x.textContent="?",i.appendChild(x)}const c=document.createElement("button");c.className="modal-btn",c.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",c.textContent="跳过动画 (Skip)",c.onclick=()=>{W=!0,_.forEach(A=>clearTimeout(A)),_=[];const b=t.getElementsByClassName("kt-dice-cube"),x=n.weapon.ts+(n.attacker.isInjured?1:0),C=d.ts+(n.defender.isInjured?1:0);for(let A=g;A<p;A++){const M=Math.floor(Math.random()*6)+1;u.push(M);const E=b[A];E&&(E.classList.remove("rolling"),E.textContent=M,M===6?E.classList.add("crit-dice"):M<x&&E.classList.add("fail-dice"))}const V=i.getElementsByClassName("kt-dice-cube");for(let A=w;A<r;A++){const M=Math.floor(Math.random()*6)+1;f.push(M);const E=V[A];E&&(E.classList.remove("rolling"),E.textContent=M,M===6?E.classList.add("crit-dice"):M<C&&E.classList.add("fail-dice"))}B()};const m=document.getElementById("modal-body");m&&m.appendChild(c),y.triggerCombatVisual("⚔️ MELEE CLASH!","shoot"),v("shoot");const u=[],f=[];let g=0,w=0;function T(){if(!W)if(g<p){const b=Math.floor(Math.random()*6)+1;u.push(b);const C=t.getElementsByClassName("kt-dice-cube")[g];C.classList.remove("rolling"),C.textContent=b;const V=n.weapon.ts+(n.attacker.isInjured?1:0);b===6?(C.classList.add("crit-dice"),v("crit")):(b<V&&C.classList.add("fail-dice"),v("click")),g++,Z(T,400)}else k()}function k(){if(!W)if(w<r){const b=Math.floor(Math.random()*6)+1;f.push(b);const C=i.getElementsByClassName("kt-dice-cube")[w];C.classList.remove("rolling"),C.textContent=b;const V=d.ts+(n.defender.isInjured?1:0);b===6?(C.classList.add("crit-dice"),v("crit")):(b<V&&C.classList.add("fail-dice"),v("click")),w++,Z(k,400)}else B()}function B(){c.remove();const b=n.attacker&&n.attacker.isInjured?1:0,x=n.defender&&n.defender.isInjured?1:0,C=n.weapon.ts+b,V=d.ts+x;n.activeAttackerDice=u.filter(A=>A>=C||A===6).map(A=>({val:A,isCrit:A===6,used:!1})),n.activeDefenderDice=f.filter(A=>A>=V||A===6).map(A=>({val:A,isCrit:A===6,used:!1})),e.disabled=!1}Z(T,1200)}function yn(){const e=document.getElementById("melee-att-pool"),t=document.getElementById("melee-def-pool");if(!e||!t)return;const i=n.attacker.faction==="Space Marine"?"sm-dice":"pm-dice",s=n.defender.faction==="Space Marine"?"sm-dice":"pm-dice";if(e.innerHTML="",n.activeAttackerDice.forEach(a=>{let l=`kt-dice-cube ${i}`;a.isCrit&&(l+=" crit-dice");const p=document.createElement("div");p.className=l,p.textContent=a.val,e.appendChild(p)}),n.activeAttackerDice.length===0){const a=document.createElement("span");a.style.cssText="color:var(--text-muted);font-size:0.85rem;",a.textContent="全部未命中",e.appendChild(a)}if(t.innerHTML="",n.activeDefenderDice.forEach(a=>{let l=`kt-dice-cube ${s}`;a.isCrit&&(l+=" crit-dice");const p=document.createElement("div");p.className=l,p.textContent=a.val,t.appendChild(p)}),n.activeDefenderDice.length===0){const a=document.createElement("span");a.style.cssText="color:var(--text-muted);font-size:0.85rem;",a.textContent="全部未命中",t.appendChild(a)}}function ge(e,t){const i=o.customAvatars[e];let s=t==="Space Marine"?"./assets/images/defaults/default_sm_avatar.png":"./assets/images/defaults/default_pm_avatar.png";const a=o.operatives.find(d=>d.id===e);if(a&&a.defaultAvatar)s=a.defaultAvatar;else{const d=t==="Space Marine",r=e.replace(/^(sm_|pm_)/,"");s=`./assets/images/operatives/${d?"sm":"pm"}/${d?"sm":"pm"}_${r}.png`}const l=i||s,p=a?a.name:e;return`<div class="op-avatar-slot duel-avatar-${e}" style="width: 50px; height: 50px; cursor: default; position: relative;">
            <img src="${l}" class="op-avatar-img" alt="${p} 头像" loading="lazy" />
          </div>`}function Oe(){const e=n.attacker,t=n.defender,i=Math.max(0,e.wounds/e.maxWounds*100),s=Math.max(0,t.wounds/t.maxWounds*100);return`
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(26,29,36,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${ge(e.id,e.faction)}
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
        ${ge(t.id,t.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${t.name}">${t.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${s}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0,t.wounds)} / ${t.maxWounds} HP</div>
      </div>
    </div>
  `}function ye(){const e=n.attacker,t=n.defender,i=Math.max(0,e.wounds/e.maxWounds*100),s=Math.max(0,t.wounds/t.maxWounds*100);return`
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(26,29,36,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${ge(e.id,e.faction)}
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
        ${ge(t.id,t.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${t.name}">${t.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${s}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0,t.wounds)} / ${t.maxWounds} HP</div>
      </div>
    </div>
  `}function xn(e,t){if(e!==n.meleeTurn){v("alert");return}(e==="attacker"?n.activeAttackerDice:n.activeDefenderDice)[t].used||(n.selectedMeleeDice={side:e,idx:t},J())}function kn(e){if(!n.selectedMeleeDice)return;const{side:t,idx:i}=n.selectedMeleeDice,a=(t==="attacker"?n.activeAttackerDice:n.activeDefenderDice)[i];if(a.used)return;const l=t==="attacker"?n.defender:n.attacker,p=t==="attacker"?n.activeDefenderDice:n.activeAttackerDice;let d;if(t==="attacker"?d=n.weapon:d=n.defender.weapons.filter(T=>!T.isRanged)[0]||new P("重拳 (Fists)",4,3,3,4,!1,null,[]),n.meleeLogs||(n.meleeLogs=""),e==="strike"){a.used=!0;let T=d.normalDamage,k=d.criticalDamage;d.hasRule&&d.hasRule("Toxic")&&l.poisonTokens>0&&(T+=1,k+=1);const b=a.isCrit?k:T,x=`> ${t==="attacker"?"攻击方":"防守方"} 执行打击 (Strike)，分配了 ${b} 伤害！<br>`;if(n.meleeLogs+=x,l.applyWounds(b),d.hasRule&&d.hasRule("Poison")&&b>0&&l.poisonTokens<1&&(l.poisonTokens=1,y.addLog(`[毒素] ${l.name} 获得了 1 个毒素标记！(来自近战)`)),d.hasRule&&d.hasRule("Shock")&&a.isCrit&&!n.shockTriggered){let M=p.findIndex(R=>!R.used&&!R.isCrit),E="普通成功";if(M===-1&&(M=p.findIndex(R=>!R.used&&R.isCrit),E="暴击成功"),M!==-1){p[M].used=!0,n.shockTriggered=!0;const R=`> [冲击] 暴击打击触发 Shock：丢弃对手 1 个未解决的${E} [${p[M].val}]！<br>`;n.meleeLogs+=R,y.addLog(`[冲击] ${d.name}：暴击打击触发，丢弃对手 1 个${E}！`)}}if(d.hasRule&&d.hasRule("Stun")&&a.isCrit&&!n.stunApplied){l.apl=Math.max(0,l.apl-1),l.stunnedUntilEndOfNextActivation=!0,n.stunApplied=!0;const M=`> [震慑] 暴击打击触发 Stun：${l.name} APL -1 (直到其下一次激活结束)！<br>`;n.meleeLogs+=M,y.addLog(`[震慑] ${d.name}：暴击打击触发，${l.name} APL -1！`),y.updateActivePanel()}v("heavy_strike"),y.triggerCombatVisual("⚔️ STRIKE! -"+b,"strike")}else{const T=t==="attacker"?n.defender.weapons.filter(x=>!x.isRanged)[0]||null:n.weapon;if(T&&T.hasRule&&T.hasRule("Brutal")&&!a.isCrit){v("alert");return}let B=-1;if(a.isCrit?(B=p.findIndex(x=>!x.used&&x.isCrit),B===-1&&(B=p.findIndex(x=>!x.used))):B=p.findIndex(x=>!x.used&&!x.isCrit),B===-1){v("alert");return}a.used=!0,p[B].used=!0;const b=`> ${t==="attacker"?"攻击方":"防守方"} 执行格挡 (Parry)，消去对方一个骰子 [${p[B].val}]！<br>`;n.meleeLogs+=b,v("metal_clash"),y.triggerCombatVisual("🛡️ PARRY!","parry")}const r=t==="attacker"?"defender":"attacker",c=r==="attacker"?n.attacker.wounds:n.defender.wounds,u=(r==="attacker"?n.activeAttackerDice:n.activeDefenderDice).some(T=>!T.used)&&c>0,f=t==="attacker"?n.attacker.wounds:n.defender.wounds,w=(t==="attacker"?n.activeAttackerDice:n.activeDefenderDice).some(T=>!T.used)&&f>0;u&&w||u?n.meleeTurn=r:w&&(n.meleeTurn=t),n.selectedMeleeDice=null,J(),e==="strike"&&y.triggerAvatarHitEffect(l.id,"melee")}function wn(){v("click"),n.selectedMeleeDice=null,J()}function $n(){v("click");const e=n.attacker,t=n.defender;y.addLog(`
--- 近战搏斗结果 ---`),y.addLog(`[双核交锋] ${e.name} vs ${t.name}`),y.addLog(`  - ${e.name} 生命值: ${e.wounds}/${e.maxWounds}`),y.addLog(`  - ${t.name} 生命值: ${t.wounds}/${t.maxWounds}`),e.apl-=1,e.actionsPerformed.push("Fight"),y.addLog(`[行动点] ${e.name} 消耗 1 APL，当前 APL: ${e.apl}`),he()}rt({addLog:S,updateScoresUI:Q,renderOperatives:G,updateActivePanel:H,startInitiativePhase:Ge,showTurnEndScoringOverlay:Xe,showCounteractOverlay:Ue,hidePhaseOverlay:Ce,hideCounteractOverlay:Vt});ft({addLog:S,triggerOperativeDeathOverlay:qt});kt({openShootWizard:et,openFightWizard:tt,renderShootStep:O,renderFightStep:J,closeModal:he});tn({addLog:S,renderOperatives:G,updateActivePanel:H,updateScoresUI:Q,triggerAvatarHitEffect:en,triggerCombatVisual:Zt});window.adjustScore=wt;window.confirmReset=$t;window.toggleSelectSM=xe;window.toggleSelectPM=qe;window.incrementWarrior=_e;window.decrementWarrior=Tt;window.validateRostersAndDeploy=St;window.updateMissionDesc=bt;window.updateRulesVersion=je;window.triggerAvatarUpload=Jt;window.handleAvatarFileSelect=Xt;window.selectOperative=ke;window.confirmActivation=At;window.cancelSelection=Mt;window.activateOperative=Ke;window.toggleConceal=Pt;window.performMove=Et;window.performCharge=Lt;window.performAdvance=Bt;window.performDash=Dt;window.performFallBack=It;window.openShootWizard=et;window.openFightWizard=tt;window.endActivation=Rt;window.showRuleHelp=_t;window.closeHelpModal=Ye;window.closeModal=he;window.nextModalStep=Se;window.selectShootDefender=nn;window.selectShootWeapon=an;window.setQA=on;window.setRollMode=sn;window.rollAttackDice=ln;window.rollDefenseDice=dn;window.selectFightDefender=vn;window.selectFightWeapon=hn;window.rollMeleeDice=bn;window.chooseMeleeDice=xn;window.resolveMeleeChoice=kn;window.cancelMeleeChoice=wn;window.rollInitiativeOverlay=zt;window.selectTurnOrder=Nt;window.confirmTurnOrder=Ft;window.buyPloy=jt;window.proceedToFirefight=Wt;window.showCounteractOverlay=Ue;window.selectCounteractOperative=Ht;window.skipCounteract=ze;window.skipCounteractAction=Ot;window.confirmOperativeDeath=Je;window.declareScoreVictory=Yt;window.toggleScoringChecklist=Gt;window.adjustScoreTemp=Ut;window.confirmTurnEndScoring=Qt;document.addEventListener("DOMContentLoaded",()=>{$e(),je()});
