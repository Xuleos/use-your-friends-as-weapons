import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { CollectionService, Workspace } from "@rbxts/services";
import { IdService } from "server/services/IdService";

const components = Dependency<Components>();
const idService = Dependency<IdService>();

interface Attributes {
	holding?: string;
}

/**
 * Not to be confused with StructureSlot.
 * This is used for keeping track of held tools
 */
@Component({
	tag: "HoldingSlot",
})
export class HoldingSlot extends BaseComponent<Attributes, Player> implements OnStart {
	onStart() {
		this.onAttributeChanged("holding", (newValue, oldValue) => {
			if (newValue !== undefined) {
				const instance = idService.getInstanceFromId(newValue);

				if (instance) {
					instance.Parent = this.instance.Character;
				}
			} else if (oldValue !== undefined) {
				const instance = idService.getInstanceFromId(oldValue);

				if (instance) {
					instance.Parent = Workspace;
				}
			}
		});

		this.maid.GiveTask(
			this.instance.CharacterRemoving.Connect(() => {
				if (this.attributes.holding !== undefined) {
					const instance = idService.getInstanceFromId(this.attributes.holding);

					if (instance) {
						instance.Parent = Workspace;
					}

					this.instance.SetAttribute("holding", undefined);
				}
			}),
		);
	}

	equip(tool?: Tool) {
		if (tool === undefined) {
			this.instance.SetAttribute("holding", undefined);

			return;
		}

		if (tool.Parent !== Workspace) {
			return;
		}

		if (this.attributes.holding !== undefined) {
			return;
		}

		if (!CollectionService.HasTag(tool, "Pickupable")) {
			Log.Warn("A tool that can not be picked up cannot be equipped");
			return;
		}

		const id = idService.getIdFromInstance(tool);

		if (id !== undefined) {
			this.instance.SetAttribute("holding", id);
		} else {
			Log.Error("Id found in equip of HoldingSlot is undefined");
		}
	}
}
