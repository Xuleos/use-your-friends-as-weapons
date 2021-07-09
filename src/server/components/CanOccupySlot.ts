import { Component, BaseComponent, OnStart, Dependency } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { CollectionService } from "@rbxts/services";
import { IdService } from "server/services/IdService";

const idService = Dependency<IdService>();

interface Attributes {
	occupying?: string;
}

@Component({
	tag: "CanOccupySlot",
})
export class CanOccupySlot extends BaseComponent<Attributes> implements OnStart {
	onStart() {}

	setOccupying(slot: Instance) {
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
