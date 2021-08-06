import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { PhysicsService, RunService, Workspace } from "@rbxts/services";

PhysicsService.CreateCollisionGroup("ToolPart");
PhysicsService.CollisionGroupSetCollidable("ToolPart", "Default", false);

interface Attributes {}

@Component({
	tag: "Pickupable",
})
export class Pickupable
	extends BaseComponent<
		Attributes,
		Tool & {
			Handle: BasePart;
		}
	>
	implements OnStart
{
	onStart() {
		const touchInterest = this.instance.Handle.FindFirstChildWhichIsA("TouchTransmitter");
		if (touchInterest) {
			touchInterest.Destroy();
		}

		this.maid.GiveTask(
			this.instance.AncestryChanged.Connect(() => {
				this.instance.CanBeDropped = false;

				const collisionGroup = this.instance.Parent === Workspace ? "Default" : "ToolPart";
				for (const descendant of this.instance.GetDescendants()) {
					if (descendant.IsA("BasePart")) {
						PhysicsService.SetPartCollisionGroup(descendant, collisionGroup);
					}
				}
			}),
		);

		this.maid.GiveTask(
			this.instance.Handle.ChildAdded.Connect((descendant) => {
				RunService.Stepped.Wait();
				if (descendant.IsA("TouchTransmitter")) {
					descendant.Destroy();
				}
			}),
		);
	}
}
