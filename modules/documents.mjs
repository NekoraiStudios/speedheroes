export class SystemActor extends Actor {
	async applyDamage(damage) {
		// Always take a minimum of 1 damage, and round to the nearest integer.
		damage = Math.round(Math.max(1, damage));

		// Update the health.
		const { value } = this.system.resources.resistance;
		await this.update({ "system.resources.resistance.value": value - damage });

		// Log a message.
		await ChatMessage.implementation.create({
			content: `${this.name} took ${damage} damage!`
		});
	}

	prepareDerivedData() {
		super.prepareDerivedData();
		// Clamp health within the appropriate range.
		const { resistance } = this.system.resources.resistance;
		resistance.value = Math.clamp(resistance.value, resistance.min, resistance.max);
	}
}

export class SystemItem extends Item {
	prepareDerivedData() {
		super.prepareDerivedData();
	}
}