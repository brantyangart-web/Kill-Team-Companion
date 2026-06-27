import re

with open('src/js/combat.js', 'r', encoding='utf-8') as f:
    js = f.read()

target = "const actualDamage = defender.applyWounds(dmgPerAttack, manualDrRolls);"
replacement = "const actualDamage = defender.applyWounds(dmgPerAttack, wizardState.mode === 'manual' ? manualDrRolls : wizardState.drRolls);"

if target in js:
    js = js.replace(target, replacement)
    print("Replaced applyWounds call successfully.")
else:
    print("Could not find the target string. Using regex fallback...")
    pattern = r"const actualDamage = defender\.applyWounds\(dmgPerAttack,\s*manualDrRolls\);"
    if re.search(pattern, js):
        js = re.sub(pattern, replacement, js)
        print("Replaced via regex.")
    else:
        print("Failed to replace!")

with open('src/js/combat.js', 'w', encoding='utf-8') as f:
    f.write(js)
