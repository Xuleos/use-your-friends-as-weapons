import { Component, BaseComponent, OnStart, Dependency, Components } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { CollectionService, Players } from "@rbxts/services";
import { validateTree } from "@rbxts/validate-tree";
import { CharacterRigR15 } from "@rbxts/yield-for-character";
import { IdService } from "server/services/IdService";
import Joint from "shared/utility/Joint";
import { StructureSlot } from "./StructureSlot";

const components = Dependency<Components>();
const idService = Dependency<IdService>();

interface Attributes {
	occupying?: string;
}

@Component({
	tag: "CanOccupySlot",
})
export class CanOccupySlot extends BaseComponent<Attributes, Player | Model> implements OnStart {
	onStart() {
		this.onAttributeChanged("occupying", (newValue, oldValue) => {
			if (newValue === oldValue) {
				return;
			}

			if (newValue !== undefined) {
				const slot = idService.getInstanceFromId(newValue);
				if (!slot) {
					return;
				}

				const structureSlot = components.getComponent<StructureSlot>(slot);
				const slotCF = structureSlot.getCFrame();

				if (!slotCF) {
					return;
				}

				if (this.instance.IsA("Model")) {
					const humanoid = this.instance.FindFirstChildOfClass("Humanoid");
					if (humanoid) {
						humanoid.PlatformStand = true;
					}

					if (this.instance.PrimaryPart) {
						this.instance.SetPrimaryPartCFrame(slotCF);
						Joint.weld(structureSlot.instance, this.instance.PrimaryPart, "Weld");
					}
				} else if (this.instance.IsA("Player") && this.instance.Character) {
					const char = this.instance.Character;
					if (validateTree(char, CharacterRigR15)) {
						char.SetPrimaryPartCFrame(slotCF);
						Joint.weld(char.HumanoidRootPart, structureSlot.instance, "Weld", char);

						char.HumanoidRootPart.Massless = true;
						char.Humanoid.PlatformStand = true;
					}
				}
			}
		});

		if (this.instance.IsA("Player")) {
			this.instance.CharacterRemoving.Connect(() => {
				if (this.attributes.occupying !== undefined) {
					const slot = idService.getInstanceFromId(this.attributes.occupying);
					if (!slot) {
						return;
					}

					const structureSlot = components.getComponent<StructureSlot>(slot);
					structureSlot.setOccupier(undefined);
				}
			});
		}
	}

	setOccupying(slot?: Instance) {
		if (slot === undefined) {
			this.instance.SetAttribute("occupying", undefined);
			return;
		}

		if (!CollectionService.HasTag(slot, "StructureSlot")) {
			Log.Warn("Something other than a structure slot cannot be occupied");
			return;
		}

		const id = idService.getIdFromInstance(slot);

		if (id !== undefined) {
			this.instance.SetAttribute("occupying", id);
		} else {
			Log.Error("Id found in setOccupying of CanOccupySlot is undefined");
		}
	}
}
