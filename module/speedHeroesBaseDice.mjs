export class SpeedHeroesBaseDice extends foundry.dice.terms.Die {
	constructor(termData) {
		termData.faces = 12;
		super(termData);
	}

	/* -------------------------------------------- */

	/** @override */
	static DENOMINATION = 'b';

	/** @override */
	get total() {
		return this.results.length;
	}

	/* -------------------------------------------- */

	/** @override */
	getResultLabel(result) {
		return {
			1: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_empty.png" />',
			2: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_empty.png" />',
			3: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_!.png" />',
			4: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_!.png" />',
			5: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_1-1.png" />',
			6: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_0-1.png" />',
			7: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_2-2.png" />',
			8: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_0-2.png" />',
			9: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_2-3.png" />',
			10: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_1-3.png" />',
			11: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_0-3.png" />',
			12: '<img src="systems/speedheroes/ui/dice/SpeedHeroes_0-3.png" />',
		}[result.result];
	}
	
	/** @override */
	getResultCSS(result) {
		return [
			this.constructor.name.toLowerCase(),
			`${result.result}`,
		];
	}
}