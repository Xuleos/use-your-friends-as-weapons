import { Service, OnStart, OnInit, Components, Dependency } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { CollectionService, Players } from "@rbxts/services";
import { CanOccupySlot } from "server/components/CanOccupySlot";
import { RandomId } from "server/components/RandomId";

const components = Dependency<Components>();

@Service({})
export class OccupierService implements OnStart {
	onStart() {
		Players.PlayerAdded.Connect((player) => {
			CollectionService.AddTag(player, "RandomId");
			CollectionService.AddTag(player, "CanOccupySlot");
		});
	}
}
