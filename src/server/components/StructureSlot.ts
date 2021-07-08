import { Component, BaseComponent, OnStart, Dependency, Components } from "@rbxts/flamework";
import { CollectionService } from "@rbxts/services";
import { Structure } from "./Structure";

const components = Dependency<Components>();

interface Attributes {
	occupied: boolean;
}

/**
 * A slot that dummies or players can occupy in a structure
 */
@Component({
	tag: "StructureSlot",
})
export class StructureSlot extends BaseComponent<Attributes> implements OnStart {
	occupiedBy?: ObjectValue;
	structure?: Instance;

	onStart() {
		this.occupiedBy = new Instance("ObjectValue");
		this.occupiedBy.Parent = this.instance;
		this.maid.GiveTask(this.occupiedBy);

		this.maid.GiveTask(
			this.occupiedBy.Changed.Connect((value) => {
				this.instance.SetAttribute("occupied", value !== undefined);
			}),
		);

		//recurse parents until finding something with the Structure tag
		let last = this.instance;
		while (!CollectionService.HasTag(last, "Structure") && last.Parent) {
			last = last.Parent;
		}
		this.structure = last;

		this.onAttributeChanged("occupied", (newValue) => {
			const structure = components.getComponent<Structure>(this.structure!);
			structure.setSlotState(this.instance, newValue);
		});
	}

	/**
	 * @returns whatever is occupying this slot
	 */
	getOccupier() {
		return this.occupiedBy?.Value;
	}
}
