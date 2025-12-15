export class SpeedHeroesBaseDice extends foundry.dice.terms.Die {
	constructor(termData) {
		termData.faces = 12;
		super(termData);
	}

	/* -------------------------------------------- */

	/** @override */
	static DENOMINATION = 'b';

	/** @override */
	static SERIALIZE_ATTRIBUTES = [...super.SERIALIZE_ATTRIBUTES, 'flavor'];
	
	/** @override */
	get total() {
		return this.results.length;
	}
	
	/** @override */
	async evaluate({minimize=false, maximize=false, attributes=['maneuverability','power','robustness','tech']} = {}) {
		// Call the parent evaluate method first, which populates this.results
		await super.evaluate({minimize, maximize});

		// Loop through the results array and inject your custom data into each result object
		this.results = this.results.map((result, index) => {
			// result looks like {result: 7, active: true}

			// Return a new object that merges the existing result data with your custom data
			return {
				...result,
				// Inject your custom data field here
				attribute: attributes[index]
			};
		});

		return this;
	}
	
	/* -------------------------------------------- */

	/** @override 
	getResultLabel(result) {
		return {
			1: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_empty.png' />",
			2: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_empty.png' />",
			3: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_!.png' />",
			4: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_!.png' />",
			5: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_1-1.png' />",
			6: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_0-1.png' />",
			7: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_2-2.png' />",
			8: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_0-2.png' />",
			9: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_2-3.png' />",
			10: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_1-3.png' />",
			11: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_0-3.png' />",
			12: "<img src='systems/speedheroes/ui/dice/SpeedHeroes_0-3.png' />",
		}[result.result];
	}*/
	
	/** @override */
	getResultLabel(result) {
		return {
			1: "",
			2: "",
			3: "!",
			4: "!",
			5: "★",
			6: "☆",
			7: "★★",
			8: "☆☆",
			9: "★★☆",
			10: "★☆☆",
			11: "☆☆☆",
			12: "☆☆☆",
		}[result.result];
	}
	
	/** @override */
	getResultCSS(result) {
		return [
			this.constructor.name.toLowerCase(),
			`${result.result}`,
			`${result.attribute}`,
		];
	}
}