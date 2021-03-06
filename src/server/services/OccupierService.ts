import { OnStart, Service } from "@flamework/core";
import { CollectionService, Players } from "@rbxts/services";

@Service({})
export class OccupierService implements OnStart {
	onStart() {
		Players.PlayerAdded.Connect((player) => {
			CollectionService.AddTag(player, "RandomId");
			CollectionService.AddTag(player, "CanOccupySlot");
		});
	}
}
