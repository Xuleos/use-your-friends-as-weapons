import { Component, BaseComponent, OnStart } from "@rbxts/flamework";

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
