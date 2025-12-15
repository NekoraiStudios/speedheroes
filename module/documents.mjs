export class SystemActor extends Actor {
	async applyDamage(damage) {
			// Always take a minimum of 1 damage, and round to the nearest integer.
			damage = Math.round(Math.max(1, damage));

			// Update the health.
			const { value } = this.system.resistance;
			await this.update({ "system.resistance.value": value - damage });

			// Log a message.
			await ChatMessage.implementation.create({
				content: `${this.name} took ${damage} damage!`
			});
		}
		
	getRollData() {
		return {}
	}

	prepareDerivedData() {
		super.prepareDerivedData();
		const system = this.system;
		
		if (this.type == "vehicule" && system?.resistance) {
			system.hp = system.resistance
		}
		
	}
	
	async rollPerformance() {
		let label = 'Perform roll-out';
		let roll = new foundry.dice.Roll("1db[maneuverability]+1db[power]+1db[robustness]");
		roll = await roll.evaluate();
		label+= '<br/><span class="maneuverability">maneuverability: '+ this.calculateResultStar(
			this.system.maneuverability.value + this.system.maneuverability.tmpstar,
			roll.terms[0].results[0].result
		);
		if (this.system.maneuverability.tmpstar != 0) {
			label += ' modified by ' + this.system.maneuverability.tmpstar;
		}
		label += "</span>";
		label+= '<br/><span class="power">power: '+ this.calculateResultStar(
			this.system.power.value + this.system.power.tmpstar,
			roll.terms[2].results[0].result
		)
		if (this.system.power.tmpstar != 0) {
			label += ' modified by ' + this.system.power.tmpstar;
		}
		label += "</span>";
		label+= '<br/><span class="robustness">robustness: '+ this.calculateResultStar(
			this.system.robustness.value + this.system.robustness.tmpstar,
			roll.terms[4].results[0].result
		)
		if (this.system.robustness.tmpstar != 0) {
			label += ' modified by ' + this.system.robustness.tmpstar;
		}
		label += "</span>";
		let message = roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this }),
			flavor: label,
		},{rollMode: game.settings.get('core', 'rollMode')});
		return message;
	}
	
	async rollTech(){
		let label = 'Perform tech';
		let roll = new foundry.dice.Roll("1db[tech]");
		roll = await roll.evaluate();
		label+= '<br/><span class="tech">tech: '+ this.calculateResultStar(this.system.energize,roll.terms[0].results[0].result) + "</span>";
		let message = roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this }),
			flavor: label,
		},{rollMode: game.settings.get('core', 'rollMode')});
		return message;
	}
	
	async rollAbilityCheck(ability) {
		let label = ability ?? '';
		let roll = new foundry.dice.Roll("1db["+ability+"]");
		let baseStar = this?.system[ability]?.value + this?.system[ability]?.tmpstar;
		roll = await roll.evaluate()
		label+= '<span class="'+ability+'">'+ability+': '+ this.calculateResultStar(baseStar,roll.terms[0].results[0].result)
		if (this?.system[ability]?.tmpstar != 0) {
			label += ' modified by ' + this?.system[ability]?.tmpstar;
		}
		label += "</span>";
		roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this }),
				flavor: label
			},{
				rollMode: game.settings.get('core', 'rollMode')
			}
		);
		return roll;
	}
	
	calculateResultStar(baseStat,diceResult) {
		let nb_fill_star = '';
		switch (diceResult) {
			case 3:
			case 4:
				nb_fill_star = "!! Complications !!";
				break;
			case 5:
			case 6:
				if (diceResult == 5 || baseStat >= 1) {
					nb_fill_star = '★';
				}
				break;
			case 7:
			case 8:
				if (diceResult == 7 || baseStat >= 2) {
					nb_fill_star = '★★';
				}
				break;
			case 9:
			case 10:
			case 11:
			case 12:
				if ((diceResult == 9 && baseStat >= 1) || (diceResult == 10 && baseStat >= 2) || (diceResult >= 11 && baseStat >= 3)) {
					nb_fill_star = '★★★';
				}
				break;
		}
		return nb_fill_star;
	}
}

export class SystemItem extends Item {
	prepareDerivedData() {
		super.prepareDerivedData();
	}
}
