import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { RunService } from "@rbxts/services";
import { Structure } from "server/components/Structure";
import { waitForTagAdded } from "shared/utility/WaitForTagAdded";

const components = Dependency<Components>();

interface Attributes {}

@Component({
	tag: "HealthOnHold",
})
export class HealthOnHold extends BaseComponent<Attributes> implements OnStart {
	onStart() {
		waitForTagAdded(this.instance, "Structure").then(() => {
			RunService.Heartbeat.Wait();

			const structure = components.getComponent<Structure>(this.instance);

			if (structure) {
				structure.onAttributeChanged("completed", (completed) => {
					const holder = this.instance.Parent;

					if (holder) {
						const humanoid = holder.FindFirstChildWhichIsA("Humanoid");

						if (humanoid) {
							if (completed) {
								humanoid.MaxHealth += 100;
							} else {
								humanoid.MaxHealth -= 100;
							}
						}
					}
				});
			}
		});
	}
}
