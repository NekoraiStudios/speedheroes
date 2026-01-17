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
		let label = 'Perform roll-out' + '<br/>';
		let roll = new foundry.dice.Roll("1db[maneuverability]+1db[power]+1db[robustness]");
		roll = await roll.evaluate();
		
		label+= this.outputHTML('maneuverability',game.i18n.format('SPEEDHEROES.maneuverability.short'), this.system.maneuverability.value,this.system.maneuverability.tmpstar,roll.terms[0].results[0].result);
		label+= this.outputHTML('power', game.i18n.format('SPEEDHEROES.power.short'), this.system.power.value,this.system.power.tmpstar,roll.terms[2].results[0].result);
		label+= this.outputHTML('robustness', game.i18n.format('SPEEDHEROES.robustness.short'), this.system.robustness.value,this.system.robustness.tmpstar,roll.terms[4].results[0].result);
		
		let message = roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this }),
			flavor: label,
		},{rollMode: game.settings.get('core', 'rollMode')});
		return message;
	}
	
	async rollTech(){
		let label = 'Perform tech' + '<br/>';
		let roll = new foundry.dice.Roll("1db[tech]");
		roll = await roll.evaluate();
		label+= this.outputHTML('tech',game.i18n.format('SPEEDHEROES.tech.short'), this.system.energize.value,this.system.energize.tmpstar,roll.terms[0].results[0].result);
		let message = roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this }),
			flavor: label,
		},{rollMode: game.settings.get('core', 'rollMode')});
		return message;
	}
	
	async rollAbilityCheck(ability) {
		let label = ability ?? '';
		let roll = new foundry.dice.Roll("1db["+ability+"]");
		roll = await roll.evaluate()
		label+= '<br/>' +this.outputHTML(ability,game.i18n.format('SPEEDHEROES.'+ability+'.short'), this?.system[ability]?.value,this?.system[ability]?.tmpstar,roll.terms[0].results[0].result);
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
		let nb_fill_star = '&nbsp;';
		switch (diceResult) {
			case 1:
			case 2:
				if (baseStat >= 4) {
					nb_fill_star = '★★★';
				}
				break;
			case 3:
			case 4:
				nb_fill_star = "!";
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
	
	outputHTML(css,attr,baseStat,modifier,result) {
		let label = '<div class="ability-result '+css+'"><p class="attribute">'+attr+'</p><p class="result">'+ this.calculateResultStar(baseStat+modifier,result) + '</p><p class="modifier">';
		if (modifier != 0) {
			label += (modifier > 0) ? '(sup)' : '(inf)' ;
		} else {
			label += '&nbsp;';
		}
		label += "</p></div>";
		return label
	}
}

export class SystemItem extends Item {
	prepareDerivedData() {
		super.prepareDerivedData();
	}
}
