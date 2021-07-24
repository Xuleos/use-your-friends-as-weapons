import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { CollectionService } from "@rbxts/services";
import { $dbg } from "rbxts-transform-debug";
import { IdService } from "server/services/IdService";
import { StructureSlot } from "./StructureSlot";

const components = Dependency<Components>();
const idService = Dependency<IdService>();

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
			this.setSlotState(descendant, descendant.GetAttribute("occupiedBy") !== undefined);
		}
	}

	setSlotState(slot: Instance, state: boolean) {
		this.slots.set(slot, state);

		let completed = true;
		for (const [_, isOccupied] of this.slots) {
			if (!isOccupied) {
				completed = false;
				break;
			}
		}

		this.instance.SetAttribute("completed", completed);
	}

	isCompleted() {
		return this.attributes.completed;
	}

	getCharactersOccupying() {
		const characters: Array<Model> = [];

		for (const [slot, _] of this.slots) {
			const structureSlot = components.getComponent<StructureSlot>(slot);

			const id = structureSlot.getOccupier();

			if (id !== undefined) {
				const instance = idService.getInstanceFromId(id);

				$dbg(instance);
				$dbg(instance?.IsA("Player"));

				if (instance && instance.IsA("Player") && instance.Character) {
					characters.push(instance.Character);
				}
			} else {
				Log.Warn("oops");
			}
		}

		$dbg(characters.size());

		return characters;
	}
}
