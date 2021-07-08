import { Component, BaseComponent, OnStart } from "@rbxts/flamework";
import Log from "@rbxts/log";

interface Attributes {}

@Component({
	tag: "StructureSlot",
})
export class StructureSlot extends BaseComponent<Attributes> implements OnStart {
	onStart() {}

	trigger() {
		Log.Debug("yeah triggered i guess");
	}
}
