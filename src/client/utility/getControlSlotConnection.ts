import { Dependency, Components } from "@rbxts/flamework";
import { Players } from "@rbxts/services";
import { CanOccupySlot } from "client/components/CanOccupySlot";
import { StraightLineBullet } from "client/components/funny-controls/StraightLineBullet";
import { StructureSlot } from "client/components/StructureSlot";
import { IdController } from "client/controllers/IdController";
import { $dbg } from "rbxts-transform-debug";

const components = Dependency<Components>();
const idController = Dependency<IdController>();

export function getControlSlotConnection(params: {
	instance: Instance;
	maid: StraightLineBullet["maid"];
	slot: StructureSlot;
	activatedCallback: () => void;
	deactivatedCallback: () => void;
}) {
	if (params.slot.structure) {
		params.maid.GiveTask(
			params.slot.structure.GetAttributeChangedSignal("completed").Connect(() => {
				if (params.slot.structure?.GetAttribute("completed") === true) {
					$dbg("Slot is completed");
					//check to see if localplayer is occupying this slot
					const canOccupySlot = components.getComponent<CanOccupySlot>(Players.LocalPlayer);

					$dbg(canOccupySlot.attributes.occupying);

					if (canOccupySlot.attributes.occupying !== undefined) {
						const instance = idController.getInstanceFromId(canOccupySlot.attributes.occupying);

						if (instance === params.instance) {
							params.activatedCallback();
						} else {
							params.deactivatedCallback();
						}
					} else {
						params.deactivatedCallback();
					}
				} else {
					params.deactivatedCallback();
				}
			}),
		);
	}
}
