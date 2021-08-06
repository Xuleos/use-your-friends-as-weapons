import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

interface Attributes {}

@Component({
	tag: "Dummy",
})
export class Dummy extends BaseComponent<Attributes> implements OnStart {
	onStart() {}
}
