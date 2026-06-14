# Legionary 数据核对报告

**核对来源**：`docs/rules/MinerU_markdown_eng_17-12_kt_legionaries_online_rules-wdpu85w6pv-8ndq4m5egw.md`  
**对比分支**：
- `origin/feature/dynamic-factions` 的 `LEGIONARY_TEMPLATES`
- 当前 `main` 分支的 `LEG_TEMPLATES`（`src/js/constants.js`）

---

## 一、特工基础属性对比

| 特工 | 官方 Wounds | 分支 Wounds | 官方 Move | 分支 Move | 官方 Save | 分支 Save | 官方 APL | 分支 APL |
|------|-------------|-------------|-----------|-----------|-----------|-----------|----------|----------|
| Aspiring Champion | **15** | 12 ❌ | 6" | 未设 | 3+ | 3 | 3 | 3 ✓ |
| Chosen | **15** | 12 ❌ | 6" | 未设 | 3+ | 3 | 3 | 3 ✓ |
| Anointed | **14** | 12 ❌ | 6" | 未设 | 3+ | 3 | 3 | 3 ✓ |
| Balefire Acolyte | **14** | 12 ❌ | 6" | 未设 | 3+ | 3 | 3 | 3 ✓ |
| Butcher | **14** | 12 ❌ | 6" | 未设 | 3+ | 3 | 3 | 3 ✓ |
| Gunner | **14** | 12 ❌ | 6" | 未设 | 3+ | 3 | 3 | 3 ✓ |
| Heavy Gunner | **14** | 12 ❌ | 6" | 未设 | 3+ | 3 | 3 | 3 ✓ |
| Icon Bearer | **14** | 12 ❌ | 6" | 未设 | 3+ | 3 | 3 | 3 ✓ |
| Shrivetalon | **14** | 12 ❌ | 6" | 未设 | 3+ | 3 | 3 | 3 ✓ |
| Warrior | **14** | 12 ❌ | 6" | 未设 | 3+ | 3 | 3 | 3 ✓ |

### 关键问题

1. **Wounds 全部偏低**：
   - Leader 单位（Aspiring Champion, Chosen）应为 15，分支设为 12（-3）
   - 其他单位应为 14，分支统一设为 12（-2）

2. **Move 未设置**：官方统一 6"，分支代码中未显式设置（依赖构造函数默认值）

3. **Save 格式问题**：官方是 "3+"，分支写的是数字 3（需确认代码是否正确解析）

4. **APL 全部正确** ✓

---

## 二、武器数据对比

### 1. Aspiring Champion

| 武器 | 官方 ATK/HIT/DMG | 分支 ATK/HIT/DMG | 官方规则 | 分支规则 |
|------|------------------|------------------|----------|----------|
| Plasma Pistol (std) | 4 / 3+ / 3/5 | 4 / 2+ / 5/6 ❌ | Range 8", Piercing 1 | 无 ❌ |
| Power Fist | 5 / 4+ / 5/7 | 5 / 4+ / 5/7 ✓ | Brutal | 无 ❌ |

**问题**：
- Plasma Pistol 命中值和伤害都错了（HIT 2+ 应为 3+，DMG 5/6 应为 3/5）
- 两个武器都缺少武器规则

### 2. Chosen

| 武器 | 官方 ATK/HIT/DMG | 分支 ATK/HIT/DMG | 官方规则 | 分支规则 |
|------|------------------|------------------|----------|----------|
| Bolt Pistol | 4 / 3+ / 3/4 | 4 / 3+ / 3/4 ✓ | Range 8" | 无 ❌ |
| Daemon Blade | 5 / 3+ / 4/7 | 5 / 3+ / 4/6 ❌ | Lethal 5+ | 无 ❌ |

**问题**：
- Daemon Blade 暴击伤害错（6 应为 7）
- 两个武器都缺少规则

### 3. Balefire Acolyte

| 武器 | 官方 ATK/HIT/DMG | 分支 ATK/HIT/DMG | 官方规则 | 分支规则 |
|------|------------------|------------------|----------|----------|
| Malign Strike | 无此武器 | 4/3/4/5 | - | 虚构 ❌ |
| Fell Daggers | 5/3+/3/4 | 4/3/4/5 ❌ | PSYCHIC, Rending, Siphon Life* | 无 ❌ |

**问题**：
- 官方没有 "Malign Strike"，这个武器名是虚构的
- Fell Daggers 的 ATK 和 DMG 都错了
- 缺少全部武器规则（PSYCHIC, Rending, Siphon Life）

**官方实际武器**：
- Bolt Pistol (4/3+/3/4, Range 8")
- Fireblast (4/3+/3/4, PSYCHIC, Blast 2", 1" Devastating 1, Saturate)
- Life Siphon (5/3+/3/3, PSYCHIC, Saturate, Siphon Life*)
- Fell Dagger (5/3+/3/4, PSYCHIC, Rending, Siphon Life*)

### 4. Shrivetalon

| 武器 | 官方 ATK/HIT/DMG | 分支 ATK/HIT/DMG | 官方规则 | 分支规则 |
|------|------------------|------------------|----------|----------|
| Bolt Pistol | 4 / 3+ / 3/4 | 4 / 3+ / 3/4 ✓ | Range 8", Rending | 无 ❌ |
| Flensing Blades | 5 / 3+ / 3/5 | 5 / 3+ / 4/5 ❌ | Lethal 5+ | 无 ❌ |

**问题**：
- Flensing Blades 暴击伤害错（5 应为 5，但普通伤害 4 应为 3）
- 两个武器都缺少规则

### 5. Butcher

| 武器 | 官方 ATK/HIT/DMG | 分支 ATK/HIT/DMG | 官方规则 | 分支规则 |
|------|------------------|------------------|----------|----------|
| Bolt Pistol | 4 / 3+ / 3/4 | 4 / 3+ / 3/4 ✓ | Range 8" | 无 ❌ |
| Double-handed Chainaxe | 5 / 4+ / 5/7 | 5 / 4+ / 4/5 ❌ | Brutal | 无 ❌ |

**问题**：
- Double-handed Chainaxe 伤害完全错（4/5 应为 5/7）
- 缺少 Brutal 规则

### 6. Anointed

| 武器 | 官方 ATK/HIT/DMG | 分支 ATK/HIT/DMG | 官方规则 | 分支规则 |
|------|------------------|------------------|----------|----------|
| Bolt Pistol | 4 / 3+ / 3/4 | 4 / 3+ / 3/4 ✓ | Range 8" | 无 ❌ |
| Daemonic Claw | 5 / 3+ / 4/5 | 5 / 3+ / 4/5 ✓ | Rending | 无 ❌ |

**问题**：
- 数值正确，但缺少武器规则

### 7. Heavy Gunner

| 武器 | 官方 ATK/HIT/DMG | 分支 ATK/HIT/DMG | 官方规则 | 分支规则 |
|------|------------------|------------------|----------|----------|
| Reaper Chaincannon | 5 / 3+ / 3/4 (focused) | 6 / 3+ / 3/4 ❌ | Ceaseless, Heavy (Reposition only), Punishing | 无 ❌ |
| Fists | 4 / 3+ / 3/4 | 3 / 3+ / 3/4 ❌ | - | - |

**问题**：
- Reaper Chaincannon ATK 错（6 应为 5）
- Fists ATK 错（3 应为 4）
- 缺少全部武器规则

**官方实际武器**（更多选项）：
- Bolt Pistol
- Heavy Bolter (focused/sweeping)
- Missile Launcher (frag/krak)
- Reaper Chaincannon (focused/sweeping)
- Fists

### 8. Gunner

| 武器 | 官方 ATK/HIT/DMG | 分支 ATK/HIT/DMG | 官方规则 | 分支规则 |
|------|------------------|------------------|----------|----------|
| Plasma Gun | 4 / 3+ / 4/6 (std) | 4 / 3+ / 5/6 ❌ | Piercing 1 | 无 ❌ |
| Fists | 4 / 3+ / 3/4 | 3 / 3+ / 3/4 ❌ | - | - |

**问题**：
- Plasma Gun 普通伤害错（5 应为 4）
- Fists ATK 错（3 应为 4）
- 缺少武器规则

**官方实际武器**（更多选项）：
- Bolt Pistol
- Flamer
- Meltagun
- Plasma Gun (standard/supercharge)
- Fists

### 9. Icon Bearer

| 武器 | 官方 ATK/HIT/DMG | 分支 ATK/HIT/DMG | 官方规则 | 分支规则 |
|------|------------------|------------------|----------|----------|
| Boltgun | 4 / 3+ / 3/4 | 4 / 3+ / 3/4 ✓ | - | - ✓ |
| Fists | 4 / 3+ / 3/4 | 3 / 3+ / 3/4 ❌ | - | - |

**问题**：
- Fists ATK 错（3 应为 4）

**官方实际武器**（更多选项）：
- Bolt Pistol
- Boltgun
- Chainsword
- Fists

### 10. Warrior

| 武器 | 官方 ATK/HIT/DMG | 分支 ATK/HIT/DMG | 官方规则 | 分支规则 |
|------|------------------|------------------|----------|----------|
| Boltgun | 4 / 3+ / 3/4 | 4 / 3+ / 3/4 ✓ | - | - ✓ |
| Fists | 4 / 3+ / 3/4 | 3 / 3+ / 3/4 ❌ | - | - |

**问题**：
- Fists ATK 错（3 应为 4）

**官方实际武器**（更多选项）：
- Bolt Pistol
- Boltgun
- Chainsword
- Fists

---

## 三、特殊能力

### 官方有但分支完全缺失的特殊能力：

1. **Aspiring Champion** - "In the Eyes of the Gods": 击杀敌人后 APL +1
2. **Chosen** - "Daemonic Aura": 阻止敌人撤退  
   **Chosen** - "Soul Gorge": 击杀后恢复 D3+1 伤口
3. **Anointed** - "Unleash Daemon": 每战一次，获得减伤 + 武器增强
4. **Balefire Acolyte** - "Siphon Life*": 武器规则，治疗友军
5. **Butcher** - "Devastating Onslaught": 敌人无法协助近战 + 免费冲锋
6. **Icon Bearer** - "Icon Bearer": 控制标记时 APL +1  
   **Icon Bearer** - "Favoured of the Dark Gods": 控制目标获得 CP
7. **Shrivetalon** - "Vicious Reflexes": 反击时先手  
   **Shrivetalon** - "Horrifying Dismemberment": 击杀后降低敌人 APL  
   **Shrivetalon** - "Grisly Mark": 放置标记影响敌人
8. **Warrior** - "Infernal Pact": 每战一次特殊能力

---

## 四、武器选项

### 问题：分支武器选择过少

官方每个特工通常有 **4-7 种武器选项**，分支只给了 **2 种**。

**示例对比**：

| 特工 | 官方武器数 | 分支武器数 | 缺失武器 |
|------|------------|------------|----------|
| Aspiring Champion | 7 | 2 | Tainted Bolt Pistol, Power Maul, Power Weapon, Tainted Chainsword |
| Chosen | 4 | 2 | Tainted Bolt Pistol, Plasma Pistol (supercharge) |
| Balefire Acolyte | 4 | 2 | Bolt Pistol, Fireblast, Life Siphon |
| Gunner | 6 | 2 | Bolt Pistol, Flamer, Meltagun, Plasma Gun (supercharge) |
| Heavy Gunner | 8 | 2 | Bolt Pistol, Heavy Bolter, Missile Launcher, Reaper Chaincannon (sweeping) |
| Icon Bearer | 4 | 2 | Bolt Pistol, Chainsword |
| Warrior | 4 | 2 | Bolt Pistol, Chainsword |

---

---

## 五、当前 main 分支对比

当前 `main` 分支的 `LEG_TEMPLATES`（`src/js/constants.js:135-187`）与官方数据差异**更为严重**：

### 特工名称完全不匹配

| 官方特工 | 当前 main 分支 | 状态 |
|----------|----------------|------|
| Aspiring Champion | Chaos Lord (混沌领主) | ❌ 名称虚构 |
| Chosen | Dark Apostate (暗黑使徒) | ❌ 名称虚构 |
| Anointed | — | ❌ 缺失 |
| Balefire Acolyte | — | ❌ 缺失 |
| Butcher | — | ❌ 缺失 |
| Gunner | Legionary Gunner (军团火力手) | ⚠️ 名称不同 |
| Heavy Gunner | Legionary Heavy Gunner (军团重武器手) | ⚠️ 名称不同 |
| Icon Bearer | — | ❌ 缺失 |
| Shrivetalon | — | ❌ 缺失 |
| Warrior | Legionary Trooper (军团步兵) | ⚠️ 名称不同 |

**额外虚构特工**：
- Legionary Champion (军团搏斗士) — 官方无此单位
- Legionary Berserker (军团狂战士) — 官方无此单位

### 基础属性对比

| 特工 | 官方 Wounds | main Wounds | 官方 Move | main Move | 官方 Save | main Save |
|------|-------------|-------------|-----------|-----------|-----------|-----------|
| Chaos Lord | 15 | 15 ✓ | 6" | 6 ✓ | 3+ | 3 ✓ |
| Dark Apostate | 15 | 15 ✓ | 6" | 6 ✓ | 3+ | 3 ✓ |
| Legionary Gunner | 14 | 14 ✓ | 6" | 6 ✓ | 3+ | 3 ✓ |
| Legionary Champion | 14 | 14 ✓ | 6" | 6 ✓ | 3+ | 3 ✓ |
| Legionary Heavy Gunner | 14 | **16** ❌ | 6" | **5** ❌ | 3+ | 3 ✓ |
| Legionary Berserker | 14 | 14 ✓ | 6" | 6 ✓ | 3+ | 3 ✓ |
| Legionary Trooper | 14 | 14 ✓ | 6" | 6 ✓ | 3+ | 3 ✓ |

### 武器数据对比

#### Chaos Lord（官方无此单位，无法对比）
```
当前: Bolt Pistol 4/3/3/4, Power Sword 5/3/5/6 ['Severe']
```

#### Dark Apostate（官方无此单位，无法对比）
```
当前: Crozius Arcanum 5/3/4/5 ['Brutal', 'Shock']
```

#### Legionary Gunner（对应官方 Gunner）
| 武器 | 官方 ATK/HIT/DMG | main ATK/HIT/DMG | 官方规则 | main 规则 |
|------|------------------|------------------|----------|-----------|
| Plasma Gun (std) | 4/3+/4/6 | — | Piercing 1 | — |
| Havoc Launcher | 无此武器 | 4/3/4/5 | - | Saturate, Severe ❌ |
| Fists | 4/3+/3/4 | 4/3/3/4 ✓ | - | - ✓ |

**问题**：虚构了 "Havoc Launcher" 武器，缺少官方武器选项

#### Legionary Champion（官方无此单位）
```
当前: Boltgun 4/3/3/4, Power Fist 4/3/5/7 ['Brutal']
```
**问题**：Power Fist ATK 错（4 应为 5）

#### Legionary Heavy Gunner（对应官方 Heavy Gunner）
| 武器 | 官方 ATK/HIT/DMG | main ATK/HIT/DMG | 官方规则 | main 规则 |
|------|------------------|------------------|----------|-----------|
| Reaper Chaincannon (focused) | 5/3+/3/4 | — | Ceaseless, Heavy, Punishing | — |
| Reaper Autocannon | 无此武器 | 5/3/3/4 | - | Piercing Crits 1 ❌ |
| Fists | 4/3+/3/4 | 4/3/3/4 ✓ | - | - ✓ |

**问题**：虚构了 "Reaper Autocannon"，属性也有错误

#### Legionary Berserker（官方无此单位）
```
当前: Bolt Pistol 4/3/3/4 [Range 8], Chainaxe 5/3/4/5 ['Brutal', 'Severe']
```

#### Legionary Trooper（对应官方 Warrior）
| 武器 | 官方 ATK/HIT/DMG | main ATK/HIT/DMG | 官方规则 | main 规则 |
|------|------------------|------------------|----------|-----------|
| Boltgun | 4/3+/3/4 | 4/3/3/4 ✓ | - | - ✓ |
| Chainsword | 5/3+/4/5 | 5/3/4/5 ✓ | - | - ✓ |

**问题**：数值正确，但缺少武器选项（官方还有 Bolt Pistol）

---

## 六、两分支对比总结

| 问题类型 | feature/dynamic-factions | main (当前) |
|----------|--------------------------|-------------|
| 特工名称正确 | ✓ 10/10 全部正确 | ❌ 仅 3/10 匹配 |
| 特工数量正确 | ✓ 10 个 | ❌ 仅 7 个 |
| Wounds 正确 | ❌ 全部偏低 | ⚠️ 大部分正确，Heavy Gunner 错 |
| Move 设置 | ❌ 未显式设置 | ✓ 已设置 |
| 武器数值正确 | ❌ 多处错误 | ❌ 虚构武器 + 部分错误 |
| 武器规则完整 | ❌ 全部缺失 | ⚠️ 部分有 |
| 武器选项完整 | ❌ 每单位 2 种 | ❌ 每单位 2 种 |
| 特殊能力实现 | ❌ 全部缺失 | ❌ 全部缺失 |

### 结论

**feature/dynamic-factions 分支**：
- ✓ 特工名称和数量正确
- ❌ 数值错误多，武器规则缺失

**main 分支（当前）**：
- ❌ 特工名称虚构严重（7 个单位中有 4 个是虚构的）
- ⚠️ 部分数值正确，但基于错误的单位
- ⚠️ 武器规则部分实现

**两个分支都不符合官方数据**，需要基于官方文档重新创建完整的 Legionary 模板。

---

## 七、总结

### 正确的部分 ✓
- 10 个特工名称全部正确
- APL 全部正确（统一为 3）

### 错误的部分 ❌

**基础属性**：
1. Wounds 全部偏低（Leader -3，其他 -2）
2. Move 未显式设置
3. Save 格式需要确认

**武器数值**：
1. Plasma Pistol (Aspiring Champion) - HIT 和 DMG 都错
2. Daemon Blade (Chosen) - 暴击伤害错
3. Malign Strike (Balefire Acolyte) - 虚构武器
4. Fell Daggers (Balefire Acolyte) - ATK 和 DMG 错
5. Flensing Blades (Shrivetalon) - DMG 错
6. Double-handed Chainaxe (Butcher) - DMG 错
7. Reaper Chaincannon (Heavy Gunner) - ATK 错
8. Fists (多个特工) - ATK 错
9. Plasma Gun (Gunner) - DMG 错

**武器规则**：
- 所有武器都缺少规则（Piercing, Rending, Lethal, Brutal, Shock, PSYCHIC, Range 等）

**武器选项**：
- 每个特工只有 2 种武器，官方有 4-8 种

**特殊能力**：
- 完全缺失所有特工的特殊能力

---

## 八、修复状态

### ✓ 已完成 (2026-06-14)

**main 分支 `LEG_TEMPLATES` 已完全重写**：

1. ✓ **特工名称和数量**：修正为官方 10 个特工
   - 2 Leader: Aspiring Champion, Chosen
   - 8 Operator: Anointed, Balefire Acolyte, Butcher, Gunner, Heavy Gunner, Icon Bearer, Shrivetalon, Warrior

2. ✓ **基础属性**：全部按官方数据修正
   - Leader Wounds: 15
   - Operator Wounds: 14
   - Move: 全部 6"
   - Save: 3+
   - APL: 3

3. ✓ **武器数值**：全部按官方数据修正
   - ATK/HIT/DMG 全部正确
   - Range 已设置

4. ✓ **武器规则**：全部添加
   - Piercing 1, Lethal 5+, Brutal, Rending, PSYCHIC, Ceaseless, Heavy, Punishing 等

5. ✓ **武器选项**：每个特工列出完整武器列表（注释中）
   - 默认装备 2 把武器
   - 其他选项在注释中列出供参考

### ⏳ 待实现

**特殊能力**（需要在游戏规则系统中实现）：

1. **Aspiring Champion** - In the Eyes of the Gods
2. **Chosen** - Daemonic Aura, Soul Gorge
3. **Anointed** - Unleash Daemon
4. **Balefire Acolyte** - Siphon Life (武器规则)
5. **Butcher** - Devastating Onslaught
6. **Icon Bearer** - Icon Bearer, Favoured of the Dark Gods
7. **Shrivetalon** - Vicious Reflexes, Horrifying Dismemberment, Grisly Mark
8. **Warrior** - Infernal Pact

**武器变体**：
- Plasma Pistol/Gun 有 standard/supercharge 两种模式
- Heavy Bolter, Missile Launcher, Reaper Chaincannon 有多种弹药类型
- 需要在 UI 中支持武器模式切换

**头像资源**：
- 需要为 10 个特工创建/获取对应的头像图片
- 当前路径: `./assets/images/operatives/leg/leg_*.png`
