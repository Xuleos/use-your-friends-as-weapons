import { AdditionalProjectileConfig } from "shared/RbxtsProjectileFork/ProjectileConfig";

export type BulletTypes = "BasicBullet" | "CannonFire";

const BulletDefinitions: {
	[name in BulletTypes]: AdditionalProjectileConfig & {
		Radius?: number;
		Color3?: Color3;
		Gravity?: number;
		Speed?: number;
		Damage?: number;
	};
} = {
	BasicBullet: {
		Lifespan: 4,
		Bounce: false,
		MinExitVelocity: 50,
		Penetration: true,
		Gravity: 0,
		Radius: 0.8,
	},
	CannonFire: {
		Speed: 200,
		Lifespan: 4,
		Bounce: false,
		MinExitVelocity: 50,
		Penetration: false,
		Gravity: -3,
		Radius: 1,
		Color3: Color3.fromRGB(255, 186, 0),
	},
} as const;

export default BulletDefinitions;
