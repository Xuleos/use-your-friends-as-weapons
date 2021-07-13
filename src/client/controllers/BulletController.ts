import { Controller, OnStart } from "@rbxts/flamework";
import { CylinderRenderer, Projectile } from "shared/Projectile2";
import { CollectionService, Players } from "@rbxts/services";
import { RemoteId } from "shared/RemoteIds";
import Remotes from "shared/Remotes";
import SyncedClock from "shared/SyncedClock";
import BulletDefinitions from "shared/consts/BulletDefinitions";

@Controller({})
export class BulletController implements OnStart {
	private mouse = Players.LocalPlayer.GetMouse();

	private fireBullet = Remotes.Client.Get(RemoteId.fireBullet);
	private receiveBullet = Remotes.Client.Get(RemoteId.receiveBullet);

	onStart() {
		this.receiveBullet.Connect((sender, origin, endPos, time, bulletType) => {
			const def = BulletDefinitions[bulletType];

			const physicsIgnore = CollectionService.GetTagged("IgnoreRaycasts");
			if (sender.Character) {
				physicsIgnore.push(sender.Character);
			}

			const deltaTime = SyncedClock.GetTime() - time + 0.02;
			const velocity = new CFrame(origin, endPos).LookVector.mul(def.Speed !== undefined ? def.Speed : 75);

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
				Renderer: new CylinderRenderer(def.Color3 !== undefined ? def.Color3 : new Color3(), def.Radius),
			});
		});
	}

	fire(origin: Vector3) {
		const def = BulletDefinitions["BasicBullet"];

		const endPos = this.mouse.Hit.Position;
		const timeFired = SyncedClock.GetTime();
		const velocity = new CFrame(origin, endPos).LookVector.mul(def.Speed !== undefined ? def.Speed : 75);

		const physicsIgnore = CollectionService.GetTagged("IgnoreRaycasts");
		if (Players.LocalPlayer.Character) {
			physicsIgnore.push(Players.LocalPlayer.Character);
		}

		new Projectile({
			Position: origin,
			Velocity: velocity,
			Acceleration: new Vector3(0, def.Gravity !== undefined ? def.Gravity : 0, 0),
			Bounce: def.Bounce,
			CanCollide: def.CanCollide,
			Resistance: def.Resistance,
			Lifespan: def.Lifespan,
			MinExitVelocity: def.MinExitVelocity,
			Penetration: def.Penetration,
			PhysicsIgnore: physicsIgnore,
			Renderer: new CylinderRenderer(def.Color3 !== undefined ? def.Color3 : new Color3(), def.Radius),
		});

		this.fireBullet.SendToServer(origin, endPos, timeFired, "BasicBullet");
	}
}
