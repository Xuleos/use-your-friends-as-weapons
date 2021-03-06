import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { t } from "@rbxts/t";
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
	instanceGuard: t.union(
		t.intersection(
			t.instanceIsA("Tool"),
			t.children({
				Handle: t.instanceIsA("BasePart"),
			}),
		),
		t.instanceIsA("BasePart"),
	),
})
export class Interactable extends BaseComponent<Attributes> implements OnStart {
	onStart() {
		const proximityPrompt = new Instance("ProximityPrompt");
		proximityPrompt.KeyboardKeyCode = Enum.KeyCode.E;
		proximityPrompt.RequiresLineOfSight = false;
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
			} else {
				Log.Error("A handle could not be found to parent ProximityPrompt to");
			}
		} else {
			proximityPrompt.Parent = this.instance;
		}

		this.maid.GiveTask(
			proximityPrompt.Triggered.Connect(() => {
				if (this.attributes.trigger === "StructureSlot") {
					const structureSlot = components.getComponent<StructureSlot>(this.instance);
					structureSlot?.trigger();
				} else if (this.attributes.trigger === "Pickupable") {
					const pickupable = components.getComponent<Pickupable>(this.instance);
					pickupable?.trigger();
				}
			}),
		);

		this.onAttributeChanged("trigger", (trigger) => {
			proximityPrompt.ActionText = Translator.formatByKey(`Interactable.${trigger}.ActionText`);
			proximityPrompt.ObjectText = this.instance.Name;
		});

		this.onAttributeChanged("canInteract", (newValue) => {
			proximityPrompt.Enabled = newValue;
		});
	}
}
