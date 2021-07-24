import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart, OnTick } from "@flamework/core";
import Log from "@rbxts/log";
import { validateTree } from "@rbxts/validate-tree";
import { Structure } from "server/components/Structure";
import { takeDamageToHumanoid } from "shared/utility/humanoidDamageWrapper";
import { HumanoidTree } from "shared/utility/HumanoidTree";

const components = Dependency<Components>();

interface Attributes {
	damageRate: number;
	damagePerTick: number;
}

@Component({
	tag: "SacrificeStructure",
})
export class SacrificeStructure extends BaseComponent<Attributes, Tool> implements OnStart, OnTick {
	cachedCharacters: Array<Model> = [];

	nextDamage = -1;

	onStart() {
		//we dont need to do anything here
	}

	onTick() {
		if (time() < this.nextDamage) {
			return;
		}

		this.nextDamage = time() + this.attributes.damageRate;

		Log.Debug("LOL");

		const structure = components.getComponent<Structure>(this.instance);

		if (structure.isCompleted()) {
			this.cachedCharacters = structure.getCharactersOccupying();

			for (const character of this.cachedCharacters) {
				if (validateTree(character, HumanoidTree)) {
					takeDamageToHumanoid(character.Humanoid, this.attributes.damagePerTick);
				}
			}
		} else {
			this.cachedCharacters = [];
		}
	}
}
