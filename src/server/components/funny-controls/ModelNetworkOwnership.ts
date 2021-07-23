import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import { RunService } from "@rbxts/services";
import { getControlSlotConnection } from "server/modules/getControlSlotConnectionServer";
import { IdService } from "server/services/IdService";
import { waitForTagAdded } from "shared/utility/WaitForTagAdded";
import { StructureSlot } from "../StructureSlot";

const components = Dependency<Components>();

interface Attributes {}

@Component({
	tag: "ModelNetworkOwnership",
})
export class ModelNetworkOwnership extends BaseComponent<Attributes, BasePart> implements OnStart {
	onStart() {
		waitForTagAdded(this.instance, "StructureSlot").then(() => {
			RunService.Heartbeat.Wait();

			const slot = components.getComponent<StructureSlot>(this.instance);

			getControlSlotConnection({
				instance: this.instance,
				maid: this.maid,
				slot: slot,
				activatedCallback: (player) => {
					this.instance.SetNetworkOwner(player);

					const parent = this.instance.Parent;
					if (parent) {
						for (const child of parent?.GetChildren()) {
							if (child.IsA("BasePart") && !child.Anchored) {
								child.SetNetworkOwner(player);
							}
						}
					}
				},
				deactivatedCallback: () => {
					this.instance.SetNetworkOwner(undefined);

					const parent = this.instance.Parent;
					if (parent) {
						for (const child of parent?.GetChildren()) {
							if (child.IsA("BasePart") && !child.Anchored) {
								child.SetNetworkOwner(undefined);
							}
						}
					}
				},
			});
		});
	}
}
