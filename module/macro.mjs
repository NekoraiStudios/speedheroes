/**
 * Attempt to create a macro from the dropped data. Will use an existing macro if one exists.
 * @param {object} dropData     The dropped data
 * @param {number} slot         The hotbar slot to use
 * @returns {Promise}
 */
export async function createSpeedHeroesMacro(dropData, slot) {
	const macroData = { type: "script", scope: "actor" };
	switch ( dropData.type ) {
		case "Actor":
			const actor = await fromUuid(dropData.uuid);
			if ( !actor ) {
				ui.notifications.warn("Actor macro failed", { localize: false });
				return null;
			}
			foundry.utils.mergeObject(macroData, {
				name: `Perform Roll: ${actor.name}`,
				img: actor.img,
				command: `SpeedHeroes.macro.rollPerformance("${actor._id}");`,
				flags: {}
			});
			break;
		default:
			return;
	}

	// Assign the macro to the hotbar
	const macro = game.macros.find(m => {
			return (m.name === macroData.name) && (m.command === macroData.command) && m.isAuthor;
		}) || await Macro.create(macroData);
	game.user.assignHotbarMacro(macro, slot);

	// Prevent the default Foundry VTT drop handling
	return false;
}

export function rollPerformance(actorId){
	game.actors.get(actorId).rollPerformance();
}

