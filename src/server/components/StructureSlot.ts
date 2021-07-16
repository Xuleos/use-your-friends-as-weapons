import { Component, BaseComponent, OnStart, Dependency, Components } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { CollectionService } from "@rbxts/services";
import { IdService } from "server/services/IdService";
import { CanOccupySlot } from "./CanOccupySlot";
import { Structure } from "./Structure";

const components = Dependency<Components>();
const idService = Dependency<IdService>();

interface Attributes {
	occupiedBy?: string;
}

/**
 * A slot that dummies or players can occupy in a structure
 */
@Component({
	tag: "StructureSlot",
})
export class StructureSlot extends BaseComponent<Attributes, BasePart> implements OnStart {
	structure?: Instance;

	onStart() {
		//recurse parents until finding something with the Structure tag
		let last: Instance = this.instance;
		while (!CollectionService.HasTag(last, "Structure") && last.Parent) {
			last = last.Parent;
		}
		this.structure = last;

		this.onAttributeChanged("occupiedBy", (newValue) => {
			const structure = components.getComponent<Structure>(this.structure!);
			structure.setSlotState(this.instance, newValue !== undefined);
		});
	}

	/**
	 * @returns whatever is occupying this slot
	 */
	getOccupier() {
		return this.attributes.occupiedBy;
	}

	setOccupier(occupier?: Player | Model) {
		if (occupier === undefined) {
			if (this.attributes.occupiedBy === undefined) {
				return;
			}

			const currentOccupying = idService.getInstanceFromId(this.attributes.occupiedBy);
			if (!currentOccupying) {
				Log.Warn("No id for currently occupying");
				return;
			}

			const canOccupySlot = components.getComponent<CanOccupySlot>(currentOccupying);
			canOccupySlot.setOccupying(undefined);

			this.instance.SetAttribute("occupiedBy", undefined);

			return;
		}

		if (this.attributes.occupiedBy !== undefined) {
			return;
		}

		const id = idService.getIdFromInstance(occupier);

		if (id !== undefined) {
			const canOccupySlot = components.getComponent<CanOccupySlot>(occupier);
			canOccupySlot.setOccupying(this.instance);

			this.instance.SetAttribute("occupiedBy", id);
		} else {
			Log.Error("Id for {Occupier} was undefined", occupier);
		}
	}

	getCFrame() {
		if (this.instance.IsA("Model")) {
			return this.instance.GetPrimaryPartCFrame();
		} else if (this.instance.IsA("Part")) {
			return this.instance.CFrame;
		} else if (this.instance.IsA("Attachment")) {
			return this.instance.WorldCFrame;
		}
	}
}
