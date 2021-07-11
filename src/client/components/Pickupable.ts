import { Component, BaseComponent } from "@rbxts/flamework";
import Remotes from "shared/Remotes";

interface Attributes {}

const pickupItem = Remotes.Client.Get("pickupItem");

@Component({
	tag: "Pickupable",
})
export class Pickupable extends BaseComponent<Attributes, Tool & { Handle: BasePart }> {
	trigger() {
		pickupItem.SendToServer(this.instance);
	}
}
