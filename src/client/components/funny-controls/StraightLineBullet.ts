import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { RunService, UserInputService } from "@rbxts/services";
import { BulletController } from "client/controllers/BulletController";
import { IdController } from "client/controllers/IdController";
import { getControlSlotConnection } from "client/utility/getControlSlotConnection";
import { $dbg } from "rbxts-transform-debug";
import { waitForTagAdded } from "shared/utility/WaitForTagAdded";
import { StructureSlot } from "../StructureSlot";

const components = Dependency<Components>();
const idController = Dependency<IdController>();
const bulletController = Dependency<BulletController>();

interface Attributes {}

@Component({
	tag: "StraightLineBullet",
})
export class StraightLineBullet
	extends BaseComponent<
		Attributes,
		Part & {
			BulletOrigin: Attachment;
		}
	>
	implements OnStart
{
	inputConnection?: RBXScriptConnection;

	onStart() {
		waitForTagAdded(this.instance, "StructureSlot").then(() => {
			RunService.Heartbeat.Wait();
			const slot = components.getComponent<StructureSlot>(this.instance);

			getControlSlotConnection({
				instance: this.instance,
				maid: this.maid,
				slot: slot,
				activatedCallback: () => {
					$dbg("Woohooo!!");
					this.inputConnection = UserInputService.InputBegan.Connect((input, gameProcessed) => {
						this.inputBegan(input, gameProcessed);
					});
				},
				deactivatedCallback: () => {
					if (this.inputConnection) {
						this.inputConnection.Disconnect();
					}
				},
			});
		});

		this.maid.GiveTask(() => {
			if (this.inputConnection) {
				this.inputConnection.Disconnect();
			}
		});
	}

	private inputBegan(input: InputObject, gameProcessed: boolean) {
		if (input.UserInputType === Enum.UserInputType.MouseButton1 && !gameProcessed) {
			const originCFrame = this.instance.BulletOrigin.WorldCFrame;

			$dbg("Firrre!!");
			bulletController.fire(
				originCFrame.Position,
				originCFrame.Position.add(originCFrame.LookVector.mul(75)),
				"CannonFire",
			);
		}
	}
}
