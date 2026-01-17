const {BooleanField, HTMLField, SchemaField, NumberField, StringField, FilePathField, EmbeddedDocumentField} = foundry.data.fields;

class ActorDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		return {
			description: new HTMLField(),
			icon: new FilePathField({ required: false, categories: ["IMAGE"] })
		};
	}
}

export class VehiculeDataModel extends ActorDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			maneuverability: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				tmpstar: new NumberField({ required: false, integer: true, min: -3, max:3, initial: 0 }),
				complication: new BooleanField({ initial: false }),
			}), 
			power: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				tmpstar: new NumberField({ required: false, integer: true, min: -3, max:3, initial: 0 }),
				complication: new BooleanField({ initial: false }),
			}), 
			robustness: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				tmpstar: new NumberField({ required: false, integer: true, min: -3, max:3, initial: 0 }),
				complication: new BooleanField({ initial: false }),
			}),
			energize: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				tmpstar: new NumberField({ required: false, integer: true, min: -3, max:3, initial: 0 }),
				complication: new BooleanField({ initial: false }),
			}), 
			resistance: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
			}),
			superformance: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				max: new NumberField({ required: true, integer: true, min: 3, initial: 3 })
			}),
			pilot: new EmbeddedDocumentField(foundry.documents.BaseActor),
			tech: new EmbeddedDocumentField(foundry.documents.BaseItem)
		}
	}
}

export class NpcVehiculeDataModel extends VehiculeDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
		}
	}
}

export class PilotDataModel extends ActorDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			composure: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 3 }),
				max: new NumberField({ required: true, integer: true, min: 0, initial: 3 })
			})
		}
	}
}

class ItemDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		return {
			name: new HTMLField()
		};
	}
}

export class TechDataModel extends ItemDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			description: new HTMLField(),
			aspect: new StringField({
				required: false,
				blank: true,
				options: ["maneuverability", "power", "robustness"],
				initial: ""
			}),
		};
	}
}
