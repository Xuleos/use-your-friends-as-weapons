import Net from "@rbxts/net";

const Remotes = Net.Definitions.Create({
	interactWithStructureSlot: Net.Definitions.ClientToServerEvent<[slot: Instance]>(),
	pickupItem: Net.Definitions.ClientToServerEvent<[item: Tool]>(),
});

export default Remotes;
