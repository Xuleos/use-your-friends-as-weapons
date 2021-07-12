import Net from "@rbxts/net";
import { RemoteId } from "./RemoteIds";

const Remotes = Net.Definitions.Create({
	[RemoteId.interactWithStructureSlot]: Net.Definitions.ClientToServerEvent<[slot: Instance]>(),
	[RemoteId.pickupItem]: Net.Definitions.ClientToServerEvent<[item: Tool]>(),
	[RemoteId.fireBullet]: Net.Definitions.ClientToServerEvent<[origin: Vector3, endPos: Vector3, time: number]>(),
});

export default Remotes;
