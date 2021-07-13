import { Component, BaseComponent, OnStart } from "@rbxts/flamework";
import { $dbg } from "rbxts-transform-debug";

interface Attributes {}

@Component({
	tag: "RandomId",
})
export class RandomId extends BaseComponent<Attributes> implements OnStart {
	onStart() {}
}
