import { SystemActor, SystemItem } from "./module/documents.mjs";
import { VehiculeDataModel, PilotDataModel, TechDataModel } from "./module/data-models.mjs";
import { VehiculeActorSheet } from "./sheet/vehicule.mjs";
import { PilotActorSheet } from "./sheet/pilot.mjs";
import { SpeedHeroesBaseDice } from "./module/speedHeroesBaseDice.mjs";


Hooks.once("init", () => {
	// Configure custom Document implementations.
	CONFIG.Actor.documentClass = SystemActor;
	CONFIG.Item.documentClass = SystemItem;

	// Configure System Data Models.
	CONFIG.Actor.dataModels = {
		vehicule: VehiculeDataModel,
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
				"system.maneuverability",
				"system.power",
				"system.robustness",
				"system.resistance"
			],
			value: []
		}
	};

});