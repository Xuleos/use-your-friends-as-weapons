import { Component, BaseComponent, OnStart } from "@rbxts/flamework";

interface Attributes {}

@Component({
	tag: "StraightLineBullet",
})
export class StraightLineBullet extends BaseComponent<Attributes> implements OnStart {
	onStart() {}
}
