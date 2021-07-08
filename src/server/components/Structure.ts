import { Component, BaseComponent, OnStart } from "@rbxts/flamework";
import { CollectionService } from "@rbxts/services";

interface Attributes {
	/** true if all slots are occupied */
	completed: boolean;
}

/**
 * Base structure that players can become apart of.
 * This component won't do a whole lot on it's own probably
 */
@Component({
	tag: "Structure",
})
export class Structure extends BaseComponent<Attributes> implements OnStart {
	private slots = new Map<Instance, boolean>();

	onStart() {
		for (const descendant of this.instance.GetDescendants()) {
			this.checkDescendantForSlot(descendant);
		}

		this.maid.GiveTask(
			this.instance.DescendantAdded.Connect((descendant) => {
				this.checkDescendantForSlot(descendant);
			}),
		);

		this.maid.GiveTask(
			this.instance.DescendantRemoving.Connect((descendant) => {
				this.slots.delete(descendant);
			}),
		);
	}

	private checkDescendantForSlot(descendant: Instance) {
		if (CollectionService.HasTag(descendant, "StructureSlot")) {
			this.slots.set(descendant, descendant.GetAttribute("occupied") as boolean);
		}
	}

	setSlotState(slot: Instance, state: boolean) {
		this.slots.set(slot, state);
	}
}
