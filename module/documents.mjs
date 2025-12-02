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
	
	rollAbilityCheck(ability) {
		let label = ability ?? '';
		let roll = new foundry.dice.Roll("3db",{nbStarNeeded: this.actor?.system[ability]?.value});
		roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label
			},{
				rollMode: game.settings.get('core', 'rollMode')
			}
		);
		console.log(roll);
		return roll;
	}
}

export class SystemItem extends Item {
	prepareDerivedData() {
		super.prepareDerivedData();
	}
}
