interface SyncedClock {
	GetTime(): number;
	Initialize(): void;
}

declare const SyncedClock: SyncedClock;

export = SyncedClock;
