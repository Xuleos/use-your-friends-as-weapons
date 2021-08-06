import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";

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
		this.instance.CanBeDropped = false;
	}
}
