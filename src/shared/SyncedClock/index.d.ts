declare namespace SyncedClock {
	export function Initialize(): void;

	export function GetTime(this: SyncedClock): number;
}

export = SyncedClock;
