import { BaseComponent, Component, OnStart } from "@rbxts/flamework";

interface Attributes {
	holding?: string;
}

@Component({
	tag: "HoldingSlot",
})
export class HoldingSlot extends BaseComponent<Attributes, Player> implements OnStart {
	onStart() {}
}
