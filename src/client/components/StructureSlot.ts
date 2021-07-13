import { Component, BaseComponent } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";

const interactWithStructureSlot = Remotes.Client.Get(RemoteId.interactWithStructureSlot);

interface Attributes {}

@Component({
	tag: "StructureSlot",
})
export class StructureSlot extends BaseComponent<Attributes> {
	trigger() {
		Log.Debug("yeah triggered i guess");
		interactWithStructureSlot.SendToServer(this.instance);
	}
}
