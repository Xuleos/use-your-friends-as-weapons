import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import { IdService } from "server/services/IdService";
import { StructureSlot } from "../StructureSlot";

const components = Dependency<Components>();
const idService = Dependency<IdService>();

interface Attributes {}

@Component({
	tag: "ModelNetworkOwnership",
})
export class ModelNetworkOwnership extends BaseComponent<Attributes, BasePart> implements OnStart {
	onStart() {
		const slot = components.getComponent<StructureSlot>(this.instance);

		if (slot.structure) {
			this.maid.GiveTask(
				slot.structure.GetAttributeChangedSignal("completed").Connect(() => {
					if (slot.structure?.GetAttribute("completed") === true) {
						const occupier = slot.getOccupier();
						if (occupier !== undefined) {
							const player = idService.getInstanceFromId(occupier);

							if (player && player.IsA("Player")) {
								this.instance.SetNetworkOwner(player);
							}
						}
					} else {
						this.instance.SetNetworkOwner(undefined);
					}
				}),
			);
		}
	}
}
