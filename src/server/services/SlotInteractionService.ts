import { Components } from "@flamework/components";
import { Dependency, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { CollectionService } from "@rbxts/services";
import { t } from "@rbxts/t";
import { validateTree } from "@rbxts/validate-tree";
import { CharacterRigR15 } from "@rbxts/yield-for-character";
import { CanOccupySlot } from "server/components/CanOccupySlot";
import { HoldingSlot } from "server/components/HoldingSlot";
import { StructureSlot } from "server/components/StructureSlot";
import StructureSlotConfig from "shared/consts/StructureSlotConfig";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";

import { IdService } from "./IdService";

const undeterminedPositionTemplate = "Position for the slot {Slot} could not be determined";

@Service({})
export class SlotInteractionService implements OnStart {
	private interactWithStructureSlot = Remotes.Server.Create(RemoteId.interactWithStructureSlot);

	constructor(private idService: IdService, private components: Components) {}

	onStart() {
		//TODO: do something here to handle cases where the player has a dummy equipped
		this.interactWithStructureSlot.Connect((player, slot) => {
			const character = player.Character;

			if (!character || !validateTree(character, CharacterRigR15)) {
				Log.Warn("{Player}'s character is not R15 or does not exist", player);
				return;
			}

			if (!this.slotRadiusCheck(player, character, slot)) {
				return;
			}

			const canOccupySlot = this.components.getComponent<CanOccupySlot>(player);
			if (canOccupySlot.attributes.occupying !== undefined) {
				return;
			}
			//TODO: probably check to see if player is holding a dummy here and do something different if so
			const structureSlot = this.components.getComponent<StructureSlot>(slot);

			const holdingSlot = this.components.getComponent<HoldingSlot>(player);
			const id = holdingSlot.attributes.holding;
			if (id !== undefined) {
				const instance = this.idService.getInstanceFromId(id);

				if (t.instanceIsA("Tool")(instance) && CollectionService.HasTag(instance, "Dummy")) {
					holdingSlot.equip(undefined);
					structureSlot.setOccupier(instance);
					return;
				}
			}

			//do something now
			structureSlot.setOccupier(player);
		});
	}

	private slotRadiusCheck(player: Player, character: CharacterRigR15, slot: Instance) {
		let slotPosition: Vector3;
		if (slot.IsA("Model")) {
			if (slot.PrimaryPart) {
				slotPosition = slot.PrimaryPart.Position;
			} else {
				Log.Error(undeterminedPositionTemplate, slot);
				return false;
			}
		} else if (slot.IsA("Part")) {
			slotPosition = slot.Position;
		} else if (slot.IsA("Attachment")) {
			slotPosition = slot.WorldPosition;
		} else {
			Log.Error(undeterminedPositionTemplate, slot);
			return false;
		}

		if (character.HumanoidRootPart.Position.sub(slotPosition).Magnitude > StructureSlotConfig.radius) {
			Log.Warn("{Player} is not within radius of slot", player);
			return false;
		}

		return true;
	}
}
