import re

with open('src/js/combat.js', 'r', encoding='utf-8') as f:
    js = f.read()

# First fix: remove Torrent block in nextModalStep
torrent_block = """      // Torrent: 自动获得全部普通命中
      const torrentMatch = wizardState.weapon.rules.find(r => r.startsWith('Torrent'));
      if (torrentMatch) {
        const torrentHits = parseInt(torrentMatch.match(/\d+/)?.[0] || wizardState.weapon.attacks);
        wizardState.attackRolls = [];
        wizardState.attackCrit = 0;
        wizardState.attackNorm = torrentHits;
        if (showToast) showToast(`武器带有 洪流 (Torrent): 自动获得 ${torrentHits} 个普通命中。`, 'info');
        wizardState.step = 5; // 直接跳到防守方投掷
        renderShootStep();
        return;
      }"""

js_new = js.replace(torrent_block, "")
if js_new != js:
    print("Successfully removed Torrent auto-hit block.")
else:
    print("Could not find Torrent auto-hit block exactly. Let's try a softer replace.")
    # let's try finding it via regex that ignores exact whitespace and Chinese characters
    pattern = r"\s*// Torrent[^\n]*\n\s*const torrentMatch = wizardState\.weapon\.rules\.find\(r => r\.startsWith\('Torrent'\)\);\n\s*if \(torrentMatch\) \{[\s\S]*?renderShootStep\(\);\n\s*return;\n\s*\}"
    js_new = re.sub(pattern, "", js)
    if js_new != js:
        print("Successfully removed Torrent auto-hit block via regex.")
    else:
        print("Still failed to remove Torrent block.")

with open('src/js/combat.js', 'w', encoding='utf-8') as f:
    f.write(js_new)
