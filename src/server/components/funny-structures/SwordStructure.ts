import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import RaycastHitbox from "@rbxts/raycast-hitbox";
import { HitboxObject } from "@rbxts/raycast-hitbox/out/typings/HitboxObject";
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/yield-for-character";
import { waitForTagAdded } from "shared/utility/WaitForTagAdded";
import { Structure } from "../Structure";

interface Attributes {}

const components = Dependency<Components>();

@Component({
	tag: "SwordStructure",
})
export class SwordStructure
	extends BaseComponent<
		Attributes,
		Tool & {
			Parent?: CharacterRigR15 | Workspace;
		}
	>
	implements OnStart
{
	hitbox?: HitboxObject;
	onHitConnection?: RBXScriptConnection;

	track?: AnimationTrack;

	onStart() {
		this.instance.CanBeDropped = false;

		waitForTagAdded(this.instance, "Structure").then(() => {
			RunService.Heartbeat.Wait();

			const structure = components.getComponent<Structure>(this.instance);

			if (structure) {
				this.maid.GiveTask(
					this.instance.GetAttributeChangedSignal("completed").Connect(() => {
						RunService.Heartbeat.Wait();

						if (!this.instance.Parent) {
							return;
						}

						if (this.instance.GetAttribute("completed") === true) {
							Log.Info("making hitbox");
							this.hitbox = RaycastHitbox.Initialize(this.instance.Parent, [
								this.instance.Parent,
								...structure.getCharactersOccupying(),
							]);

							this.onHitConnection = this.hitbox.OnHit.Connect((part, humanoid) => {
								Log.Debug("Sword hit {Part}", part.Name);
								if (humanoid) {
									humanoid.Health -= 50;
								}
							});
						} else if (this.hitbox) {
							RaycastHitbox.Deinitialize(this.instance.Parent);
						}
					}),
				);
			}
		});

		this.maid.GiveTask(() => {
			//this.hitbox?.HitStop();

			this.onHitConnection?.Disconnect();

			if (this.instance.Parent) {
				RaycastHitbox.Deinitialize(this.instance.Parent);
			}
		});

		this.maid.GiveTask(
			this.instance.Equipped.Connect(() => {
				if (this.instance.Parent && !this.instance.Parent.IsA("Workspace")) {
					this.track = this.instance.Parent.Humanoid.Animator.LoadAnimation(
						ReplicatedStorage.assets.animations.LeftSlash,
					);
					this.track.Priority = Enum.AnimationPriority.Action;
				}
			}),
		);

		this.maid.GiveTask(
			this.instance.AncestryChanged.Connect(() => {
				if (this.track?.Parent === undefined || this.track?.Parent === Workspace) {
					this.track?.Destroy();
				}
			}),
		);

		this.maid.GiveTask(
			this.instance.Activated.Connect(() => {
				this.track?.Play();

				this.hitbox?.HitStart(1);
			}),
		);
	}
}
