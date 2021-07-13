import { Service, OnStart } from "@rbxts/flamework";
import { CollectionService, Players } from "@rbxts/services";

@Service({})
export class IgnoreRaycastsService implements OnStart {
	onStart() {
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((character) => {
				CollectionService.AddTag(character, "IgnoreRaycasts");
			});
		});
	}
}
