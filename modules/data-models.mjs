const {HTMLField, SchemaField, NumberField, StringField, FilePathField, EmbeddedDocumentField} = foundry.data.fields;

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
				min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				max: new NumberField({ required: true, integer: true, min: 0, initial: 3 })
			}),
			power: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				max: new NumberField({ required: true, integer: true, min: 0, initial: 3 })
			}),
			robustness: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				max: new NumberField({ required: true, integer: true, min: 0, initial: 3 })
			}),
			resistance: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				max: new NumberField({ required: true, integer: true, min: 0, initial: 3 })
			}),
			pilot: new EmbeddedDocumentField(PilotDataModel),
			tech: new EmbeddedDocumentField(TechDataModel)
		}
	}
}

export class PilotDataModel extends ActorDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			composure: new SchemaField({
				value: new NumberField({ required: true, integer: true, min: 0, initial: 3 }),
				min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
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
			aspect:  new StringField({
				required: false,
				blank: true,
				options: ["maneuverability", "power", "robustness"],
				initial: ""
			}),
		};
	}
}
