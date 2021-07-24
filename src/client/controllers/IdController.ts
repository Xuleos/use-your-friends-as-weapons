import { Controller, OnStart } from "@flamework/core";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";

@Controller({})
export class IdController implements OnStart {
	private flushIds = Remotes.Client.Get(RemoteId.flushIds);
	private getIds = Remotes.Client.Get(RemoteId.getIds);

	instanceToId = new Map<Instance, string>();
	idToInstance = new Map<string, Instance>();

	onStart() {
		this.flushIds.Connect((added, removed) => {
			for (const [id, instance] of added) {
				this.instanceToId.set(instance, id);
				this.idToInstance.set(id, instance);
			}

			for (const id of removed) {
				const instance = this.idToInstance.get(id);
				if (instance) {
					this.instanceToId.delete(instance);
				}

				this.idToInstance.delete(id);
			}
		});

		this.getIds.CallServerAsync().then((ids) => {
			for (const [id, instance] of ids) {
				this.idToInstance.set(id, instance);
				this.instanceToId.set(instance, id);
			}
		});
	}

	getInstanceFromId(id: string) {
		return this.idToInstance.get(id);
	}

	getIdFromInstance(instance: Instance) {
		return this.instanceToId.get(instance);
	}
}
