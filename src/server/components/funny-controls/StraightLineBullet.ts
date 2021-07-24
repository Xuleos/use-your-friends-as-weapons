import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

interface Attributes {}

@Component({
	tag: "StraightLineBullet",
})
export class StraightLineBullet extends BaseComponent<Attributes> implements OnStart {
	onStart() {}
}
