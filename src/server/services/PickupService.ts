import { Components } from "@flamework/components";
import { Dependency, OnStart, Service } from "@flamework/core";
import { CollectionService, Players } from "@rbxts/services";
import { HoldingSlot } from "server/components/HoldingSlot";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";

@Service({})
export class PickupService implements OnStart {
	private pickupItem = Remotes.Server.Create(RemoteId.pickupItem);

	constructor(private components: Components) {}

	onStart() {
		this.pickupItem.Connect((player, tool) => {
			const holdingSlot = this.components.getComponent<HoldingSlot>(player);
			holdingSlot.equip(tool);
		});

		Players.PlayerAdded.Connect((player) => {
			CollectionService.AddTag(player, "HoldingSlot");
		});
	}
}
