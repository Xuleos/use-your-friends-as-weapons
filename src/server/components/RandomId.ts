import { Component, BaseComponent, OnStart } from "@rbxts/flamework";
import Log from "@rbxts/log";

interface Attributes {}

@Component({
	tag: "RandomId",
})
export class RandomId extends BaseComponent<Attributes> implements OnStart {
	onStart() {}
}
