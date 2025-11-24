/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SpeedHeroesActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['speedheroes', 'sheet', 'actor'],
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

	/** @override */
	get template() {
		return `systems/speedheroes/templates/actor/${this.actor.type}-sheet.hbs`;
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

	/** @override */
	async getData() {
		// Retrieve the data structure from the base sheet. You can inspect or log
		// the context variable to see the structure, but some key properties for
		// sheets are the actor object, the data object, whether or not it's
		// editable, the items array, and the effects array.
		const context = super.getData();

		// Use a safe clone of the actor data for further operations.
		const actorData = this.document.toObject(false);

		// Add the actor's data to context.data for easier access, as well as flags.
		context.system = actorData.system;
		context.flags = actorData.flags;

		// Adding a pointer to CONFIG.BOILERPLATE
		context.config = CONFIG.BOILERPLATE;

		// Prepare character data and items.
		if (actorData.type == 'character') {
			this._prepareItems(context);
			this._prepareCharacterData(context);
		}

		// Prepare NPC data and items.
		if (actorData.type == 'npc') {
			this._prepareItems(context);
		}

		// Enrich biography info for display
		// Enrichment turns text like `[[/r 1d20]]` into buttons
		context.enrichedBiography = await TextEditor.enrichHTML(
			this.actor.system.biography,
			{
				// Whether to show secret blocks in the finished html
				secrets: this.document.isOwner,
				// Necessary in v11, can be removed in v12
				async: true,
				// Data to fill in for inline rolls
				rollData: this.actor.getRollData(),
				// Relative UUID resolution
				relativeTo: this.actor,
			}
		);

		return context;
	}

	/**
	 * Character-specific context modifications
	 *
	 * @param {object} context The context object to mutate
	 */
	_prepareCharacterData(context) {
		// This is where you can enrich character-specific editor fields
		// or setup anything else that's specific to this type
	}

	/**
	 * Organize and classify Items for Actor sheets.
	 *
	 * @param {object} context The context object to mutate
	 */
	_prepareItems(context) {

	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html,options) {
		super.activateListeners(html,options);

		// Render the item sheet for viewing/editing prior to the editable check.
		
		const editButtons = html.querySelector('.item-edit');
		if (editButtons) {
			editButtons.addEventListener('click', (ev) => {
				const li = $(ev.currentTarget).parents('.item');
				const item = this.actor.items.get(li.data('itemId'));
				item.sheet.render(true);
			});
		}

		// -------------------------------------------------------------
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Add Inventory Item
		html.on('click', '.item-create', this._onItemCreate.bind(this));

		// Delete Inventory Item
		html.on('click', '.item-delete', (ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			item.delete();
			li.slideUp(200, () => this.render(false));
		});

		// Active Effect management
		html.on('click', '.effect-control', (ev) => {
			const row = ev.currentTarget.closest('li');
			const document =
				row.dataset.parentId === this.actor.id
					? this.actor
					: this.actor.items.get(row.dataset.parentId);
			onManageActiveEffect(ev, document);
		});


		// Drag events for macros.
		if (this.actor.isOwner) {
			let handler = (ev) => this._onDragStart(ev);
			html.find('li.item').each((i, li) => {
				if (li.classList.contains('inventory-header')) return;
				li.setAttribute('draggable', true);
				li.addEventListener('dragstart', handler, false);
			});
		}
	}

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
	
	
	
	static get DEFAULT_OPTIONS() {
		return foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
			// ... (your existing options)
			template: template(),
			tag: "form", // Still need this for automatic form handling
			form: {
				handler: this._onSubmitForm,
				submitOnChange: true,
			}
		});
	}

	// You can now remove your custom _renderHTML and _replaceHTML overrides.
	// The mixin provides the concrete implementations of these methods.

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);
		// ... your custom button listeners ...
	}

	/** @override */
	async _updateObject(event, formData) {
		return this.document.update(formData);
	}
}
