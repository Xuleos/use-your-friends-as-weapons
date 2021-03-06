import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

interface Attributes {}

@Component({
	tag: "RandomId",
})
export class RandomId extends BaseComponent<Attributes> implements OnStart {
	onStart() {}
}
