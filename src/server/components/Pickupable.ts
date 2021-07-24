import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { RunService } from "@rbxts/services";

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
