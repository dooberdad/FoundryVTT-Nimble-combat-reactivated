import './scss/main.scss';

import canvasInit from './hooks/canvasInit.js';
import init from './hooks/init.js';
import i18nInit from './hooks/i18nInit.js';
import setup from './hooks/setup.js';
import ready from './hooks/ready.js';
import renderChatMessageHTML from './hooks/renderChatMessage.js';
import renderNimbleTokenHUD from './hooks/renderNimbleTokenHUD.js';

import { hotbarDrop } from './hooks/hotBarDrop.ts';

// ⭐ NEW — import our barebones Combat implementation
import { NimbleCombat } from './nimble-combat';

/** ----------------------------------- */
//                Hooks
/** ----------------------------------- */
Hooks.once('init', init);
Hooks.once('setup', setup);
Hooks.once('ready', ready);
Hooks.once('i18nInit', i18nInit);

Hooks.on('canvasInit', canvasInit);
Hooks.on('renderChatMessageHTML', renderChatMessageHTML);
Hooks.on('renderNimbleTokenHUD', renderNimbleTokenHUD);

Hooks.on('hotbarDrop', hotbarDrop);

// ⭐ NEW — register barebones combat support
Hooks.once('init', () => {
  // @ts-ignore
  CONFIG.Combat ??= {};
  // @ts-ignore
  CONFIG.Combat.documentClass = NimbleCombat;

  // @ts-ignore
  CONFIG.ui ??= {};
  // @ts-ignore
  CONFIG.ui.combat = CombatTracker;

  // Optional: default initiative config
  // @ts-ignore
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  console.log("Nimble | Barebones combat support registered");
});
