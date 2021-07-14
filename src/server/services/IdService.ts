import { Service, OnStart } from "@rbxts/flamework";
import { CollectionService } from "@rbxts/services";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";
import randomString from "shared/utility/randomString";

@Service({})
export class IdService implements OnStart {
	private flushIds = Remotes.Server.Create(RemoteId.flushIds);
	private getIds = Remotes.Server.Create(RemoteId.getIds);

	private entriesAddedBeforeFLush = new Map<string, Instance>();
	private entriesRemovedBeforeFlush: Array<string> = [];

	instanceToId = new Map<Instance, string>();
	idToInstance = new Map<string, Instance>();

	onStart() {
		for (const instance of CollectionService.GetTagged("RandomId")) {
			this.instanceAdded(instance);
		}

		CollectionService.GetInstanceAddedSignal("RandomId").Connect((instance) => {
			this.instanceAdded(instance);
		});

		CollectionService.GetInstanceRemovedSignal("RandomId").Connect((instance) => {
			this.instanceRemoved(instance);
		});

		this.getIds.SetCallback(() => {
			return this.idToInstance;
		});
	}

	tick() {
		if (this.entriesAddedBeforeFLush.size() === 0 && this.entriesRemovedBeforeFlush.size() === 0) {
			return;
		}

		this.flushIds.SendToAllPlayers(this.entriesAddedBeforeFLush, this.entriesRemovedBeforeFlush);

		this.entriesAddedBeforeFLush.clear();
		this.entriesRemovedBeforeFlush.clear();
	}

	private instanceAdded(instance: Instance) {
		const id = randomString(6);
		this.instanceToId.set(instance, id);
		this.idToInstance.set(id, instance);

		this.entriesAddedBeforeFLush.set(id, instance);
	}

	private instanceRemoved(instance: Instance) {
		const id = this.instanceToId.get(instance);

		if (id !== undefined) {
			this.idToInstance.delete(id);
			this.instanceToId.delete(instance);

			this.entriesRemovedBeforeFlush.push(id);
		}
	}

	getInstanceFromId(id: string) {
		return this.idToInstance.get(id);
	}

	getIdFromInstance(instance: Instance) {
		return this.instanceToId.get(instance);
	}
}
