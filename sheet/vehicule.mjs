/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets; // Access the base class here

export class VehiculeActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
	constructor(object, options) {
		super(object, options)
	}
	
	static get DEFAULT_OPTIONS() {
		return foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
			classes: ['speedheroes', 'sheet', 'actor'],
			tag: "form",
			form: {
				handler: this.#onSubmitForm,
				submitOnChange: true,
				closeOnSubmit: false
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
			actions: {
				rollAbilityCheck: this.#rollAbilityCheck,
				onRoll: this.#onRoll,
				itemCreate: this.#onItemCreate,
				//itemDelete: this.#itemDelete
			 }
		});
	}
	/** @inheritDoc */
	static PARTS = {
		form: {
			template: `systems/speedheroes/templates/actor/vehicule-sheet.hbs`
		}
	}
	
	get document() {
		return this.options.document
	}

	get title() {
		return `${this.document.name}: ${game.i18n.localize('SPEEDHEROES.SheetVehicule')}`
	}
	
	/**
	 * Prepare the context for the sheet.
	 * @override
	 */
	async _prepareContext(options) {
		
		// Call your existing getData method logic to populate the context
		const context = await super._prepareContext(options);
		
		context.techs = context.document.items.filter(item => item.type === "tech");
		console.log(context.techs)
		
		context.system = context.document.system;
		
		context.actor = context.document
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
		context.tmpstarObj = {
			"1": "SPEEDHEROES.superiority.base",
			"0": "SPEEDHEROES.neutral.base",
			"-1": "SPEEDHEROES.inferiority.base",
		}
		return context;
	}

	
	/**
	 * handling data
	 */
	static async #onSubmitForm(event, form, formData) {
		console.log(formData)
		event.preventDefault()
		formData.object.name = formData.object.name ?? this.document.name; 
		formData.object.img = formData.object.img ?? this.document.img;
		await this.document.update(formData.object)
	}

	static async #rollAbilityCheck(event, target) {
		event.preventDefault()
		const ability = target.dataset.ability
		await this.actor.rollAbilityCheck(ability)
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
	static async #onItemCreate(event) {
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
	static async #onRoll(event) {
		event.preventDefault();
		const element = event.target;
		const dataset = element.dataset;

		// Handle item rolls.
		if (dataset.rolltype) {
			let label;
			let roll;
			let message;
			switch (dataset.rolltype) {
				case "item":
					const itemId = element.closest('.item').dataset.itemId;
					const item = this.actor.items.get(itemId);
					if (item) return item.roll();
				case "main":
					return this.actor.rollPerformance();
				case "tech":
					return this.actor.rollTech();
			}
		}

		// Handle rolls that supply the formula directly.
		if (dataset.roll) {
			let label = dataset.label ? `[ability] ${dataset.label}` : '';
			let roll = new foundry.dice.Roll(dataset.roll, this.documentgetRollData());
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.document }),
				flavor: label,
				rollMode: game.settings.get('core', 'rollMode'),
			});
			return roll;
		}
	}
	

	
	
}
