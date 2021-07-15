import { Dependency } from "@rbxts/flamework";
import { ModelNetworkOwnership } from "server/components/funny-controls/ModelNetworkOwnership";
import { StructureSlot } from "server/components/StructureSlot";
import { IdService } from "server/services/IdService";

const idService = Dependency<IdService>();

export function getControlSlotConnection(params: {
	instance: Instance;
	maid: ModelNetworkOwnership["maid"];
	slot: StructureSlot;
	activatedCallback: (player: Player) => void;
	deactivatedCallback: () => void;
}) {
	if (params.slot.structure) {
		params.maid.GiveTask(
			params.slot.structure.GetAttributeChangedSignal("completed").Connect(() => {
				if (params.slot.structure?.GetAttribute("completed") === true) {
					const occupier = params.slot.getOccupier();

					if (occupier !== undefined) {
						const player = idService.getInstanceFromId(occupier);

						if (player && player.IsA("Player")) {
							params.activatedCallback(player);
						} else {
							params.deactivatedCallback();
						}
					} else {
						params.deactivatedCallback();
					}
				} else {
					params.deactivatedCallback();
				}
			}),
		);
	}
}
