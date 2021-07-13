import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";
import { Interactable } from "./Interactable";

const components = Dependency<Components>();

interface Attributes {}

const pickupItem = Remotes.Client.Get(RemoteId.pickupItem);

@Component({
	tag: "Pickupable",
})
export class Pickupable extends BaseComponent<Attributes, Tool & { Handle: BasePart }> implements OnStart {
	onStart() {
		const char = this.instance.Parent;
		if (char?.FindFirstChildOfClass("Humanoid")) {
			this.setInteractable(false);
		}

		this.maid.GiveTask(
			this.instance.Equipped.Connect(() => {
				Log.Debug("Pickupable item equipped");
				this.setInteractable(false);
			}),
		);

		this.maid.GiveTask(
			this.instance.Unequipped.Connect(() => {
				this.setInteractable(true);
			}),
		);
	}

	private setInteractable(toggle: boolean) {
		const interactable = components.getComponent<Interactable>(this.instance);

		if (interactable.attributes.trigger === "Pickupable") {
			this.instance.SetAttribute("canInteract", toggle);
		}
	}

	trigger() {
		pickupItem.SendToServer(this.instance);
	}
}
