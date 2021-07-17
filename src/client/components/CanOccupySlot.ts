import { BaseComponent, Component, OnStart } from "@rbxts/flamework";

interface Attributes {
	occupying?: string;
}

@Component({
	tag: "CanOccupySlot",
})
export class CanOccupySlot extends BaseComponent<Attributes, Player | Model> implements OnStart {
	onStart() {}
}
