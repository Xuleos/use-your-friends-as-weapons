import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { CollectionService, Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { IdController } from "client/controllers/IdController";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";
import { Interactable } from "./Interactable";

const components = Dependency<Components>();
const idController = Dependency<IdController>();

const interactWithStructureSlot = Remotes.Client.Get(RemoteId.interactWithStructureSlot);

interface Attributes {
	occupiedBy?: string;
}

@Component({
	tag: "StructureSlot",
})
export class StructureSlot extends BaseComponent<Attributes> implements OnStart {
	structure?: Instance;

	onStart() {
		let last: Instance = this.instance;
		while (!CollectionService.HasTag(last, "Structure") && last.Parent) {
			last = last.Parent;
		}
		this.structure = last;

		this.onAttributeChanged("occupiedBy", (newValue) => {
			this.setInteractable(newValue === undefined);
		});

		this.maid.GiveTask(
			Players.LocalPlayer.GetAttributeChangedSignal("holding").Connect(() => {
				const id = Players.LocalPlayer.GetAttribute("holding");

				if (t.string(id)) {
					const instance = idController.getInstanceFromId(id);

					if (instance && CollectionService.HasTag(instance, "Dummy")) {
						if (this.attributes.occupiedBy === undefined) {
							this.setInteractable(true);
						}
					} else {
						this.setInteractable(false);
					}
				} else if (this.attributes.occupiedBy === undefined) {
					this.setInteractable(true);
				}
			}),
		);

		this.maid.GiveTask(
			Players.LocalPlayer.GetAttributeChangedSignal("occupying").Connect(() => {
				this.setInteractable(Players.LocalPlayer.GetAttribute("occupying") === undefined);
			}),
		);
	}

	trigger() {
		Log.Debug("yeah triggered i guess");
		interactWithStructureSlot.SendToServer(this.instance);
	}

	private setInteractable(toggle: boolean) {
		const interactable = components.getComponent<Interactable>(this.instance);

		if (interactable.attributes.trigger === "StructureSlot") {
			this.instance.SetAttribute("canInteract", toggle);
		} else {
			Log.Error("lol interactable's trigger is for something other than a StructureSlot");
		}
	}
}
