import { Flamework } from "@rbxts/flamework";
import Log, { Logger } from "@rbxts/log";
import { $git } from "rbxts-transform-debug";
import Zircon, { ZirconClient } from "@rbxts/zircon";
import { StarterGui } from "@rbxts/services";
import SyncedClock from "shared/SyncedClock";

// eslint-disable-next-line prettier/prettier
Log.SetLogger(
	Logger.configure()
		.WriteTo(Zircon.Log.Console())
		.WriteTo(Log.RobloxOutput())
		.EnrichWithProperty("CommitId", $git().Commit)
		.Create(),
);

ZirconClient.BindConsole({
	EnableTags: true,
	Keys: [Enum.KeyCode.Backquote],
});

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

SyncedClock.Initialize();

Flamework.addPaths("src/client/controllers", "src/client/components");
Flamework.ignite();
