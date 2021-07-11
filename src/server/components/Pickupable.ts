import { Component, BaseComponent, OnStart } from "@rbxts/flamework";

interface Attributes {
	/** Whether people can pick it up */
	toggle: boolean;
}

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

		/*this.maid.GiveTask(
			this.instance.Handle.ChildAdded.Connect((descendant) => {
				if (descendant.IsA("TouchTransmitter")) {
					descendant.Destroy();
				}
			}),
		);*/
	}
}
