import { Flamework } from "@rbxts/flamework";
import Log, { Logger } from "@rbxts/log";
import { $git } from "rbxts-transform-debug";
import Zircon, { ZirconClient } from "@rbxts/zircon";

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

Flamework.addPaths("src/client/controllers", "src/client/components");
Flamework.ignite();
