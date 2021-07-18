import { Component, BaseComponent, OnStart, Components, Dependency } from "@rbxts/flamework";
import Log from "@rbxts/log";
import RaycastHitbox from "@rbxts/raycast-hitbox";
import { HitboxObject } from "@rbxts/raycast-hitbox/out/typings/HitboxObject";
import { ContextActionService, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/yield-for-character";
import { $dbg, $warn } from "rbxts-transform-debug";
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

	track?: AnimationTrack;

	onStart() {
		waitForTagAdded(this.instance, "Structure").then(() => {
			RunService.Heartbeat.Wait();

			const structure = components.getComponent<Structure>(this.instance);

			if (structure) {
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

						this.hitbox.OnHit.Connect((part, humanoid, results) => {
							Log.Debug("Sword hit something");
							$dbg(part);
							if (humanoid) {
								humanoid.Health -= 50;
							}
						});
					} else if (this.hitbox) {
						RaycastHitbox.Deinitialize(this.instance.Parent);
					}
				});
			}
		});

		this.maid.GiveTask(() => {
			this.hitbox?.HitStop();

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
				$dbg(this.track);
				this.track?.Play();

				this.hitbox?.HitStart(1);
			}),
		);
	}
}
