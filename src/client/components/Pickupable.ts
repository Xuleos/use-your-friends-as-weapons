import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";
import { waitForTagAdded } from "shared/utility/WaitForTagAdded";
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
			this.instance.AncestryChanged.Connect(() => {
				if (this.instance.Parent === Workspace) {
					this.setInteractable(true);
				} else {
					this.setInteractable(false);
				}
			}),
		);

		this.maid.GiveTask(
			Players.LocalPlayer.GetAttributeChangedSignal("occupying").Connect(() => {
				this.setInteractable(Players.LocalPlayer.GetAttribute("occupying") === undefined);
			}),
		);

		this.maid.GiveTask(
			Players.LocalPlayer.GetAttributeChangedSignal("holding").Connect(() => {
				this.setInteractable(Players.LocalPlayer.GetAttribute("holding") === undefined);
			}),
		);

		waitForTagAdded(this.instance, "CanOccupySlot")
			.then(() => {
				this.maid.GiveTask(
					this.instance.GetAttributeChangedSignal("occupying").Connect(() => {
						this.setInteractable(this.instance.GetAttribute("occupying") === undefined);
					}),
				);
			})
			.catch(() => {
				//lol
			});
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
