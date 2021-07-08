import { Component, BaseComponent, OnStart, Components, Dependency, Flamework } from "@rbxts/flamework";
import { Constructor } from "@rbxts/flamework/out/types";
import Log from "@rbxts/log";
import { StructureSlot } from "./StructureSlot";

const components = Dependency<Components>();

interface Attributes {
	trigger: "StructureSlot";
}

@Component({
	tag: "Interactable",
})
export class Interactable extends BaseComponent<Attributes> implements OnStart {
	onStart() {
		const proximityPrompt = new Instance("ProximityPrompt");
		proximityPrompt.KeyboardKeyCode = Enum.KeyCode.E;
		proximityPrompt.ActionText = "Interact";
		proximityPrompt.Exclusivity = Enum.ProximityPromptExclusivity.OneGlobally;
		this.maid.GiveTask(proximityPrompt);

		if (this.instance.IsA("Model")) {
			if (this.instance.PrimaryPart) {
				const attachment = this.instance.PrimaryPart.FindFirstChildOfClass("Attachment");
				if (attachment) {
					proximityPrompt.Parent = attachment;
				} else {
					proximityPrompt.Parent = this.instance.PrimaryPart;
				}
			} else {
				Log.Error("{Name}'s instance of Interactable does not have a PrimaryPart", this.instance);
			}
		} else {
			proximityPrompt.Parent = this.instance;
		}

		this.maid.GiveTask(
			proximityPrompt.Triggered.Connect(() => {
				if (this.attributes.trigger === "StructureSlot") {
					const structureSlot = components.getComponent<StructureSlot>(this.instance);
					structureSlot.trigger();
				}
			}),
		);
	}
}
