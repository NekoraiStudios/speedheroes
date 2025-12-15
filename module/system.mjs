export class system 
{
	static async createSystemMacro(data, slot) {
		// Check the type of data being dropped (e.g., item, actor, journal entry)
		if (data.type !== "Actor") return; // Only handle Actor drops

		// Get the item document using its UUID
		const actor = await fromUuid(data.uuid);
		if (!actor) return;

		// Define the macro command as a script
		// This command calls a function you define within your system's codebase
		const command = `SpeedHeroes.system.rollPerformance("${actor._id}");`;

		// Create the Macro document
		let macro = game.macros.find(m => m.name === `Roll ${actor.name}`);
		if (!macro) {
			macro = await Macro.create({
				name: `Roll ${actor.name}`,
				type: "script",
				img: actor.img || "icons/svg/dice-target.svg",
				command: command
			});
		}

		// Assign the macro to the hotbar slot
		game.user.assignHotbarMacro(macro, slot);

		// Prevent the default Foundry VTT drop handling
		return false;
	};

	static rollPerformance(actorId){
		game.actors.get(actorId).rollPerformance();
	}
}
