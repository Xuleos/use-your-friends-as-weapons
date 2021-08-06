/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { ProjectileConfig } from "./ProjectileConfig";
import { IRenderer } from "./IRenderer";
/**
 * A projectile that simulates physical interactions with the world according to the given configuration
 */
export declare class Projectile {
	/**
	 * The total number of seconds that have elapsed
	 */
	static ElapsedTime: number;

	/**
	 * The current projectiles being simulated
	 */
	static Projectiles: Projectile[];

	/**
	 * The set of projectiles to be removed on the next step
	 */
	static readonly RemoveList: Set<Projectile>;

	/**
	 * The global physics ignore that applies to all Projectile instances
	 */
	static readonly GlobalPhysicsIgnore: Instance[];

	/**
	 * The point in `Projectile.ElapsedTime` that this projectile will die, whether or not it has hit something
	 */
	readonly Lifetime: number;

	/**
	 * The renderer for the projectile
	 */
	readonly Renderer: IRenderer;

	private PositionX;
	private PositionY;
	private PositionZ;

	private VelocityX;
	private VelocityY;
	private VelocityZ;

	private AccelerationX;
	private AccelerationY;
	private AccelerationZ;

	private DistanceSq;
	private Bounce;
	private CanCollide;
	private MaxRangeSquare;
	private MinExitVelocity;
	private Penetration;
	private PhysicsIgnore;
	private Resistance;
	private OnTouch;

	constructor(Configuration: ProjectileConfig);
	/**
	 * Adds an object to the global physics ignore
	 * @param Object The object to add
	 */
	static AddToPhysicsIgnore: (Object: Instance) => void;
	private static Raycast;
	private static RaycastLegacy;
	/**
	 * DO NOT CALL THIS
	 * Used to commit a step of physics and rendering
	 */
	Step(DeltaTime: number): void;
	/**
	 * Removes the projectile
	 * @param Instantly Whether to remove the projectile instantly or to add it to the remove list for the following step
	 */
	Remove(Instantly?: boolean): void;
}
