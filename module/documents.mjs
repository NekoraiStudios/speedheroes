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
}

export class SystemItem extends Item {
	prepareDerivedData() {
		super.prepareDerivedData();
	}
}
