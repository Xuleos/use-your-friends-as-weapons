import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { $dbg } from "rbxts-transform-debug";
import { Structure } from "server/components/Structure";
import { OctreeService } from "server/services/OctreeService";
import { takeDamageToHumanoid } from "shared/utility/humanoidDamageWrapper";

const components = Dependency<Components>();
const octreeService = Dependency<OctreeService>();

interface Attributes {}

@Component({
	tag: "BombStructure",
})
export class BombStructure
	extends BaseComponent<
		Attributes,
		Tool & {
			Handle: BasePart;
		}
	>
	implements OnStart
{
	onStart() {
		this.maid.GiveTask(
			this.instance.Activated.Connect(() => {
				const structure = components.getComponent<Structure>(this.instance);

				if (structure.attributes.completed) {
					const nearby = octreeService.radiusSearch(this.instance.Handle.Position, 30);

					//make cool particles

					for (const model of nearby) {
						const humanoid = model.FindFirstChildWhichIsA("Humanoid");

						if (humanoid) {
							takeDamageToHumanoid(humanoid, 180);
						} else {
							model.Destroy();
						}
					}

					this.instance.Destroy();
				}
			}),
		);
	}
}
