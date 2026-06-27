import { confirmShootResult } from './src/js/combat.js';
import { wizardState, gameState } from './src/js/state.js';
import { Operative } from './src/js/models.js';

global.document = {
  getElementById: (id) => ({ style: {}, appendChild: () => {}, innerHTML: '' }),
  createElement: () => ({ style: {}, appendChild: () => {}, innerHTML: '' }),
  body: { appendChild: () => {} }
};
global.window = {};

const attacker = new Operative({ name: 'A', factionId: 'space_marines', weapons: [] });
const defender = new Operative({ name: 'B', factionId: 'plague_marines', weapons: [] });

wizardState.attacker = attacker;
wizardState.defender = defender;
wizardState.weapon = { name: 'Gun', ts: 3, rules: [] };
wizardState.attackRolls = [6, 4];
wizardState.mode = 'auto';

try {
  console.log("Calling confirmShootResult...");
  confirmShootResult([4, 3]);
  console.log("Success!");
} catch (e) {
  console.error("ERROR:", e);
}
