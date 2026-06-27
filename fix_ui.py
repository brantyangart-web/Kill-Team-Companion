import re

with open('src/js/ui.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add auto-end logic to updateActivePanel
auto_end_logic = """export function updateActivePanel() {
  if (gameState.activeAgent && gameState.activeAgent.isDead) {
    const deadOp = gameState.activeAgent;
    addLog(`[阵亡] ${deadOp.name} 已阵亡，自动结束激活。`);
    endActivation();
    return;
  }"""

js = js.replace("export function updateActivePanel() {", auto_end_logic)

# 2. Add || op.isDead to all action buttons to be safe
js = re.sub(r"(document\.getElementById\('action-move'\)\.disabled = [^\n;]+);", r"\1 || op.isDead;", js)
js = re.sub(r"(document\.getElementById\('action-charge'\)\.disabled = [^\n;]+);", r"\1 || op.isDead;", js)
js = re.sub(r"(document\.getElementById\('action-advance'\)\.disabled = [^\n;]+);", r"\1 || op.isDead;", js)
js = re.sub(r"(document\.getElementById\('action-dash'\)\.disabled = [^\n;]+);", r"\1 || op.isDead;", js)
js = re.sub(r"(document\.getElementById\('action-fallback'\)\.disabled = [^\n;]+);", r"\1 || op.isDead;", js)
js = re.sub(r"(document\.getElementById\('action-shoot'\)\.disabled = [^\n;]+);", r"\1 || op.isDead;", js)
js = re.sub(r"(document\.getElementById\('action-fight'\)\.disabled = [^\n;]+);", r"\1 || op.isDead;", js)

with open('src/js/ui.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("ui.js updated for Bugs 2 and 3.")
