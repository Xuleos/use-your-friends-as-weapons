import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import Roact from "@rbxts/roact";
import { ContextActionService, Players, RunService } from "@rbxts/services";
import { IdController } from "client/controllers/IdController";
import Scale from "client/ui/components/Scale";
import Turn from "client/ui/components/Turn";
import { getControlSlotConnection } from "client/utility/getControlSlotConnection";
import { $dbg } from "rbxts-transform-debug";
import { waitForTagAdded } from "shared/utility/WaitForTagAdded";
import { CanOccupySlot } from "../CanOccupySlot";
import { StructureSlot } from "../StructureSlot";

const components = Dependency<Components>();
const idController = Dependency<IdController>();

interface Attributes {}

@Component({
	tag: "TurnModel",
})
export class TurnModel extends BaseComponent<Attributes, BasePart> implements OnStart {
	mount?: Roact.Tree;

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
					this.mount = Roact.mount(
						<screengui>
							<Scale Size={new Vector2(800, 400)} Scale={0.8} />

							<Turn
								leftTriggered={(dt) => {
									if (slot.structure && slot.structure.IsA("Model")) {
										const cframe = slot.structure.GetPrimaryPartCFrame();
										slot.structure.SetPrimaryPartCFrame(
											cframe.mul(CFrame.Angles(0, math.rad(dt * 60), 0)),
										);
									}
								}}
								rightTriggered={(dt) => {
									if (slot.structure && slot.structure.IsA("Model")) {
										const cframe = slot.structure.GetPrimaryPartCFrame();
										slot.structure.SetPrimaryPartCFrame(
											cframe.mul(CFrame.Angles(0, math.rad(dt * -60), 0)),
										);
									}
								}}
							/>
						</screengui>,
						Players.LocalPlayer.FindFirstChildOfClass("PlayerGui"),
					);
				},
				deactivatedCallback: () => {
					//deactivated
					if (this.mount) {
						Roact.unmount(this.mount);
						this.mount = undefined;
					}
				},
			});

			this.maid.GiveTask(() => {
				if (this.mount) {
					Roact.unmount(this.mount);
					this.mount = undefined;
				}
			});
		});
	}
}
