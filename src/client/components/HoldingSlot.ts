import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

interface Attributes {
	holding?: string;
}

@Component({
	tag: "HoldingSlot",
})
export class HoldingSlot extends BaseComponent<Attributes, Player> implements OnStart {
	onStart() {}
}
