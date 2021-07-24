import { OnTick, Service } from "@flamework/core";
import Octree from "@rbxts/octree";
import { CollectionService, Players } from "@rbxts/services";
import { validateTree } from "@rbxts/validate-tree";
import { CharacterRigR15 } from "@rbxts/yield-for-character";

@Service({})
export class OctreeService implements OnTick {
	private nextOctreeReset = -1;
	private importantEntityOctree = new Octree<Model>();

	onTick() {
		if (time() < this.nextOctreeReset) {
			return;
		}

		this.nextOctreeReset = time() + 3;

		this.importantEntityOctree.ClearAllNodes();

		for (const player of Players.GetPlayers()) {
			const character = player.Character;

			if (character && validateTree(character, CharacterRigR15)) {
				this.importantEntityOctree.CreateNode(character.HumanoidRootPart.Position, character);
			}
		}

		for (const structure of CollectionService.GetTagged("Structure")) {
			if (structure.IsA("Model") && structure.PrimaryPart) {
				this.importantEntityOctree.CreateNode(structure.PrimaryPart.Position, structure);
			}
		}
	}

	radiusSearch(position: Vector3, radius: number) {
		return this.importantEntityOctree.RadiusSearch(position, radius);
	}
}
