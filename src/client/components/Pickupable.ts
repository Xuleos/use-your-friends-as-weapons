import { Component, BaseComponent } from "@rbxts/flamework";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";

interface Attributes {}

const pickupItem = Remotes.Client.Get(RemoteId.pickupItem);

@Component({
	tag: "Pickupable",
})
export class Pickupable extends BaseComponent<Attributes, Tool & { Handle: BasePart }> {
	trigger() {
		pickupItem.SendToServer(this.instance);
	}
}
