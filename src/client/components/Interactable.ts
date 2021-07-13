import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import Log from "@rbxts/log";
import Translator from "client/utility/Translate";
import { Pickupable } from "./Pickupable";
import { StructureSlot } from "./StructureSlot";

const components = Dependency<Components>();

type InteractableTrigger = "StructureSlot" | "Pickupable";

interface Attributes {
	trigger: InteractableTrigger;
	canInteract: boolean;
}

@Component({
	tag: "Interactable",
})
export class Interactable extends BaseComponent<Attributes> implements OnStart {
	onStart() {
		const proximityPrompt = new Instance("ProximityPrompt");
		proximityPrompt.KeyboardKeyCode = Enum.KeyCode.E;
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
		} else if (this.instance.IsA("Tool")) {
			const handle = this.instance.FindFirstChild("Handle");

			if (handle) {
				proximityPrompt.Parent = handle;
			}
		} else {
			proximityPrompt.Parent = this.instance;
		}

		this.maid.GiveTask(
			proximityPrompt.Triggered.Connect(() => {
				if (this.attributes.trigger === "StructureSlot") {
					const structureSlot = components.getComponent<StructureSlot>(this.instance);
					structureSlot.trigger();
				} else if (this.attributes.trigger === "Pickupable") {
					const pickupable = components.getComponent<Pickupable>(this.instance);
					pickupable.trigger();
				}
			}),
		);

		proximityPrompt.ActionText = Translator.formatByKey(`Interactable.${this.attributes.trigger}.ActionText`);
		proximityPrompt.ObjectText = this.instance.Name;

		this.onAttributeChanged("canInteract", (newValue) => {
			proximityPrompt.Enabled = newValue;
		});
	}
}
