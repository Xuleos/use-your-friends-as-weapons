import { Service, OnStart, Components, Dependency } from "@rbxts/flamework";
import { CharacterRigR15 } from "@rbxts/yield-for-character";
import { validateTree } from "@rbxts/validate-tree";
import Remotes from "shared/Remotes";
import Log from "@rbxts/log";
import StructureSlotConfig from "shared/consts/StructureSlotConfig";
import { StructureSlot } from "server/components/StructureSlot";
import { RemoteId } from "shared/RemoteIds";
import { CanOccupySlot } from "server/components/CanOccupySlot";

const components = Dependency<Components>();

const undeterminedPositionTemplate = "Position for the slot {Slot} could not be determined";

@Service({})
export class SlotInteractionService implements OnStart {
	private interactWithStructureSlot = Remotes.Server.Create(RemoteId.interactWithStructureSlot);

	onStart() {
		this.interactWithStructureSlot.Connect((player, slot) => {
			const character = player.Character;

			if (!character || !validateTree(character, CharacterRigR15)) {
				Log.Warn("{Player}'s character is not R15 or does not exist", player);
				return;
			}

			if (!this.slotRadiusCheck(player, character, slot)) {
				return;
			}

			const canOccupySlot = components.getComponent<CanOccupySlot>(player);
			if (canOccupySlot.attributes.occupying !== undefined) {
				return;
			}
			//TODO: probably check to see if player is holding a dummy here and do something different if so

			//do something now
			const structureSlot = components.getComponent<StructureSlot>(slot);
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
