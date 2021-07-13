import { AdditionalProjectileConfig } from "shared/Projectile2/ProjectileConfig";

export type BulletTypes = "BasicBullet";

const BulletDefinitions: {
	[name in BulletTypes]: AdditionalProjectileConfig & {
		Radius?: number;
		Color3?: Color3;
		Gravity?: number;
		Speed?: number;
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
} as const;

export default BulletDefinitions;
