import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import { Structure } from "../Structure";

interface Attributes {}

const components = Dependency<Components>();

@Component({
	tag: "GunStructure",
})
export class GunStructure
	extends BaseComponent<
		Attributes,
		Tool & {
			Handle: BasePart & {
				BulletOrigin: Attachment;
			};
		}
	>
	implements OnStart
{
	onStart() {
		const structure = components.getComponent<Structure>(this.instance);

		if (structure) {
			structure.onAttributeChanged("completed", (newValue) => {
				if (newValue) {
					//enable the gun stuff B)
				}
			});
		}
	}
}
