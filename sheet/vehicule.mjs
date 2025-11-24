/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets; // Access the base class here

export class SpeedHeroesActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
	static get DEFAULT_OPTIONS() {
		return foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
			classes: ['speedheroes', 'sheet', 'actor'],
			tag: "form",
			form: {
				handler: this._onSubmitForm,
				submitOnChange: true,
			},
			width: 600,
			height: 600,
			tabs: [
				{
					navSelector: '.sheet-tabs',
					contentSelector: '.sheet-body',
					initial: 'techs',
				},
			],
		});
	}
	/**
	 * Prepare the context for the sheet.
	 * @override
	 */
	async _prepareContext(options) {
		
		// Call your existing getData method logic to populate the context
		const context = await super._prepareContext(options);
		
		context.tech = context.document.items.filter(item => item.type === "tech");
		/*
		if (context.document.system.description) {
			context.enrichedDescription = await foundry.applications.ux.TextEditor.enrichHTML(
				context.document.system.description,
				{
					async: true, // Required in v13 for asynchronous enrichment
					rollData: context.document.getRollData(),
					relativeTo: context.document,
				}
			);
		}*/
		console.log(context);
		return context;
	}

	/** @override */
	get template() {
		const type = this.document?.type || 'vehicule'; // Fallback type
		console.log(type)
		return `systems/speedheroes/templates/actor/test-sheet.hbs`;
	}

	/** @override */
	activateListeners(html) { 
		super.activateListeners(html);
	}

	/**
	 * This method is called upon form submission after form data is validated.
	 * @param {Event} event The initial triggering submission event.
	 * @param {object} formData The object of validated form data with which to update the document.
	 * @returns {Promise<Document>} A Promise which resolves once the update operation has completed.
	 */
	async _updateObject(event, formData) {
		// formData is already flattened (e.g., { "system.attributes.str.value": 10 })

		// Apply the data to the document using the document's built-in update method
		return this.document.update(formData);
	}
	

	/* -------------------------------------------- */

	
	/**
	 *	Handle events
	 * 	@param {Event} event	 The originating click event
	 * @private
	 */
	_onEvent(event) {
		console.log(event);
		switch (event.target.dataset.action) {
			case 'rollAbility':
				this._onRollAbility(event.target.dataset.ability);
				break;
		}
		event.preventDefault();
	}
	/**
	 * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
	 * @param {Event} event	 The originating click event
	 * @private
	 */
	async _onItemCreate(event) {
		event.preventDefault();
		const header = event.currentTarget;
		// Get the type of item to create.
		const type = header.dataset.type;
		// Grab any data associated with this control.
		const data = duplicate(header.dataset);
		// Initialize a default name.
		const name = `New ${type.capitalize()}`;
		// Prepare the item object.
		const itemData = {
			name: name,
			type: type,
			system: data,
		};
		// Remove the type from the dataset since it's in the itemData.type prop.
		delete itemData.system['type'];

		// Finally, create the item!
		return await Item.create(itemData, { parent: this.actor });
	}

	/**
	 * Handle clickable rolls.
	 * @param {Event} event	 The originating click event
	 * @private
	 */
	static onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;

		// Handle item rolls.
		if (dataset.rollType) {
			switch (dataset.rollType) {
				case "item":
					const itemId = element.closest('.item').dataset.itemId;
					const item = this.actor.items.get(itemId);
					if (item) return item.roll();
				case "main":
					let label = 'Perform roll';
					let roll = new Roll("3d12", this.actor.getRollData());
					let message = roll.toMessage({
						speaker: ChatMessage.getSpeaker({ actor: this.actor }),
						flavor: label,
					},{create:false,rollMode: game.settings.get('core', 'rollMode')});
					return message;
			}
		}

		// Handle rolls that supply the formula directly.
		if (dataset.roll) {
			let label = dataset.label ? `[ability] ${dataset.label}` : '';
			let roll = new Roll(dataset.roll, this.actor.getRollData());
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
				rollMode: game.settings.get('core', 'rollMode'),
			});
			return roll;
		}
	}
}
