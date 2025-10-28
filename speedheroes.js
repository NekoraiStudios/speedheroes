import { SystemActor, SystemItem } from "./module/documents.mjs";
import { VehiculeDataModel, PilotDataModel, TechDataModel } from "./module/data-models.mjs";
import { SpeedHeroesActorSheet } from "./sheets/vehicule.mjs";

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
	
	Actors.registerSheet('vehicule', SpeedHeroesActorSheet, {
	  makeDefault: true,
	  label: 'SPEEDHEROES.SheetLabels.Actor',
	});

	// Configure trackable attributes. Exemple from web site for other setting
	/*
	CONFIG.Actor.trackableAttributes = {
		hero: {
			bar: ["resources.health", "resources.power", "goodness"],
			value: ["progress"]
		},
		pawn: {
			bar: ["resources.health", "resources.power"],
			value: []
		}
	};
	*/
});