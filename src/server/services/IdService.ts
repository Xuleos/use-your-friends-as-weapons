import { Service, OnStart } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { CollectionService } from "@rbxts/services";
import randomString from "shared/utility/randomString";

@Service({})
export class IdService implements OnStart {
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
	}

	private instanceAdded(instance: Instance) {
		const id = randomString(6);
		this.instanceToId.set(instance, id);
		this.idToInstance.set(id, instance);
	}

	private instanceRemoved(instance: Instance) {
		const id = this.instanceToId.get(instance);

		if (id !== undefined) {
			this.idToInstance.delete(id);
			this.instanceToId.delete(instance);
		}
	}

	getInstanceFromId(id: string) {
		return this.idToInstance.get(id);
	}

	getIdFromInstance(instance: Instance) {
		return this.instanceToId.get(instance);
	}
}
