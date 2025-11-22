// nimble-combat.ts

/**
 * Barebones Nimble combat document.
 * This hooks Nimble into Foundry's core Combat system:
 *  - Shows the Combat Tracker tab
 *  - Allows rolling initiative
 *  - Supports turn/round order
 */

export class NimbleCombat extends Combat {
  /**
   * Override rollInitiative to plug into Nimble actor data if desired.
   * For now, this uses:
   *   1d20 + (actor.system.attributes.initiative ?? 0)
   * with a fallback to plain 1d20.
   */
  async rollInitiative(
    ids: string | string[],
    {
      formula = null,
      updateTurn = true,
      messageOptions = {}
    }: { formula?: string | null; updateTurn?: boolean; messageOptions?: any } = {}
  ): Promise<this> {
    const idArray = Array.isArray(ids) ? ids : [ids];
    const updates: any[] = [];

    for (const id of idArray) {
      const combatant = this.combatants.get(id);
      if (!combatant) continue;

      const actor = combatant.actor;

      const initBonus =
        (actor as any)?.system?.attributes?.initiative ??
        (actor as any)?.system?.attributes?.init ??
        0;

      const usedFormula = formula || `1d20 + ${initBonus}`;

      const roll = await (new Roll(usedFormula, (actor as any)?.system ?? {})).roll({ async: true });

      updates.push({
        _id: id,
        initiative: roll.total
      });

      if ((messageOptions as any)?.create !== false) {
        roll.toMessage({
          speaker: ChatMessage.getSpeaker({ actor }),
          flavor: `${actor?.name ?? combatant.name} rolls initiative`,
          ...messageOptions
        });
      }
    }

    if (!updates.length) return this;

    await this.updateEmbeddedDocuments("Combatant", updates);

    if (updateTurn) {
      this.turn = this.turns.findIndex(t => idArray.includes(t.id!));
    }

    return this;
  }
}
