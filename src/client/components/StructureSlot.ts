import { Component, BaseComponent, Components, Dependency, OnStart } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { Players } from "@rbxts/services";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";
import { HoldingSlot } from "./HoldingSlot";
import { Interactable } from "./Interactable";

const components = Dependency<Components>();

const interactWithStructureSlot = Remotes.Client.Get(RemoteId.interactWithStructureSlot);

interface Attributes {
	occupiedBy?: string;
}

@Component({
	tag: "StructureSlot",
})
export class StructureSlot extends BaseComponent<Attributes> implements OnStart {
	onStart() {
		this.onAttributeChanged("occupiedBy", (newValue) => {
			this.setInteractable(newValue === undefined);
		});

		Players.LocalPlayer.GetAttributeChangedSignal("holding").Connect(() => {
			this.setInteractable(Players.LocalPlayer.GetAttribute("holding") === undefined);
		});
	}

	trigger() {
		Log.Debug("yeah triggered i guess");
		interactWithStructureSlot.SendToServer(this.instance);
	}

	private setInteractable(toggle: boolean) {
		const interactable = components.getComponent<Interactable>(this.instance);

		if (interactable.attributes.trigger === "StructureSlot") {
			this.instance.SetAttribute("canInteract", toggle);
		}
	}
}
