import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { RunService } from "@rbxts/services";
import { Structure } from "server/components/Structure";
import { waitForTagAdded } from "shared/utility/WaitForTagAdded";

const components = Dependency<Components>();

interface Attributes {}

@Component({
	tag: "SpeedOnHold",
})
export class SpeedOnHold extends BaseComponent<Attributes, Tool> implements OnStart {
	onStart() {
		waitForTagAdded(this.instance, "Structure").then(() => {
			RunService.Heartbeat.Wait();

			const structure = components.getComponent<Structure>(this.instance);

			if (structure) {
				this.instance.GetAttributeChangedSignal("completed").Connect(() => {
					const holder = this.instance.Parent;

					if (holder) {
						const humanoid = holder.FindFirstChildWhichIsA("Humanoid");

						if (humanoid) {
							if (this.instance.GetAttribute("completed") === true) {
								humanoid.WalkSpeed += 16;
							} else {
								humanoid.WalkSpeed -= 16;
							}
						}
					}
				});
			}
		});
	}
}
