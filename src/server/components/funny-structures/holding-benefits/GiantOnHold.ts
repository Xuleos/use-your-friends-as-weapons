import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { RunService } from "@rbxts/services";
import { validateTree } from "@rbxts/validate-tree";
import { CharacterRigR15 } from "@rbxts/yield-for-character";
import { Structure } from "server/components/Structure";
import { waitForTagAdded } from "shared/utility/WaitForTagAdded";

const components = Dependency<Components>();

interface Attributes {}

@Component({
	tag: "GiantOnHold",
})
export class GiantOnHold extends BaseComponent<Attributes> implements OnStart {
	onStart() {
		waitForTagAdded(this.instance, "Structure").then(() => {
			RunService.Heartbeat.Wait();

			const structure = components.getComponent<Structure>(this.instance);

			if (structure) {
				this.instance.GetAttributeChangedSignal("completed").Connect(() => {
					const holder = this.instance.Parent;

					if (holder) {
						if (validateTree(holder, CharacterRigR15)) {
							if (this.instance.GetAttribute("completed") === true) {
								holder.Humanoid.BodyDepthScale.Value += 20;
								holder.Humanoid.BodyHeightScale.Value += 20;
								holder.Humanoid.BodyWidthScale.Value += 20;
								holder.Humanoid.HeadScale.Value += 20;
							} else {
								holder.Humanoid.BodyDepthScale.Value -= 20;
								holder.Humanoid.BodyHeightScale.Value -= 20;
								holder.Humanoid.BodyWidthScale.Value -= 20;
								holder.Humanoid.HeadScale.Value -= 20;
							}
						}
					}
				});
			}
		});
	}
}
