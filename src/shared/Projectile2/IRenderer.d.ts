/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
export interface IRenderer {
	readonly PhysicsIgnore: ReadonlyArray<Instance>;
	/**
	 * Destroys the renderer
	 */
	Destroy(): void;
	/**
	 * Renders the projectile
	 * @param Position The position to render at
	 * @param DirectionUnit The unit vector describing the current direction of the projectile
	 */
	Render(Position: Vector3, DirectionUnit: Vector3): void;
}
