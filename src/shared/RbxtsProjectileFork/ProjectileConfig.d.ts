/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/compiler-types" />
import { IRenderer } from "./IRenderer";

export type MainProjectileConfig = {
	/**
	 * The initial position
	 */
	Position: Vector3;

	/**
	 * The initial velocity
	 */
	Velocity: Vector3;

	/**
	 * The constant acceleration
	 */
	Acceleration: Vector3;
};

export type AdditionalProjectileConfig = Partial<{
	/**
	 * Whether the projectile should bounce
	 * Defaults to false
	 */
	Bounce?: boolean;

	/**
	 *
	 */
	ElapsedTime?: number;

	/**
	 * Whether the projectile can collide with other objects (whether it should check for collisions)
	 * Defaults to true
	 */
	CanCollide?: boolean;

	/**
	 * The maximum lifespan, in seconds, of the projectile
	 * Defaults to 2
	 */
	Lifespan?: number;

	/**
	 * The maximum distance, in studs, that the projectile can travel
	 * Defaults to 5000
	 */
	MaxRange?: number;

	/**
	 * The minimum exit velocity of the projectile. If the calculated exit velocity in a penetration is less than this value, the projectile will be destroyed.
	 * Defaults to 100
	 */
	MinExitVelocity?: number;

	/**
	 * Whether the projectile can penetrate through objects in the world
	 * Defaults to false
	 */
	Penetration?: boolean;

	/**
	 * The list of Instances (and their descendants) to ignore during all physics calculations
	 * Defaults to an empty array
	 */
	PhysicsIgnore?: Array<Instance>;

	/**
	 * The amount of resistance applied during a penetration
	 * Defaults to 1
	 */
	Resistance?: number;

	/**
	 * The renderer for the projectile
	 * Defaults to a white CylinderRenderer
	 */
	Renderer?: IRenderer;

	/**
	 * An optional callback function for when the projectile collides with a part not in its physicsIgnore
	 * @param Part The part that was collided with by the projectile
	 * @param Position The position of the collision with the part and the projectile
	 * @param SurfaceNormal The normal of the surface that the projectile collided with
	 * @param CollisionNormal The negative unit vector of the velocity of the projectile at the time of collision
	 * @returns A boolean indicating whether the projectile should be removed
	 */
	OnTouch?: (Part: BasePart, Position: Vector3, SurfaceNormal: Vector3, CollisionNormal: Vector3) => boolean;
}>;

/**
 * Defines the set of configuration values for a Projectile
 */
export declare type ProjectileConfig = MainProjectileConfig & AdditionalProjectileConfig;
