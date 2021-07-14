import Net from "@rbxts/net";
import { RemoteId } from "./RemoteIds";
import BulletDefinitions, { BulletTypes } from "./consts/BulletDefinitions";

const Remotes = Net.Definitions.Create({
	[RemoteId.interactWithStructureSlot]: Net.Definitions.ClientToServerEvent<[slot: Instance]>(),
	[RemoteId.pickupItem]: Net.Definitions.ClientToServerEvent<[item: Tool]>(),
	[RemoteId.fireBullet]:
		Net.Definitions.ClientToServerEvent<
			[origin: Vector3, endPos: Vector3, time: number, bulletType: BulletTypes]
		>(),
	[RemoteId.receiveBullet]:
		Net.Definitions.ServerToClientEvent<
			[sender: Player, origin: Vector3, endPos: Vector3, time: number, bulletType: BulletTypes]
		>(),
	[RemoteId.flushIds]: Net.Definitions.ServerToClientEvent<[added: Map<string, Instance>, removed: Array<string>]>(),
	[RemoteId.getIds]: Net.Definitions.ServerAsyncFunction<() => Map<string, Instance>>(),
});

export default Remotes;
