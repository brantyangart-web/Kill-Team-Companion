import re

with open('src/js/combat.js', 'r', encoding='utf-8') as f:
    js = f.read()

pattern = r"(\s*// Torrent:\s*[^\n]+\n\s*const torrentMatch = wizardState\.weapon\.rules\.find\(r => r\.startsWith\('Torrent'\)\);\n\s*if \(torrentMatch\) \{\n(?:[^\}]+)\}\n\s*\})"

match = re.search(pattern, js)
if match:
    print("Found the Torrent block!")
else:
    print("Torrent block not found exactly as expected.")

