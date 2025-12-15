import { SystemActor, SystemItem } from "./module/documents.mjs";
import { VehiculeDataModel, PilotDataModel, TechDataModel, NpcVehiculeDataModel } from "./module/data-models.mjs";
import { VehiculeActorSheet } from "./sheet/vehicule.mjs";
import { PilotActorSheet } from "./sheet/pilot.mjs";
import { SpeedHeroesBaseDice } from "./module/speedHeroesBaseDice.mjs";
import * as macro from "./module/macro.mjs";

globalThis.SpeedHeroes = {
	SystemActor,
	SystemItem,
	macro
};


Hooks.once("init", () => {
	globalThis.SpeedHeroes = game.SpeedHeroes = Object.assign(game.system, globalThis.SpeedHeroes);
	// Configure custom Document implementations.
	CONFIG.Actor.documentClass = SystemActor;
	CONFIG.Item.documentClass = SystemItem;

	// Configure System Data Models.
	CONFIG.Actor.dataModels = {
		vehicule: VehiculeDataModel,
		npcvehicule:NpcVehiculeDataModel,
		pilot: PilotDataModel
	};
	CONFIG.Item.dataModels = {
		tech: TechDataModel
	};
	
	// register vehicule sheet
	foundry.documents.collections.Actors.registerSheet('speedheroes', VehiculeActorSheet, {
		types: ['vehicule'],
		makeDefault: true,
		label: 'SPEEDHEROES.SheetLabels.Vehicule',
	});
	// register pilot sheet
	foundry.documents.collections.Actors.registerSheet('speedheroes', PilotActorSheet, {
		types: ['pilot'],
		makeDefault: true,
		label: 'SPEEDHEROES.SheetLabels.Pilot',
	});

	// Load partials templates in memory
	foundry.applications.handlebars.loadTemplates([
		"systems/speedheroes/templates/actor/parts/actor-equipment.hbs",
		"systems/speedheroes/templates/actor/parts/actor-pilot.hbs",
		"systems/speedheroes/templates/actor/parts/active-effects.hbs"
	]);

	// Configs
	CONFIG.Dice.rolls[0].CHAT_TEMPLATE = "systems/speedheroes/templates/chat/roll-message.hbs";
	CONFIG.Dice.rolls[0].TOOLTIP_TEMPLATE = "systems/speedheroes/templates/chat/roll-tooltip.hbs";
	CONFIG.Dice.terms['b'] = SpeedHeroesBaseDice;

	CONFIG.Actor.trackableAttributes = {
		vehicle: {
			bar: [
				"resistance",
				"superformance"
			],
			value: []
		}
	};

});

Hooks.once("ready", async () => {
	// Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
	Hooks.on("hotbarDrop", (bar, data, slot) => {
		if ( ["ActiveEffect", "Actor", "Item"].includes(data.type) ) {
			documents.macro.createSpeedHeroesMacro(data, slot);
			return false;
		}
	});
	const prototypeTokenOverrides = await game.settings.get("core","prototypeTokenOverrides");
	await game.settings.set(
		"core",
		"prototypeTokenOverrides",
		foundry.utils.mergeObject(prototypeTokenOverrides.toObject(), {
			vehicule: {
				disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL,
				actorLink: true,
				displayBars: CONST.TOKEN_DISPLAY_MODES.OWNER,
				bar1:{
					attribute:"resistance"
				},
				bar2:{
					attribute:"superformance"
				}
			},
			npcvehicule: {
				disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
				actorLink: false,
				bar1:{
					attribute:"resistance"
				},
				bar2:{
					attribute:"superformance"
				}
			}
		})
	)
});

Hooks.once('diceSoNiceReady', (dice3d) => {
	dice3d.addSystem({id:"speedheroes",name:"SpeedHeroes"},"preferred");
	dice3d.addDicePreset({
		type:"db",
		labels:[
			'systems/speedheroes/ui/dice/SpeedHeroes_empty.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_empty.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_!.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_!.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_1-1.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_0-1.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_2-2.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_0-2.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_2-3.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_1-3.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_0-3.png',
			'systems/speedheroes/ui/dice/SpeedHeroes_0-3.png',
		],
		system:"speedheroes"
	});
	dice3d.addColorset({
		name: 'maneuverability',
		description: 'Maneuverability',
		category: 'SpeedHeroes',
		foreground: '#000000',
		background: '#ff7b00',
		outline: 'none',
		texture: 'none'
	});
	dice3d.addColorset({
		name: 'power',
		description: 'Power',
		category: 'SpeedHeroes',
		foreground: '#000000',
		background: '#33cc33',
		outline: 'none',
		texture: 'none'
	});
	dice3d.addColorset({
		name: 'robustness',
		description: 'Robustness',
		category: 'SpeedHeroes',
		foreground: '#000000',
		background: '#e6e6e6',
		outline: 'none',
		texture: 'none'
	});
	dice3d.addColorset({
		name: 'tech',
		description: 'Astrotech',
		category: 'SpeedHeroes',
		foreground: '#000000',
		background: '#00b3ff',
		outline: 'none',
		texture: 'none'
	});

});