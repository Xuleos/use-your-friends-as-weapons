import { Flamework } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { $git } from "rbxts-transform-debug";
import Zircon from "@rbxts/zircon";
import SyncedClock from "shared/SyncedClock";

// eslint-disable-next-line prettier/prettier
Log.SetLogger(
	Logger.configure()
		.WriteTo(Zircon.Log.Console())
		.WriteTo(Log.RobloxOutput())
		.EnrichWithProperty("CommitId", $git().Commit)
		.Create(),
);

SyncedClock.Initialize();

Flamework.addPaths("src/server/services", "src/server/components");
Flamework.ignite();
