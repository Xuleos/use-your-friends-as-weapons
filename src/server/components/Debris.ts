import { BaseComponent, Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import { Workspace } from "@rbxts/services";

interface Attributes {
	deleteAfter?: number;
}

@Component({
	tag: "Debris",
})
export class Debris extends BaseComponent<Attributes> implements OnStart, OnTick {
	deleteTime?: number;

	onStart() {
		this.deleteTime = time() + (this.attributes.deleteAfter !== undefined ? this.attributes.deleteAfter : 120);
	}

	onTick() {
		if (this.instance.Parent !== Workspace) {
			return;
		}

		if (this.deleteTime === undefined || time() < this.deleteTime) {
			return;
		}

		this.instance.Destroy();
	}
}
