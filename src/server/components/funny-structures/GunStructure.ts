import { Component, BaseComponent, OnStart } from "@rbxts/flamework";

interface Attributes {}

@Component({
	tag: "GunStructure",
})
export class GunStructure extends BaseComponent<Attributes> implements OnStart {
	onStart() {}
}
