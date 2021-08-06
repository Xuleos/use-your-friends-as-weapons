import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

interface Attributes {
	/** true if all slots are occupied */
	completed: boolean;
}

@Component({
	tag: "Structure",
})
export class Structure extends BaseComponent<Attributes> implements OnStart {
	onStart() {}
}
