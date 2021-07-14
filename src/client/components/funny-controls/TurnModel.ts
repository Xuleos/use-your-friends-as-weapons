import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import { ContextActionService, Players, RunService } from "@rbxts/services";
import { IdController } from "client/controllers/IdController";
import { getControlSlotConnection } from "client/utility/getControlSlotConnection";
import { waitForTagAdded } from "shared/utility/WaitForTagAdded";
import { CanOccupySlot } from "../CanOccupySlot";
import { StructureSlot } from "../StructureSlot";

const components = Dependency<Components>();
const idController = Dependency<IdController>();

interface Attributes {}

@Component({})
export class TurnModel extends BaseComponent<Attributes, BasePart> implements OnStart {
	onStart() {
		waitForTagAdded(this.instance, "StructureSlot").then(() => {
			RunService.Heartbeat.Wait();

			const slot = components.getComponent<StructureSlot>(this.instance);

			getControlSlotConnection({
				instance: this.instance,
				maid: this.maid,
				slot: slot,
				activatedCallback: () => {
					//activated
				},
				deactivatedCallback: () => {
					//deactivated
				},
			});
		});
	}
}
