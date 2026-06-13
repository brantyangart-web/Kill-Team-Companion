const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Replace standard faction checks
content = content.replace(/faction === 'Space Marine'/g, "faction === gameState.factionA");
content = content.replace(/faction === 'Plague Marine'/g, "faction === gameState.factionB");
content = content.replace(/nextFaction === 'Space Marine'/g, "nextFaction === gameState.factionA");
content = content.replace(/nextFaction === 'Plague Marine'/g, "nextFaction === gameState.factionB");
content = content.replace(/winner === 'Space Marine'/g, "winner === gameState.factionA");
content = content.replace(/winner === 'Plague Marine'/g, "winner === gameState.factionB");

// Replace arrays/objects lookups
content = content.replace(/aliveCounts\['Space Marine'\]/g, "aliveCounts[gameState.factionA]");
content = content.replace(/aliveCounts\['Plague Marine'\]/g, "aliveCounts[gameState.factionB]");

// Replace nested attacker/defender checks
content = content.replace(/\.faction === 'Space Marine'/g, ".faction === gameState.factionA");
content = content.replace(/\.faction === 'Plague Marine'/g, ".faction === gameState.factionB");

// Handle specific logic cases
content = content.replace(/const factions = \['Space Marine', 'Plague Marine'\];/g, "const factions = [gameState.factionA, gameState.factionB];");

content = content.replace(/hasUsableOperatives\('Space Marine'\)/g, "hasUsableOperatives(gameState.factionA)");
content = content.replace(/hasUsableOperatives\('Plague Marine'\)/g, "hasUsableOperatives(gameState.factionB)");

content = content.replace(/selectTurnOrder\('Space Marine'\)/g, "selectTurnOrder(gameState.factionA)");
content = content.replace(/selectTurnOrder\('Plague Marine'\)/g, "selectTurnOrder(gameState.factionB)");

fs.writeFileSync('index.html', content, 'utf8');
console.log('Replacements completed successfully.');
