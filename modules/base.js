import { SystemActor, SystemItem } from "modules/documents.mjs";
import { VehiculeDataModel, PilotDataModel, TechDataModel } from "modules/data-models.mjs";

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