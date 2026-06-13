/**
 * Rolls a single D6.
 * @returns {number} Integer between 1 and 6.
 */
export function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Rolls a pool of D6 dice.
 * @param {number} count - Number of dice to roll.
 * @returns {number[]} Array of dice values sorted in descending order.
 */
export function rollDicePool(count) {
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollD6());
  }
  return rolls.sort((a, b) => b - a);
}

/**
 * Classifies attack D6 rolls into critical hits, normal hits, and misses.
 * @param {number[]} rolls - Dice roll values.
 * @param {number} bs - Ballistic Skill target (e.g. 3)
 * @returns {{criticals: number, normals: number, misses: number, rolls: number[]}}
 */
export function evaluateAttackRolls(rolls, bs) {
  let criticals = 0;
  let normals = 0;
  let misses = 0;

  for (const val of rolls) {
    if (val === 6) {
      criticals++;
    } else if (val >= bs) {
      normals++;
    } else {
      misses++;
    }
  }

  return { criticals, normals, misses, rolls };
}

/**
 * Classifies defense D6 rolls into critical saves, normal saves, and fails.
 * @param {number[]} rolls - Dice roll values.
 * @param {number} sv - Save target (e.g. 3)
 * @returns {{criticals: number, normals: number, fails: number, rolls: number[]}}
 */
export function evaluateDefenseRolls(rolls, sv) {
  let criticals = 0;
  let normals = 0;
  let fails = 0;

  for (const val of rolls) {
    if (val === 6) {
      criticals++;
    } else if (val >= sv) {
      normals++;
    } else {
      fails++;
    }
  }

  return { criticals, normals, fails, rolls };
}
