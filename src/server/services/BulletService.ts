import { Service, OnStart } from "@rbxts/flamework";
import { CollectionService, Players } from "@rbxts/services";
import { InvisibleProjectRenderer } from "server/modules/InvisibleProjectRenderer";
import BulletDefinitions from "shared/consts/BulletDefinitions";
import { CylinderRenderer, Projectile } from "shared/Projectile2";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";
import SyncedClock from "shared/SyncedClock";

@Service({})
export class BulletService implements OnStart {
	private fireBullet = Remotes.Server.Create(RemoteId.fireBullet);

	onStart() {
		this.fireBullet.Connect((player, origin, endPos, time, bulletType) => {
			const def = BulletDefinitions[bulletType];

			const deltaTime = SyncedClock.GetTime() - time + 0.02;
			const velocity = new CFrame(origin, endPos).LookVector.mul(def.Speed !== undefined ? def.Speed : 75);

			const physicsIgnore = CollectionService.GetTagged("IgnoreRaycasts");

			new Projectile({
				Position: origin,
				ElapsedTime: deltaTime,
				Velocity: velocity,
				Acceleration: new Vector3(0, def.Gravity !== undefined ? def.Gravity : 0, 0),
				Bounce: def.Bounce,
				CanCollide: def.CanCollide,
				Resistance: def.Resistance,
				Lifespan: def.Lifespan,
				MinExitVelocity: def.MinExitVelocity,
				Penetration: def.Penetration,
				PhysicsIgnore: physicsIgnore,
				OnTouch: (part) => {
					const model = part.FindFirstAncestorWhichIsA("Model");
					if (model) {
						const humanoid = model.FindFirstChildWhichIsA("Humanoid");

						if (humanoid) {
							humanoid.Health -= 20;
						}
					}
					return true;
				},
				Renderer: new InvisibleProjectRenderer(),
			});

			this.fireBullet.SendToAllPlayersExcept(player, origin, endPos, time, bulletType);
		});
	}
}
