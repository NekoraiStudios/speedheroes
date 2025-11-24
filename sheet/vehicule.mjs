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
			template: "systems/speedheroes/templates/actor/vehicule-sheet.hbs",
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
		
		if (context.system.biography) {
			context.enrichedBiography = await foundry.applications.ux.TextEditor.enrichHTML(
				context.system.biography,
				{
					async: true, // Required in v13 for asynchronous enrichment
					rollData: context.document.getRollData(),
					relativeTo: context.document,
				}
			);
		}

		return context;
	}

	/** @override */
	async getTemplate() {
		return `systems/speedheroes/templates/actor/${this.actor.type}-sheet.hbs`;
	}

	/** @override */
	activateListeners(html) { 
		super.activateListeners(html);

		const editButtons = html.querySelector('.item-edit');
		if (editButtons) {
			editButtons.addEventListener('click', (ev) => {
				const li = ev.currentTarget.closest('.item'); 
				const item = this.actor.items.get(li.dataset.itemId);
				item.sheet.render(true);
			});
		}

		// -------------------------------------------------------------
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Corrected jQuery use to native event listeners or using the original jQuery object if preferred
		// Option 1 (Preferred V2 Native DOM API):
		html.querySelector('.item-create')?.addEventListener('click', this._onItemCreate.bind(this));

		// Delete Inventory Item
		html.addEventListener('click', (ev) => {
			if (!ev.target.closest('.item-delete')) return;

			const li = ev.target.closest('.item');
			const item = this.actor.items.get(li.dataset.itemId);
			item.delete();
			// Note: Native slideUp is more complex, you can keep jQuery for effects if necessary for now
			$(li).slideUp(200, () => this.render(false)); 
		});

		// Active Effect management
		html.addEventListener('click', (ev) => {
			if (!ev.target.closest('.effect-control')) return;

			const row = ev.target.closest('li');
			const document =
				row.dataset.parentId === this.actor.id
					? this.actor
					: this.actor.items.get(row.dataset.parentId);
			onManageActiveEffect(ev, document);
		});


		// Drag events for macros.
		if (this.actor.isOwner) {
			let handler = (ev) => this._onDragStart(ev);
			// Option 2: If you must use jQuery for selection/iteration
			$(html).find('li.item').each((i, li) => {
				if (li.classList.contains('inventory-header')) return;
				li.setAttribute('draggable', true);
				li.addEventListener('dragstart', handler, false);
			});
		}
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
