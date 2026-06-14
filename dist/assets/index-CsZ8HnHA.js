(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const y=new(window.AudioContext||window.webkitAudioContext);function h(e){try{y.state==="suspended"&&y.resume();const t=y.createOscillator(),a=y.createGain();if(t.connect(a),a.connect(y.destination),e==="click")t.frequency.setValueAtTime(600,y.currentTime),a.gain.setValueAtTime(.04,y.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,y.currentTime+.08),t.start(),t.stop(y.currentTime+.08);else if(e==="shoot"){const r=y.currentTime;[0,.08,.16].forEach(s=>{const c=y.sampleRate*.08,l=y.createBuffer(1,c,y.sampleRate),p=l.getChannelData(0);for(let g=0;g<c;g++)p[g]=Math.random()*2-1;const m=y.createBufferSource();m.buffer=l;const u=y.createBiquadFilter();u.type="lowpass",u.frequency.value=1e3;const d=y.createGain();d.gain.setValueAtTime(.12,r+s),d.gain.exponentialRampToValueAtTime(1e-4,r+s+.08),m.connect(u),u.connect(d),d.connect(y.destination),m.start(r+s);const f=y.createOscillator(),v=y.createGain();f.frequency.setValueAtTime(160,r+s),f.frequency.linearRampToValueAtTime(80,r+s+.06),v.gain.setValueAtTime(.15,r+s),v.gain.exponentialRampToValueAtTime(1e-4,r+s+.06),f.connect(v),v.connect(y.destination),f.start(r+s),f.stop(r+s+.06)})}else if(e==="crit")t.type="sawtooth",t.frequency.setValueAtTime(880,y.currentTime),t.frequency.setValueAtTime(1200,y.currentTime+.08),a.gain.setValueAtTime(.06,y.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,y.currentTime+.25),t.start(),t.stop(y.currentTime+.25);else if(e==="save")t.type="sine",t.frequency.setValueAtTime(988,y.currentTime),a.gain.setValueAtTime(.05,y.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,y.currentTime+.12),t.start(),t.stop(y.currentTime+.12);else if(e==="flesh"){const r=y.sampleRate*.15,i=y.createBuffer(1,r,y.sampleRate),s=i.getChannelData(0);for(let m=0;m<r;m++)s[m]=Math.random()*2-1;const c=y.createBufferSource();c.buffer=i;const l=y.createBiquadFilter();l.type="bandpass",l.frequency.value=300;const p=y.createGain();p.gain.setValueAtTime(.08,y.currentTime),p.gain.exponentialRampToValueAtTime(1e-4,y.currentTime+.15),c.connect(l),l.connect(p),p.connect(y.destination),c.start()}else if(e==="bubble")t.type="sine",t.frequency.setValueAtTime(200,y.currentTime),t.frequency.exponentialRampToValueAtTime(1200,y.currentTime+.06),a.gain.setValueAtTime(.05,y.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,y.currentTime+.06),t.start(),t.stop(y.currentTime+.06);else if(e==="alert")t.type="triangle",t.frequency.setValueAtTime(330,y.currentTime),a.gain.setValueAtTime(.08,y.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,y.currentTime+.3),t.start(),t.stop(y.currentTime+.3);else if(e==="epic_win"){const r=[523.25,659.25,783.99,1046.5],i=y.currentTime;r.forEach((s,c)=>{const l=y.createOscillator(),p=y.createGain();l.type="triangle",l.frequency.setValueAtTime(s,i+c*.08),p.gain.setValueAtTime(0,i+c*.08),p.gain.linearRampToValueAtTime(.08,i+c*.08+.02),p.gain.exponentialRampToValueAtTime(1e-4,i+c*.08+.22),l.connect(p),p.connect(y.destination),l.start(i+c*.08),l.stop(i+c*.08+.22)})}else if(e==="epic_fail"){const r=[164.81,155.56,146.83,138.59],i=y.currentTime;r.forEach((s,c)=>{const l=y.createOscillator(),p=y.createGain();l.type="sawtooth";const m=i+c*.2,u=c===3?.65:.18;l.frequency.setValueAtTime(s,m),c===3&&l.frequency.linearRampToValueAtTime(95,m+u),p.gain.setValueAtTime(0,m),p.gain.linearRampToValueAtTime(.08,m+.02),p.gain.exponentialRampToValueAtTime(1e-4,m+u),l.connect(p),p.connect(y.destination),l.start(m),l.stop(m+u)})}else if(e==="funeral"){const r=[261.63,261.63,261.63,207.65],i=[.35,.35,.35,.7],s=[0,.45,.9,1.35],c=y.currentTime;r.forEach((l,p)=>{const m=y.createOscillator(),u=y.createGain();m.type="sine";const d=c+s[p],f=i[p];m.frequency.setValueAtTime(l,d),u.gain.setValueAtTime(0,d),u.gain.linearRampToValueAtTime(.06,d+.05),u.gain.exponentialRampToValueAtTime(1e-4,d+f),m.connect(u),u.connect(y.destination),m.start(d),m.stop(d+f)})}else if(e==="metal_clash"){const r=y.currentTime,i=y.createOscillator(),s=y.createGain();i.type="sine",i.frequency.setValueAtTime(1400,r),i.frequency.linearRampToValueAtTime(900,r+.25),s.gain.setValueAtTime(.06,r),s.gain.exponentialRampToValueAtTime(1e-4,r+.3),i.connect(s),s.connect(y.destination),i.start(),i.stop(r+.3);const c=y.createOscillator(),l=y.createGain();c.type="triangle",c.frequency.setValueAtTime(300,r),c.frequency.linearRampToValueAtTime(120,r+.15),l.gain.setValueAtTime(.1,r),l.gain.exponentialRampToValueAtTime(1e-4,r+.18),c.connect(l),l.connect(y.destination),c.start(),c.stop(r+.18)}else if(e==="heavy_strike"){const r=y.currentTime,i=y.createOscillator(),s=y.createGain();i.type="sawtooth",i.frequency.setValueAtTime(80,r),i.frequency.exponentialRampToValueAtTime(35,r+.2),s.gain.setValueAtTime(.2,r),s.gain.exponentialRampToValueAtTime(1e-4,r+.2),i.connect(s),s.connect(y.destination),i.start(),i.stop(r+.2);const c=y.createOscillator(),l=y.createGain();c.type="sine",c.frequency.setValueAtTime(550,r),l.gain.setValueAtTime(.05,r),l.gain.exponentialRampToValueAtTime(1e-4,r+.12),c.connect(l),l.connect(y.destination),c.start(),c.stop(r+.12);const p=y.sampleRate*.12,m=y.createBuffer(1,p,y.sampleRate),u=m.getChannelData(0);for(let g=0;g<p;g++)u[g]=Math.random()*2-1;const d=y.createBufferSource();d.buffer=m;const f=y.createBiquadFilter();f.type="bandpass",f.frequency.value=220;const v=y.createGain();v.gain.setValueAtTime(.12,r),v.gain.exponentialRampToValueAtTime(1e-4,r+.12),d.connect(f),f.connect(v),v.connect(y.destination),d.start()}}catch{}}const Mt={"Space Marine":{astartesDoubleAction:!0},"Plague Marine":{disgustingResilience:!0},Legionary:{astartesDoubleAction:!0,darkZealotry:!0}};function Y(e,t){const a=Mt[e];return a?!!a[t]:!1}const Ce={"Space Marine":{id:"Space Marine",name:"死亡天使 (Angels of Death)",shortName:"死亡天使",themeColor:"var(--sm-accent)",diceClass:"sm-dice",headerImg:"./assets/images/headers/faction_header_sm.png",templates:null,ploys:[{id:"bolter_discipline",name:"风暴开火 (Bolter Discipline)",type:"Strategic",cp:1,desc:"特工在使用爆弹类武器时可进行第二次射击行动。"},{id:"shock_assault",name:"震慑突击 (Shock Assault)",type:"Strategic",cp:1,desc:"冲锋后近战搏斗时获得额外重投。"},{id:"transhuman",name:"极限减伤 (Transhuman Physiology)",type:"Firefight",cp:1,desc:"遭到致命一击时可将 1 个暴击伤害降为普通伤害。"}]},"Plague Marine":{id:"Plague Marine",name:"瘟疫守卫 (Plague Marines)",shortName:"瘟疫守卫",themeColor:"var(--pm-accent)",diceClass:"pm-dice",headerImg:"./assets/images/headers/faction_header_pm.png",templates:null,ploys:[{id:"inexorable_advance",name:"无尽行军 (Inexorable Advance)",type:"Strategic",cp:1,desc:"忽略移动减损惩罚，强行推进。"},{id:"malicious_volleys",name:"剧毒喷洒 (Malicious Volleys)",type:"Strategic",cp:1,desc:"爆弹武器即使移动过也能双击。"},{id:"contagious_resilience",name:"恶心减伤 (Disgustingly Resilient)",type:"Firefight",cp:1,desc:"防守时可以将一枚失败骰改为普通成功。"}]},Legionary:{id:"Legionary",name:"黑军团 (Legionaries)",shortName:"黑军团",themeColor:"#8b1a1a",diceClass:"leg-dice",headerImg:"./assets/images/headers/faction_header_leg.png",templates:null,ploys:[{id:"dark_zealotry",name:"黑暗狂热 (Dark Zealotry)",type:"Strategic",cp:1,desc:"近战搏斗时可重投 1 个失败骰。"},{id:"chaos_glory",name:"混沌荣耀 (Chaos Glory)",type:"Strategic",cp:1,desc:" leader 在 Fight 中获得 +1 攻击。"},{id:"warp_touched",name:"亚空间庇护 (Warp-Touched)",type:"Firefight",cp:1,desc:"受到致命伤害时可掷骰 6+ 抵消。"}]}};function Re(e,t){Ce[e]&&(Ce[e].templates=t)}function Ee(e){return Ce[e]||null}function Rt(e){const t=o.teamFactions[0],a=o.teamFactions[1];return e===t?a:e===a?t:t===e?a:t}function J(e){return o.teamFactions[0]===e?0:o.teamFactions[1]===e?1:-1}function Z(e){return J(e)===0?o.smCp:o.pmCp}function ce(e,t){J(e)===0?o.smCp=t:o.pmCp=t}function z(e){const t=Ce[e];return t?t.diceClass:"sm-dice"}function T(e){const t=Ce[e];return t?t.shortName:e}function q(e){return e==="Space Marine"?"sm":e==="Plague Marine"?"pm":e==="Legionary"?"leg":"sm"}function j(e){return`--${q(e)}-accent`}function oe(e){return J(e)===0?o.smActivePloys:o.pmActivePloys}function at(e,t){J(e)===0?o.smActivePloys=t:o.pmActivePloys=t}const F={};function Vt(e){Object.assign(F,e)}const o={turningPoint:1,phase:"Initiative",initiative:"Space Marine",initiativeSlot:0,activeTurn:"Space Marine",activeTurnSlot:0,activeAgent:null,pendingActivation:null,teamFactions:{0:"Space Marine",1:"Plague Marine"},smVp:0,smCp:2,pmVp:0,pmCp:2,smActivePloys:[],pmActivePloys:[],operatives:[],gameOver:!1,customAvatars:{},smKillsScored:0,pmKillsScored:0,missionType:"seize_ground",rulesVersion:"lite",chapterTacticSelections:{},marksOfChaosSelections:{}},Ft={actionType:"shoot",step:1,attacker:null,defender:null,weapon:null,inRangeAndVisible:!0,inCoverConcealed:!1,inCover:!1,enemyInControlRange:!1,mode:"random",attackRolls:[],attackCrit:0,attackNorm:0,defenseRolls:[],defCrit:0,defNorm:0,attRerollIndex:-1,defRerollIndex:-1,stunApplied:!1,shockTriggered:!1,activeAttackerDice:[],activeDefenderDice:[],meleeTurn:"attacker"};let n={...Ft};const it=["医疗兵默默拿出了骨灰盒，叹气道：『这活我接不了，抬走，下一位！』","他为了信仰流尽了最后一滴血，虽然倒下的姿势实在不够优雅。","战锤世界可没有复活币，老铁一路走好！","这大概就是传说中的『战术性白给』吧……","棋子已变成战场地形/掩体的一部分（大雾）。","纳垢大父叹了口气，表示可以多一碗上好的堆肥了。","帝皇叹了口气，并从垃圾桶里捞了捞他的物理模型。"];function fe(e){const t=typeof e=="number"?e:J(e);return o.operatives.some(a=>a.teamSlot===t&&!a.isDead&&!a.hasActed)}function Ht(){if(h("click"),o.turningPoint>=5){F.addLog(`
========================================`),F.addLog(">>> 已达第 5 回合上限！进入最终胜负结算！"),F.addLog("========================================"),F.showTurnEndScoringOverlay(!0);return}o.turningPoint+=1,o.phase="Initiative",o.smActivePloys=[],o.pmActivePloys=[],o.operatives.forEach(t=>{t.isDead||(t.hasActed=!1,t.apl=t.currentApl,t.actionsPerformed=[],t.hasCounteractedThisTP=!1)});const e=document.getElementById("btn-next-phase");e&&(e.style.display="none"),F.addLog(`
========================================`),F.addLog(`>>> Turning Point ${o.turningPoint} 开始！`),F.addLog("========================================"),F.startInitiativePhase()}function _t(e){const t=typeof e=="number"?e:J(e);return o.operatives.some(a=>a.teamSlot===t&&!a.isDead&&a.hasActed&&!a.hasConceal&&!a.hasCounteractedThisTP)}function Nt(){const e=o.activeTurnSlot,t=1-e,a=o.teamFactions[t],r=o.teamFactions[e],i=fe(t),s=fe(e);i?(o.activeTurnSlot=t,o.activeTurn=a,F.addLog(`>>> 交替轮转：轮到【${T(a)}】选择特工激活。`)):s?(o.activeTurnSlot=t,o.activeTurn=a,_t(t)?(F.addLog(`>>> 【${T(a)}】无可用特工，但可发动反击 (Counteract)！`),F.showCounteractOverlay(t)):(F.addLog(`>>> 【${T(a)}】已无可用特工且无反击机会。轮到【${T(r)}】继续。`),o.activeTurnSlot=e,o.activeTurn=r)):(F.addLog(">>> 双方全部特工激活完毕。准备开始回合得分结算。"),F.showTurnEndScoringOverlay()),F.renderOperatives(),F.updateActivePanel()}function pt(){const e=o.activeTurnSlot,t=1-e,a=o.teamFactions[e],r=o.teamFactions[t];F.addLog(`>>> 【${T(a)}】选择跳过反击。`),fe(t)?(o.activeTurnSlot=t,o.activeTurn=r,F.addLog(`>>> 轮到【${T(r)}】继续激活。`)):(F.addLog(">>> 双方均已无法激活。回合得分结算开始。"),F.showTurnEndScoringOverlay()),F.renderOperatives(),F.updateActivePanel()}function Ot(e){const t=o.operatives.find(a=>a.id===e);t&&(t.hasActed=!1,t.apl=1,t.counteracting=!0,t.hasCounteractedThisTP=!0,t.actionsPerformed=[],o.activeAgent=t,F.addLog(`>>> 【${t.name}】发动反击！获得 1 AP（移动不超过 2"）。`),F.hideCounteractOverlay(),F.renderOperatives(),F.updateActivePanel())}const W={};function zt(e){Object.assign(W,e)}const mt={PSYCHIC:"灵能",Saturate:"饱和",Severe:"重伤",Poison:"毒素",Toxic:"剧毒","Piercing Crits 1":"穿甲暴击 1",'Torrent 1"':'涌流 1"','Torrent 2"':'涌流 2"',Shock:"震击",Stun:"眩晕",Brutal:"残暴","Indirect Fire":"间接射击","Heavy (Dash only)":"重型(仅冲刺)","Seek Light":"追光",Silent:"静默"};function je(e){return mt[e]||e}class C{constructor(t,a,r,i,s,c=!0,l=null,p=[]){this.name=t,this.attacks=a,this.ts=r,this.normalDamage=i,this.criticalDamage=s,this.isRanged=c,this.range=l,this.rules=p}hasRule(t){return this.rules.includes(t)}get displayRange(){return this.range===null?"-":this.range+'"'}get displayRules(){return this.rules.length>0?this.rules.map(t=>mt[t]||t).join(", "):"-"}}class ot{constructor(t,a,r,i,s,c,l,p=[],m="",u=6,d=-1){this.id=t,this.name=a,this.faction=r,this.teamSlot=d,this.maxWounds=i,this.wounds=i,this.maxApl=s,this.apl=s,this.df=c,this.sv=l,this.weapons=p,this.defaultAvatar=m,this.maxMove=u,this.move=u,this.hasActed=!1,this.isDead=!1,this.actionsPerformed=[],this.poisonTokens=0,this.hasConceal=!0,this.counteracting=!1,this.hasCounteractedThisTP=!1,this.orderSwitchedThisActivation=!1,this.operativeType="",this.marksOfChaos=null,this.chapterTactics=[],this.ironHaloUsed=!1,this.unleashDaemonActive=!1,this.heroicLeaderUsedThisTP=!1,this.woundsRegainedThisTP=0,this.putrescentVitalityUsedThisTP=!1,this.infernalPactUsed=!1,this.grislyMarkUsed=!1,this.oncePerBattleAbilitiesUsed=new Set}get isInjured(){return this.wounds>0&&this.wounds<this.maxWounds/2}get currentApl(){const t=o.rulesVersion==="standard"?1:0;return this.maxApl-(this.isInjured?t:0)}get currentMove(){let t=this.maxMove-(this.isInjured?2:0);return o.rulesVersion==="standard"&&this.marksOfChaos==="SLAANESH"&&(t+=1),Math.max(0,t)}getEffectiveAplForMarkerControl(){let t=this.currentApl;return o.rulesVersion==="standard"&&(this.operativeType==="pm_icon_bearer"||this.operativeType==="leg_icon_bearer")&&(t+=1),t}healWounds(t){if(this.isDead||t<=0)return 0;const a=this.maxWounds-this.wounds,r=Math.min(t,a);return r>0&&(this.wounds+=r,W.addLog(`[治疗] ${this.name} 恢复 ${r} 点伤口 (${this.wounds}/${this.maxWounds})`)),r}isOncePerBattleAvailable(t){return!this.oncePerBattleAbilitiesUsed.has(t)}markOncePerBattleUsed(t){this.oncePerBattleAbilitiesUsed.add(t)}toggleConceal(){this.hasConceal=!this.hasConceal}reset(){this.wounds=this.maxWounds,this.apl=this.maxApl,this.move=this.maxMove,this.hasActed=!1,this.isDead=!1,this.actionsPerformed=[],this.poisonTokens=0,this.hasConceal=!0,this.counteracting=!1,this.orderSwitchedThisActivation=!1,this.heroicLeaderUsedThisTP=!1,this.woundsRegainedThisTP=0,this.putrescentVitalityUsedThisTP=!1}applyWounds(t,a=null){if(this.isDead)return 0;if(o.rulesVersion==="standard"&&this.operativeType==="sm_captain"&&!this.ironHaloUsed&&!Array.isArray(t)&&confirm(`💫 Iron Halo (每战一次)

${this.name} 即将受到 ${t} 点伤害。
是否使用 Iron Halo 忽略本次伤害？`))return this.ironHaloUsed=!0,W.addLog(`[钢铁光环] ${this.name} 使用 Iron Halo！忽略 ${t} 点伤害！(每战一次已使用)`),W.showToast&&W.showToast("💫 Iron Halo: 伤害已忽略！","success"),0;const r=Y(this.faction,"disgustingResilience");let i=0,s=[];Array.isArray(t)?(s=t,i=t.reduce((p,m)=>p+m,0)):(i=t,s=[t]),W.addLog(`[伤害] ${this.name} 准备分配 ${i} 点伤害...`);let c=0;if(r){const p=oe(this.faction).includes("contagious_resilience");W.addLog(`[特性] 触发${T(this.faction)}专属【恶心作呕 (DR 4+)】 ${p?"(已开启传染韧性，允许首个失败重投)":""}：`);let m=0,u=!1;for(const d of s){if(d<3){W.addLog(`  - 单次攻击伤害 ${d} (<3)，不触发 DR。`),c+=d;continue}let f;if(a&&m<a.length?(f=a[m++],W.addLog(`  - 伤害 ${d} (>=3): 手动录入 DR 骰子 [${f}]`)):(f=Math.floor(Math.random()*6)+1,W.addLog(`  - 伤害 ${d} (>=3): 投 DR 骰子 [${f}]`)),f<4&&p&&!u&&!a){u=!0;const v=f;f=Math.floor(Math.random()*6)+1,W.addLog(`    -> [传染韧性] 自动重投失败 [${v}] -> [${f}]`)}if(f>=4){const v=d-1;W.addLog(`    -> 成功！伤害减免 1 点 (${d} -> ${v})`),h("bubble"),c+=v}else W.addLog(`    -> 减免失败，受到全额 ${d} 点伤害。`),c+=d,h("flesh")}}else c=i,c>0&&h("flesh");const l=this.wounds;return this.wounds=Math.max(0,this.wounds-c),W.addLog(`[分配] ${this.name} 生命值: ${l} -> ${this.wounds} ${this.wounds===0?"(已阵亡!)":""}`),this.wounds===0&&(this.isDead=!0,this.hasActed=!0,W.triggerOperativeDeathOverlay(this)),c}}const We=[{id:"sm_1",name:"Space Marine Captain (星际战士队长)",operativeType:"sm_captain",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_captain.png",weapons:[new C("Master-crafted Bolt Rifle (精铸爆弹步枪)",4,3,4,5,!0,24,["Indirect Fire"]),new C("Relic Blade (遗物利刃)",5,3,5,6,!1,null,["Severe"])]},{id:"sm_2",name:"Assault Intercessor Sergeant (突击军士)",operativeType:"sm_assault_sergeant",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sergeant.png",weapons:[new C("Hand Flamer (手持火焰喷射器)",4,2,3,3,!0,6,["Saturate",'Torrent 1"']),new C("Chainsword (链锯剑)",5,3,4,5,!1,null,[])]},{id:"sm_3",name:"Intercessor Sergeant (战术军士)",operativeType:"sm_intercessor_sergeant",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sergeant.png",weapons:[new C("Bolt Rifle (爆弹步枪)",4,3,3,4,!0,null,["Piercing Crits 1"]),new C("Chainsword (链锯剑)",4,3,4,5,!1,null,[])]},{id:"sm_4",name:"Eliminator Sniper (Eliminator 狙击手)",operativeType:"sm_eliminator_sniper",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_sniper.png",weapons:[new C("Bolt Sniper Rifle (爆弹狙击步枪)",4,2,3,4,!0,null,["Heavy (Dash only)","Saturate","Seek Light","Silent"]),new C("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_5",name:"Heavy Intercessor Gunner (重型火力手)",operativeType:"sm_heavy_gunner",wounds:18,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/sm/sm_heavy_gunner.png",weapons:[new C("Heavy Bolter (重型爆弹枪)",5,3,4,5,!0,null,["Piercing Crits 1"]),new C("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_8",name:"Intercessor Gunner (战术火力手)",operativeType:"sm_intercessor_gunner",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_warrior_b.png",weapons:[new C("Auto Bolt Rifle (自动爆弹步枪)",4,3,3,4,!0,null,['Torrent 1"']),new C("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"sm_6",name:"Assault Intercessor Warrior (突击战士)",operativeType:"sm_assault_warrior",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_assault.png",weapons:[new C("Heavy Bolt Pistol (重型爆弹手枪)",4,3,3,4,!0,8,["Piercing Crits 1"]),new C("Chainsword (链锯剑)",5,3,4,5,!1,null,[])]},{id:"sm_7",name:"Intercessor Warrior (战术战士)",operativeType:"sm_intercessor_warrior",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:6,defaultAvatar:"./assets/images/operatives/sm/sm_warrior_a.png",weapons:[new C("Bolt Rifle (爆弹步枪)",4,3,3,4,!0,null,["Piercing Crits 1"]),new C("Fists (铁拳)",4,3,3,4,!1,null,[])]}],qe=[{id:"pm_1",name:"Plague Marine Champion (瘟疫冠军)",operativeType:"pm_champion",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_champion.png",weapons:[new C("Plague Sword (瘟疫之剑)",5,3,4,5,!1,null,["Severe","Poison","Toxic"])]},{id:"pm_2",name:"Malignant Plaguecaster (恶性瘟疫术士)",operativeType:"pm_plaguecaster",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_caster.png",weapons:[new C("Entropy (熵能术)",4,3,3,7,!0,7,["PSYCHIC","Saturate","Severe","Poison"]),new C("Plague Wind (瘟疫之风)",6,3,2,3,!0,null,["PSYCHIC","Saturate","Severe",'Torrent 1"',"Poison"]),new C("Corrupted Staff (腐蚀法杖)",4,3,3,4,!1,null,["PSYCHIC","Severe","Shock","Stun","Poison"])]},{id:"pm_3",name:"Plague Marine Bombardier (瘟疫掷弹兵)",operativeType:"pm_bombardier",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_gunner.png",weapons:[new C("Boltgun (爆弹枪)",4,3,3,4,!0,null,["Toxic"]),new C("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"pm_4",name:"Plague Marine Fighter (瘟疫搏击手)",operativeType:"pm_fighter",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_fighter.png",weapons:[new C("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new C("Flail of Corruption (腐化之链枷)",5,3,4,5,!1,null,["Brutal","Severe","Shock","Poison"])]},{id:"pm_5",name:"Plague Marine Heavy Gunner (瘟疫重炮手)",operativeType:"pm_heavy_gunner",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_heavy.png",weapons:[new C("Plague Spewer (瘟疫喷射器)",5,2,3,3,!0,7,["Saturate","Severe",'Torrent 2"',"Poison"]),new C("Fists (铁拳)",4,3,3,4,!1,null,[])]},{id:"pm_6",name:"Plague Marine Icon Bearer (瘟疫圣像手)",operativeType:"pm_icon_bearer",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_icon.png",weapons:[new C("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new C("Plague Knife (瘟疫匕首)",5,3,3,4,!1,null,["Severe","Poison"])]},{id:"pm_7",name:"Plague Marine Warrior (瘟疫战士)",operativeType:"pm_warrior",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:5,defaultAvatar:"./assets/images/operatives/pm/pm_warrior.png",weapons:[new C("Boltgun (爆弹枪)",4,3,3,4,!0,null,["Toxic"]),new C("Plague Knife (瘟疫匕首)",4,3,3,4,!1,null,["Severe","Poison"])]}],Ke=[{id:"leg_1",name:"Aspiring Champion (铁血冠军)",operativeType:"leg_aspiring_champion",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/leg/leg_champion.png",weapons:[new C("Plasma Pistol (等离子手枪)",4,3,3,5,!0,8,["Piercing 1"]),new C("Power Fist (动力拳套)",5,4,5,7,!1,null,["Brutal"])]},{id:"leg_2",name:"Chosen (神选者)",operativeType:"leg_chosen",wounds:15,apl:3,df:3,sv:3,isLeader:!0,move:6,defaultAvatar:"./assets/images/operatives/leg/leg_apostate.png",weapons:[new C("Plasma Pistol (等离子手枪)",4,3,3,5,!0,8,["Piercing 1"]),new C("Daemon Blade (恶魔之刃)",5,3,4,7,!1,null,["Lethal 5+"])]},{id:"leg_3",name:"Anointed (受膏者)",operativeType:"leg_anointed",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/leg/leg_anointed.png",weapons:[new C("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new C("Daemonic Claw (恶魔魔爪)",5,3,4,5,!1,null,["Rending"])]},{id:"leg_4",name:"Balefire Acolyte (炎劫祭司)",operativeType:"leg_balefire_acolyte",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/leg/leg_lord.png",weapons:[new C("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new C("Fell Dagger (堕落匕首)",5,3,3,4,!1,null,["PSYCHIC","Rending"])]},{id:"leg_5",name:"Butcher (屠夫)",operativeType:"leg_butcher",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/leg/leg_berserker.png",weapons:[new C("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new C("Double-handed Chainaxe (双手链锯斧)",5,4,5,7,!1,null,["Brutal"])]},{id:"leg_6",name:"Gunner (特种枪手)",operativeType:"leg_gunner",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/leg/leg_gunner.png",weapons:[new C("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new C("Plasma Gun (等离子枪)",4,3,4,6,!0,null,["Piercing 1"])]},{id:"leg_7",name:"Heavy Gunner (重机枪手)",operativeType:"leg_heavy_gunner",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/leg/leg_heavy.png",weapons:[new C("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new C("Reaper Chaincannon (收割机枪)",5,3,3,4,!0,null,["Ceaseless","Heavy (Dash only)","Punishing"])]},{id:"leg_8",name:"Icon Bearer (举旗手)",operativeType:"leg_icon_bearer",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/leg/leg_icon.png",weapons:[new C("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new C("Boltgun (爆弹枪)",4,3,3,4,!0,null,[])]},{id:"leg_9",name:"Shrivetalon (剥皮裂爪)",operativeType:"leg_shrivetalon",wounds:14,apl:3,df:3,sv:3,isLeader:!1,move:6,defaultAvatar:"./assets/images/operatives/leg/leg_shrivetalon.png",weapons:[new C("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,["Rending"]),new C("Flensing Blades (剥皮双刃)",5,3,3,5,!1,null,["Lethal 5+"])]},{id:"leg_10",name:"Legionary Warrior (军团战士)",operativeType:"leg_warrior",wounds:14,apl:3,df:3,sv:3,isLeader:!1,isWarrior:!0,move:6,defaultAvatar:"./assets/images/operatives/leg/leg_trooper.png",weapons:[new C("Bolt Pistol (爆弹手枪)",4,3,3,4,!0,8,[]),new C("Boltgun (爆弹枪)",4,3,3,4,!0,null,[])]}],jt={move:{title:"🏃 移动 (Normal Move) 规则帮助",body:`
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
        `}},Wt="/Kill-Team-Companion/";function ne(e){if(!e)return"";let t=e.replace(/^\.\//,"");return t.startsWith("/")?t:Wt+t}const qt=window.matchMedia("(prefers-reduced-motion: reduce)"),ut={seize_ground:"夺取阵地 (Seize Ground)",recovery:"物资回收 (Recovery)",breakthrough:"突破防线 (Breakthrough)",custom:"自定义 (Custom)"},Kt={seize_ground:'<b style="color:var(--imperial-gold);">夺取阵地：</b>棋盘上通常摆放 3 个目标点。每回合结束时，根据控制的目标数量与局势获得 VP。',recovery:'<b style="color:var(--imperial-gold);">物资回收：</b>棋盘上散布遗物/情报标记。通过移动或激活动作拾取，并护送携带者回到己方部署区以完成回收。',breakthrough:'<b style="color:var(--imperial-gold);">突破防线：</b>派遣特工穿越战场，进入敌方部署区以获取 VP。先抵达敌方阵地者得分。',custom:'<b style="color:var(--imperial-gold);">自定义任务：</b>根据实体任务卡或自定规则，自由勾选各项得分条件。'},st={seize_ground:["控制中央目标点 (+1 VP)","控制左翼目标点 (+1 VP)","控制右翼目标点 (+1 VP)","控制目标数量多于对手 (+1 VP)","消灭对方半数以上特工 (+1 VP)"],recovery:["拾取 1 枚遗物/情报 (+1 VP)","拾取 2 枚及以上遗物/情报 (+1 VP)","将遗物送回己方部署区 (+1 VP)","阻止对手完成回收 (+1 VP)","消灭敌方携带遗物的特工 (+1 VP)"],breakthrough:["1 名特工进入敌方部署区 (+1 VP)","2+ 名特工进入敌方部署区 (+1 VP)","控制敌方部署区内的目标 (+1 VP)","阻滞敌方推进（敌方无人进入你部署区）(+1 VP)","歼灭敌方后卫力量 (+1 VP)"],custom:["控制 1+ 目标点 (+1 VP)","控制目标多于对手 (+1 VP)","完成特定任务动作 (+1 VP)","本回合秘密任务 1 (+1 VP)","本回合秘密任务 2 (+1 VP)"]};function Ut(){const e=document.getElementById("mission-type"),t=document.getElementById("mission-desc");e&&t&&(t.innerHTML=Kt[e.value]||"")}function ft(){const e=document.getElementById("rules-version"),t=document.getElementById("rules-version-desc");e&&(o.rulesVersion=e.value),t&&(o.rulesVersion==="lite"?t.innerHTML='<b style="color:var(--sm-accent);">Lite 规则：</b>简化版规则，隐藏 Advance（前进）行动，Dash 固定 3"，适合新手快速上手。':t.innerHTML='<b style="color:var(--imperial-gold);">Standard 规则：</b>完整版规则，包含所有行动（Advance/Dash/Fall Back），适合有经验的玩家。');const a=document.getElementById("action-advance");if(a){const r=a.closest(".action-btn-row");r&&(r.style.display=o.rulesVersion==="lite"?"none":"")}}let Gt=0;function Q(e,t="info",a=4e3){const r=document.getElementById("toast-container");if(!r){console.warn(`[Toast ${t}]:`,e);return}const i=document.createElement("div");i.className=`toast toast-${t}`,i.setAttribute("role",t==="error"?"alert":"status"),i.textContent=e,i.id=`toast-${++Gt}`,r.appendChild(i);const s=setTimeout(()=>{i.classList.add("toast-exit"),setTimeout(()=>i.remove(),300)},a);i.addEventListener("click",()=>{clearTimeout(s),i.classList.add("toast-exit"),setTimeout(()=>i.remove(),300)})}function Zt(e,t){const a=document.createElement("div");a.className="modal-overlay",a.style.display="flex",a.setAttribute("role","alertdialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-label","确认操作"),a.innerHTML=`
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
  `,document.body.appendChild(a),be(a);const r=()=>{xe(),a.remove()};a.querySelector("#confirm-dialog-cancel").addEventListener("click",()=>{r()}),a.querySelector("#confirm-dialog-ok").addEventListener("click",()=>{r(),t&&t()});const i=s=>{s.key==="Escape"&&(r(),document.removeEventListener("keydown",i))};document.addEventListener("keydown",i)}let me=null,ke=null;function lt(e){return e.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])')}function be(e){ke=document.activeElement,me=e;const t=lt(e);t.length>0&&t[0].focus(),e._focusTrapHandler=a=>{if(a.key==="Tab"){const r=lt(e);if(r.length===0)return;const i=r[0],s=r[r.length-1];a.shiftKey?document.activeElement===i&&(a.preventDefault(),s.focus()):document.activeElement===s&&(a.preventDefault(),i.focus())}},e.addEventListener("keydown",e._focusTrapHandler)}function xe(){me&&me._focusTrapHandler&&(me.removeEventListener("keydown",me._focusTrapHandler),delete me._focusTrapHandler),me=null,ke&&ke.focus&&ke.focus(),ke=null}document.addEventListener("keydown",e=>{if(e.key==="Escape"){const t=document.getElementById("help-modal");if(t&&t.style.display==="flex"){xt();return}const a=document.getElementById("combat-modal");if(a&&a.style.display==="flex"){gt.closeModal();return}const r=document.getElementById("death-overlay");if(r&&r.style.display==="flex"){kt();return}}});const ae={0:{},1:{}},gt={};function Qt(e){Object.assign(gt,e)}function L(e){const t=document.getElementById("battle-log-lines");if(!t)return;const a=document.createElement("div");a.textContent=e,t.appendChild(a),t.scrollTop=t.scrollHeight}function se(){document.getElementById("sm-vp").textContent=o.smVp,document.getElementById("sm-cp").textContent=o.smCp,document.getElementById("pm-vp").textContent=o.pmVp,document.getElementById("pm-cp").textContent=o.pmCp,document.getElementById("dash-tp").textContent=o.turningPoint;let e=o.phase;e==="Initiative"?e="先攻阶段":e==="Strategy"?e="策略阶段":e==="Firefight"&&(e="战斗阶段"),document.getElementById("dash-phase").textContent=e;const t={bolter_discipline:"爆弹惩戒",contagious_resilience:"传染韧性",dark_zealotry:"黑暗狂热"},a=document.getElementById("sm-ploy-tags");a.innerHTML="";const r=q(o.teamFactions[0]);o.smActivePloys.forEach(l=>{const p=document.createElement("span");p.className=`ploy-tag ${r}`,p.textContent=t[l]||l,a.appendChild(p)});const i=document.getElementById("pm-ploy-tags");i.innerHTML="";const s=q(o.teamFactions[1]);o.pmActivePloys.forEach(l=>{const p=document.createElement("span");p.className=`ploy-tag ${s}`,p.textContent=t[l]||l,i.appendChild(p)});const c=document.getElementById("btn-next-phase");c&&(o.phase==="Firefight"&&!fe(0)&&!fe(1)?(c.style.display="inline-block",c.textContent="回合得分结算",c.onclick=$t):c.style.display="none")}function Yt(){[0,1].forEach(e=>{const t=o.teamFactions[e],a=Ee(t),r=q(t),i=a?a.shortName:t,s=a?`${a.shortName} (${a.id})`:t,c=document.getElementById(`score-card-title-${e}`);c&&(c.textContent=s);const l=document.getElementById(`score-card-${e}`);l&&(l.className=`score-card ${r}`);const p=document.getElementById(`board-header-name-${e}`);p&&(p.textContent=`${i}战队`);const m=document.getElementById(`board-header-img-${e}`);m&&a&&a.headerImg&&(m.src=ne(a.headerImg),m.alt=`${i}战队旗帜`);const u=e===0?"sm-board":"pm-board",d=document.getElementById(u);d&&(d.className=`operative-board ${r}-team`)})}function Jt(e,t,a){if(h("click"),t==="cp")return;let r;e==="sm"?r=0:e==="pm"?r=1:r=J(e),r===0?o.smVp=Math.max(0,o.smVp+a):o.pmVp=Math.max(0,o.pmVp+a),se()}function Xt(){Zt("确定要重置当前对局吗？所有进度和选择将被清空。",()=>{h("click"),o.turningPoint=1,o.phase="Initiative",o.teamFactions={0:"Space Marine",1:"Plague Marine"},o.initiative="Space Marine",o.initiativeSlot=0,o.activeTurn="Space Marine",o.activeTurnSlot=0,o.smVp=0,o.smCp=2,o.pmVp=0,o.pmCp=2,o.smActivePloys=[],o.pmActivePloys=[],o.operatives=[],o.activeAgent=null,o.gameOver=!1,o.smKillsScored=0,o.pmKillsScored=0,document.getElementById("start-screen").style.display="flex",document.getElementById("global-dash").style.display="none",document.getElementById("battle-area").style.display="none",document.getElementById("guidance-banner").style.display="none",document.getElementById("battle-log-lines").innerHTML="",Ue()})}function X(e){document.getElementById("guidance-text").textContent=e}function Te(e,t){var m;const a=o.customAvatars[e],r=q(t);let i=ne(`assets/images/defaults/default_${r}_avatar.png`);const s=o.operatives.find(u=>u.id===e),c=We.concat(qe).concat(Ke),l=s?s.name:((m=c.find(u=>u.id===e))==null?void 0:m.name)||e;if(s&&s.defaultAvatar)i=ne(s.defaultAvatar);else{const u=c.find(d=>d.id===e);u&&u.defaultAvatar&&(i=ne(u.defaultAvatar))}return`<div class="op-avatar-slot main-avatar-${e}">
            <img src="${a||i}" class="op-avatar-img" alt="${l} 头像" loading="lazy" />
          </div>`}function en(e){return e.weapons.map(t=>{const a=t.name.split(" ")[0],r=t.rules&&t.rules.length>0?` [${t.rules.map(je).join(",")}]`:"";return a+r}).join(" / ")}function rt(e,t,a,r,i,s,c,l){const p=a?'<span class="role-badge leader" >LEADER</span>':'<span class="role-badge">OPERATOR</span>',m=r?"checked":"",u=i?"disabled":"",d=Te(e.id,t),f=e.isWarrior?' <span style="color:#c9a84c; font-size:0.65rem;">[Warrior]</span>':"",v=`s${l}`;let g;return e.isWarrior?g=`
      <div class="warrior-counter" data-warrior-id="${v}-${e.id}">
        <button class="warrior-counter-btn minus" onclick="event.stopPropagation(); decrementWarrior(${l},'${e.id}')" aria-label="减少数量">−</button>
        <span class="warrior-counter-value" id="warrior-count-${v}-${e.id}">0</span>
        <button class="warrior-counter-btn plus" onclick="event.stopPropagation(); incrementWarrior(${l},'${e.id}')" aria-label="增加数量">+</button>
      </div>
    `:g=`<input type="checkbox" class="roster-checkbox" id="check-${v}-${e.id}" ${m} ${u}>`,`
    ${g}
    ${d}
    <div class="roster-op-info">
      <div class="roster-op-name">${e.name} ${p}${f}</div>
      <div class="roster-op-weapons">Move: ${e.move||6}" | HP: ${e.wounds} | APL: ${e.apl}</div>
      <div style="font-size:0.65rem; color:#9a9da5; margin-top:2px;">武器: ${en(e)}</div>
    </div>
  `}function de(e){const t=o.teamFactions[e],a=Ee(t);return a&&a.templates?a.templates:t==="Space Marine"?We:t==="Plague Marine"?qe:t==="Legionary"?Ke:[]}function vt(e,t){h("click");const a=de(e),r=ae[e],i=a.find(p=>p.id===t);if(!i||!i.isWarrior)return;if(ve(e)>=5){Q("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning");return}r[t]=(r[t]||0)+1;const c=document.getElementById(`warrior-count-s${e}-${t}`);c&&(c.textContent=r[t]);const l=document.getElementById(`picker-row-s${e}-${t}`);l&&(r[t]>0?l.classList.add("selected"):l.classList.remove("selected")),ye(),he(e)}function tn(e,t){h("click");const a=ae[e];if(!a[t]||a[t]<=0)return;a[t]--;const r=document.getElementById(`warrior-count-s${e}-${t}`);r&&(r.textContent=a[t]);const i=document.getElementById(`picker-row-s${e}-${t}`);i&&a[t]<=0&&i.classList.remove("selected"),ye(),he(e)}function ve(e){const t=de(e),a=ae[e];let r=0;return t.filter(i=>!i.isLeader&&!i.isWarrior).forEach(i=>{var s;(s=document.getElementById(`check-s${e}-${i.id}`))!=null&&s.checked&&r++}),t.filter(i=>!i.isLeader&&i.isWarrior).forEach(i=>{r+=a[i.id]||0}),r}function ct(e){const t=de(e);ae[e];let a=0;return t.filter(r=>r.isLeader).forEach(r=>{var i;(i=document.getElementById(`check-s${e}-${r.id}`))!=null&&i.checked&&a++}),a+ve(e)}function Ue(){ae[0]={},ae[1]={},Fe(0),Fe(1),ye(),he(0),he(1)}function Fe(e){const t=o.teamFactions[e],a=de(e),r=q(t),i=j(t);T(t);const s=Ee(t),c=document.getElementById(`team${e}-roster-card`),l=document.getElementById(`team${e}-roster-title`);c&&(c.className=`roster-picker-card ${r}`),l&&(l.textContent=s?`${s.shortName} (${s.id})`:t);const p=a.filter(v=>v.isLeader),m=a.filter(v=>!v.isLeader),u=document.getElementById(`team${e}-leader-section`),d=document.getElementById(`team${e}-operator-section`);if(!u||!d)return;u.innerHTML="",d.innerHTML="";const f=e===0?"⚜":"☠";u.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:var(${i}); margin-bottom:6px; padding-left:4px;">
      ${f} 🎖️ LEADER — 单选 1 名 ${f}
    </div>
  `,p.forEach(v=>{const g=p.length===1,x=document.createElement("div");x.className="roster-pick-row",x.id=`picker-row-s${e}-${v.id}`,x.innerHTML=rt(v,t,!0,g,g,"","",e);const $=x.querySelector('input[type="checkbox"]');$&&($.removeAttribute("onchange"),$.onclick=P=>{P.stopPropagation(),$.disabled||$e(e,v.id)}),x.onclick=P=>{if(P.target.className!=="roster-checkbox"&&!P.target.closest(".op-avatar-slot")){const k=x.querySelector('input[type="checkbox"]');k&&!k.disabled&&(k.checked=!k.checked,$e(e,v.id))}},u.appendChild(x),g&&x.classList.add("selected")}),d.innerHTML=`
    <div style="font-size:0.8rem; font-weight:600; color:var(${i}); margin:12px 0 6px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span>${f} 🎯 OPERATORS — 共选 5 名 (Warrior 可用计数器重复选取) ${f}</span>
      <span id="team${e}-op-count" style="font-size:0.75rem; color:#9a9da5; font-family:'Pirata One',serif;">0 / 5</span>
    </div>
    <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px; padding-left:4px;">
      ⚠️ 非 Warrior 每种只能带一名。Warrior [Warrior] 可用 +/− 按钮选取最多 5 名同型单位。
    </p>
  `,m.forEach(v=>{const g=document.createElement("div");g.className="roster-pick-row",g.id=`picker-row-s${e}-${v.id}`,g.innerHTML=rt(v,t,!1,!1,!1,"","",e);const x=g.querySelector('input[type="checkbox"]');x&&!v.isWarrior&&(x.removeAttribute("onchange"),x.onclick=$=>{$.stopPropagation(),$e(e,v.id)}),g.onclick=$=>{if($.target.className!=="roster-checkbox"&&!$.target.closest(".op-avatar-slot")&&!$.target.closest(".warrior-counter"))if(v.isWarrior)vt(e,v.id);else{const P=g.querySelector('input[type="checkbox"]');P&&!P.disabled&&(P.checked=!P.checked,$e(e,v.id))}},d.appendChild(g)})}function nn(e){const t=document.getElementById(`team${e}-faction`);t&&(o.teamFactions[e]=t.value,ae[e]={},Fe(e),ye(),he(e))}function $e(e,t){h("click");const a=de(e),r=a.find(c=>c.id===t),i=document.getElementById(`check-s${e}-${t}`),s=document.getElementById(`picker-row-s${e}-${t}`);if(!(!r||!i)&&!(i.disabled&&i.checked)){if(r.isLeader)i.checked&&a.filter(c=>c.isLeader&&c.id!==t).forEach(c=>{var p;const l=document.getElementById(`check-s${e}-${c.id}`);l&&(l.checked=!1,(p=document.getElementById(`picker-row-s${e}-${c.id}`))==null||p.classList.remove("selected"))});else if(i.checked&&ve(e)>5){i.checked=!1,Q("Operator 数量已达上限 (5 名)！请先减少其他 Operator。","warning"),ye();return}i.checked?s==null||s.classList.add("selected"):s==null||s.classList.remove("selected"),ye(),he(e)}}function he(e){const t=de(e),a=ae[e],i=ve(e)>=5;t.filter(s=>!s.isLeader).forEach(s=>{if(s.isWarrior){const c=document.querySelector(`#picker-row-s${e}-${s.id} .warrior-counter-btn.plus`),l=document.querySelector(`#picker-row-s${e}-${s.id} .warrior-counter-btn.minus`),p=a[s.id]||0;c&&(c.disabled=i),l&&(l.disabled=p<=0)}else{const c=document.getElementById(`check-s${e}-${s.id}`);if(!c)return;i&&!c.checked?c.disabled=!0:c.disabled=!1}})}function ye(){const e=ct(0),t=ve(0),a=document.getElementById("team0-roster-count");a&&(a.textContent=`已选: ${e} / 6 人`);const r=document.getElementById("team0-op-count");r&&(r.textContent=`${t} / 5`);const i=ct(1),s=ve(1),c=document.getElementById("team1-roster-count");c&&(c.textContent=`已选: ${i} / 6 人`);const l=document.getElementById("team1-op-count");l&&(l.textContent=`${s} / 5`)}function an(){h("click");const e=de(0),t=[];let a=0;e.forEach(d=>{var f;if(d.isWarrior){const v=ae[0][d.id]||0;v>0&&t.push({tmpl:d,count:v})}else(f=document.getElementById(`check-s0-${d.id}`))!=null&&f.checked&&(t.push({tmpl:d,count:1}),d.isLeader&&a++)});const r=t.reduce((d,f)=>d+f.count,0),i=de(1),s=[];i.forEach(d=>{var f;if(d.isWarrior){const v=ae[1][d.id]||0;v>0&&s.push({tmpl:d,count:v})}else(f=document.getElementById(`check-s1-${d.id}`))!=null&&f.checked&&s.push({tmpl:d,count:1})});const c=s.reduce((d,f)=>d+f.count,0),l=o.teamFactions[0],p=o.teamFactions[1];if(r!==6){h("alert"),Q(`${T(l)} 必须刚好选择 6 人！当前选择了 ${r} 人。`,"error");return}if(a!==1){h("alert"),Q(`${T(l)} 必须选择且仅选择 1 名队长！`,"error");return}if(c!==6){h("alert"),Q(`${T(p)} 必须刚好选择 6 人！当前选择了 ${c} 人。`,"error");return}if(s.filter(d=>d.tmpl.isLeader).reduce((d,f)=>d+f.count,0)!==1){h("alert"),Q(`${T(p)} 必须选择且仅选择 1 名队长！`,"error");return}o.operatives=[],t.forEach(({tmpl:d,count:f})=>{for(let v=0;v<f;v++){const g=f>1?`${d.id}_${v+1}`:d.id,x=f>1?`${d.name} #${v+1}`:d.name,$=new ot(g,x,l,d.wounds,d.apl,d.df,d.sv,d.weapons,d.defaultAvatar,d.move||6,0);d.operativeType&&($.operativeType=d.operativeType),o.operatives.push($)}}),s.forEach(({tmpl:d,count:f})=>{for(let v=0;v<f;v++){const g=f>1?`${d.id}_${v+1}`:d.id,x=f>1?`${d.name} #${v+1}`:d.name,$=new ot(g,x,p,d.wounds,d.apl,d.df,d.sv,d.weapons,d.defaultAvatar,d.move||5,1);d.operativeType&&($.operativeType=d.operativeType),o.operatives.push($)}});const u=document.getElementById("mission-type");u&&(o.missionType=u.value),L(`  - 当前任务: ${ut[o.missionType]||o.missionType}`),document.getElementById("start-screen").style.display="none",document.getElementById("global-dash").style.display="grid",document.getElementById("battle-area").style.display="grid",document.getElementById("guidance-banner").style.display="flex",L(">>> 战队挑选部署完毕！"),L(`  - ${T(l)} 登场: ${o.operatives.filter(d=>d.teamSlot===0).map(d=>d.name).join(", ")}`),L(`  - ${T(p)} 登场: ${o.operatives.filter(d=>d.teamSlot===1).map(d=>d.name).join(", ")}`),Yt(),se(),ie(),o.rulesVersion==="standard"?on(()=>{_e()}):_e()}function on(e){const t=[],a=o.teamFactions[0],r=o.teamFactions[1];if(a==="Space Marine"&&t.push({teamSlot:0,type:"chapterTactics"}),r==="Space Marine"&&t.push({teamSlot:1,type:"chapterTactics"}),a==="Legionary"&&t.push({teamSlot:0,type:"marksOfChaos"}),r==="Legionary"&&t.push({teamSlot:1,type:"marksOfChaos"}),t.length===0){e();return}let i=0;function s(){if(i>=t.length){e();return}const c=t[i];i++,c.type==="chapterTactics"?sn(c.teamSlot,s):c.type==="marksOfChaos"&&ln(c.teamSlot,s)}s()}function sn(e,t){const a=[{id:"aggressive",name:"Aggressive (凶猛)",desc:"近战武器获得 Rending"},{id:"dueler",name:"Dueler (决斗者)",desc:"普通成功可格挡暴击"},{id:"resolute",name:"Resolute (坚毅)",desc:"忽略 APL 变化、免疫 Shock"},{id:"stealthy",name:"Stealthy (隐蔽)",desc:"额外保留 1 个 cover save"},{id:"mobile",name:"Mobile (机动)",desc:"Fall Back -1AP，可在控制范围冲锋"},{id:"hardy",name:"Hardy (坚韧)",desc:"防御 5+ 为暴击；反击时首个 ≥3 Normal Dmg -1"},{id:"sharpshooter",name:"Sharpshooter (神射手)",desc:"未移动时爆弹武器 Accurate 1 + Severe"},{id:"siege_specialist",name:"Siege Specialist (攻城专家)",desc:"远程 Saturate；近战敌方不能 assist"}],r=o.operatives.filter(l=>l.teamSlot===e&&l.faction==="Space Marine"),i=T("Space Marine");L(`
>>> ${i} 部署完毕！请选择 Chapter Tactics (章战术)`);let s=0;function c(){if(s>=r.length){L(`>>> ${i} Chapter Tactics 选择完成！`),t();return}const l=r[s];s++;const p=document.createElement("div");p.className="phase-overlay",p.style.zIndex="2000";let m=`
      <div style="background: #1e293b; border: 2px solid #60a5fa; border-radius: 12px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
        <h2 style="color: #60a5fa; margin-bottom: 16px;">📋 ${l.name} — 选择 Chapter Tactics</h2>
        <p style="color: #94a3b8; margin-bottom: 16px;">选择 2 种章战术 (primary + secondary)：</p>
        <div id="ct-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
    `;a.forEach(d=>{m+=`
        <label style="display: flex; align-items: flex-start; gap: 8px; padding: 8px; background: #334155; border-radius: 6px; cursor: pointer;">
          <input type="checkbox" class="ct-checkbox" value="${d.id}" style="margin-top: 3px;">
          <div>
            <div style="color: #e2e8f0; font-weight: bold; font-size: 13px;">${d.name}</div>
            <div style="color: #94a3b8; font-size: 11px;">${d.desc}</div>
          </div>
        </label>
      `}),m+=`
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button id="ct-confirm-btn" class="action-btn" style="background: #3b82f6;">确认选择</button>
        </div>
      </div>
    `,p.innerHTML=m,document.body.appendChild(p),p.querySelectorAll(".ct-checkbox").forEach(d=>{d.addEventListener("change",()=>{p.querySelectorAll(".ct-checkbox:checked").length>2&&(d.checked=!1,Q("最多选择 2 种章战术！","warning"))})}),p.querySelector("#ct-confirm-btn").addEventListener("click",()=>{const d=p.querySelectorAll(".ct-checkbox:checked"),f=Array.from(d).map(v=>v.value);if(f.length!==2){Q("请选择恰好 2 种章战术！","warning");return}o.chapterTacticSelections[l.id]={primary:f[0],secondary:f[1]},l.chapterTactics=f,L(`  - ${l.name}: ${f.join(", ")}`),h("click"),document.body.removeChild(p),c()})}c()}function ln(e,t){const a=[{id:"KHORNE",name:"Khorne (恐虐)",desc:"近战武器获得 Severe",color:"#dc2626"},{id:"NURGLE",name:"Nurgle (纳垢)",desc:"Normal Dmg ≥3 时 D6 5+ 减 1",color:"#16a34a"},{id:"SLAANESH",name:"Slaanesh (色孽)",desc:'Move +1"',color:"#d946ef"},{id:"TZEENTCH",name:"Tzeentch (奸奇)",desc:"远程武器获得 Severe",color:"#3b82f6"},{id:"UNDIVIDED",name:"Undivided (无分)",desc:'6" 内交战时远程武器获得 Ceaseless',color:"#a855f7"}],r=o.operatives.filter(l=>l.teamSlot===e&&l.faction==="Legionary"),i=T("Legionary");L(`
>>> ${i} 部署完毕！请选择 Marks of Chaos (混沌印记)`);let s=0;function c(){if(s>=r.length){L(`>>> ${i} Marks of Chaos 选择完成！`),t();return}const l=r[s];s++;const p=document.createElement("div");p.className="phase-overlay",p.style.zIndex="2000";let m=`
      <div style="background: #1e293b; border: 2px solid #8b1a1a; border-radius: 12px; padding: 24px; max-width: 500px; width: 90%;">
        <h2 style="color: #ef4444; margin-bottom: 16px;">👹 ${l.name} — 选择混沌印记</h2>
        <p style="color: #94a3b8; margin-bottom: 16px;">选择 1 种混沌印记：</p>
        <div id="moc-options" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
    `;a.forEach(d=>{m+=`
        <label style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #334155; border-radius: 8px; cursor: pointer; border: 2px solid transparent;" class="moc-option">
          <input type="radio" name="moc-radio" value="${d.id}" style="width: 18px; height: 18px;">
          <div>
            <div style="color: ${d.color}; font-weight: bold; font-size: 15px;">${d.name}</div>
            <div style="color: #94a3b8; font-size: 12px;">${d.desc}</div>
          </div>
        </label>
      `}),m+=`
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button id="moc-confirm-btn" class="action-btn" style="background: #8b1a1a;">确认选择</button>
        </div>
      </div>
    `,p.innerHTML=m,document.body.appendChild(p);const u=p.querySelectorAll(".moc-option");u.forEach(d=>{const f=d.querySelector('input[type="radio"]');f.addEventListener("change",()=>{u.forEach(v=>v.style.borderColor="transparent"),f.checked&&(d.style.borderColor="#ef4444")})}),p.querySelector("#moc-confirm-btn").addEventListener("click",()=>{var g;const d=p.querySelector('input[name="moc-radio"]:checked');if(!d){Q("请选择 1 种混沌印记！","warning");return}const f=d.value;o.marksOfChaosSelections[l.id]=f,l.marksOfChaos=f;const v=((g=a.find(x=>x.id===f))==null?void 0:g.name)||f;L(`  - ${l.name}: ${v}`),h("click"),document.body.removeChild(p),c()})}c()}function ie(){const e=document.getElementById("sm-ops-list"),t=document.getElementById("pm-ops-list");e.innerHTML="",t.innerHTML="";let a=0,r=0;o.operatives.forEach(i=>{const s=i.teamSlot>=0?i.teamSlot:J(i.faction),c=q(i.faction);s===0&&!i.isDead&&a++,s===1&&!i.isDead&&r++;const l=document.createElement("div");let p=`op-card ${c}-theme`;i.isDead?p+=" dead":i.hasActed&&(p+=" activated"),o.activeAgent&&o.activeAgent.id===i.id&&(p+=" active-target"),l.className=p;const m=i.wounds/i.maxWounds*100,u=i.weapons.map(A=>A.name.split(" ")[0]).join(" / ");let d="";Y(i.faction,"disgustingResilience")&&oe(i.faction).includes("contagious_resilience")&&!i.isDead&&(d=`<span class="card-ploy-tag" style="border-color:var(${j(i.faction)}); color:var(${j(i.faction)}); background:rgba(122,184,138,0.15);">减伤重投</span>`);let f="";i.isDead||(i.hasConceal&&(f+='<span class="card-ploy-tag" style="border-color:#818cf8; color:#818cf8; background:rgba(129,140,248,0.15); font-size:0.6rem;">隐蔽</span>'),i.isInjured&&(f+='<span class="card-ploy-tag" style="border-color:var(--red); color:var(--red); background:rgba(184,76,76,0.15); font-size:0.6rem;">重伤</span>'),i.poisonTokens>0&&(f+='<span class="card-ploy-tag" style="border-color:#7ab88a; color:#7ab88a; background:rgba(122,184,138,0.15); font-size:0.6rem;">毒素×'+i.poisonTokens+"</span>"));const v=!i.isDead&&!i.hasActed&&o.phase==="Firefight"&&o.activeTurnSlot===i.teamSlot,g=o.activeAgent&&o.activeAgent.id===i.id,x=i.actionsPerformed.length>0,k=(v||g)&&!x?`<button class="conceal-toggle-btn" onclick="event.stopPropagation(); toggleConceal('${i.id}')" title="选择命令 (开始行动后锁定)" style="font-size:0.65rem; padding:2px 6px; margin-left:4px; background:${i.hasConceal?"rgba(129,140,248,0.3)":"transparent"}; border:1px solid #818cf8; color:#818cf8; border-radius:4px; cursor:pointer;">${i.hasConceal?"🛡️隐蔽":"🛡️交战"}</button>`:(v||g)&&x?`<button class="conceal-toggle-btn" disabled title="已开始行动，命令锁定" style="font-size:0.65rem; padding:2px 6px; margin-left:4px; background:${i.hasConceal?"rgba(129,140,248,0.15)":"transparent"}; border:1px solid #475569; color:#64748b; border-radius:4px; cursor:not-allowed; opacity:0.6;">${i.hasConceal?"🛡️隐蔽(锁)":"🛡️交战(锁)"}</button>`:"",S=Te(i.id,i.faction);l.innerHTML=`
      <div style="position:absolute;top:3px;right:6px;color:var(--imperial-gold);font-size:10px;opacity:0.4;pointer-events:none;z-index:1;">✦</div>
      <div class="op-card-top">
        <div class="op-avatar-row">
          ${S}
          <span class="op-card-title">${i.name} ${d} ${f} ${k}</span>
        </div>
        <span class="op-card-tag">${i.currentApl} APL${i.isInjured&&o.rulesVersion==="standard"?' <span style="color:var(--red); font-size:0.6rem;">(-1)</span>':""}</span>
      </div>
      <div class="op-card-hp">
        <span>HP (Wounds):</span>
        <span>${i.wounds} / ${i.maxWounds}</span>
      </div>
      <div class="op-hp-bar-container">
        <div class="op-hp-bar" style="width: ${m}%; background-color: ${m<40?"var(--red)":"var(--green)"}"></div>
      </div>
      <div class="op-card-stats">
        <span>Move: <strong>${i.currentMove}"</strong>${i.isInjured?' <span style="color:var(--red); font-size:0.55rem;">(-2)</span>':""}</span>
        <span>DF: <strong>${i.df}</strong></span>
        <span>SV: <strong>${i.sv}+</strong></span>
        <span style="font-size: 0.65rem; color: #5a5d65; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">
          ${u}
        </span>
      </div>
    `,l.setAttribute("role","button"),l.setAttribute("tabindex","0"),l.setAttribute("aria-label",`${i.name}，HP: ${i.wounds}/${i.maxWounds}，${i.isDead?"已阵亡":i.hasActed?"已激活":"可激活"}`),o.pendingActivation&&o.pendingActivation.id===i.id&&l.classList.add("pending-activation"),!i.isDead&&!i.hasActed&&o.phase==="Firefight"&&o.activeTurnSlot===i.teamSlot&&!o.activeAgent?(l.onclick=()=>He(i.id),l.onkeydown=A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),He(i.id))}):(l.onclick=null,l.onkeydown=null,i.isDead&&l.setAttribute("aria-disabled","true")),s===0?e.appendChild(l):t.appendChild(l)}),document.getElementById("sm-alive-count").textContent=`${a} / 6 存活`,document.getElementById("pm-alive-count").textContent=`${r} / 6 存活`}function rn(e){h("click");const t=o.operatives.find(a=>a.id===e);if(!(!t||t.isDead)){if(t.actionsPerformed.length>0){Q("已开始行动，命令锁定，无法再切换！","warning");return}t.toggleConceal(),L(`[命令切换] ${t.name} ${t.hasConceal?"进入隐蔽 (Conceal)：在掩体中不可被射击；本激活不能主动射击/冲锋。":"切换为交战 (Engage)。"}`),ie(),K()}}function He(e){h("click");const t=o.operatives.find(a=>a.id===e);!t||t.isDead||t.hasActed||o.phase!=="Firefight"||o.activeTurnSlot!==t.teamSlot||o.activeAgent||(o.pendingActivation&&o.pendingActivation.id===e?o.pendingActivation=null:o.pendingActivation=t,ie(),K())}function cn(){const e=o.pendingActivation;e&&(o.pendingActivation=null,ht(e.id))}function dn(){h("click"),o.pendingActivation=null,ie(),K()}function ht(e){h("click");const t=o.operatives.find(r=>r.id===e);if(!t||t.isDead||t.hasActed)return;if(o.activeAgent=t,o.pendingActivation=null,t.actionsPerformed=[],t.orderSwitchedThisActivation=!1,t.poisonTokens>0){const r=t.wounds;if(L(`[毒素] ${t.name} 携带毒素标记，激活开始受到 1 点伤害！`),t.applyWounds(1),Q(`☠️ ${t.name} 毒素发作：受到 1 点伤害 (${r} → ${t.wounds})`,"warning"),t.isDead){ie(),K();return}}t.apl=t.currentApl;const a=t.isInjured?o.rulesVersion==="standard"?" (Injured: APL -1)":' (Injured: Move -2")':"";L(`[激活] ${t.name} 开始激活，获得 ${t.apl} APL！${a}`),ie(),K()}function K(){const e=document.getElementById("active-panel-content"),t=document.getElementById("active-panel-empty"),a=document.getElementById("active-panel-status"),r=document.getElementById("active-panel"),i=document.getElementById("turn-indicator"),s=document.getElementById("turn-indicator-faction"),c=document.querySelector(".turn-indicator-label");if(i&&o.phase==="Firefight"){i.style.display="flex";const g=T(o.activeTurn);s&&(s.textContent=g),i.className=`turn-indicator ${q(o.activeTurn)}-turn`,c&&(o.activeAgent?c.textContent=" — 正在行动":o.pendingActivation?c.textContent=" — 请确认激活":c.textContent="的回合 — 请选择特工")}else i&&(i.style.display="none");const l=document.getElementById("pending-activation-panel");if(l)if(o.pendingActivation&&!o.activeAgent){l.style.display="flex";const g=o.pendingActivation,x=document.getElementById("pending-op-avatar");x&&(x.innerHTML=Te(g.id,g.faction)),document.getElementById("pending-op-name").textContent=g.name,document.getElementById("pending-op-faction").textContent=T(g.faction),document.getElementById("pending-op-move").textContent=g.currentMove+'"',document.getElementById("pending-op-hp").textContent=`${g.wounds}/${g.maxWounds}`,document.getElementById("pending-op-apl").textContent=g.currentApl}else l.style.display="none";const p=document.getElementById("sm-board"),m=document.getElementById("pm-board"),u=o.phase==="Firefight",d=o.activeTurnSlot,f=u&&d===0,v=u&&d===1;if(p&&(p.classList.toggle("active-turn",f),p.classList.toggle("inactive-turn",u&&!f)),m&&(m.classList.toggle("active-turn",v),m.classList.toggle("inactive-turn",u&&!v)),o.activeAgent){e.style.display="flex",t.style.display="none";const g=o.activeAgent;a.textContent="当前激活特工";const x=document.getElementById("active-op-avatar-container");x&&(x.innerHTML=Te(g.id,g.faction)),r.className=`active-card ${q(g.faction)}-active`,document.getElementById("active-op-name").textContent=g.name,document.getElementById("active-op-faction").textContent=T(g.faction);const $=document.getElementById("active-apl-dots");$.innerHTML="";for(let M=0;M<g.maxApl;M++){const pe=document.createElement("div");pe.className="apl-dot"+(M<g.apl?" active":""),$.appendChild(pe)}const P=g.actionsPerformed.includes("Move"),k=g.actionsPerformed.includes("Charge"),S=g.actionsPerformed.includes("Advance"),A=g.actionsPerformed.includes("Dash"),_=g.weapons.some(M=>M.hasRule("Heavy")),H=g.actionsPerformed.includes("FallBack"),R=g.actionsPerformed.filter(M=>M==="Shoot").length,I=g.actionsPerformed.filter(M=>M==="Fight").length,N=R>0,V=I>0,w=Y(g.faction,"astartesDoubleAction"),E=g.counteracting===!0,G=oe(g.faction).includes("bolter_discipline"),O=w||G,re=P||k||S||A||H,D=S||H,Ie=A&&!_,Ye=E?1:O?2:1,Je=E?1:O?2:1,Xe=O&&!E&&V,et=O&&!E&&N,Pt=R>=Ye,Et=I>=Je;document.getElementById("action-move").disabled=g.apl<1||re||E,document.getElementById("action-charge").disabled=E?!0:g.apl<1||re||V||N||g.hasConceal,document.getElementById("action-advance").disabled=g.apl<1||re||V||N||E,document.getElementById("action-dash").disabled=g.apl<1||re||V||N||E,document.getElementById("action-fallback").disabled=g.apl<2||re||V||N||E;const Lt=_&&!A&&g.weapons.every(M=>M.hasRule("Heavy")),Dt=g.weapons.some(M=>M.hasRule("Silent")),It=g.hasConceal&&!Dt;document.getElementById("action-shoot").disabled=g.apl<1||Pt||Xe||k||D||Ie||Lt||It,document.getElementById("action-fight").disabled=g.apl<1||Et||et||D||A;const Bt=Y(g.faction,"disgustingResilience")&&oe(g.faction).includes("contagious_resilience"),tt=G&&!w?"爆弹惩戒":"Astartes",nt=document.getElementById("active-ploys-display");if(nt){const M=[];E&&M.push('<span style="color:#f97316;">⚡ 反击 (Counteract): 仅限 1 次行动, 移动≤2", 不可冲锋</span>'),S&&M.push('<span style="color:#f59e0b;">🏃💨 已前进 (Advance): 不能再射击/近战</span>'),A&&M.push(`<span style="color:#f59e0b;">💨💨 已冲刺 (Dash): 不能再近战${_?"，仅 Heavy 武器可射击":"，不能射击"}</span>`),H&&M.push('<span style="color:#f59e0b;">🔙 已撤退 (Fall Back): 不能再射击/近战</span>'),N&&!E&&O&&M.push(`<span style="color:#6a9ad4;">💥 ${tt}: 已射击×${R}，锁定近战</span>`),V&&!E&&O&&M.push(`<span style="color:#f87171;">⚔️ ${tt}: 已近战×${I}，锁定射击</span>`),Bt&&M.push('<span style="color:var(--pm-accent);">🛡️ 传染韧性生效中</span>'),G&&!w&&M.push('<span style="color:#fbbf24;">🔥 爆弹惩戒: 可射击 2 次</span>'),Y(g.faction,"darkZealotry")&&oe(g.faction).includes("dark_zealotry")&&M.push('<span style="color:#c94444;">⚔️ 黑暗狂热: 近战可重投 1 个失败骰</span>'),nt.innerHTML=M.length>0?M.join(" | "):""}const Be=document.querySelector("#action-shoot span:first-child");if(Be)if(O){const M=Ye-R,pe=Xe?" (已锁定)":"";Be.innerHTML=`💥 射击 [${M>0?M:0}次剩余${pe}]`}else Be.innerHTML="💥 射击 (Shoot)";const Me=document.querySelector("#action-fight span:first-child");if(Me)if(O){const M=Je-I,pe=et?" (已锁定)":"";Me.innerHTML=`⚔️ 近战 [${M>0?M:0}次剩余${pe}]`}else Me.innerHTML="⚔️ 近战 (Fight)";X(`【特工行动】${g.name} 剩余 APL: ${g.apl}。可执行移动/冲锋/前进/冲刺/撤退/射击/近战，或点击下方按钮结束。`)}else if(o.pendingActivation)e.style.display="none",t.style.display="none",a.textContent="等待确认",r.className="active-card",X(`【预选确认】已选中【${o.pendingActivation.name}】。请在右侧面板点击「确认激活」或「取消」。`);else{e.style.display="none",t.style.display="block",a.textContent="等待特工激活",r.className="active-card";const g=o.activeTurnSlot,x=o.teamFactions[g],$=T(x);if(fe(g))X(`【激活提示】请从${g===0?"左边":"右边"}【${$}】战队卡片列表中选择点击发亮的特工卡片，载入动作。`);else{const k=1-g;fe(k)?X("【激活换边】因为当前轮次已无可用单位，权能自动转回另一方。请继续点击激活。"):X("【激活结束】双方所有特工已耗尽激活！请点击右上角的回合推进至下一TP。")}}}function pn(){const e=o.activeAgent;!e||e.apl<1||(h("click"),e.apl-=1,e.actionsPerformed.push("Move"),e.counteracting?L(`  - ${e.name} 执行 [反击移动]，消耗 1 AP。⚠️ 物理沙盘移动不得超过 2"！`):L(`  - ${e.name} 执行 [移动 (Move)]，消耗 1 APL。`),K())}function mn(){const e=o.activeAgent;!e||e.apl<1||(h("click"),e.apl-=1,e.actionsPerformed.push("Charge"),L(`  - ${e.name} 执行 [冲锋 (Charge)]，移动最多 ${e.currentMove+2}" 并贴入敌方控制范围，消耗 1 APL。`),K())}function un(){const e=o.activeAgent;!e||e.apl<1||(h("click"),e.apl-=1,e.actionsPerformed.push("Advance"),L(`  - ${e.name} 执行 [前进 (Advance)]，移动距离 +3" (总计 ${e.currentMove+3}")，但本激活不能再射击/近战。`),K())}function fn(){const e=o.activeAgent;!e||e.apl<1||(h("click"),e.apl-=1,e.actionsPerformed.push("Dash"),L(`  - ${e.name} 执行 [冲刺 (Dash)]，移动最多 3" (lite 规则，且不能攀爬)，本激活不能再射击/近战 (Heavy Dash-only 武器除外)。`),K())}function gn(){const e=o.activeAgent;if(!e||e.apl<2){e&&L(`  - ❌ ${e.name} APL 不足 (${e.apl}/2)，无法执行撤退 (Fall Back)。`);return}h("click"),e.apl-=2,e.actionsPerformed.push("FallBack"),L(`  - ${e.name} 执行 [撤退 (Fall Back)]，脱离交战区域 (移动最多 ${e.currentMove}")，消耗 2 APL。本激活不能再射击/近战。`),K()}function vn(){h("click");const e=o.activeAgent;e&&(e.counteracting&&(L(`[反击结束] ${e.name} 的反击行动完毕。`),e.counteracting=!1),e.hasActed=!0,e.apl=0,L(`[结束激活] ${e.name} 结束了本次激活。`),o.activeAgent=null,o.pendingActivation=null,Nt())}function _e(){o.phase="Initiative",se(),Le();const e=document.getElementById("phase-overlay-content");e.innerHTML=`
    <h3>Turning Point ${o.turningPoint} - 先攻掷骰</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:10px;">
      游戏开始前，双方通过投掷先攻骰 (Initiative Roll-Off) 判定胜负，胜者决定谁拿先攻手牌。
    </p>

    <div class="init-roll-grid" style="margin-bottom:12px;">
      <div class="init-team-col ${q(o.teamFactions[0])}">
        <h4 style="color:var(${j(o.teamFactions[0])}); font-size:0.9rem;">${T(o.teamFactions[0])}先攻骰</h4>
        <div class="dice-pool-view" id="overlay-init-sm-dice">
          <div class="kt-dice-cube ${z(o.teamFactions[0])}">?</div>
        </div>
        <div id="overlay-init-sm-val" style="font-weight:bold; font-size: 0.9rem; color:var(--text-muted);">未投骰</div>
      </div>
      <div class="init-team-col ${q(o.teamFactions[1])}">
        <h4 style="color:var(${j(o.teamFactions[1])}); font-size:0.9rem;">${T(o.teamFactions[1])}先攻骰</h4>
        <div class="dice-pool-view" id="overlay-init-pm-dice">
          <div class="kt-dice-cube ${z(o.teamFactions[1])}">?</div>
        </div>
        <div id="overlay-init-pm-val" style="font-weight:bold; font-size: 0.9rem; color:var(--text-muted);">未投骰</div>
      </div>
    </div>

    <button class="btn-large" id="btn-overlay-roll" onclick="rollInitiativeOverlay()" style="padding: 10px 30px; font-size:0.9rem;">开始掷骰判定</button>
  `,X("【先攻阶段】点击按钮开始判定本回合先手优势权。")}function Le(){const e=document.getElementById("phase-overlay");e.style.display="flex";const t=document.getElementById("phase-overlay-content");t&&(t.classList.add("gothic-panel"),t.querySelector(".gothic-arch")||t.insertAdjacentHTML("afterbegin",'<div class="gothic-arch"></div>')),be(e)}function Ge(){document.getElementById("phase-overlay").style.display="none",xe()}function hn(){const e=document.getElementById("counteract-overlay");e&&(e.style.display="none"),xe()}function yt(e){const t=document.getElementById("counteract-overlay"),a=document.getElementById("counteract-content"),r=typeof e=="number"?e:J(e),i=o.teamFactions[r],s=T(i),c=`var(${j(i)})`,l=o.operatives.filter(m=>m.teamSlot===r&&!m.isDead&&m.hasActed&&!m.hasConceal);let p="";l.forEach(m=>{p+=`
      <div class="counteract-op-row" onclick="selectCounteractOperative('${m.id}')" style="
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
      " onmouseover="this.style.borderColor='${c}'; this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.03)'">
        <div style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.1); overflow:hidden; flex-shrink:0;">
          <img src="${ne(m.defaultAvatar)}" style="width:100%; height:100%; object-fit:cover;" alt="${m.name}" />
        </div>
        <div style="flex:1;">
          <div style="font-weight:600; color:#fff; font-size:0.85rem;">${m.name}</div>
          <div style="font-size:0.7rem; color:var(--text-muted);">HP: ${m.wounds}/${m.maxWounds} | 武器: ${m.weapons.length} 种</div>
        </div>
        <div style="color:${c}; font-size:0.75rem; font-weight:600;">选择 →</div>
      </div>
    `}),a.innerHTML=`
    <h3 style="color:${c}; margin-bottom:8px;">⚡ 反击时机 (Counteract)</h3>
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
  `,t.style.display="flex",be(t)}function yn(e){h("crit"),Ot(e)}function bn(){h("click"),pt()}function xn(){const e=document.getElementById("overlay-init-sm-dice"),t=document.getElementById("overlay-init-pm-dice"),a=document.getElementById("btn-overlay-roll");a.disabled=!0;const r=o.teamFactions[0],i=o.teamFactions[1],s=z(r),c=z(i);e.innerHTML=`<div class="kt-dice-cube ${s} rolling">?</div>`,t.innerHTML=`<div class="kt-dice-cube ${c} rolling">?</div>`,h("shoot"),setTimeout(()=>{const l=Math.floor(Math.random()*6)+1;e.innerHTML=`<div class="kt-dice-cube ${s} ${l===6?"crit-dice":""}">${l}</div>`,h("click"),l===6&&h("crit"),setTimeout(()=>{const p=Math.floor(Math.random()*6)+1;if(t.innerHTML=`<div class="kt-dice-cube ${c} ${p===6?"crit-dice":""}">${p}</div>`,h("click"),p===6&&h("crit"),l===p)h("alert"),document.getElementById("overlay-init-sm-val").textContent=`平局 [${l}]`,document.getElementById("overlay-init-pm-val").textContent=`平局 [${p}]`,a.disabled=!1,a.textContent="平局！重新投骰",L(`  - 先攻判定平局 [${l}]，准备重投...`);else{const m=l>p?r:i,u=T(m);h("crit"),a.style.display="none",document.getElementById("overlay-init-sm-val").textContent=`点数: ${l}`,document.getElementById("overlay-init-pm-val").textContent=`点数: ${p}`,L(`  - 先攻判定掷骰：${T(r)} [${l}] vs ${T(i)} [${p}]`),L(`  - 【${u}】赢得了投骰，准备选择先攻权归属。`);const d=document.getElementById("phase-overlay-content"),f=document.createElement("div");f.style.cssText="border-top:1px solid var(--panel-border); margin-top:16px; padding-top:16px; width:100%;",f.innerHTML=`
            <p style="color:var(${j(m)}); font-weight:bold; margin-bottom:10px;">👑 【${u}】选择首发玩家：</p>
            <div id="turn-order-buttons" style="display:flex; gap:10px; margin-bottom:10px;">
              <button class="qa-btn turn-order-btn" data-slot="0" onclick="selectTurnOrder(0)" style="flex:1;">${T(r)}先攻</button>
              <button class="qa-btn turn-order-btn" data-slot="1" onclick="selectTurnOrder(1)" style="flex:1;">${T(i)}先攻</button>
            </div>
            <button id="btn-confirm-turn-order" class="btn-large" onclick="confirmTurnOrder()" style="display:none; padding:10px 30px; font-size:0.9rem; width:100%; margin-top:8px;">
              确认首发选择
            </button>
        `,d.appendChild(f),X(`【选择先后】王座归属：【${u}】玩家获胜，请点击按钮选择首发方并确认。`)}},300)},700)}function kn(e){h("click");const t=o.teamFactions[e];document.querySelectorAll(".turn-order-btn").forEach(s=>{parseInt(s.dataset.slot)===e?(s.classList.add("selected"),s.style.background="linear-gradient(135deg, var(--imperial-gold), #8a6a1c)",s.style.color="#000",s.style.borderColor="var(--imperial-gold-bright)",s.style.boxShadow="0 0 12px rgba(201, 168, 76, 0.5)"):(s.classList.remove("selected"),s.style.background="",s.style.color="",s.style.borderColor="",s.style.boxShadow="")});const r=document.getElementById("btn-confirm-turn-order");r&&(r.style.display="block",r.dataset.pendingSlot=String(e));const i=T(t);X(`【预选首发】已选中【${i}】为先攻方，请点击确认按钮完成选择。`)}function $n(){const e=document.getElementById("btn-confirm-turn-order"),t=e&&e.dataset.pendingSlot;if(t===void 0)return;const a=parseInt(t),r=o.teamFactions[a];h("crit"),o.initiativeSlot=a,o.initiative=r,o.activeTurnSlot=a,o.activeTurn=r,L(`  - 确认：【${T(r)}】获得本回合的先攻优势！`),bt()}function bt(){const e=o.phase;if(o.phase="Strategy",e!=="Strategy")if(o.turningPoint===1)ce(o.teamFactions[0],Z(o.teamFactions[0])+1),ce(o.teamFactions[1],Z(o.teamFactions[1])+1),L("  💰 第1回合策略阶段：双方各获得 1 CP。");else{const a=o.initiative,r=Rt(a);ce(a,Z(a)+1),ce(r,Z(r)+2),L(`  💰 TP${o.turningPoint} 策略阶段：${T(a)}(先攻) +1 CP, ${T(r)} +2 CP。`)}se(),Le();const t=document.getElementById("phase-overlay-content");t.innerHTML=`
    <h3>Turning Point ${o.turningPoint} - 策略阶段</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">
      在此阶段，双方可以使用命令点 (CP) 激活计策 (Strategic Ploys)。
    </p>

    <div class="gothic-divider"><span style="color:var(--imperial-gold);font-size:8px;">⬥</span><span style="color:var(--imperial-gold);font-size:14px;">✠</span><span style="color:var(--imperial-gold);font-size:8px;">⬥</span></div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">
      ${(()=>{const a=o.teamFactions[0],r=o.teamFactions[1],i=(s,c)=>{const l=T(s),p=j(s),m=oe(s);let u,d,f,v,g;Y(s,"astartesDoubleAction")?(g="bolter_discipline",u="爆弹惩戒",d="🔥",f="Astartes",v=`${l}特工本回合激活内，可以使用<b>两次</b>射击行动。`):Y(s,"disgustingResilience")?(g="contagious_resilience",u="传染韧性",d="🛡️",f="Death Guard",v=`${l}在结算【恶心作呕 (DR)】伤害减免时，可<b>重投第一个失败的减伤骰</b>。`):(g="dark_zealotry",u="黑暗狂热",d="⚔️",f="Heretic Astartes",v=`${l}特工在本回合近战搏斗中，可<b>重投 1 个失败骰</b>。`);const x=m.includes(g);return`<div class="ploy-choice-card ${x?"selected":""}" role="button" tabindex="0" onclick="buyPloy('${c}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();buyPloy('${c}')}">
            <div class="ploy-title">
              <span>${d} ${u} (1 CP)</span>
              <span style="font-size:0.75rem; color:var(${p});">${f}</span>
            </div>
            <div class="ploy-desc">${v}</div>
            <div style="margin-top:6px; font-weight:bold; font-size:0.75rem; color:var(${p});">
              ${x?"● 生效中":"点击启用"}
            </div>
          </div>`};return i(a,a)+i(r,r)})()}
    </div>

    <button class="btn-large" onclick="proceedToFirefight()" style="padding: 10px 40px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #2a5a3a); border-color:#4a7c59; box-shadow:none;">
      进入战斗阶段 (Proceed to Firefight)
    </button>
  `,X("【策略阶段】双方轮流消费 1 CP 采购策略 Ploys。按 Proceed 按钮进入实际交火战斗。")}function wn(e){let t;e==="sm"?t=0:e==="pm"?t=1:t=J(e);const a=o.teamFactions[t],r=T(a),i=oe(a);let s,c,l;if(Y(a,"astartesDoubleAction")?(s="bolter_discipline",c="爆弹惩戒",l="本回合可双击开火！"):Y(a,"disgustingResilience")?(s="contagious_resilience",c="传染韧性",l="DR首发失败可重投！"):(s="dark_zealotry",c="黑暗狂热",l="近战可重投 1 个失败骰！"),i.includes(s))h("click"),at(a,[]),ce(a,Z(a)+1);else{if(Z(a)<1){h("alert"),Q(`${r} CP 不足！`,"warning");return}h("crit"),at(a,[s]),ce(a,Z(a)-1),L(`  - ${r}激活策略：【${c}】！${l}`)}bt()}function Cn(){h("click"),Ge(),o.phase="Firefight",se(),L(`
【战斗阶段开始】Turning Point ${o.turningPoint}`),L(`>>> 首发方【${T(o.activeTurn)}】可以激活一名特工。`),ie(),K(),X("【特工激活期】在两侧列表中点击未激活的特工（高亮）卡片，载入中央控制板执行动作。")}function Tn(e){h("click");const t=jt[e];if(!t)return;document.getElementById("help-title").textContent=t.title,document.getElementById("help-body").innerHTML=t.body;const a=document.getElementById("help-modal");a.style.display="flex",be(a)}function xt(){h("click"),document.getElementById("help-modal").style.display="none",xe()}function Sn(e){h("funeral");const t=document.getElementById("death-overlay"),a=document.getElementById("death-model-name"),r=document.getElementById("death-model-faction"),i=document.getElementById("death-gag-text");if(t){a.textContent=e.name;const s=Ee(e.faction);r.textContent=s?`${s.shortName} (${s.id})`:e.faction;const c=Math.floor(Math.random()*it.length);i.textContent=it[c],t.style.display="flex",be(t)}L(`[阵亡提示] 特工 ${e.name} 已阵亡！请在物理沙盘中移除模型。`)}function kt(){h("click");const e=document.getElementById("death-overlay");e&&(e.style.display="none",xe()),An()}function An(){if(o.gameOver)return;const e=o.teamFactions[0],t=o.teamFactions[1],a=o.operatives.filter(i=>i.teamSlot===0&&!i.isDead).length,r=o.operatives.filter(i=>i.teamSlot===1&&!i.isDead).length;a===0&&r===0?(o.gameOver=!0,ge("draw","双方均全员阵亡，战斗以同归于尽平局告终！")):a===0?(o.gameOver=!0,ge("pm",`${T(e)}战队全员阵亡！
${T(t)} 成功清剿了残敌，夺取了战场的完全控制权！`)):r===0&&(o.gameOver=!0,ge("sm",`${T(t)}战队全员阵亡！
${T(e)} 肃清了战场，坚守住光荣防线！`))}function ge(e,t){Le();const a=document.getElementById("phase-overlay-content");let r="🎉 对局结束 🎉",i="var(--text-main)";if(e==="sm"){const s=o.teamFactions[0];r=`🏆 ${T(s)} 荣获胜利！ 🏆`,i=`var(${j(s)})`}else if(e==="pm"){const s=o.teamFactions[1];r=`🏆 ${T(s)} 荣获胜利！ 🏆`,i=`var(${j(s)})`}else e==="draw"&&(r="🤝 双方同归于尽 (Match Draw) 🤝",i="var(--imperial-gold)");a.innerHTML=`
    <h3 style="color: ${i}; font-size: 1.4rem; margin-bottom: 12px;">${r}</h3>
    <div class="qa-card" style="margin-bottom: 20px; font-size: 0.95rem; text-align: center; line-height: 1.6; border-color: rgba(255,255,255,0.1);">
      <p style="white-space: pre-line; color: var(--text-main);">${t}</p>
    </div>
    <button class="btn-large" onclick="confirmReset()" style="padding: 10px 30px; font-size:0.9rem; background: var(--red); border-color: #b84c4c; width: 100%;">
      返回主菜单并重置对局
    </button>
  `}function $t(e=!1){o.phase="TurnEndScoring",o.isFinalScoring=e,se(),Le();const t=o.operatives.filter(s=>s.teamSlot===1&&s.isDead).length,a=o.operatives.filter(s=>s.teamSlot===0&&s.isDead).length,r=t-o.smKillsScored,i=a-o.pmKillsScored;o.tempSmChecklist=[!1,!1,!1,!1,!1],o.tempPmChecklist=[!1,!1,!1,!1,!1],o.tempSmObjManualOffset=0,o.tempPmObjManualOffset=0,o.tempSmObjVp=0,o.tempPmObjVp=0,o.tempSmKillVp=r,o.tempPmKillVp=i,o.tempSmKills=t,o.tempPmKills=a,Ze(),X("【回合结算】引导计算 VP：请输入双方本回合完成任务的 VP，并确认得分结算。")}function Ze(){const e=document.getElementById("phase-overlay-content"),t=o.tempSmKillVp+o.tempSmObjVp,a=o.tempPmKillVp+o.tempPmObjVp,r=st[o.missionType]||st.custom,i=ut[o.missionType]||"自定义任务",s=(m,u,d)=>r.map((f,v)=>`
      <label class="scoring-item">
        <input type="checkbox" ${d?`style="accent-color: ${d};"`:""} ${u[v]?"checked":""} onchange="toggleScoringChecklist('${m}', ${v})">
        <span>${f}</span>
      </label>
    `).join(""),c=o.turningPoint>=5,l=c?"确认结算并完成对局":"确认结算并推进回合",p=c?"declareScoreVictory()":"confirmTurnEndScoring()";e.innerHTML=`
    <h3 style="font-size:1.3rem; margin-bottom: 8px;">Turning Point ${o.turningPoint} - 得分结算</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:15px; text-align:center;">
      每回合结束时，引导玩家计算任务得分，并由系统自动根据击杀数累加击杀 VP（1 击杀 = 1 VP）。
    </p>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">

      <!-- Team 0 结算 -->
      <div class="init-team-col ${q(team0Faction)}" style="align-items:stretch;">
        <h4 style="color:var(${j(team0Faction)}); font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px; text-align:center; font-family:'Pirata One',serif;">
          ${T(team0Faction)}
        </h4>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>⚔️ 新增击杀得分：</span>
            <span style="font-weight:bold; color:var(${j(team0Faction)});">${o.tempSmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${o.tempSmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">
              ${i} — 任务结算助手
            </div>
            ${s("sm",o.tempSmChecklist,"")}
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
            <span style="color:var(${j(team0Faction)});">+${t} VP</span>
          </div>
        </div>
      </div>

      <!-- Team 1 结算 -->
      <div class="init-team-col ${q(team1Faction)}" style="align-items:stretch;">
        <h4 style="color:var(${j(team1Faction)}); font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px; text-align:center; font-family:'Pirata One',serif;">
          ${T(team1Faction)}
        </h4>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>⚔️ 新增击杀得分：</span>
            <span style="font-weight:bold; color:var(${j(team1Faction)});">${o.tempPmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${o.tempPmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">
              ${i} — 任务结算助手
            </div>
            ${s("pm",o.tempPmChecklist,`var(${j(team1Faction)})`)}
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
            <span style="color:var(${j(team1Faction)});">+${a} VP</span>
          </div>
        </div>
      </div>

    </div>

    <button class="btn-large" onclick="${p}" style="padding: 12px 30px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #2a5a3a); border-color:#4a7c59; box-shadow:none; width: 100%;">
      ${l}
    </button>
  `}function Pn(e,t){h("click"),e==="sm"?(o.tempSmChecklist[t]=!o.tempSmChecklist[t],o.tempSmObjVp=Math.max(0,o.tempSmChecklist.filter(Boolean).length+o.tempSmObjManualOffset)):(o.tempPmChecklist[t]=!o.tempPmChecklist[t],o.tempPmObjVp=Math.max(0,o.tempPmChecklist.filter(Boolean).length+o.tempPmObjManualOffset)),Ze()}function En(e,t){h("click"),e==="sm"?(o.tempSmObjManualOffset+=t,o.tempSmObjVp=Math.max(0,o.tempSmChecklist.filter(Boolean).length+o.tempSmObjManualOffset)):(o.tempPmObjManualOffset+=t,o.tempPmObjVp=Math.max(0,o.tempPmChecklist.filter(Boolean).length+o.tempPmObjManualOffset)),Ze()}function Ln(){h("crit");const e=o.tempSmKillVp+o.tempSmObjVp,t=o.tempPmKillVp+o.tempPmObjVp;o.smVp+=e,o.pmVp+=t,o.smKillsScored=o.tempSmKills,o.pmKillsScored=o.tempPmKills,L(`
--- Turning Point ${o.turningPoint} 回合结算结果 ---`),L(`[${T(o.teamFactions[0])}] 新增 ${e} VP (任务:${o.tempSmObjVp}, 击杀:${o.tempSmKillVp}) | 累计 VP: ${o.smVp}`),L(`[${T(o.teamFactions[1])}] 新增 ${t} VP (任务:${o.tempPmObjVp}, 击杀:${o.tempPmKillVp}) | 累计 VP: ${o.pmVp}`),Ge(),Ht()}function Dn(){h("crit");const e=o.tempSmKillVp+o.tempSmObjVp,t=o.tempPmKillVp+o.tempPmObjVp;o.smVp+=e,o.pmVp+=t,o.smKillsScored=o.tempSmKills,o.pmKillsScored=o.tempPmKills,o.gameOver=!0,se();const a=o.teamFactions[0],r=o.teamFactions[1];let i=`双方经历五回合激烈交火，战斗正式落幕！
最终战队积分：
${T(a)}: ${o.smVp} VP
${T(r)}: ${o.pmVp} VP

`;o.smVp===o.pmVp?ge("draw",i+"双方得分平分秋色，本局握手言和！"):o.smVp>o.pmVp?ge("sm",i+`${T(a)}胜利点数更高，赢得最终胜利！`):ge("pm",i+`${T(r)}胜利点数更高，赢得最终胜利！`)}function In(e,t){e.stopPropagation();const a=document.getElementById("global-avatar-uploader");a&&(a.dataset.targetOpId=t,a.value="",a.click())}function Bn(e){const t=e.target.files[0];if(!t)return;const a=e.target.dataset.targetOpId;if(!a)return;const r=new FileReader;r.onload=function(i){const s=i.target.result;o.customAvatars[a]=s,Ue(),ie(),K(),L(`[头像上传] 成功更新特工 [${a}] 的自定义照片！`)},r.readAsDataURL(t)}function Mn(e,t="normal"){qt.matches||(document.body.classList.remove("intense-shake"),document.body.offsetWidth,document.body.classList.add("intense-shake"),setTimeout(()=>{document.body.classList.remove("intense-shake")},400));const a=document.createElement("div");a.className="impact-effect-text",a.textContent=e,t==="strike"?(a.style.color="var(--red)",a.style.textShadow="0 0 20px rgba(225, 29, 72, 0.85), 0 0 40px #000"):t==="parry"?(a.style.color="#38bdf8",a.style.textShadow="0 0 20px rgba(56, 189, 248, 0.85), 0 0 40px #000"):t==="shoot"?a.style.color="var(--sm-accent)":t==="deflect"&&(a.style.color="#7ab88a",a.style.textShadow="0 0 20px rgba(163, 230, 53, 0.85), 0 0 40px #000"),document.body.appendChild(a),setTimeout(()=>{a.remove()},1800)}function Rn(e,t){[`.duel-avatar-${e}`,`.main-avatar-${e}`].forEach(r=>{const i=document.querySelector(r);if(!i)return;i.classList.remove("avatar-hit-flash"),i.querySelectorAll(".bullet-hole-effect, .slash-effect").forEach(l=>l.remove()),i.offsetWidth,i.classList.add("avatar-hit-flash");const c=document.createElement("div");c.className=t==="shoot"?"bullet-hole-effect":"slash-effect",i.appendChild(c),setTimeout(()=>{i.classList.remove("avatar-hit-flash"),c.remove()},900)})}function Vn(e){return o.rulesVersion!=="standard"?[]:e.chapterTactics||[]}function we(e,t){return Vn(e).includes(t)}function Fn(e){return o.rulesVersion!=="standard"?null:e.marksOfChaos||null}function Ne(e,t){return Fn(e)===t}const b={};function Hn(e){Object.assign(b,e)}let B,Oe,ze;function _n(e){B=e.showToast,Oe=e.trapFocus,ze=e.releaseFocusTrap}window.matchMedia("(prefers-reduced-motion: reduce)");let ee=!1,te=[];function ue(e,t){const a=setTimeout(e,t);return te.push(a),a}function wt(e,t,a,r=0){if(o.rulesVersion==="standard"){if(b.addLog(`
>>> 击杀回调检测...`),e.operativeType==="leg_aspiring_champion"){const i=e.apl;e.apl=Math.min(e.apl+1,5),e._eyesOfGodsActive=!0,b.addLog(`[诸神之眼] ${e.name} 击杀敌人！APL +1 (${i} → ${e.apl})，直到本次激活结束。`),B&&B(`⚡ 诸神之眼：APL +1 (${e.apl})`,"success")}if(e.operativeType==="leg_chosen"&&a==="fight"){const s=Math.floor(Math.random()*3)+1+1,c=e.healWounds(s);b.addLog(`[灵魂吞噬] ${e.name} 近战击杀！恢复 ${c} 点伤口 (D3+1 = ${s})。`),B&&B(`💚 灵魂吞噬：恢复 ${c} 伤口`,"success")}if(e.operativeType==="leg_shrivetalon"){b.addLog(`[恐怖肢解] ${e.name} 击杀！3" 内另一敌人 APL -1 (直到其下次激活结束)。`);const i=o.operatives.filter(s=>s.teamSlot!==e.teamSlot&&!s.isDead);if(i.length>0){const s=i[0];s.apl=Math.max(1,s.apl-1),s._horrifyingDismembermentActive=!0,b.addLog(`  → ${s.name} APL -1 (${s.apl})，直到其下次激活结束。`)}}if(t.poisonTokens>0){const i=o.operatives.filter(s=>s.teamSlot===e.teamSlot&&s.operativeType==="pm_champion"&&!s.isDead&&s.woundsRegainedThisTP<3);for(const s of i){const c=Math.min(r,3-s.woundsRegainedThisTP);if(c>0){const l=s.healWounds(c);s.woundsRegainedThisTP+=l,b.addLog(`[祖父祝福] ${s.name} 响应！恢复 ${l} 点伤口 (本 TP 已回 ${s.woundsRegainedThisTP}/3)。`)}}}b.addLog(">>> 击杀回调完成。")}}function Ct(){const e=document.getElementById("combat-modal");e.style.display="flex",document.getElementById("modal-btn-next").disabled=!0,Oe&&Oe(e)}function De(){h("click"),document.getElementById("combat-modal").style.display="none",ze&&ze(),ee=!1,te=[],b.renderOperatives(),b.updateActivePanel()}function Qe(){var e;if(h("click"),n.actionType==="shoot"){if(n.step===3){if(!n.inRangeAndVisible){h("alert"),B&&B("目标不可见或超出武器射程，无法进行射击行动！","error");return}if(n.inCoverConcealed){h("alert"),B&&B("目标处于隐蔽状态且在掩体中，无法对其进行射击 (L185)！","error");return}if(n.enemyInControlRange){h("alert"),B&&B("有敌方特工处于你的控制范围内，无法进行射击行动 (L111)！","error");return}const t=n.weapon.rules.find(a=>a.startsWith("Torrent"));if(t){const a=parseInt(((e=t.match(/\d+/))==null?void 0:e[0])||n.weapon.attacks);n.attackRolls=[],n.attackCrit=0,n.attackNorm=a,B&&B(`💧 激流 (Torrent): 自动命中 ${a} 次，跳过攻击骰步骤。`,"info"),n.step=5,U();return}}else if(n.step===4&&n.mode==="manual"){if(Qn(),n.attackRolls.length===0){B&&B("请输入有效的攻击骰点数！格式: 6, 4, 3, 2 (1-6逗号隔开)","error");return}}else if(n.step===5&&n.mode==="manual"){Yn();const t=document.getElementById("manual-def-dice-val");if(t&&t.value.trim()!==""&&n.defenseRolls.length===0){B&&B("请输入有效的防御骰点数！格式: 5, 2 (1-6逗号隔开)","error");return}}}else if(n.actionType==="fight"&&n.step===3){if(!n.inMeleeRange){h("alert"),B&&B("目标必须在 1 英寸（1🔺）交战距离内，才能进行近战搏斗！","error");return}if(n.hasFallenBack){h("alert"),B&&B("已执行退却的特工，本回合无法执行格斗动作！","error");return}}n.step++,n.actionType==="shoot"?U():n.actionType==="fight"&&le()}function Tt(){h("click");const e=o.activeAgent;if(!e)return;const t=e.weapons.some(d=>d.hasRule&&d.hasRule("Silent"));if(e.hasConceal&&!t){h("alert"),B&&B("隐蔽单位不能射击 (需先切为交战，或携带 Silent 武器)！","error");return}const a=document.querySelector("#combat-modal .modal-content");if(a&&(a.style.backgroundImage=`linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("${ne("assets/images/backgrounds/bg_shoot_action.png")}")`,a.style.backgroundSize="cover",a.style.backgroundPosition="center"),Object.assign(n,{actionType:"shoot",step:1,attacker:e,defender:null,weapon:e.weapons.filter(d=>d.isRanged)[0]||null,inRangeAndVisible:!0,inCoverConcealed:!1,inCover:!1,enemyInControlRange:!1,mode:"random",attRerollIndex:-1,defRerollIndex:-1,attackRolls:[],defenseRolls:[],stunApplied:!1,shockTriggered:!1}),!n.weapon){B&&B("该特工没有配备任何远程武器！","warning");return}n.weapon.hasRule&&n.weapon.hasRule("Torrent")&&b.addLog(`[激流] ${n.weapon.name}：Torrent 规则生效！当前简化为仅对主目标射击。完整多目标选择待后续版本实现。`),n.weapon.hasRule&&n.weapon.hasRule("Blast")&&b.addLog(`[爆炸] ${n.weapon.name}：Blast 规则生效！当前简化为仅对主目标。完整 AoE 待后续版本实现。`),n.weapon.hasRule&&n.weapon.hasRule("Balanced")&&b.addLog(`[平衡] ${n.weapon.name}：Balanced 规则生效！可重投 1 个攻击骰（需手动操作）。`),n.weapon.hasRule&&n.weapon.hasRule("Ceaseless")&&b.addLog(`[不息] ${n.weapon.name}：Ceaseless 规则生效！可重投投出特定值的骰子（需手动操作）。`),n.weapon.hasRule&&n.weapon.hasRule("Relentless")&&b.addLog(`[无情] ${n.weapon.name}：Relentless 规则生效！可重投任意攻击骰（需手动操作）。`),n.weapon.hasRule&&n.weapon.hasRule("Limited")&&b.addLog(`[有限] ${n.weapon.name}：Limited 规则生效！每场战斗有使用次数限制（当前未追踪）。`),n.weapon.hasRule&&n.weapon.hasRule("Seek")&&b.addLog(`[寻的] ${n.weapon.name}：Seek 规则生效！隐蔽单位不能利用地形掩体。`),n.weapon.rules.some(d=>d.startsWith("Range"))&&b.addLog(`[射程] ${n.weapon.name}：Range 规则生效！有最大射程限制（当前未检查）。`),Ct(),U()}function U(){var i,s,c;const e=document.getElementById("modal-title"),t=document.getElementById("modal-body"),a=document.getElementById("modal-btn-next"),r=document.getElementById("modal-btn-cancel");if(a.onclick=Qe,r.style.display="inline-block",n.step===1){e.textContent="射击结算 - 步骤 1: 选择目标";const l=n.attacker.teamSlot>=0?n.attacker.teamSlot:J(n.attacker.faction),p=o.operatives.filter(u=>u.teamSlot!==l&&!u.isDead);if(p.length===0){t.innerHTML='<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>',a.disabled=!0;return}let m='<div class="weapon-picker-list">';p.forEach(u=>{const d=u.isInjured?' <span style="color:var(--red); font-size:0.7rem;">[重伤]</span>':"",f=u.poisonTokens>0?' <span style="color:#7ab88a; font-size:0.7rem;">[毒素]</span>':"";m+=`
        <div class="weapon-pick-item ${n.defender&&n.defender.id===u.id?"selected":""}" role="button" tabindex="0" onclick="selectShootDefender('${u.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectShootDefender('${u.id}')}">
          <span class="weapon-pick-name">${u.name}${d}${f}</span>
          <span class="weapon-pick-stats">HP: ${u.wounds}/${u.maxWounds} | DF:${u.df} | Move:${u.currentMove}"</span>
        </div>
      `}),m+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要射击的敌方特工：</p>
      ${m}
    `,a.textContent="选择武器",a.disabled=!n.defender}else if(n.step===2){e.textContent="射击结算 - 步骤 2: 选择武器";const l=n.attacker.weapons.filter(f=>f.isRanged),p=n.attacker.isInjured,m=n.attacker.actionsPerformed.includes("Dash");let u='<div class="weapon-picker-list">';l.forEach((f,v)=>{const g=p?`${f.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${f.ts+1}+</span>`:`${f.ts}+`,x=f.range?` | Range: ${f.range}"`:"",$=f.rules&&f.rules.length>0?` | ${f.rules.map(je).join(", ")}`:"",k=f.hasRule("Heavy")&&!m,S=k?' <span style="color:var(--red); font-size:0.65rem;">[需先冲刺]</span>':"",A=k?"opacity:0.4; cursor:not-allowed; pointer-events:none;":"";u+=`
        <div class="weapon-pick-item ${n.weapon.name===f.name?"selected":""}" role="button" tabindex="0" style="${A}" onclick="${k?"":`selectShootWeapon(${v})`}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${k?"":`selectShootWeapon(${v})`}}">
          <span class="weapon-pick-name">${f.name}${S}</span>
          <span class="weapon-pick-stats">A: ${f.attacks} | BS: ${g} | D: ${f.normalDamage}/${f.criticalDamage}${x}${$}</span>
        </div>
      `}),u+="</div>";const d=m?"":'<p style="color:var(--text-muted); font-size:0.75rem; margin-bottom:8px;">💡 标注<span style="color:var(--red);">[需先冲刺]</span>的武器为重武器，仅在执行冲刺 (Dash) 后可使用。</p>';t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要射击使用的武器：</p>
      ${d}
      ${u}
    `,a.textContent="回答判定问题",a.disabled=!1}else if(n.step===3){e.textContent="射击结算 - 步骤 3: 距离与掩体判定";const l=n.weapon,p=l.hasRule("Indirect Fire"),m=l.hasRule("Seek Light"),u=p?'<p style="color:#818cf8; font-size:0.75rem;">💡 <b>间接射击</b>：无需视线，射程判定跳过。</p>':"",d=m?'<p style="color:#f59e0b; font-size:0.75rem;">💡 <b>寻光</b>：目标即使在掩体中也无法获得掩体加成。</p>':"",f=n.defender&&n.defender.hasConceal;f||(n.inCoverConcealed=!1);const v=f?`<div class="qa-card" style="margin-top:10px;">
          <div class="qa-question">2. 目标处于<strong>隐蔽</strong>状态，是否在掩体中？<span style="color:#f59e0b; font-size:0.75rem;">(隐蔽目标在掩体中不可射击 — L185)</span></div>
          <div class="qa-options">
            <button class="qa-btn ${n.inCoverConcealed?"selected":""}" onclick="setQA('inCoverConcealed', true)">是 (无法射击)</button>
            <button class="qa-btn ${n.inCoverConcealed?"":"selected"}" onclick="setQA('inCoverConcealed', false)">否 (可以选定)</button>
          </div>
        </div>`:'<p style="color:#7ab88a; font-size:0.75rem; margin-top:8px;">✓ 目标为交战(Engage)状态：可见即可射击，无需掩体判定 (L180)。</p>';t.innerHTML=`
      <p style="margin-bottom: 12px; color:var(--text-muted);">回答以下判定问题以完成结算：</p>
      ${u}
      ${d}

      <div class="qa-card">
        <div class="qa-question">1. 目标是否在你的有效视线和射程内？${p?' <span style="color:#818cf8;">(自动判定为是)</span>':""}</div>
        <div class="qa-options">
          <button class="qa-btn ${n.inRangeAndVisible?"selected":""}" onclick="setQA('inRangeAndVisible', true)" ${p?'style="pointer-events:none; opacity:0.6;"':""}>是 (在射程内)</button>
          <button class="qa-btn ${n.inRangeAndVisible?"":"selected"}" onclick="setQA('inRangeAndVisible', false)" ${p?'style="pointer-events:none; opacity:0.6;"':""}>否 (无法见/超射程)</button>
        </div>
      </div>

      ${v}

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">3. 目标是否在掩体中 (Cover)？${m?' <span style="color:#f59e0b;">(寻光忽略掩体)</span>':""}</div>
        <div class="qa-options">
          <button class="qa-btn ${n.inCover?"selected":""}" onclick="setQA('inCover', true)" ${m?'style="pointer-events:none; opacity:0.6;"':""}>是 (触发掩体成功保留)</button>
          <button class="qa-btn ${n.inCover?"":"selected"}" onclick="setQA('inCover', false)" ${m?'style="pointer-events:none; opacity:0.6;"':""}>否 (开阔地带)</button>
        </div>
      </div>

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">4. 是否有敌方特工处于<strong>你的控制范围内</strong>（1" 内）？<span style="color:#f59e0b; font-size:0.75rem;">(这将阻止射击 — L111)</span></div>
        <div class="qa-options">
          <button class="qa-btn ${n.enemyInControlRange?"selected":""}" onclick="setQA('enemyInControlRange', true)">是 (无法射击)</button>
          <button class="qa-btn ${n.enemyInControlRange?"":"selected"}" onclick="setQA('enemyInControlRange', false)">否 (可以射击)</button>
        </div>
      </div>
    `,p&&(n.inRangeAndVisible=!0),m&&(n.inCover=!1),a.textContent="选择掷骰模式",a.disabled=!1}else if(n.step===4){e.textContent="射击结算 - 步骤 4: 攻击方掷骰 (Angels of Death)";let l="";const p=Z(n.attacker.faction);if(n.attackRolls.length>0){const d=n.weapon.ts+(n.attacker.isInjured?1:0),f=n.attacker.isInjured?' <span style="color:var(--red); font-size:0.75rem;">(重伤+1)</span>':"";l=`
        <div class="roll-summary-block" style="margin-top:10px;">
          🎯 <b>命中统计:</b> 暴击(6点): <span style="color:var(--sm-accent); font-weight:bold;">${n.attackCrit}</span>, 普通命中(${d}+${f}): <span style="color:#6a9ad4;">${n.attackNorm}</span>
          ${p>=1&&n.attRerollIndex===-1?'<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上方任何一个未命中的灰色骰子重投。</span>':""}
        </div>
      `}const m=n.weapon.ts+(n.attacker.isInjured?1:0),u=n.attacker.isInjured?` <span style="color:var(--red); font-size:0.75rem;">(重伤+1 → ${m}+)</span>`:"";t.innerHTML=`
      ${Ve()}

      <p style="margin-bottom: 12px;">武器 [${n.weapon.name}]，攻击骰数: <b>${n.weapon.attacks}</b>，命中要求: <b>${m}+</b>${u}</p>

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

      ${l}

      <div id="manual-attack-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${n.weapon.attacks} 个骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-att-dice-val" value="6, 4, 3, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
      </div>
    `,n.attackRolls.length>0?(a.disabled=!1,qn()):n.mode==="manual"?a.disabled=!1:a.disabled=!0,a.textContent="防守方投骰"}else if(n.step===5){e.textContent=`射击结算 - 步骤 5: 防守方防御掷骰 (${T(n.defender.faction)})`;let l="",p=n.defender.df;const m=n.weapon.hasRule&&n.weapon.hasRule("Saturate");n.inCover&&!m?(l=`<p style="color:var(--pm-accent); margin-bottom: 4px;">🛡️ 目标在掩体中：自动获得 1 个普通成功，且防御投骰池减 1 (DF = ${p} -> ${p-1})</p>`,p=Math.max(0,p-1)):n.inCover&&m&&(l='<p style="color:var(--red); margin-bottom: 4px;">🔥 [饱和] 目标在掩体中，但 Saturate 生效：不能保留掩体骰！</p>');const u=n.weapon.rules.find(g=>g.startsWith("Piercing")&&!g.startsWith("Piercing Crits"));if(u){const g=parseInt(((i=u.match(/\d+/))==null?void 0:i[0])||"1"),x=p;p=Math.max(0,p-g),l+=`<p style="color:#f97316; margin-bottom: 4px;">🔥 <b>穿透 (Piercing ${g})</b>：DF 池减少 ${g} (DF = ${x} -> ${p})</p>`}const d=n.weapon.rules.find(g=>g.startsWith("Piercing Crits"));if(d&&n.attackCrit>0){const g=parseInt(((s=d.match(/\d+/))==null?void 0:s[0])||"1"),x=p;p=Math.max(0,p-g),l+=`<p style="color:#f97316; margin-bottom: 4px;">🔥 <b>穿透暴击 (Piercing Crits ${g})</b>：暴击命中，DF 池减少 ${g} (DF = ${x} -> ${p})</p>`}let f="";const v=Z(n.defender.faction);n.defenseRolls.length>0&&p>0&&(f=`
        <div class="roll-summary-block" style="margin-top:10px;">
          🛡️ <b>防守统计:</b> 暴击防守: <span style="color:var(--pm-accent); font-weight:bold;">${n.defCrit}</span>, 普通防守(${n.defender.sv}+): <span style="color:#b0d4ba;">${n.defNorm}</span>
          ${v>=1&&n.defRerollIndex===-1?'<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上面任何一个未命中的灰色骰子重投。</span>':""}
        </div>
      `),t.innerHTML=`
      ${Ve()}

      <p style="margin-bottom: 6px;">防守特工: [${n.defender.name}]，保护要求: <b>${n.defender.sv}+</b></p>
      ${l}
      <p style="margin-bottom: 12px;">需要投掷的防御骰数: <b>${p}</b></p>

      <div class="dice-rolling-area" id="defense-rolling-zone">
        <div class="dice-pool-view" id="defense-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        ${n.defenseRolls.length===0?`<button class="modal-btn primary" id="btn-roll-defense" onclick="rollDefenseDice(${p})">开始顺序防守投骰</button>`:""}
      </div>

      ${f}

      <div id="manual-defense-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${p} 个防御骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-def-dice-val" value="5, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
      </div>
    `,n.defenseRolls.length>0||p===0?(a.disabled=!1,Gn()):n.mode==="manual"?a.disabled=!1:a.disabled=!0,a.textContent="计算伤害与对消"}else if(n.step===6){e.textContent="射击结算 - 步骤 6: 匹配对消与最终扣血",n.weapon.hasRule&&n.weapon.hasRule("Severe")&&n.attackCrit===0&&n.attackNorm>=1&&(n.attackNorm-=1,n.attackCrit+=1,b.addLog(`[严重] ${n.weapon.name}：无暴击保留，升级 1 个普通命中为暴击！`)),n.weapon.hasRule&&n.weapon.hasRule("Stun")&&n.attackCrit>0&&!n.stunApplied&&(n.defender.apl=Math.max(0,n.defender.apl-1),n.defender.stunnedUntilEndOfNextActivation=!0,n.stunApplied=!0,b.addLog(`[震慑] ${n.weapon.name}：保留暴击生效，${n.defender.name} APL -1 (直到其下一次激活结束)！`),b.updateActivePanel());let m=n.attackCrit,u=n.attackNorm,d=n.defCrit,f=n.defNorm;if(n.weapon.hasRule&&n.weapon.hasRule("Saturate")&&n.inCover&&f>0){const D=Math.min(1,f);f-=D,b.addLog(`[饱和] ${n.weapon.name}：防御方不能保留掩体骰，移除 ${D} 个掩体自动成功！`)}const g=Math.min(m,d);m-=g,d-=g;let x=0;m>0&&f>=2&&(x=Math.min(m,Math.floor(f/2)),m-=x,f-=x*2);const $=Math.min(u,f);u-=$,f-=$;const P=Math.min(u,d);u-=P,d-=P;let k=n.weapon.normalDamage,S=n.weapon.criticalDamage;const A=n.weapon.hasRule&&n.weapon.hasRule("Toxic");A&&n.defender.poisonTokens>0&&(k+=1,S+=1,b.addLog(`[剧毒] 目标携带毒素标记，${n.weapon.name} 伤害 +1 (${k}/${S})`));const _=n.weapon.hasRule&&n.weapon.hasRule("Severe"),H=n.severeFromAbility;if((_||H)&&m>0){const D=H?"章战术/印记":"";k=S,b.addLog(`[重伤] ${n.weapon.name}：保留暴击，普通伤害升级为暴击伤害 (${k})${D?` (${D})`:""}！`)}const R=n.weapon.rules.find(D=>D.startsWith("Devastating"));if(R&&m>0){const D=parseInt(((c=R.match(/\d+/))==null?void 0:c[0])||"0");D>0&&(S+=D,b.addLog(`[毁灭] ${n.weapon.name}：暴击额外 +${D} 伤害 (${S})！`))}const I=[];for(let D=0;D<m;D++)I.push(S);for(let D=0;D<u;D++)I.push(k);const N=I.reduce((D,Ie)=>D+Ie,0),V=I.filter(D=>D>=3).length;let w=`
      <div class="matching-view">
        <div class="matching-row">
          <span class="matching-label">攻击命中</span>
          <div class="matching-dice-list">
    `;const E=n.weapon.ts+(n.attacker.isInjured?1:0),G=z(n.attacker.faction),O=z(n.defender.faction);for(let D=0;D<n.attackCrit;D++)w+=`<div class="kt-dice-cube ${G} crit-dice">6</div>`;for(let D=0;D<n.attackNorm;D++)w+=`<div class="kt-dice-cube ${G}">${E}</div>`;n.attackCrit+n.attackNorm===0&&(w+='<span style="font-size:0.8rem; color:var(--text-muted);">无命中</span>'),w+=`
          </div>
        </div>
        <div class="matching-row">
          <span class="matching-label">防御保护</span>
          <div class="matching-dice-list">
    `;for(let D=0;D<n.defCrit;D++)w+=`<div class="kt-dice-cube ${O} crit-dice">6</div>`;for(let D=0;D<n.defNorm;D++)w+=`<div class="kt-dice-cube ${O}">${n.defender.sv}</div>`;n.defCrit+n.defNorm===0&&(w+='<span style="font-size:0.8rem; color:var(--text-muted);">无防御成功</span>'),w+=`
          </div>
        </div>
      </div>
    `;let re="";Y(n.defender.faction,"disgustingResilience")&&V>0&&(re=`
        <div id="manual-dr-container" style="background:var(--dark-card); padding:10px; border-radius:8px; margin-top:8px; border:1px solid var(--panel-border);">
          <label style="font-size:0.75rem; color:var(--text-muted);">录入瘟疫守卫【恶心作呕】的 ${V} 个投骰点数 (每次≥3伤害的攻击各投一次, 为空则按随机)：</label>
          <input type="text" id="manual-dr-dice-val" placeholder="例: 4,2,5" style="margin-top:4px; padding:6px; font-size:0.9rem; background:#000; border:1px solid #334155; color:#fff; width:100%;">
        </div>
      `),t.innerHTML=`
      ${Ve()}

      ${w}

      <div class="qa-card" style="margin-top:10px;">
        <p style="font-size:0.95rem; font-weight:600; color:#fff;">最终对消计算汇报：</p>
        <p style="margin-top:4px;">- 暴击命中残留: <b>${m}</b> 个 (每个伤害: ${S}${A&&n.defender.poisonTokens>0?' <span style="color:#a78bfa;">[剧毒+1]</span>':""})</p>
        <p>- 普通命中残留: <b>${u}</b> 个 (每个伤害: ${k}${A&&n.defender.poisonTokens>0?' <span style="color:#a78bfa;">[剧毒+1]</span>':""})</p>
        <p style="color:var(--sm-accent); font-weight:bold; margin-top:8px; font-size:1rem;">分配伤害总计: ${N} 点</p>
      </div>

      ${re}
    `,a.textContent="完成结算并扣血",a.disabled=!1,a.onclick=()=>Jn(I),N>0&&setTimeout(()=>{b.triggerAvatarHitEffect(n.defender.id,"shoot")},150)}}function Nn(e){h("click"),n.defender=o.operatives.find(t=>t.id===e),U()}function On(e){h("click"),n.weapon=n.attacker.weapons.filter(t=>t.isRanged)[e],U()}function zn(e,t){h("click"),n[e]=t,n.actionType==="fight"?le():U()}function jn(e){h("click"),n.mode=e,U(),e==="manual"?(document.getElementById("manual-attack-input").style.display="block",document.getElementById("attack-rolling-zone").style.display="none",document.getElementById("modal-btn-next").disabled=!1):(document.getElementById("manual-attack-input").style.display="none",document.getElementById("attack-rolling-zone").style.display="flex",document.getElementById("modal-btn-next").disabled=n.attackRolls.length===0)}function Wn(){const e=document.getElementById("modal-btn-next"),t=document.getElementById("attack-dice-pool"),a=document.getElementById("btn-roll-attack");if(n.attackRolls.length>0)return;a.style.display="none",e.disabled=!0;const r=z(n.attacker.faction);t.innerHTML="";const i=n.weapon.attacks;ee=!1,te=[];for(let m=0;m<i;m++){const u=document.createElement("div");u.className=`kt-dice-cube ${r} rolling`,u.textContent="?",t.appendChild(u)}const s=document.createElement("button");s.className="modal-btn",s.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",s.textContent="跳过动画 (Skip)",s.onclick=()=>{ee=!0,te.forEach(d=>clearTimeout(d)),te=[];const m=t.getElementsByClassName("kt-dice-cube"),u=n.weapon.ts+(n.attacker.isInjured?1:0);for(let d=l;d<i;d++){const f=Math.floor(Math.random()*6)+1;c.push(f);const v=m[d];v&&(v.classList.remove("rolling"),v.textContent=f,f===6?v.classList.add("crit-dice"):f<u&&v.classList.add("fail-dice"))}n.attackRolls=c,Se(),U()},t.parentElement.appendChild(s),b.triggerCombatVisual("🔥 OPEN FIRE!","shoot"),h("shoot");const c=[];let l=0;function p(){if(!ee)if(l<i){const m=Math.floor(Math.random()*6)+1;c.push(m);const d=t.getElementsByClassName("kt-dice-cube")[l];d.classList.remove("rolling"),d.textContent=m;const f=n.weapon.ts+(n.attacker.isInjured?1:0);m===6?(d.classList.add("crit-dice"),h("crit")):(m<f&&d.classList.add("fail-dice"),h("click")),l++,ue(p,400)}else{n.attackRolls=c,Se(),s.remove();const m=n.attackCrit+n.attackNorm;m===0?(h("epic_fail"),b.triggerCombatVisual("❌ ALL MISSED!","normal")):(m===i||n.attackCrit>=2)&&(h("epic_win"),b.triggerCombatVisual("✨ EPIC SHOTS!","shoot")),U()}}ue(p,1200)}function qn(){const e=document.getElementById("attack-dice-pool");if(!e)return;e.innerHTML="";const t=n.attacker.faction,a=Z(t),r=z(t),i=n.weapon.ts+(n.attacker.isInjured?1:0);n.attackRolls.forEach((s,c)=>{const l=document.createElement("div");let p=`kt-dice-cube ${r}`;if(s===6?p+=" crit-dice":s<i&&(p+=" fail-dice"),l.className=p,l.textContent=s,s<i&&a>=1&&n.attRerollIndex===-1){const u=document.createElement("div");u.className="reroll-indicator",u.textContent="R",l.appendChild(u),l.onclick=()=>Kn(c),l.style.cursor="pointer"}else if(c===n.attRerollIndex){const u=document.createElement("div");u.className="reroll-indicator",u.style.background="var(--green)",u.textContent="✓",l.appendChild(u)}e.appendChild(l)})}function Kn(e){h("shoot"),ce(n.attacker.faction,Z(n.attacker.faction)-1),b.updateScoresUI(),n.attRerollIndex=e;const r=document.getElementById("attack-dice-pool").getElementsByClassName("kt-dice-cube")[e],i=z(n.attacker.faction);r.className=`kt-dice-cube ${i} rolling`,r.innerHTML="?",setTimeout(()=>{const s=Math.floor(Math.random()*6)+1;b.addLog(`  - [重投] 攻击方消耗 1 CP重投 D6: [${n.attackRolls[e]}] -> [${s}]`),n.attackRolls[e]=s,Se(),U()},500)}function Se(){var I,N;const e=n.attacker,t=n.weapon,a=n.defender,r=e&&e.isInjured?1:0,i=t.ts+r,s=!t.isRanged,c=t.rules.find(V=>V.startsWith("Lethal")),l=c?parseInt(((I=c.match(/\d+/))==null?void 0:I[0])||"6"):6;let p=0,m=0;n.attackRolls.forEach(V=>{V>=l?p++:V>=i&&m++});const u=t.hasRule&&t.hasRule("Rending"),d=o.rulesVersion==="standard"&&we(e,"aggressive");(u||d&&s)&&p>0&&m>0&&(m-=1,p+=1,b.addLog(`[撕裂] ${t.name}：保留暴击生效，升级 1 个普通命中为暴击！${d&&!u?" (凶猛章战术)":""}`)),t.hasRule&&t.hasRule("Punishing")&&p>0&&n.attackRolls.filter(w=>w<i&&w!==6&&w<l).length>0&&(m+=1,b.addLog(`[惩罚] ${t.name}：保留暴击生效，保留 1 个失败骰作为普通成功！`));const g=t.rules.find(V=>V.startsWith("Accurate")),x=o.rulesVersion==="standard"&&we(e,"sharpshooter"),$=/bolt/i.test(t.name),P=e&&e.actionsPerformed.length===0,k=x&&$&&P;if(g||k){const V=g?parseInt(((N=g.match(/\d+/))==null?void 0:N[0])||"1"):1,w=n.attackRolls.filter(G=>G<i&&G<l).length,E=Math.min(V,w);E>0&&(m+=E,b.addLog(`[精准] ${t.name}：自动保留 ${E} 个普通成功！${k&&!g?" (神射手章战术)":""}`))}t.hasRule&&t.hasRule("Toxic")&&a&&a.poisonTokens>0?(b.addLog(`[毒素] ${t.name}：目标携带毒素标记，Normal/Critical Dmg +1！`),n.toxicBonusActive=!0):n.toxicBonusActive=!1;const A=t.hasRule&&t.hasRule("Severe"),_=o.rulesVersion==="standard"&&Ne(e,"KHORNE"),H=o.rulesVersion==="standard"&&Ne(e,"TZEENTCH");if(n.severeFromAbility=!A&&(_&&s||H&&!s||x&&$&&P),n.severeFromAbility){const V=_?"恐虐印记":H?"奸奇印记":"神射手章战术";b.addLog(`[重伤] ${e.name}：${V}生效，武器获得 Severe！`)}const R=o.rulesVersion==="standard"&&we(e,"siege_specialist");n.saturateFromAbility=R&&!s,n.saturateFromAbility&&b.addLog(`[攻城专家] ${e.name}：远程武器获得 Saturate！`),n.attackCrit=p,n.attackNorm=m}function Un(e){const t=document.getElementById("modal-btn-next"),a=document.getElementById("defense-dice-pool"),r=document.getElementById("btn-roll-defense");if(n.defenseRolls.length>0)return;if(e===0){n.defCrit=0;const m=n.weapon.hasRule&&n.weapon.hasRule("Saturate");n.defNorm=n.inCover&&!m?1:0,t.disabled=!1;return}r.style.display="none",t.disabled=!0;const i=z(n.defender.faction);a.innerHTML="",ee=!1,te=[];for(let m=0;m<e;m++){const u=document.createElement("div");u.className=`kt-dice-cube ${i} rolling`,u.textContent="?",a.appendChild(u)}const s=document.createElement("button");s.className="modal-btn",s.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",s.textContent="跳过动画 (Skip)",s.onclick=()=>{ee=!0,te.forEach(u=>clearTimeout(u)),te=[];const m=a.getElementsByClassName("kt-dice-cube");for(let u=l;u<e;u++){const d=Math.floor(Math.random()*6)+1;c.push(d);const f=m[u];f&&(f.classList.remove("rolling"),f.textContent=d,d===6?f.classList.add("crit-dice"):d<n.defender.sv&&f.classList.add("fail-dice"))}n.defenseRolls=c,Ae(),U()},a.parentElement.appendChild(s),b.triggerCombatVisual("🛡️ INCOMING FIRE!","parry"),h("shoot");const c=[];let l=0;function p(){if(!ee)if(l<e){const m=Math.floor(Math.random()*6)+1;c.push(m);const d=a.getElementsByClassName("kt-dice-cube")[l];d.classList.remove("rolling"),d.textContent=m,m===6?(d.classList.add("crit-dice"),h("crit")):(m<n.defender.sv&&d.classList.add("fail-dice"),h("click")),l++,ue(p,400)}else{n.defenseRolls=c,Ae(),s.remove();const m=n.defender.sv,u=c.filter(f=>f>=m).length,d=c.filter(f=>f===6).length;u===0?(h("epic_fail"),b.triggerCombatVisual("💀 DEFENSE BUSTED!","normal")):(u===e||d>=2)&&(h("epic_win"),b.triggerCombatVisual("🛡️ SHIELD CLUTCH!","deflect")),U()}}ue(p,1200)}function Gn(e){const t=document.getElementById("defense-dice-pool");if(!t)return;t.innerHTML="";const a=n.defender.faction,r=Z(a),i=z(a);n.defenseRolls.forEach((s,c)=>{const l=document.createElement("div");let p=`kt-dice-cube ${i}`;if(s===6?p+=" crit-dice":s<n.defender.sv&&(p+=" fail-dice"),l.className=p,l.textContent=s,s<n.defender.sv&&r>=1&&n.defRerollIndex===-1){const u=document.createElement("div");u.className="reroll-indicator",u.textContent="R",l.appendChild(u),l.onclick=()=>Zn(c),l.style.cursor="pointer"}else if(c===n.defRerollIndex){const u=document.createElement("div");u.className="reroll-indicator",u.style.background="var(--green)",u.textContent="✓",l.appendChild(u)}t.appendChild(l)})}function Zn(e,t){h("save"),ce(n.defender.faction,Z(n.defender.faction)-1),b.updateScoresUI(),n.defRerollIndex=e;const i=document.getElementById("defense-dice-pool").getElementsByClassName("kt-dice-cube")[e],s=z(n.defender.faction);i.className=`kt-dice-cube ${s} rolling`,i.innerHTML="?",setTimeout(()=>{const c=Math.floor(Math.random()*6)+1;b.addLog(`  - [重投] 防御方消耗 1 CP重投 D6: [${n.defenseRolls[e]}] -> [${c}]`),n.defenseRolls[e]=c,Ae(),U()},500)}function Ae(){const e=n.defender,t=n.weapon,a=e.sv,i=t.hasRule&&t.hasRule("Saturate")||n.saturateFromAbility,c=o.rulesVersion==="standard"&&e.operativeType==="sm_eliminator_sniper"&&i;c&&b.addLog(`[伪装斗篷] ${e.name}：忽略 Saturate 规则！`);const l=i&&!c;let p=n.inCover&&!l?1:0;const m=o.rulesVersion==="standard"&&we(e,"hardy"),u=o.rulesVersion==="standard"&&e.operativeType==="pm_warrior",d=m||u;let f=0;n.defenseRolls.forEach(v=>{v===6||d&&v===5?f++:v>=a&&p++}),m&&f>0&&b.addLog(`[坚韧] ${e.name}：章战术生效，5+ 防御骰算暴击！`),u&&f>0&&b.addLog(`[厌恶韧性] ${e.name}：5+ 防御骰算暴击！`),n.defCrit=f,n.defNorm=p}function Qn(){const e=document.getElementById("manual-att-dice-val");if(!e)return;const a=e.value.split(",").map(r=>parseInt(r.trim(),10)).filter(r=>!isNaN(r)&&r>=1&&r<=6);n.attackRolls=a,Se()}function Yn(){const e=document.getElementById("manual-def-dice-val");if(!e)return;const a=e.value.split(",").map(r=>parseInt(r.trim(),10)).filter(r=>!isNaN(r)&&r>=1&&r<=6);n.defenseRolls=a,Ae()}function Jn(e){h("click");const t=n.attacker,a=n.defender;let r=null;const i=document.getElementById("manual-dr-dice-val");i&&i.value.trim()!==""&&(r=i.value.split(",").map(m=>parseInt(m.trim(),10)).filter(m=>!isNaN(m)&&m>=1&&m<=6)),b.addLog(`
--- 射击对决结果 ---`),b.addLog(`[攻击方] ${t.name} 使用 ${n.weapon.name} 射击`),b.addLog(`[防守方] ${a.name}`);const s=a.applyWounds(e,r);if(a.isDead&&o.rulesVersion==="standard"&&wt(t,a,"shoot",s),n.weapon.hasRule&&n.weapon.hasRule("Poison")&&s>0&&a.poisonTokens<1&&(a.poisonTokens=1,b.addLog(`[毒素] ${a.name} 获得了 1 个毒素标记！下次激活开始时将受到 1 点伤害。`)),n.weapon.hasRule&&n.weapon.hasRule("PSYCHIC")){const m=n.attackRolls.filter(u=>u===1).length;m>0&&(b.addLog(`[灵能反噬] ${n.weapon.name} 引发危险！投出 ${m} 个 1，攻击方受到 ${m} 点伤害。`),t.applyWounds(m))}if(n.weapon.hasRule&&n.weapon.hasRule("Hot")){const m=Math.floor(Math.random()*6)+1,u=n.weapon.ts;if(m<u){const d=m*2;b.addLog(`[过热] ${n.weapon.name}：投出 ${m} < ${u}，反噬 ${d} 点伤害！`),t.applyWounds(d)}else b.addLog(`[过热] ${n.weapon.name}：投出 ${m} ≥ ${u}，安全。`)}t.apl-=1,t.actionsPerformed.push("Shoot"),b.addLog(`[行动点] ${t.name} 消耗 1 APL，当前 APL: ${t.apl}`),De(),s>0&&setTimeout(()=>{b.triggerAvatarHitEffect(a.id,"shoot")},100)}function St(){h("click");const e=o.activeAgent;if(!e)return;const t=document.querySelector("#combat-modal .modal-content");if(t&&(t.style.backgroundImage=`linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("${ne("assets/images/backgrounds/bg_melee_action.png")}")`,t.style.backgroundSize="cover",t.style.backgroundPosition="center"),Object.assign(n,{actionType:"fight",step:1,attacker:e,defender:null,weapon:e.weapons.filter(a=>!a.isRanged)[0]||null,inMeleeRange:!0,hasFallenBack:!1,mode:"random",activeAttackerDice:[],activeDefenderDice:[],meleeTurn:"attacker",meleeLogs:""}),!n.weapon){B&&B("该特工没有配备任何近战武器！","warning");return}Ct(),le()}function Xn(e){h("click"),n.defender=o.operatives.find(t=>t.id===e),le()}function ea(e){h("click"),n.weapon=n.attacker.weapons.filter(t=>!t.isRanged)[e],le()}function le(){const e=document.getElementById("modal-title"),t=document.getElementById("modal-body"),a=document.getElementById("modal-btn-next"),r=document.getElementById("modal-btn-cancel");if(a.onclick=Qe,r.style.display="inline-block",n.step===1){e.textContent="近战结算 - 步骤 1: 选择目标";const i=n.attacker.teamSlot>=0?n.attacker.teamSlot:J(n.attacker.faction),s=o.operatives.filter(l=>l.teamSlot!==i&&!l.isDead);if(s.length===0){t.innerHTML='<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>',a.disabled=!0;return}let c='<div class="weapon-picker-list">';s.forEach(l=>{const p=l.isInjured?' <span style="color:var(--red); font-size:0.7rem;">[重伤]</span>':"",m=l.poisonTokens>0?' <span style="color:#7ab88a; font-size:0.7rem;">[毒素]</span>':"";c+=`
        <div class="weapon-pick-item ${n.defender&&n.defender.id===l.id?"selected":""}" role="button" tabindex="0" onclick="selectFightDefender('${l.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightDefender('${l.id}')}">
          <span class="weapon-pick-name">${l.name}${p}${m}</span>
          <span class="weapon-pick-stats">HP: ${l.wounds}/${l.maxWounds} | DF:${l.df}</span>
        </div>
      `}),c+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要交战的敌方特工 (必须在交战距离内)：</p>
      ${c}
    `,a.textContent="判定近战条件",a.disabled=!n.defender}else if(n.step===2){e.textContent="近战结算 - 步骤 2: 选择近战武器";const i=n.attacker.weapons.filter(l=>!l.isRanged),s=n.attacker.isInjured;let c='<div class="weapon-picker-list">';i.forEach((l,p)=>{const m=s?`${l.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${l.ts+1}+</span>`:`${l.ts}+`,u=l.rules&&l.rules.length>0?` | ${l.rules.map(je).join(", ")}`:"";c+=`
        <div class="weapon-pick-item ${n.weapon.name===l.name?"selected":""}" role="button" tabindex="0" onclick="selectFightWeapon(${p})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightWeapon(${p})}">
          <span class="weapon-pick-name">${l.name}</span>
          <span class="weapon-pick-stats">A: ${l.attacks} | WS: ${m} | D: ${l.normalDamage}/${l.criticalDamage}${u}</span>
        </div>
      `}),c+="</div>",t.innerHTML=`
      <p style="margin-bottom:10px;">选择你要使用的近战武器：</p>
      ${c}
    `,a.textContent="判定交战距离与退却",a.disabled=!1}else if(n.step===3)e.textContent="近战结算 - 步骤 3: 距离与退却判定",t.innerHTML=`
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
    `,a.textContent="双方近战掷骰",a.disabled=!1;else if(n.step===4)e.textContent="近战结算 - 步骤 4: 双方近战掷骰",t.innerHTML=`
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
    `,n.activeAttackerDice.length>0||n.activeDefenderDice.length>0?(a.disabled=!1,At()):a.disabled=!0,a.textContent="进入伤害/格挡分配";else if(n.step===5){e.textContent="近战结算 - 步骤 5: 伤害与格挡交替分配";const i=n.attacker.wounds>0,s=n.defender.wounds>0,c=n.activeAttackerDice.some($=>!$.used),l=n.activeDefenderDice.some($=>!$.used);if(!i||!s||!c&&!l){let $="";!i&&!s?$="双方同归于尽！":i?s?$="双方所有成功骰已分配完毕。":$=`防守方 [${n.defender.name}] 已阵亡！`:$=`攻击方 [${n.attacker.name}] 已阵亡！`,t.innerHTML=`
        <!-- 双方状态卡 -->
        ${dt()}

        <div class="qa-card" style="text-align: center; margin-top: 16px;">
          <h4 style="color: var(--sm-accent); margin-bottom: 8px;">战斗结束</h4>
          <p>${$}</p>
        </div>

        <div class="melee-interactive-log" id="melee-int-log" style="margin-top:12px; height: 100px;">
          ${n.meleeLogs}
        </div>
      `,a.textContent="完成近战结算",a.disabled=!1,a.onclick=sa,r.style.display="none";return}const p=z(n.attacker.faction),m=z(n.defender.faction);let u="";n.activeAttackerDice.forEach(($,P)=>{let k=`melee-dice-btn ${p}`;$.isCrit&&(k+=" crit"),$.used&&(k+=" used");const A=n.selectedMeleeDice&&n.selectedMeleeDice.side==="attacker"&&n.selectedMeleeDice.idx===P?"outline: 3px solid #6a9ad4; transform: scale(1.15); box-shadow: 0 0 15px rgba(96,165,250,0.8); z-index: 2;":"";u+=`<button class="${k}" style="${A}" onclick="chooseMeleeDice('attacker', ${P})">${$.val}</button>`}),n.activeAttackerDice.length===0&&(u='<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>');let d="";n.activeDefenderDice.forEach(($,P)=>{let k=`melee-dice-btn ${m}`;$.isCrit&&(k+=" crit"),$.used&&(k+=" used");const A=n.selectedMeleeDice&&n.selectedMeleeDice.side==="defender"&&n.selectedMeleeDice.idx===P?"outline: 3px solid var(--pm-accent); transform: scale(1.15); box-shadow: 0 0 15px rgba(74,124,89,0.8); z-index: 2;":"";d+=`<button class="${k}" style="${A}" onclick="chooseMeleeDice('defender', ${P})">${$.val}</button>`}),n.activeDefenderDice.length===0&&(d='<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>');const f=n.meleeTurn==="attacker"?"攻击方":"防守方",v=n.meleeTurn==="attacker"?"#6a9ad4":"var(--pm-accent)";let g="";if(n.selectedMeleeDice){const{side:$,idx:P}=n.selectedMeleeDice,S=($==="attacker"?n.activeAttackerDice:n.activeDefenderDice)[P];let A;$==="attacker"?A=n.weapon:A=n.defender.weapons.filter(E=>!E.isRanged)[0]||new C("重拳 (Fists)",4,3,3,4,!1,null,[]);const _=S.isCrit?A.criticalDamage:A.normalDamage,R=($==="attacker"?n.activeDefenderDice:n.activeAttackerDice).some(E=>!E.used),I=$==="attacker"?n.defender.weapons.filter(E=>!E.isRanged)[0]||null:n.weapon,N=I&&I.hasRule&&I.hasRule("Brutal"),V=N&&!S.isCrit,w=N?S.isCrit?'<div style="margin-top:8px; font-size:0.75rem; color:#22c55e;">🔥 残暴 (Brutal) 生效：你选择了暴击骰，可以格挡！</div>':'<div style="margin-top:8px; font-size:0.75rem; color:#ef4444;">🔥 残暴 (Brutal) 生效：只能用暴击骰格挡！此骰不可用于 Parry。</div>':"";g=`
        <div class="melee-choice-card" style="position:relative; background: linear-gradient(180deg, #2a2d35, #1e2128); border: 2px solid ${v}; border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: center; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
          <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: #fff;">
            🎯 已选中点数 <span style="display:inline-block; padding: 2px 8px; border-radius: 4px; background: ${$==="attacker"?"rgba(74,106,154,0.3)":"rgba(74,124,89,0.3)"}; color: ${$==="attacker"?"#6a9ad4":"var(--pm-accent)"}; font-weight: 900; font-family:'Pirata One',serif;">${S.val}${S.isCrit?" (⚡暴击)":""}</span>，请选择分配动作：
          </div>

          <div style="display: flex; gap: 16px; justify-content: center;">
            <button onclick="resolveMeleeChoice('strike')" class="melee-action-btn strike-btn" style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, var(--red), #5a2020); border: 2px solid #b84c4c; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(184, 76, 76, 0.3); transition: all 0.2s ease;">
              ⚔️ 打击 (STRIKE)<br>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.9;">造成 ${_} 点伤害</span>
            </button>

            <button onclick="resolveMeleeChoice('parry')" class="melee-action-btn parry-btn" ${!R||V?'disabled style="opacity: 0.4; cursor: not-allowed;"':""} style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, #4a6a9a, #3a5580); border: 2px solid #6a9ad4; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(74, 106, 154, 0.3); transition: all 0.2s ease;">
              🛡️ 格挡 (PARRY)<br>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.9;">消去对方一个成功骰</span>
            </button>
          </div>

          ${w}

          <div style="margin-top: 10px;">
            <button onclick="cancelMeleeChoice()" class="modal-btn" style="padding: 4px 12px; font-size: 0.75rem; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: var(--text-muted);">
              取消选择
            </button>
          </div>
        </div>
      `}t.innerHTML=`
      <!-- 双方实时血条与头像 -->
      ${dt()}

      <p style="margin-bottom: 10px; font-weight: bold; text-align: center; color: ${v}; font-size: 1.05rem;">
        👉 当前轮到：【${f}】分配骰子
      </p>

      ${g}

      <div class="melee-grid" style="margin-bottom: 16px;">
        <div class="melee-pool-card">
          <div class="melee-pool-title" style="display:flex; justify-content:space-between;">
            <span>攻击方成功骰</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">HP: ${n.attacker.wounds}</span>
          </div>
          <div class="melee-dice-pool">
            ${u}
          </div>
        </div>

        <div class="melee-pool-card">
          <div class="melee-pool-title" style="display:flex; justify-content:space-between;">
            <span>防守方成功骰</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">HP: ${n.defender.wounds}</span>
          </div>
          <div class="melee-dice-pool">
            ${d}
          </div>
        </div>
      </div>

      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 6px;">
        💡 <b>分配指南:</b> 点击你的高亮骰子，若对方有剩余成功骰，可选择格挡(Parry)消去对方一个未使用的成功骰，或选择打击(Strike)对敌方特工造成伤害。
      </div>

      <div class="melee-interactive-log" id="melee-int-log">
        <!-- 滚动记录 -->
      </div>
    `;const x=document.getElementById("melee-int-log");x&&(x.innerHTML=n.meleeLogs,x.scrollTop=x.scrollHeight),a.textContent="交替进行中...",a.disabled=!0}}function ta(){const e=document.getElementById("modal-btn-next"),t=document.getElementById("melee-att-pool"),a=document.getElementById("melee-def-pool"),r=document.getElementById("btn-roll-melee");r.style.display="none",e.disabled=!0;const i=z(n.attacker.faction),s=z(n.defender.faction);t.innerHTML="",ee=!1,te=[];const c=n.weapon.attacks;for(let k=0;k<c;k++){const S=document.createElement("div");S.className=`kt-dice-cube ${i} rolling`,S.textContent="?",t.appendChild(S)}const l=n.defender.weapons.filter(k=>!k.isRanged)[0]||new C("重拳 (Fists)",3,3,3,4,!1),p=l.attacks;a.innerHTML="";for(let k=0;k<p;k++){const S=document.createElement("div");S.className=`kt-dice-cube ${s} rolling`,S.textContent="?",a.appendChild(S)}const m=document.createElement("button");m.className="modal-btn",m.style.cssText="padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;",m.textContent="跳过动画 (Skip)",m.onclick=()=>{ee=!0,te.forEach(H=>clearTimeout(H)),te=[];const k=t.getElementsByClassName("kt-dice-cube"),S=n.weapon.ts+(n.attacker.isInjured?1:0),A=l.ts+(n.defender.isInjured?1:0);for(let H=v;H<c;H++){const R=Math.floor(Math.random()*6)+1;d.push(R);const I=k[H];I&&(I.classList.remove("rolling"),I.textContent=R,R===6?I.classList.add("crit-dice"):R<S&&I.classList.add("fail-dice"))}const _=a.getElementsByClassName("kt-dice-cube");for(let H=g;H<p;H++){const R=Math.floor(Math.random()*6)+1;f.push(R);const I=_[H];I&&(I.classList.remove("rolling"),I.textContent=R,R===6?I.classList.add("crit-dice"):R<A&&I.classList.add("fail-dice"))}P()};const u=document.getElementById("modal-body");u&&u.appendChild(m),b.triggerCombatVisual("⚔️ MELEE CLASH!","shoot"),h("shoot");const d=[],f=[];let v=0,g=0;function x(){if(!ee)if(v<c){const k=Math.floor(Math.random()*6)+1;d.push(k);const A=t.getElementsByClassName("kt-dice-cube")[v];A.classList.remove("rolling"),A.textContent=k;const _=n.weapon.ts+(n.attacker.isInjured?1:0);k===6?(A.classList.add("crit-dice"),h("crit")):(k<_&&A.classList.add("fail-dice"),h("click")),v++,ue(x,400)}else $()}function $(){if(!ee)if(g<p){const k=Math.floor(Math.random()*6)+1;f.push(k);const A=a.getElementsByClassName("kt-dice-cube")[g];A.classList.remove("rolling"),A.textContent=k;const _=l.ts+(n.defender.isInjured?1:0);k===6?(A.classList.add("crit-dice"),h("crit")):(k<_&&A.classList.add("fail-dice"),h("click")),g++,ue($,400)}else P()}function P(){m.remove(),r.style.display="none";const k=n.attacker&&n.attacker.isInjured?1:0,S=n.defender&&n.defender.isInjured?1:0,A=n.weapon.ts+k,_=l.ts+S;n.allAttackerRolls=d.map((w,E)=>({val:w,isSuccess:w>=A||w===6,isCrit:w===6,originalIdx:E})),n.allDefenderRolls=f.map((w,E)=>({val:w,isSuccess:w>=_||w===6,isCrit:w===6,originalIdx:E})),n.activeAttackerDice=d.filter(w=>w>=A||w===6).map(w=>({val:w,isCrit:w===6,used:!1})),n.activeDefenderDice=f.filter(w=>w>=_||w===6).map(w=>({val:w,isCrit:w===6,used:!1})),n.meleeEffectiveAttTs=A,n.meleeEffectiveDefTs=_,n.meleeDefWeapon=l,n.darkZealotryUsed={attacker:!1,defender:!1};const H=Y(n.attacker.faction,"darkZealotry")&&oe(n.attacker.faction).includes("dark_zealotry"),R=Y(n.defender.faction,"darkZealotry")&&oe(n.defender.faction).includes("dark_zealotry"),I=n.allAttackerRolls.filter(w=>!w.isSuccess).length,N=n.allDefenderRolls.filter(w=>!w.isSuccess).length,V=document.getElementById("modal-body");if(V&&(H&&I>0||R&&N>0)){const w=document.createElement("div");w.id="melee-reroll-section",w.style.cssText="margin-top: 12px; padding: 10px; background: rgba(139, 26, 26, 0.15); border: 1px solid var(--leg-accent, #c94444); border-radius: 8px;";let E='<div style="font-weight: bold; color: #c94444; margin-bottom: 8px;">⚔️ 黑暗狂热 (Dark Zealotry) — 可重投 1 个失败骰</div>';H&&I>0&&(E+=`<button class="modal-btn" style="margin-right: 8px; background: linear-gradient(135deg, #6a9ad4, #4a7ab4);" onclick="rerollMeleeDice('attacker')">攻击方重投 (${I} 个失败)</button>`),R&&N>0&&(E+=`<button class="modal-btn" style="background: linear-gradient(135deg, #4a7c59, #2a5c39);" onclick="rerollMeleeDice('defender')">防守方重投 (${N} 个失败)</button>`),w.innerHTML=E,V.appendChild(w)}e.disabled=!1}ue(x,1200)}function na(e){if(n.darkZealotryUsed[e]){b.showToast("每方只能使用 1 次黑暗狂热重投！","warning");return}const a=(e==="attacker"?n.allAttackerRolls:n.allDefenderRolls).filter(v=>!v.isSuccess);if(a.length===0){b.showToast("没有可重投的失败骰！","warning");return}const r=Math.floor(Math.random()*a.length),i=a[r],s=e==="attacker"?n.meleeEffectiveAttTs:n.meleeEffectiveDefTs,c=Math.floor(Math.random()*6)+1,l=c>=s||c===6;h("crit");const p=e==="attacker"?n.allAttackerRolls[i.originalIdx]:n.allDefenderRolls[i.originalIdx],m=p.val;p.val=c,p.isSuccess=l,p.isCrit=c===6;const u=(e==="attacker"?n.allAttackerRolls:n.allDefenderRolls).filter(v=>v.isSuccess);e==="attacker"?n.activeAttackerDice=u.map(v=>({val:v.val,isCrit:v.isCrit,used:!1})):n.activeDefenderDice=u.map(v=>({val:v.val,isCrit:v.isCrit,used:!1})),n.darkZealotryUsed[e]=!0;const d=T(e==="attacker"?n.attacker.faction:n.defender.faction);addLog(`[黑暗狂热] ${d} 重投失败骰: [${m}] → [${c}]${l?" ✓命中!":" ✗未命中"}`);const f=document.getElementById("melee-reroll-section");f&&f.remove(),At()}function At(){const e=document.getElementById("melee-att-pool"),t=document.getElementById("melee-def-pool");if(!e||!t)return;const a=z(n.attacker.faction),r=z(n.defender.faction);if(e.innerHTML="",n.activeAttackerDice.forEach(i=>{let s=`kt-dice-cube ${a}`;i.isCrit&&(s+=" crit-dice");const c=document.createElement("div");c.className=s,c.textContent=i.val,e.appendChild(c)}),n.activeAttackerDice.length===0){const i=document.createElement("span");i.style.cssText="color:var(--text-muted);font-size:0.85rem;",i.textContent="全部未命中",e.appendChild(i)}if(t.innerHTML="",n.activeDefenderDice.forEach(i=>{let s=`kt-dice-cube ${r}`;i.isCrit&&(s+=" crit-dice");const c=document.createElement("div");c.className=s,c.textContent=i.val,t.appendChild(c)}),n.activeDefenderDice.length===0){const i=document.createElement("span");i.style.cssText="color:var(--text-muted);font-size:0.85rem;",i.textContent="全部未命中",t.appendChild(i)}}function Pe(e,t){const a=o.customAvatars[e],r=q(t);let i=ne(`assets/images/defaults/default_${r}_avatar.png`);const s=o.operatives.find(p=>p.id===e);if(s&&s.defaultAvatar)i=ne(s.defaultAvatar);else{const p=e.replace(/^(sm_|pm_|leg_)/,"");i=ne(`assets/images/operatives/${r}/${r}_${p}.png`)}const c=a||i,l=s?s.name:e;return`<div class="op-avatar-slot duel-avatar-${e}" style="width: 50px; height: 50px; cursor: default; position: relative;">
            <img src="${c}" class="op-avatar-img" alt="${l} 头像" loading="lazy" />
          </div>`}function dt(){const e=n.attacker,t=n.defender,a=Math.max(0,e.wounds/e.maxWounds*100),r=Math.max(0,t.wounds/t.maxWounds*100);return`
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(26,29,36,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${Pe(e.id,e.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:#6a9ad4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${e.name}">${e.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">攻击方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${a}%; height:100%; transition:width 0.3s ease;"></div>
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
        ${Pe(t.id,t.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${t.name}">${t.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${r}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0,t.wounds)} / ${t.maxWounds} HP</div>
      </div>
    </div>
  `}function Ve(){const e=n.attacker,t=n.defender,a=Math.max(0,e.wounds/e.maxWounds*100),r=Math.max(0,t.wounds/t.maxWounds*100);return`
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(26,29,36,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${Pe(e.id,e.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:#6a9ad4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${e.name}">${e.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">射击方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${a}%; height:100%; transition:width 0.3s ease;"></div>
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
        ${Pe(t.id,t.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${t.name}">${t.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${r}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0,t.wounds)} / ${t.maxWounds} HP</div>
      </div>
    </div>
  `}function aa(e,t){if(e!==n.meleeTurn){h("alert"),B&&B("现在不属于你的近战分配回合！","warning");return}(e==="attacker"?n.activeAttackerDice:n.activeDefenderDice)[t].used||(n.selectedMeleeDice={side:e,idx:t},le())}function ia(e){if(!n.selectedMeleeDice)return;const{side:t,idx:a}=n.selectedMeleeDice,i=(t==="attacker"?n.activeAttackerDice:n.activeDefenderDice)[a];if(i.used)return;const s=t==="attacker"?n.defender:n.attacker,c=t==="attacker"?n.activeDefenderDice:n.activeAttackerDice;let l;if(t==="attacker"?l=n.weapon:l=n.defender.weapons.filter(x=>!x.isRanged)[0]||new C("重拳 (Fists)",4,3,3,4,!1,null,[]),n.meleeLogs||(n.meleeLogs=""),e==="strike"){i.used=!0;const x=t==="attacker"?n.attacker:n.defender,$=!l.isRanged;let P=l.normalDamage,k=l.criticalDamage;l.hasRule&&l.hasRule("Toxic")&&s.poisonTokens>0&&(P+=1,k+=1,b.addLog(`[剧毒] 目标携带毒素标记，${l.name} 近战伤害 +1 (${P}/${k})`));const A=l.hasRule&&l.hasRule("Severe"),_=o.rulesVersion==="standard"&&Ne(x,"KHORNE");o.rulesVersion==="standard"&&we(x,"aggressive");const H=_&&$;if((A||H)&&i.isCrit){P=k;const E=H&&!A?" (恐虐印记)":"";b.addLog(`[重伤] ${l.name}：暴击打击，普通伤害升级为暴击伤害 (${P})${E}！`)}const R=i.isCrit?k:P,I=`> ${t==="attacker"?"攻击方":"防守方"} 执行打击 (Strike)，分配了 ${R} 伤害！<br>`;if(n.meleeLogs+=I,s.applyWounds(R),s.isDead&&o.rulesVersion==="standard"){const E=t==="attacker"?n.attacker:n.defender;wt(E,s,"fight",R)}if(l.hasRule&&l.hasRule("Poison")&&R>0&&s.poisonTokens<1&&(s.poisonTokens=1,b.addLog(`[毒素] ${s.name} 获得了 1 个毒素标记！(来自近战)`)),l.hasRule&&l.hasRule("Shock")&&i.isCrit&&!n.shockTriggered){let E=c.findIndex(O=>!O.used&&!O.isCrit),G="普通成功";if(E===-1&&(E=c.findIndex(O=>!O.used&&O.isCrit),G="暴击成功"),E!==-1){c[E].used=!0,n.shockTriggered=!0;const O=`> [冲击] 暴击打击触发 Shock：丢弃对手 1 个未解决的${G} [${c[E].val}]！<br>`;n.meleeLogs+=O,b.addLog(`[冲击] ${l.name}：暴击打击触发，丢弃对手 1 个${G}！`)}}if(l.hasRule&&l.hasRule("Stun")&&i.isCrit&&!n.stunApplied){s.apl=Math.max(0,s.apl-1),s.stunnedUntilEndOfNextActivation=!0,n.stunApplied=!0;const E=`> [震慑] 暴击打击触发 Stun：${s.name} APL -1 (直到其下一次激活结束)！<br>`;n.meleeLogs+=E,b.addLog(`[震慑] ${l.name}：暴击打击触发，${s.name} APL -1！`),b.updateActivePanel()}h("heavy_strike"),b.triggerCombatVisual("⚔️ STRIKE! -"+R,"strike")}else{const x=t==="attacker"?n.defender.weapons.filter(S=>!S.isRanged)[0]||null:n.weapon;if(x&&x.hasRule&&x.hasRule("Brutal")&&!i.isCrit){h("alert"),B&&B("残暴 (Brutal)：只能使用暴击骰格挡！","warning");return}let P=-1;if(i.isCrit?(P=c.findIndex(S=>!S.used&&S.isCrit),P===-1&&(P=c.findIndex(S=>!S.used))):P=c.findIndex(S=>!S.used&&!S.isCrit),P===-1){h("alert"),B&&B("没有合法的对方骰子可供格挡招架！","warning");return}i.used=!0,c[P].used=!0;const k=`> ${t==="attacker"?"攻击方":"防守方"} 执行格挡 (Parry)，消去对方一个骰子 [${c[P].val}]！<br>`;n.meleeLogs+=k,h("metal_clash"),b.triggerCombatVisual("🛡️ PARRY!","parry")}const p=t==="attacker"?"defender":"attacker",m=p==="attacker"?n.attacker.wounds:n.defender.wounds,d=(p==="attacker"?n.activeAttackerDice:n.activeDefenderDice).some(x=>!x.used)&&m>0,f=t==="attacker"?n.attacker.wounds:n.defender.wounds,g=(t==="attacker"?n.activeAttackerDice:n.activeDefenderDice).some(x=>!x.used)&&f>0;d&&g||d?n.meleeTurn=p:g&&(n.meleeTurn=t),n.selectedMeleeDice=null,le(),e==="strike"&&b.triggerAvatarHitEffect(s.id,"melee")}function oa(){h("click"),n.selectedMeleeDice=null,le()}function sa(){h("click");const e=n.attacker,t=n.defender;b.addLog(`
--- 近战搏斗结果 ---`),b.addLog(`[双核交锋] ${e.name} vs ${t.name}`),b.addLog(`  - ${e.name} 生命值: ${e.wounds}/${e.maxWounds}`),b.addLog(`  - ${t.name} 生命值: ${t.wounds}/${t.maxWounds}`),e.apl-=1,e.actionsPerformed.push("Fight"),b.addLog(`[行动点] ${e.name} 消耗 1 APL，当前 APL: ${e.apl}`),De()}Vt({addLog:L,updateScoresUI:se,renderOperatives:ie,updateActivePanel:K,startInitiativePhase:_e,showTurnEndScoringOverlay:$t,showCounteractOverlay:yt,hidePhaseOverlay:Ge,hideCounteractOverlay:hn});zt({addLog:L,triggerOperativeDeathOverlay:Sn});Qt({openShootWizard:Tt,openFightWizard:St,renderShootStep:U,renderFightStep:le,closeModal:De});Hn({addLog:L,renderOperatives:ie,updateActivePanel:K,updateScoresUI:se,triggerAvatarHitEffect:Rn,triggerCombatVisual:Mn});_n({showToast:Q,trapFocus:be,releaseFocusTrap:xe});window.adjustScore=Jt;window.confirmReset=Xt;window.toggleSelect=$e;window.handleFactionChange=nn;window.incrementWarrior=vt;window.decrementWarrior=tn;window.validateRostersAndDeploy=an;window.updateMissionDesc=Ut;window.updateRulesVersion=ft;window.triggerAvatarUpload=In;window.handleAvatarFileSelect=Bn;window.selectOperative=He;window.confirmActivation=cn;window.cancelSelection=dn;window.activateOperative=ht;window.toggleConceal=rn;window.performMove=pn;window.performCharge=mn;window.performAdvance=un;window.performDash=fn;window.performFallBack=gn;window.openShootWizard=Tt;window.openFightWizard=St;window.endActivation=vn;window.showRuleHelp=Tn;window.closeHelpModal=xt;window.closeModal=De;window.nextModalStep=Qe;window.selectShootDefender=Nn;window.selectShootWeapon=On;window.setQA=zn;window.setRollMode=jn;window.rollAttackDice=Wn;window.rollDefenseDice=Un;window.selectFightDefender=Xn;window.selectFightWeapon=ea;window.rollMeleeDice=ta;window.rerollMeleeDice=na;window.chooseMeleeDice=aa;window.resolveMeleeChoice=ia;window.cancelMeleeChoice=oa;window.rollInitiativeOverlay=xn;window.selectTurnOrder=kn;window.confirmTurnOrder=$n;window.buyPloy=wn;window.proceedToFirefight=Cn;window.showCounteractOverlay=yt;window.selectCounteractOperative=yn;window.skipCounteract=pt;window.skipCounteractAction=bn;window.confirmOperativeDeath=kt;window.declareScoreVictory=Dn;window.toggleScoringChecklist=Pn;window.adjustScoreTemp=En;window.confirmTurnEndScoring=Ln;document.addEventListener("DOMContentLoaded",()=>{Re("Space Marine",We),Re("Plague Marine",qe),Re("Legionary",Ke),Ue(),ft()});
