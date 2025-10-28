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

	prepareDerivedData() {
		super.prepareDerivedData();
		console.log(this.system);
		// Clamp health within the appropriate range.
//		const { resistance } = this.system.resistance;
//		resistance.value = Math.clamp(resistance.value, resistance.min, resistance.max);
	}
}

export class SystemItem extends Item {
	prepareDerivedData() {
		super.prepareDerivedData();
	}
}