import { CollectionService } from "@rbxts/services";

export async function waitForTagAdded(instance: Instance, tag: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (CollectionService.HasTag(instance, tag)) {
			resolve();
		}

		const connection = CollectionService.GetInstanceAddedSignal(tag).Connect((addedInstance) => {
			if (addedInstance === instance) {
				if (connection) {
					connection.Disconnect();
				}
				resolve();
			}
		});

		Promise.delay(3).then(() => {
			if (connection) {
				connection.Disconnect();

				reject(`waitForTagAdded for ${tag} timed out after 5 seconds`);
			}
		});
	});
}
