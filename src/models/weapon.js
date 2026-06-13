export class Weapon {
  /**
   * @param {Object} params
   * @param {string} params.name - Weapon name
   * @param {number} params.attacks - Attacks value (A), i.e., number of attack dice to roll
   * @param {number} params.bs - Ballistic Skill (BS), minimum target roll for a hit (e.g., 3 means 3+)
   * @param {number} params.normalDamage - Damage on a normal hit
   * @param {number} params.criticalDamage - Damage on a critical hit (rolling a 6)
   */
  constructor({ name, attacks, bs, normalDamage, criticalDamage }) {
    this.name = name;
    this.attacks = attacks;
    this.bs = bs;
    this.normalDamage = normalDamage;
    this.criticalDamage = criticalDamage;
  }
}
