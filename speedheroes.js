import { SystemActor, SystemItem } from "./module/documents.mjs";
import { VehiculeDataModel, PilotDataModel, TechDataModel } from "./module/data-models.mjs";
import { VehiculeActorSheet } from "./sheet/vehicule.mjs";
import { PilotActorSheet } from "./sheet/pilot.mjs";


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
	
	foundry.documents.collections.Actors.registerSheet('speedheroes', VehiculeActorSheet, {
		types: ['vehicule'],
		makeDefault: true,
		label: 'SPEEDHEROES.SheetLabels.Vehicule',
	});
	foundry.documents.collections.Actors.registerSheet('speedheroes', PilotActorSheet, {
			types: ['pilot'],
			makeDefault: true,
			label: 'SPEEDHEROES.SheetLabels.Pilot',
		});
	
	foundry.applications.handlebars.loadTemplates([
		"systems/speedheroes/templates/actor/parts/actor-equipment.hbs",
		"systems/speedheroes/templates/actor/parts/actor-pilot.hbs",
		"systems/speedheroes/templates/actor/parts/active-effects.hbs"
	]);


	// Configure trackable attributes. Exemple from web site for other setting
	
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