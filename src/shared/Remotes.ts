import Net from "@rbxts/net";

const Remotes = Net.Definitions.Create({
	interactWithStructureSlot: Net.Definitions.ClientToServerEvent<[slot: Instance]>(),
});

export default Remotes;
