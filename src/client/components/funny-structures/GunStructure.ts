import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { BulletController } from "client/controllers/BulletController";
import { Structure } from "../Structure";

interface Attributes {}

const components = Dependency<Components>();
const bulletController = Dependency<BulletController>();

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
		this.maid.GiveTask(
			this.instance.Activated.Connect(() => {
				const structure = components.getComponent<Structure>(this.instance);

				if (structure && structure.attributes.completed) {
					//fire legally B)
					bulletController.fire(this.instance.Handle.BulletOrigin.WorldPosition);
				}
			}),
		);
	}
}
