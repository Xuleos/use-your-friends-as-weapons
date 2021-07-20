import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import { RunService, Workspace } from "@rbxts/services";
import Joint from "shared/utility/Joint";
import { waitForTagAdded } from "shared/utility/WaitForTagAdded";
import { Structure } from "../Structure";

interface Attributes {}

const components = Dependency<Components>();

@Component({
	tag: "ShieldStructure",
})
export class ShieldStructure
	extends BaseComponent<
		Attributes,
		Tool & {
			Handle: BasePart & {
				ShieldOrigin: Attachment;
			};
		}
	>
	implements OnStart
{
	shieldPart?: Part;

	onStart() {
		waitForTagAdded(this.instance, "Structure").then(() => {
			RunService.Heartbeat.Wait();

			const structure = components.getComponent<Structure>(this.instance);

			if (structure) {
				structure.onAttributeChanged("completed", (completed) => {
					if (completed) {
						//enable the shield
						this.shieldPart = new Instance("Part");
						this.shieldPart.Anchored = false;
						this.shieldPart.CanCollide = false;
						this.shieldPart.Material = Enum.Material.ForceField;
						this.shieldPart.Shape = Enum.PartType.Ball;
						this.shieldPart.Size = new Vector3(20, 20, 20);
						this.shieldPart.Transparency = 0.8;
						this.shieldPart.Massless = true;
						this.shieldPart.CFrame = this.instance.Handle.ShieldOrigin.WorldCFrame;
						Joint.weld(this.shieldPart, this.instance.Handle, "Weld", this.shieldPart);
						this.shieldPart.Parent = Workspace;
						this.maid.GiveTask(this.shieldPart);
					} else {
						this.shieldPart?.Destroy();
					}
				});
			}
		});
	}
}
