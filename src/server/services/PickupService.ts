import { Service, OnStart, Components, Dependency } from "@rbxts/flamework";
import { CollectionService, Players } from "@rbxts/services";
import { HoldingSlot } from "server/components/HoldingSlot";
import Remotes from "shared/Remotes";

const components = Dependency<Components>();

@Service({})
export class PickupService implements OnStart {
	private pickupItem = Remotes.Server.Create("pickupItem");

	onStart() {
		this.pickupItem.Connect((player, tool) => {
			const holdingSlot = components.getComponent<HoldingSlot>(player);
			holdingSlot.equip(tool);
		});

		Players.PlayerAdded.Connect((player) => {
			CollectionService.AddTag(player, "HoldingSlot");
		});
	}
}
